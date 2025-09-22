/**
 * Web R1 Polyfills - R1 Creation Triggers Compatibility Layer
 * Implements R1 Creation SDK functionality for web browsers
 * Based on https://github.com/rabbit-hmi-oss/creations-sdk/blob/main/plugin-demo/reference/creation-triggers.md
 */

/**
 * Initialize R1 Creation Triggers polyfills for web environment
 */
export function initializeWebR1Polyfills() {
  console.log('Initializing R1 Creation Triggers web polyfills...');
  
  // 1. PluginMessageHandler polyfill
  if (!window.PluginMessageHandler) {
    window.PluginMessageHandler = {
      postMessage: (message) => {
        console.log('[Web Polyfill] PluginMessageHandler.postMessage:', message);
        
        try {
          const parsedMessage = JSON.parse(message);
          
          // Simulate LLM responses for web testing
          if (parsedMessage.useLLM) {
            setTimeout(() => {
              const mockResponse = {
                message: parsedMessage.message,
                pluginId: 'web-r1-tv',
                data: JSON.stringify({
                  response: `Web polyfill response for: ${parsedMessage.message}`,
                  timestamp: new Date().toISOString(),
                  webMode: true
                })
              };
              
              if (window.onPluginMessage) {
                window.onPluginMessage(mockResponse);
              }
            }, 1000);
          }
        } catch (e) {
          console.warn('[Web Polyfill] Invalid JSON in plugin message:', e);
        }
      }
    };
  }
  
  // 2. closeWebView polyfill
  if (!window.closeWebView) {
    window.closeWebView = {
      postMessage: (message) => {
        console.log('[Web Polyfill] closeWebView.postMessage:', message);
        // In web environment, we could close the tab or redirect
        if (window.confirm('Close R1 TV app?')) {
          window.close() || (window.location.href = 'about:blank');
        }
      }
    };
  }
  
  // 3. TouchEventHandler polyfill
  if (!window.TouchEventHandler) {
    window.TouchEventHandler = {
      postMessage: (eventData) => {
        console.log('[Web Polyfill] TouchEventHandler.postMessage:', eventData);
        
        try {
          const event = JSON.parse(eventData);
          const element = document.elementFromPoint(event.x, event.y);
          
          if (element) {
            switch (event.type) {
              case 'tap':
                element.click();
                break;
              case 'down':
                element.dispatchEvent(new TouchEvent('touchstart', {
                  touches: [{ clientX: event.x, clientY: event.y }]
                }));
                break;
              case 'up':
                element.dispatchEvent(new TouchEvent('touchend'));
                break;
              case 'move':
                element.dispatchEvent(new TouchEvent('touchmove', {
                  touches: [{ clientX: event.x, clientY: event.y }]
                }));
                break;
            }
          }
        } catch (e) {
          console.warn('[Web Polyfill] TouchEventHandler error:', e);
        }
      }
    };
  }
  
  // 4. CreationStorageHandler polyfill
  if (!window.creationStorage) {
    window.creationStorage = {
      plain: {
        setItem: async (key, value) => {
          try {
            localStorage.setItem(`r1tv_plain_${key}`, value);
          } catch (e) {
            console.warn('[Web Polyfill] Plain storage setItem error:', e);
          }
        },
        
        getItem: async (key) => {
          try {
            return localStorage.getItem(`r1tv_plain_${key}`);
          } catch (e) {
            console.warn('[Web Polyfill] Plain storage getItem error:', e);
            return null;
          }
        },
        
        removeItem: async (key) => {
          try {
            localStorage.removeItem(`r1tv_plain_${key}`);
          } catch (e) {
            console.warn('[Web Polyfill] Plain storage removeItem error:', e);
          }
        },
        
        clear: async () => {
          try {
            Object.keys(localStorage)
              .filter(key => key.startsWith('r1tv_plain_'))
              .forEach(key => localStorage.removeItem(key));
          } catch (e) {
            console.warn('[Web Polyfill] Plain storage clear error:', e);
          }
        }
      },
      
      secure: {
        setItem: async (key, value) => {
          // Web fallback: use sessionStorage for "secure" storage
          try {
            sessionStorage.setItem(`r1tv_secure_${key}`, value);
          } catch (e) {
            console.warn('[Web Polyfill] Secure storage setItem error:', e);
          }
        },
        
        getItem: async (key) => {
          try {
            return sessionStorage.getItem(`r1tv_secure_${key}`);
          } catch (e) {
            console.warn('[Web Polyfill] Secure storage getItem error:', e);
            return null;
          }
        },
        
        removeItem: async (key) => {
          try {
            sessionStorage.removeItem(`r1tv_secure_${key}`);
          } catch (e) {
            console.warn('[Web Polyfill] Secure storage removeItem error:', e);
          }
        },
        
        clear: async () => {
          try {
            Object.keys(sessionStorage)
              .filter(key => key.startsWith('r1tv_secure_'))
              .forEach(key => sessionStorage.removeItem(key));
          } catch (e) {
            console.warn('[Web Polyfill] Secure storage clear error:', e);
          }
        }
      }
    };
  }
  
  // 5. AccelerometerHandler polyfill
  if (!window.creationSensors) {
    let accelerometerCallback = null;
    let accelerometerInterval = null;
    
    window.creationSensors = {
      accelerometer: {
        isAvailable: async () => {
          // Check if DeviceMotionEvent is supported
          return 'DeviceMotionEvent' in window;
        },
        
        start: (callback, options = {}) => {
          accelerometerCallback = callback;
          const frequency = options.frequency || 60;
          
          // Try to use device motion events
          if ('DeviceMotionEvent' in window) {
            const handleDeviceMotion = (event) => {
              if (accelerometerCallback && event.accelerationIncludingGravity) {
                const { x, y, z } = event.accelerationIncludingGravity;
                // Normalize values to -1 to 1 range (approximate)
                accelerometerCallback({
                  x: Math.max(-1, Math.min(1, (x || 0) / 9.8)),
                  y: Math.max(-1, Math.min(1, (y || 0) / 9.8)),
                  z: Math.max(-1, Math.min(1, (z || 0) / 9.8))
                });
              }
            };
            
            window.addEventListener('devicemotion', handleDeviceMotion);
            
            // Store cleanup function
            window.creationSensors.accelerometer._cleanup = () => {
              window.removeEventListener('devicemotion', handleDeviceMotion);
            };
          } else {
            // Fallback: simulate accelerometer data
            accelerometerInterval = setInterval(() => {
              if (accelerometerCallback) {
                accelerometerCallback({
                  x: (Math.random() - 0.5) * 0.1,
                  y: (Math.random() - 0.5) * 0.1,
                  z: 0.98 + (Math.random() - 0.5) * 0.04
                });
              }
            }, 1000 / frequency);
          }
        },
        
        stop: () => {
          accelerometerCallback = null;
          
          if (accelerometerInterval) {
            clearInterval(accelerometerInterval);
            accelerometerInterval = null;
          }
          
          if (window.creationSensors.accelerometer._cleanup) {
            window.creationSensors.accelerometer._cleanup();
            delete window.creationSensors.accelerometer._cleanup;
          }
        }
      }
    };
  }
  
  // Hardware Button Events polyfills
  initializeHardwareButtonPolyfills();
  
  console.log('R1 Creation Triggers web polyfills initialized successfully!');
}

/**
 * Initialize hardware button event polyfills for web
 */
function initializeHardwareButtonPolyfills() {
  // Side Button (PTT) Events - map to keyboard events
  let longPressTimer = null;
  
  // Map space bar to side button
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !e.repeat) {
      e.preventDefault();
      
      // Start long press timer
      longPressTimer = setTimeout(() => {
        const longPressStartEvent = new CustomEvent('longPressStart');
        window.dispatchEvent(longPressStartEvent);
      }, 500);
    }
  });
  
  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
        
        // Short press - dispatch sideClick
        const sideClickEvent = new CustomEvent('sideClick');
        window.dispatchEvent(sideClickEvent);
      } else {
        // Long press end
        const longPressEndEvent = new CustomEvent('longPressEnd');
        window.dispatchEvent(longPressEndEvent);
      }
    }
  });
  
  // Scroll Wheel Events - map to mouse wheel or arrow keys
  document.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    if (e.deltaY < 0) {
      const scrollUpEvent = new CustomEvent('scrollUp');
      window.dispatchEvent(scrollUpEvent);
    } else if (e.deltaY > 0) {
      const scrollDownEvent = new CustomEvent('scrollDown');
      window.dispatchEvent(scrollDownEvent);
    }
  });
  
  // Also map arrow keys to scroll events
  document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') {
      e.preventDefault();
      const scrollUpEvent = new CustomEvent('scrollUp');
      window.dispatchEvent(scrollUpEvent);
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      const scrollDownEvent = new CustomEvent('scrollDown');
      window.dispatchEvent(scrollDownEvent);
    }
  });
  
  console.log('Hardware button polyfills initialized (Space=PTT, Wheel/Arrows=Scroll)');
}

/**
 * Check if running in R1 device environment
 */
export function isR1Environment() {
  return !!(window.PluginMessageHandler && 
           window.closeWebView && 
           window.creationStorage && 
           window.creationSensors);
}

/**
 * Get platform info
 */
export function getPlatformInfo() {
  return {
    isR1: isR1Environment(),
    isWeb: !isR1Environment(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenSize: {
      width: window.screen.width,
      height: window.screen.height
    },
    viewportSize: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  };
}
