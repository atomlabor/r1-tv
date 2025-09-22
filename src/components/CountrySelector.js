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
 * CountrySelector - Modern UI component for selecting countries with TV channels
 * Loads available countries from tv-garden-channel-list API
 * Features dark mode design optimized for Rabbit R1 display
 */
const CountrySelector = ({ onCountrySelect, selectedCountry }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://tv-garden-channel-list.vercel.app/api/countries');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Sort countries alphabetically
      const sortedCountries = data.sort((a, b) => a.name.localeCompare(b.name));
      setCountries(sortedCountries);
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError('Fehler beim Laden der Länder');
    } finally {
      setLoading(false);
    }
  };

  const handleCountryClick = (country) => {
    onCountrySelect(country);
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="country-selector">
        <div className="header">
          <h1 className="title">TV Kanäle</h1>
          <p className="subtitle">Lade verfügbare Länder...</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="country-selector">
        <div className="header">
          <h1 className="title">TV Kanäle</h1>
          <p className="subtitle">Fehler beim Laden</p>
        </div>
        <div className="error-container">
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={fetchCountries}>
              Erneut versuchen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="country-selector">
      <div className="header">
        <h1 className="title">TV Kanäle</h1>
        <p className="subtitle">{selectedCountry ? `${selectedCountry.name} ausgewählt` : 'Land auswählen'}</p>
      </div>

      <div className="search-container">
        <div className="search-card">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Land suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="countries-grid">
        {filteredCountries.length === 0 ? (
          <div className="no-results">
            <span className="no-results-icon">🌍</span>
            <p>Keine Länder gefunden</p>
          </div>
        ) : (
          filteredCountries.map((country) => (
            <div
              key={country.code}
              className={`country-card ${
                selectedCountry?.code === country.code ? 'selected' : ''
              }`}
              onClick={() => handleCountryClick(country)}
            >
              <div className="country-flag">
                {countryFlags[country.code] || '🏳️'}
              </div>
              <div className="country-info">
                <h3 className="country-name">{country.name}</h3>
                <p className="country-code">{country.code}</p>
                <p className="country-channels">
                  {country.channelCount || 0} Kanäle
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CountrySelector;
