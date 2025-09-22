/**
 * Web R1 SDK Provider
 * Provides web-compatible wrapper for R1 SDK functionality
 */
import React, { createContext, useContext, useState, useCallback } from 'react';

// Create SDK Context
const WebR1SDKContext = createContext(null);

/**
 * Web R1 SDK Provider Component
 */
export const WebR1SDKProvider = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceRotation, setDeviceRotation] = useState('portrait');
  const [isWebEnvironment] = useState(typeof window !== 'undefined');

  // Mock R1 Device Functions for Web
  const sdk = {
    // Device Info
    device: {
      isR1Device: false,
      platform: 'web',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
    },

    // Screen & Display
    screen: {
      enterFullscreen: useCallback(() => {
        if (isWebEnvironment && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      }, [isWebEnvironment]),

      exitFullscreen: useCallback(() => {
        if (isWebEnvironment && document.exitFullscreen) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      }, [isWebEnvironment]),

      toggleFullscreen: useCallback(() => {
        if (isFullscreen) {
          sdk.screen.exitFullscreen();
        } else {
          sdk.screen.enterFullscreen();
        }
      }, [isFullscreen]),

      isFullscreen,
      rotation: deviceRotation
    },

    // Navigation & UI
    navigation: {
      back: useCallback(() => {
        if (isWebEnvironment && window.history.length > 1) {
          window.history.back();
        }
      }, [isWebEnvironment]),

      home: useCallback(() => {
        if (isWebEnvironment) {
          window.location.href = '/';
        }
      }, [isWebEnvironment])
    },

    // Storage (using localStorage as fallback)
    storage: {
      get: useCallback((key) => {
        if (isWebEnvironment) {
          try {
            const value = localStorage.getItem(`r1tv_${key}`);
            return value ? JSON.parse(value) : null;
          } catch (e) {
            console.warn('Storage get error:', e);
            return null;
          }
        }
        return null;
      }, [isWebEnvironment]),

      set: useCallback((key, value) => {
        if (isWebEnvironment) {
          try {
            localStorage.setItem(`r1tv_${key}`, JSON.stringify(value));
            return true;
          } catch (e) {
            console.warn('Storage set error:', e);
            return false;
          }
        }
        return false;
      }, [isWebEnvironment]),

      remove: useCallback((key) => {
        if (isWebEnvironment) {
          try {
            localStorage.removeItem(`r1tv_${key}`);
            return true;
          } catch (e) {
            console.warn('Storage remove error:', e);
            return false;
          }
        }
        return false;
      }, [isWebEnvironment])
    },

    // Network status
    network: {
      isOnline: isWebEnvironment ? navigator.onLine : true,
      connectionType: 'wifi' // Default assumption for web
    },

    // Utility functions
    utils: {
      log: useCallback((message, data = null) => {
        console.log(`[R1TV]: ${message}`, data || '');
      }, []),

      error: useCallback((message, error = null) => {
        console.error(`[R1TV Error]: ${message}`, error || '');
      }, [])
    }
  };

  return (
    <WebR1SDKContext.Provider value={sdk}>
      {children}
    </WebR1SDKContext.Provider>
  );
};

/**
 * Hook to use R1 SDK
 */
export const useR1SDK = () => {
  const context = useContext(WebR1SDKContext);
  if (!context) {
    throw new Error('useR1SDK must be used within a WebR1SDKProvider');
  }
  return context;
};

/**
 * Export default SDK instance for direct use
 */
export default {
  WebR1SDKProvider,
  useR1SDK
};
