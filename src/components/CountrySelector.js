import React, { useState, useEffect } from 'react';
import '../styles/CountrySelector.css';

/**
 * CountrySelector - Komponente für die Auswahl verschiedener Länder
 * Zeigt verfügbare Länder für TV-Kanäle an
 */
const CountrySelector = ({ onCountrySelect, selectedCountry }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Beispiel-Länder - wird später durch tv.garden API ersetzt
  const mockCountries = [
    { code: 'DE', name: 'Deutschland', flag: '🇩🇪' },
    { code: 'US', name: 'USA', flag: '🇺🇸' },
    { code: 'GB', name: 'Großbritannien', flag: '🇬🇧' },
    { code: 'FR', name: 'Frankreich', flag: '🇫🇷' },
    { code: 'IT', name: 'Italien', flag: '🇮🇹' },
    { code: 'ES', name: 'Spanien', flag: '🇪🇸' }
  ];

  useEffect(() => {
    // Simuliere API-Aufruf für Länderliste
    const fetchCountries = async () => {
      try {
        setLoading(true);
        // TODO: tv.garden API Integration
        // const response = await fetch('tv.garden/api/countries');
        // const data = await response.json();
        
        // Temporär: Mock-Daten verwenden
        setTimeout(() => {
          setCountries(mockCountries);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Fehler beim Laden der Länder:', error);
        setCountries(mockCountries); // Fallback
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
        <h2>Länder werden geladen...</h2>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="country-selector">
      <h2>Land auswählen</h2>
      <div className="countries-grid">
        {countries.map((country) => (
          <button
            key={country.code}
            className={`country-item ${
              selectedCountry?.code === country.code ? 'selected' : ''
            }`}
            onClick={() => handleCountryClick(country)}
          >
            <span className="flag">{country.flag}</span>
            <span className="name">{country.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountrySelector;
