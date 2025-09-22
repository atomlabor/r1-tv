# Web Access Implementation

This document describes how the R1-TV app can be used and deployed as a web application, including web access patterns, trigger systems, internationalization, and integration guidelines.

## Web Access & Deployment

### Building for Web

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The dist/ folder contains the deployable web app
```

### Hosting Options

1. **Static Hosting**
   - Deploy the `dist/` folder to any static hosting service
   - Supports: Netlify, Vercel, GitHub Pages, AWS S3 + CloudFront
   - Configure proper MIME types for .js and .css files

2. **Server Requirements**
   - No server-side processing required
   - Serve index.html for all routes (SPA routing)
   - Enable gzip compression for better performance

### API & CORS Configuration

```javascript
// API configuration for web deployment
const API_CONFIG = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://api.r1-tv.com' 
    : 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
};

// CORS setup for backend
app.use(cors({
  origin: ['https://r1-tv.com', 'https://app.r1-tv.com'],
  credentials: true
}));
```

## Rabbit Creation Triggers

### Event Handling System

```javascript
// src/utils/triggers.js
export class TriggerSystem {
  constructor() {
    this.listeners = new Map();
    this.fallbacks = new Map();
  }

  // Register rabbit creation trigger
  registerTrigger(eventType, handler, fallback = null) {
    this.listeners.set(eventType, handler);
    if (fallback) {
      this.fallbacks.set(eventType, fallback);
    }
  }

  // Trigger rabbit creation
  async triggerCreation(type, data) {
    try {
      const handler = this.listeners.get(type);
      if (handler) {
        return await handler(data);
      }
    } catch (error) {
      console.error(`Trigger failed: ${type}`, error);
      return this.executeFallback(type, data);
    }
  }

  // Execute fallback mechanism
  executeFallback(type, data) {
    const fallback = this.fallbacks.get(type);
    return fallback ? fallback(data) : null;
  }
}
```

### Module Structure

```
src/
├── triggers/
│   ├── index.js          # Main trigger system
│   ├── webTriggers.js    # Web-specific triggers
│   ├── r1Triggers.js     # R1 device triggers
│   └── fallbacks.js      # Fallback mechanisms
├── events/
│   ├── eventBus.js       # Global event system
│   └── customEvents.js   # Custom event definitions
└── components/
    └── RabbitCreator.vue # UI component for creation
```

### Example Implementation

```javascript
// Web trigger implementation
import { TriggerSystem } from './triggers';

const webTriggers = new TriggerSystem();

// Voice command trigger (web)
webTriggers.registerTrigger('voice', async (command) => {
  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      return createRabbitFromVoice(transcript);
    };
    recognition.start();
  }
}, 
// Fallback to text input
(data) => {
  return createRabbitFromText(data.fallbackText);
});

// Gesture trigger (web)
webTriggers.registerTrigger('gesture', async (gestureData) => {
  // Use device motion API or touch gestures
  return createRabbitFromGesture(gestureData);
});
```

## Internationalization (i18n)

### Language Switching

```javascript
// src/i18n/index.js
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import de from './locales/de.json';

const i18n = createI18n({
  locale: localStorage.getItem('language') || 'de',
  fallbackLocale: 'en',
  messages: {
    en,
    de
  }
});

// Language switching logic
export function switchLanguage(locale) {
  i18n.global.locale = locale;
  localStorage.setItem('language', locale);
  document.documentElement.lang = locale;
}
```

### Settings Logic

```javascript
// src/stores/settings.js
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    language: localStorage.getItem('language') || 'de',
    theme: localStorage.getItem('theme') || 'dark'
  }),
  
  actions: {
    setLanguage(lang) {
      this.language = lang;
      localStorage.setItem('language', lang);
      switchLanguage(lang);
    }
  }
});
```

### Translation File Structure

```json
// src/i18n/locales/en.json
{
  "app": {
    "title": "R1-TV",
    "subtitle": "Your Personal AI Assistant"
  },
  "navigation": {
    "home": "Home",
    "rabbits": "Rabbits",
    "settings": "Settings"
  },
  "rabbits": {
    "create": "Create Rabbit",
    "edit": "Edit Rabbit",
    "delete": "Delete Rabbit"
  }
}
```

## Integration Guidelines

### Browser Compatibility

- **Minimum Requirements:**
  - Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
  - ES2020 support required
  - WebGL 2.0 for advanced features

- **Feature Detection:**

```javascript
// Feature detection and polyfills
function checkBrowserSupport() {
  const features = {
    webgl: !!window.WebGLRenderingContext,
    speechRecognition: 'webkitSpeechRecognition' in window,
    deviceMotion: 'DeviceMotionEvent' in window
  };
  
  return features;
}
```

### Responsive Design

```css
/* Mobile-first responsive design */
.rabbit-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .rabbit-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .rabbit-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### R1 Device Integration

```javascript
// R1-specific adaptations
if (window.R1_DEVICE) {
  // Use R1 native APIs
  import('./r1-native-adapter.js');
} else {
  // Use web fallbacks
  import('./web-adapter.js');
}
```

## Developer Guidelines

### Custom Events

```javascript
// Define custom events
const RABBIT_EVENTS = {
  CREATED: 'rabbit:created',
  UPDATED: 'rabbit:updated',
  DELETED: 'rabbit:deleted'
};

// Emit custom events
function createRabbit(data) {
  const rabbit = new Rabbit(data);
  
  // Emit creation event
  window.dispatchEvent(new CustomEvent(RABBIT_EVENTS.CREATED, {
    detail: { rabbit }
  }));
  
  return rabbit;
}

// Listen for events
window.addEventListener(RABBIT_EVENTS.CREATED, (event) => {
  console.log('New rabbit created:', event.detail.rabbit);
});
```

### Plugin System

```javascript
// Plugin architecture for extensions
class PluginManager {
  constructor() {
    this.plugins = new Map();
  }
  
  register(name, plugin) {
    this.plugins.set(name, plugin);
    if (plugin.init) {
      plugin.init();
    }
  }
  
  execute(event, data) {
    for (const [name, plugin] of this.plugins) {
      if (plugin.handle && plugin.handle[event]) {
        plugin.handle[event](data);
      }
    }
  }
}
```

### Performance Optimization

```javascript
// Lazy loading for better performance
const RabbitEditor = defineAsyncComponent(() =>
  import('./components/RabbitEditor.vue')
);

// Service worker for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

### Deployment Checklist

- [ ] Build optimization enabled
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Browser compatibility tested
- [ ] Mobile responsiveness verified
- [ ] Offline functionality tested
- [ ] Performance metrics acceptable
- [ ] Accessibility compliance checked

## API Reference

### Core Methods

```javascript
// Main API methods
window.R1TV = {
  createRabbit(data),
  updateRabbit(id, data),
  deleteRabbit(id),
  switchLanguage(locale),
  registerPlugin(name, plugin)
};
```

### Event Types

- `rabbit:created` - New rabbit created
- `rabbit:updated` - Rabbit modified
- `rabbit:deleted` - Rabbit removed
- `language:changed` - UI language switched
- `theme:changed` - Theme updated

This implementation provides a solid foundation for web deployment while maintaining compatibility with R1 device features.
