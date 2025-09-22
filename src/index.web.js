/**
 * Web Entry Point for R1 TV App
 * Provides web-compatible version with R1 Creation Triggers integration
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WebR1SDKProvider } from './sdk/web-r1-sdk';
import { I18nProvider } from './i18n/i18n-context';
import './styles/index.css';
import './styles/web-responsive.css';

// Check if we're running in a web environment vs R1 device
const isWebEnvironment = typeof window !== 'undefined' && 
  !window.PluginMessageHandler && 
  !window.closeWebView;

// Initialize Web R1 SDK compatibility layer if in web environment
if (isWebEnvironment) {
  // Import and initialize web SDK polyfills
  import('./sdk/web-r1-polyfills').then(({ initializeWebR1Polyfills }) => {
    initializeWebR1Polyfills();
  });
}

// Configure app for web deployment
const AppWithProviders = () => {
  return (
    <React.StrictMode>
      <I18nProvider>
        <WebR1SDKProvider>
          <App platform="web" />
        </WebR1SDKProvider>
      </I18nProvider>
    </React.StrictMode>
  );
};

// Initialize React app
const container = document.getElementById('root');
if (!container) {
  // Create root container if it doesn't exist (for web deployment)
  const rootDiv = document.createElement('div');
  rootDiv.id = 'root';
  rootDiv.className = 'r1-tv-web-root';
  document.body.appendChild(rootDiv);
}

const root = ReactDOM.createRoot(container || document.getElementById('root'));

// Web-specific initialization
if (isWebEnvironment) {
  // Set up service worker for offline capabilities
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

  // Set web-specific document properties
  document.title = 'R1 TV - Live TV Streaming';
  
  // Add web-specific meta tags
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, user-scalable=no';
    document.head.appendChild(meta);
  }
  
  // Add PWA manifest
  const manifestLink = document.createElement('link');
  manifestLink.rel = 'manifest';
  manifestLink.href = '/manifest.json';
  document.head.appendChild(manifestLink);
  
  // Add theme color
  const themeColor = document.createElement('meta');
  themeColor.name = 'theme-color';
  themeColor.content = '#1a1a1a';
  document.head.appendChild(themeColor);
}

// Render the app
root.render(<AppWithProviders />);

// Hot Module Replacement for development
if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    root.render(
      <React.StrictMode>
        <I18nProvider>
          <WebR1SDKProvider>
            <NextApp platform="web" />
          </WebR1SDKProvider>
        </I18nProvider>
      </React.StrictMode>
    );
  });
}

// Export for potential server-side rendering
export default AppWithProviders;
