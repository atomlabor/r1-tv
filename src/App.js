import React, { useState } from 'react';
import './styles/App.css';

/**
 * R1-TV - Simple working React App for demonstration
 */
function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Mock countries data
  const countries = [
    { code: 'DE', name: 'Deutschland', flag: '🇩🇪' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'FR', name: 'France', flag: '🇫🇷' }
  ];

  // Mock channels data
  const mockChannels = {
    'DE': [
      { id: 'ard', name: 'ARD', logo: '🎥', stream: 'https://example.com/ard' },
      { id: 'zdf', name: 'ZDF', logo: '📺', stream: 'https://example.com/zdf' },
      { id: 'rtl', name: 'RTL', logo: '🎆', stream: 'https://example.com/rtl' }
    ],
    'US': [
      { id: 'cnn', name: 'CNN', logo: '📰', stream: 'https://example.com/cnn' },
      { id: 'fox', name: 'Fox News', logo: '🦊', stream: 'https://example.com/fox' }
    ],
    'GB': [
      { id: 'bbc', name: 'BBC One', logo: '📻', stream: 'https://example.com/bbc' }
    ],
    'FR': [
      { id: 'tf1', name: 'TF1', logo: '📺', stream: 'https://example.com/tf1' }
    ]
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const toggleFavorite = (channel) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === channel.id);
      if (isFavorite) {
        return prev.filter(fav => fav.id !== channel.id);
      } else {
        return [...prev, channel];
      }
    });
  };

  const channels = selectedCountry ? (mockChannels[selectedCountry.code] || []) : [];

  return (
    <div className="app">
      <header className="app-header">
        <h1>🐰📺 R1-TV</h1>
        <p>TV-App für Rabbit R1 mit Länderauswahl, Senderliste und Favoriten</p>
        {favorites.length > 0 && (
          <div className="favorites-count">
            {favorites.length} Favorit{favorites.length > 1 ? 'en' : ''}
          </div>
        )}
      </header>
      
      <main className="app-main">
        {!selectedCountry ? (
          <div className="country-selector">
            <h2>Land auswählen:</h2>
            <div className="countries-grid">
              {countries.map(country => (
                <button
                  key={country.code}
                  className="country-button"
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="country-flag">{country.flag}</span>
                  <span className="country-name">{country.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="channel-list">
            <div className="navigation-header">
              <button 
                className="back-button" 
                onClick={() => setSelectedCountry(null)}
              >
                ← Zurück zu Ländern
              </button>
              <h2>TV-Sender - {selectedCountry.name}</h2>
            </div>
            <div className="channels-grid">
              {channels.map(channel => (
                <div className="channel-item" key={channel.id}>
                  <div className="channel-info">
                    <span className="channel-logo">{channel.logo}</span>
                    <span className="channel-name">{channel.name}</span>
                  </div>
                  <button
                    className={`favorite-button ${
                      favorites.some(fav => fav.id === channel.id) ? 'active' : ''
                    }`}
                    onClick={() => toggleFavorite(channel)}
                  >
                    {favorites.some(fav => fav.id === channel.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              ))}
            </div>
            {channels.length === 0 && (
              <p className="no-channels">Keine Sender für dieses Land verfügbar.</p>
            )}
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Entwickelt für Rabbit R1 | Basiert auf R1-create.js & tv.garden API</p>
      </footer>
    </div>
  );
}

export default App;
