import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import deTranslations from './locales/de.json';
import enTranslations from './locales/en.json';

/**
 * i18next configuration for R1-TV internationalization
 * 
 * Features:
 * - German and English language support
 * - Automatic language detection from browser/R1 device
 * - Fallback to English if language not supported
 * - Namespace support for organized translations
 * - Development mode logging
 */

const resources = {
  de: {
    translation: deTranslations
  },
  en: {
    translation: enTranslations
  }
};

// R1 device language detection function
const detectR1Language = () => {
  // Try to detect R1 device language
  // Fallback to browser language detection
  if (typeof window !== 'undefined') {
    // Check if running on R1 device
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('rabbit') || userAgent.includes('r1')) {
      // Try to get R1 device language setting
      // This would need to be implemented based on R1 SDK
      return 'de'; // Default to German for R1 devices
    }
  }
  return null; // Let i18next-browser-languagedetector handle it
};

i18n
  // Load translations using http backend for dynamic loading
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    
    // Language settings
    lng: detectR1Language(), // Detected language
    fallbackLng: 'en', // Fallback language
    supportedLngs: ['en', 'de'], // Supported languages
    
    // Detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'r1-tv-language'
    },
    
    // Debugging
    debug: process.env.NODE_ENV === 'development',
    
    // Interpolation options
    interpolation: {
      escapeValue: false // React already escapes
    },
    
    // Translation loading
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    
    // Performance
    load: 'languageOnly', // Load only language codes (en, de)
    cleanCode: true,
    
    // React i18next options
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em'],
    }
  });

// Export language helper functions
export const getCurrentLanguage = () => i18n.language;
export const changeLanguage = (lng) => i18n.changeLanguage(lng);
export const getSupportedLanguages = () => ['en', 'de'];

// Language display names
export const getLanguageDisplayName = (lng) => {
  const names = {
    'en': 'English',
    'de': 'Deutsch'
  };
  return names[lng] || lng;
};

export default i18n;
