import React, { useState, useEffect } from 'react';
import '../styles/CountrySelector.css';

// Flag emoji mapping for countries
const countryFlags = {
  'AD': '🇦🇩', 'AE': '🇦🇪', 'AF': '🇦🇫', 'AL': '🇦🇱', 'AM': '🇦🇲', 'AO': '🇦🇴', 'AR': '🇦🇷',
  'AT': '🇦🇹', 'AU': '🇦🇺', 'AW': '🇦🇼', 'AZ': '🇦🇿', 'BA': '🇧🇦', 'BD': '🇧🇩', 'BE': '🇧🇪',
  'BF': '🇧🇫', 'BG': '🇧🇬', 'BH': '🇧🇭', 'BJ': '🇧🇯', 'BM': '🇧🇲', 'BN': '🇧🇳', 'BO': '🇧🇴',
  'BQ': '🇧🇶', 'BR': '🇧🇷', 'BS': '🇧🇸', 'BY': '🇧🇾', 'CA': '🇨🇦', 'CD': '🇨🇩', 'CH': '🇨🇭',
  'CI': '🇨🇮', 'CL': '🇨🇱', 'CM': '🇨🇲', 'CN': '🇨🇳', 'CO': '🇨🇴', 'CR': '🇨🇷', 'CU': '🇨🇺',
  'CV': '🇨🇻', 'CW': '🇨🇼', 'CY': '🇨🇾', 'CZ': '🇨🇿', 'DE': '🇩🇪', 'DJ': '🇩🇯', 'DK': '🇩🇰',
  'DO': '🇩🇴', 'DZ': '🇩🇿', 'EC': '🇪🇨', 'EE': '🇪🇪', 'EG': '🇪🇬', 'EH': '🇪🇭', 'ER': '🇪🇷',
  'ES': '🇪🇸', 'ET': '🇪🇹', 'FI': '🇫🇮', 'FO': '🇫🇴', 'FR': '🇫🇷', 'GE': '🇬🇪', 'GH': '🇬🇭',
  'GL': '🇬🇱', 'GM': '🇬🇲', 'GN': '🇬🇳', 'GP': '🇬🇵', 'GQ': '🇬🇶', 'GR': '🇬🇷', 'GT': '🇬🇹',
  'GU': '🇬🇺', 'GY': '🇬🇾', 'HK': '🇭🇰', 'HN': '🇭🇳', 'HR': '🇭🇷', 'HT': '🇭🇹', 'HU': '🇭🇺',
  'ID': '🇮🇩', 'IE': '🇮🇪', 'IL': '🇮🇱', 'IN': '🇮🇳', 'IQ': '🇮🇶', 'IR': '🇮🇷', 'IS': '🇮🇸',
  'IT': '🇮🇹', 'JM': '🇯🇲', 'JO': '🇯🇴', 'JP': '🇯🇵', 'KE': '🇰🇪', 'KH': '🇰🇭', 'KN': '🇰🇳',
  'KR': '🇰🇷', 'KW': '🇰🇼', 'KZ': '🇰🇿', 'LA': '🇱🇦', 'LB': '🇱🇧', 'LC': '🇱🇨', 'LK': '🇱🇰',
  'LT': '🇱🇹', 'LU': '🇱🇺', 'LV': '🇱🇻', 'LY': '🇱🇾', 'MA': '🇲🇦', 'MC': '🇲🇨', 'MD': '🇲🇩',
  'ME': '🇲🇪', 'MK': '🇲🇰', 'ML': '🇲🇱', 'MM': '🇲🇲', 'MN': '🇲🇳', 'MQ': '🇲🇶', 'MT': '🇲🇹',
  'MU': '🇲🇺', 'MV': '🇲🇻', 'MX': '🇲🇽', 'MY': '🇲🇾', 'MZ': '🇲🇿', 'NA': '🇳🇦', 'NG': '🇳🇬',
  'NI': '🇳🇮', 'NL': '🇳🇱', 'NO': '🇳🇴', 'NP': '🇳🇵', 'NZ': '🇳🇿', 'OM': '🇴🇲', 'PA': '🇵🇦',
  'PE': '🇵🇪', 'PF': '🇵🇫', 'PH': '🇵🇭', 'PK': '🇵🇰', 'PL': '🇵🇱', 'PR': '🇵🇷', 'PS': '🇵🇸',
  'PT': '🇵🇹', 'PY': '🇵🇾', 'QA': '🇶🇦', 'RO': '🇷🇴', 'RS': '🇷🇸', 'RU': '🇷🇺', 'RW': '🇷🇼',
  'SA': '🇸🇦', 'SD': '🇸🇩', 'SE': '🇸🇪', 'SG': '🇸🇬', 'SI': '🇸🇮', 'SK': '🇸🇰', 'SM': '🇸🇲',
  'SN': '🇸🇳', 'SO': '🇸🇴', 'SR': '🇸🇷', 'SV': '🇸🇻', 'SX': '🇸🇽', 'SY': '🇸🇾', 'TD': '🇹🇩',
  'TG': '🇹🇬', 'TH': '🇹🇭', 'TJ': '🇹🇯', 'TN': '🇹🇳', 'TR': '🇹🇷', 'TT': '🇹🇹', 'TW': '🇹🇼',
  'UA': '🇺🇦', 'UG': '🇺🇬', 'UK': '🇬🇧', 'US': '🇺🇸', 'UY': '🇺🇾', 'UZ': '🇺🇿', 'VE': '🇻🇪',
  'VG': '🇻🇬', 'VN': '🇻🇳', 'WS': '🇼🇸', 'XK': '🇽🇰', 'YE': '🇾🇪', 'ZA': '🇿🇦', 'ZW': '🇿🇼'
};

/**
 * CountrySelector - Komponente für die Auswahl verschiedener Länder
 * Lädt verfügbare Länder mit TV-Kanälen aus der tv-garden-channel-list API
 */
const CountrySelector = ({ onCountrySelect, selectedCountry }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Lade Länder-Metadaten von tv-garden-channel-list
        const response = await fetch(
          'https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries_metadata.json'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch countries metadata');
        }
        
        const countriesData = await response.json();
        
        // Filtere nur Länder mit verfügbaren Kanälen
        const availableCountries = Object.entries(countriesData)
          .filter(([code, data]) => data.hasChannels)
          .map(([code, data]) => ({
            code: code.toUpperCase(),
            name: data.country,
            flag: countryFlags[code.toUpperCase()] || '🏳️',
            capital: data.capital,
            timeZone: data.timeZone
          }))
          .sort((a, b) => a.name.localeCompare(b.name)); // Alphabetisch sortieren
        
        setCountries(availableCountries);
      } catch (error) {
        console.error('Fehler beim Laden der Länder:', error);
        setError(error.message);
        
        // Fallback: Einige wichtige Länder
        const fallbackCountries = [
          { code: 'DE', name: 'Deutschland', flag: '🇩🇪' },
          { code: 'US', name: 'United States', flag: '🇺🇸' },
          { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
          { code: 'FR', name: 'France', flag: '🇫🇷' },
          { code: 'IT', name: 'Italy', flag: '🇮🇹' },
          { code: 'ES', name: 'Spain', flag: '🇪🇸' }
        ];
        setCountries(fallbackCountries);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryClick = (country) => {
    if (onCountrySelect) {
      onCountrySelect(country);
    }
  };

  if (loading) {
    return (
      <div className="country-selector loading">
        <h3>Länder werden geladen...</h3>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error && countries.length === 0) {
    return (
      <div className="country-selector error">
        <h3>Fehler beim Laden der Länder</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Erneut versuchen
        </button>
      </div>
    );
  }

  return (
    <div className="country-selector">
      <div className="selector-header">
        <h3>Land auswählen</h3>
        <div className="country-count">
          {countries.length} Länder mit TV-Kanälen verfügbar
        </div>
        {error && (
          <div className="warning">
            ⚠️ Fallback-Daten werden verwendet
          </div>
        )}
      </div>
      
      <div className="countries-grid">
        {countries.map((country) => (
          <button
            key={country.code}
            className={`country-item ${
              selectedCountry?.code === country.code ? 'selected' : ''
            }`}
            onClick={() => handleCountryClick(country)}
            title={`${country.name}${country.capital ? ` - ${country.capital}` : ''}`}
          >
            <span className="flag">{country.flag}</span>
            <span className="name">{country.name}</span>
            <span className="code">{country.code}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountrySelector;
