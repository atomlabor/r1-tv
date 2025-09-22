import React, { useState } from 'react';
import CountrySelector from './components/CountrySelector';
import './styles/App.css';

/**
 * R1-TV - Hauptkomponente der Rabbit R1 TV App
 * Integriert alle Hauptfunktionen: Länderauswahl, Senderliste, Player, Favoriten
 */
function App() {
  // App-weite State-Verwaltung
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentView, setCurrentView] = useState('country-selection'); // 'country-selection', 'channels', 'player'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock-Daten für Sender (wird später durch tv.garden API ersetzt)
  const mockChannels = {
    'DE': [
      { id: 'ard', name: 'ARD', logo: '🎥', stream: 'https://example.com/ard' },
      { id: 'zdf', name: 'ZDF', logo: '📺', stream: 'https://example.com/zdf' },
      { id: 'rtl', name: 'RTL', logo: '🎆', stream: 'https://example.com/rtl' }
    ],
    'US': [
      { id: 'cnn', name: 'CNN', logo: '📰', stream: 'https://example.com/cnn' },
      { id: 'fox', name: 'Fox News', logo: '🦊', stream: 'https://example.com/fox' }
    ]
  };

  // Event Handler
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCurrentView('channels');
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    setCurrentView('player');
  };

  const handleBackToCountries = () => {
    setSelectedCountry(null);
    setCurrentView('country-selection');
  };

  const handleBackToChannels = () => {
    setSelectedChannel(null);
    setCurrentView('channels');
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // TODO: Rabbit SDK Integration für Hardware-Rotation
  };

  // Rendering der verschiedenen Views
  const renderCurrentView = () => {
    switch (currentView) {
      case 'country-selection':
        return (
          <CountrySelector
            onCountrySelect={handleCountrySelect}
            selectedCountry={selectedCountry}
          />
        );
      
      case 'channels':
        const channels = mockChannels[selectedCountry?.code] || [];
        return (
          <div className="channel-list">
            <div className="navigation-header">
              <button onClick={handleBackToCountries} className="back-button">
                ← Zurück zu Ländern
              </button>
              <h2>TV-Sender - {selectedCountry?.name}</h2>
            </div>
            <div className="channels-grid">
              {channels.map(channel => (
                <div key={channel.id} className="channel-item">
                  <button
                    onClick={() => handleChannelSelect(channel)}
                    className="channel-button"
                  >
                    <span className="channel-logo">{channel.logo}</span>
                    <span className="channel-name">{channel.name}</span>
                  </button>
                  <button
                    onClick={() => toggleFavorite(channel)}
                    className={`favorite-button ${
                      favorites.some(fav => fav.id === channel.id) ? 'active' : ''
                    }`}
                  >
                    {favorites.some(fav => fav.id === channel.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'player':
        return (
          <div className={`video-player ${isFullscreen ? 'fullscreen' : ''}`}>
            <div className="player-header">
              <button onClick={handleBackToChannels} className="back-button">
                ← Zurück zu Sendern
              </button>
              <h3>{selectedChannel?.name}</h3>
              <button onClick={toggleFullscreen} className="fullscreen-button">
                {isFullscreen ? '📏' : '🔲'}
              </button>
            </div>
            <div className="video-container">
              <div className="video-placeholder">
                <div className="video-info">
                  <h2>{selectedChannel?.name}</h2>
                  <p>Stream: {selectedChannel?.stream}</p>
                  <p className="placeholder-text">
                    📺 Video-Player Platzhalter
                    <br />
                    (Integration mit tv.garden API und Rabbit SDK)
                  </p>
                </div>
              </div>
            </div>
            <div className="player-controls">
              <button onClick={() => toggleFavorite(selectedChannel)}>
                {favorites.some(fav => fav.id === selectedChannel?.id) ? '❤️' : '🤍'} Favorit
              </button>
            </div>
          </div>
        );
      
      default:
        return <div>Lade...</div>;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🐰📺 R1-TV</h1>
        <div className="app-info">
          <span>Rabbit R1 TV-App</span>
          {favorites.length > 0 && (
            <span className="favorites-count">
              {favorites.length} Favorit{favorites.length > 1 ? 'en' : ''}
            </span>
          )}
        </div>
      </header>
      
      <main className="app-main">
        {renderCurrentView()}
      </main>
      
      <footer className="app-footer">
        <p>Entwickelt für Rabbit R1 | Basiert auf R1-create.js & tv.garden API</p>
      </footer>
    </div>
  );
}

export default App;
