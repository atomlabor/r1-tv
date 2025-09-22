import React, { useState, useEffect } from 'react';
import './styles/App.css';

/**
 * TVGarden RAW Integration - Minimal Weather-Style Button UI
 * Direct channel loading from TVGarden RAW API with instant player
 */
function App() {
  const [currentView, setCurrentView] = useState('countries');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Country codes for TVGarden RAW API
  const countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'de', name: 'Germany', flag: '🇩🇪' },
    { code: 'fr', name: 'France', flag: '🇫🇷' },
    { code: 'es', name: 'Spain', flag: '🇪🇸' },
    { code: 'it', name: 'Italy', flag: '🇮🇹' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'jp', name: 'Japan', flag: '🇯🇵' },
    { code: 'kr', name: 'South Korea', flag: '🇰🇷' },
    { code: 'br', name: 'Brazil', flag: '🇧🇷' },
    { code: 'mx', name: 'Mexico', flag: '🇲🇽' }
  ];

  // Load channels directly from TVGarden RAW API
  const loadChannels = async (countryCode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries/${countryCode}.json`);
      if (!response.ok) throw new Error('Failed to load channels');
      const data = await response.json();
      
      // Filter for m3u8 streams only
      const validChannels = data
        .filter(ch => ch.url && ch.url.includes('.m3u8'))
        .map((ch, idx) => ({
          id: `${countryCode}_${idx}`,
          name: ch.name || 'Unknown Channel',
          url: ch.url,
          logo: ch.logo || ''
        }))
        .slice(0, 20); // Limit for performance
      
      setChannels(validChannels);
    } catch (err) {
      setError(`Could not load ${countryCode.toUpperCase()} channels`);
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setCurrentView('channels');
    loadChannels(country.code);
  };

  const selectChannel = (channel) => {
    setSelectedChannel(channel);
    setCurrentView('player');
  };

  const goBack = () => {
    if (currentView === 'player') {
      setCurrentView('channels');
      setSelectedChannel(null);
    } else if (currentView === 'channels') {
      setCurrentView('countries');
      setSelectedCountry(null);
      setChannels([]);
    }
  };

  return (
    <div className="app">
      {/* Country Selection */}
      {currentView === 'countries' && (
        <div className="weather-container">
          <h1 className="weather-title">R1 TV</h1>
          <div className="weather-subtitle">Select Country</div>
          <div className="weather-grid">
            {countries.map(country => (
              <button
                key={country.code}
                className="weather-button"
                onClick={() => selectCountry(country)}
              >
                <div className="weather-icon">{country.flag}</div>
                <div className="weather-code">{country.code.toUpperCase()}</div>
                <div className="weather-name">{country.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Channel List */}
      {currentView === 'channels' && (
        <div className="weather-container">
          <div className="weather-header">
            <button className="weather-back" onClick={goBack}>←</button>
            <h1 className="weather-title">{selectedCountry?.flag} {selectedCountry?.name}</h1>
          </div>
          
          {loading && <div className="weather-loading">Loading channels...</div>}
          
          {error && (
            <div className="weather-error">
              {error}
              <button 
                className="weather-retry" 
                onClick={() => loadChannels(selectedCountry.code)}
              >
                Retry
              </button>
            </div>
          )}
          
          {!loading && !error && (
            <div className="weather-grid">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  className="weather-button channel-button"
                  onClick={() => selectChannel(channel)}
                >
                  <div className="weather-icon">📺</div>
                  <div className="weather-name channel-name">{channel.name}</div>
                  <div className="weather-code">▶ PLAY</div>
                </button>
              ))}
              {channels.length === 0 && (
                <div className="weather-empty">No channels available</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Video Player */}
      {currentView === 'player' && selectedChannel && (
        <div className="player-container">
          <div className="player-header">
            <button className="weather-back" onClick={goBack}>←</button>
            <div className="player-info">
              <div className="player-title">{selectedChannel.name}</div>
              <div className="player-country">{selectedCountry?.flag} {selectedCountry?.name}</div>
            </div>
          </div>
          <div className="player-wrapper">
            <video
              controls
              autoPlay
              className="video-player"
              src={selectedChannel.url}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
