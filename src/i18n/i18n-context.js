/**
 * I18n Context Provider
 * Provides internationalization context and hooks for R1 TV
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create I18n Context
const I18nContext = createContext(null);

// Simple fallback translations
const fallbackTranslations = {
  de: {
    'app.title': 'R1 TV',
    'app.loading': 'Lade...',
    'countries.title': 'Land wählen',
    'channels.title': 'TV-Sender',
    'player.fullscreen': 'Vollbild',
    'player.back': 'Zurück',
    'favorites.add': 'Zu Favoriten hinzufügen',
    'favorites.remove': 'Aus Favoriten entfernen'
  },
  en: {
    'app.title': 'R1 TV',
    'app.loading': 'Loading...',
    'countries.title': 'Select Country',
    'channels.title': 'TV Channels',
    'player.fullscreen': 'Fullscreen',
    'player.back': 'Back',
    'favorites.add': 'Add to Favorites',
    'favorites.remove': 'Remove from Favorites'
  }
};

/**
 * I18n Provider Component
 */
export const I18nProvider = ({ children }) => {
  const [currentLocale, setCurrentLocale] = useState('de');
  const [translations, setTranslations] = useState(fallbackTranslations);

  // Detect browser language on initial load
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language || navigator.languages[0];
      const langCode = browserLang.split('-')[0]; // Get base language (de, en, etc.)
      
      if (translations[langCode]) {
        setCurrentLocale(langCode);
      }
    }
  }, [translations]);

  // Translation function
  const t = (key, params = {}) => {
    const currentTranslations = translations[currentLocale] || translations.de;
    let translation = currentTranslations[key] || key;

    // Simple parameter replacement
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{{${param}}}`, params[param]);
    });

    return translation;
  };

  // Change language function
  const changeLanguage = (locale) => {
    if (translations[locale]) {
      setCurrentLocale(locale);
      
      // Store preference in localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('r1tv_language', locale);
      }
    }
  };

  // Load saved language preference
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const savedLang = localStorage.getItem('r1tv_language');
      if (savedLang && translations[savedLang]) {
        setCurrentLocale(savedLang);
      }
    }
  }, [translations]);

  const contextValue = {
    currentLocale,
    translations: translations[currentLocale] || translations.de,
    t,
    changeLanguage,
    availableLanguages: Object.keys(translations)
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

/**
 * Hook to use I18n
 */
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    // Return fallback if not in provider
    return {
      currentLocale: 'de',
      t: (key) => key,
      changeLanguage: () => {},
      availableLanguages: ['de', 'en']
    };
  }
  return context;
};

/**
 * Translation hook (alias for easier use)
 */
export const useTranslation = () => {
  const { t, currentLocale, changeLanguage } = useI18n();
  return { t, i18n: { language: currentLocale, changeLanguage } };
};

export default I18nProvider;
