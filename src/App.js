import React, { useState, useEffect } from 'react';
import './styles/App.css';

/**
 * R1-TV - Minimal Country/Channel Selector with TVGarden Integration
 * Content area: 240x254px, Top offset: 28px, Viewport: 240x282px
 */
function App() {
  const [currentView, setCurrentView] = useState('countries');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Popular countries for TV streaming
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' }
  ];

  const loadChannels = async (countryCode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://iptv-org.github.io/api/countries/${countryCode.toLowerCase()}.json`);
      if (!response.ok) throw new Error('Failed to load channels');
      const data = await response.json();
      
      // Filter for working streams
      const validChannels = data
        .filter(ch => ch.url && ch.url.includes('.m3u8'))
        .map((ch, idx) => ({
          id: `${countryCode}_${idx}`,
          name: ch.name || 'Unknown Channel',
          url: ch.url,
          category: ch.category || 'General',
          logo: ch.logo || ''
        }))
        .slice(0, 20); // Limit to first 20 channels
      
      setChannels(validChannels);
      setCurrentView('channels');
    } catch (err) {
      setError(err.message);
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
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
    <div className="viewport">
      <div className="status-offset"></div>
      
      {/* Country Selection View */}
      {currentView === 'countries' && (
        <div className="pane">
          <header className="topbar">
            <div className="brand">R1 TV</div>
            <div className="subtitle">Select Country</div>
          </header>
          <main className="content">
            <div className="country-grid">
              {countries.map(country => (
                <button 
                  key={country.code}
                  className="country-card"
                  onClick={() => selectCountry(country)}
                >
                  <div className="country-flag">{country.code}</div>
                  <div className="country-name">{country.name}</div>
                </button>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* Channel List View */}
      {currentView === 'channels' && (
        <div className="pane">
          <header className="topbar">
            <button className="btn-back" onClick={goBack}>←</button>
            <div className="brand">{selectedCountry?.name}</div>
          </header>
          <main className="content">
            {loading && <div className="loading">Loading channels...</div>}
            {error && (
              <div className="error">
                <p>{error}</p>
                <button onClick={() => loadChannels(selectedCountry.code)}>Retry</button>
              </div>
            )}
            {!loading && !error && (
              <div className="channel-list">
                {channels.map(channel => (
                  <button 
                    key={channel.id}
                    className="channel-item"
                    onClick={() => selectChannel(channel)}
                  >
                    <div className="channel-name">{channel.name}</div>
                    <div className="channel-category">{channel.category}</div>
                  </button>
                ))}
                {channels.length === 0 && (
                  <div className="no-channels">No channels available</div>
                )}
              </div>
            )}
          </main>
        </div>
      )}

      {/* Video Player View */}
      {currentView === 'player' && selectedChannel && (
        <div className="pane">
          <header className="topbar">
            <button className="btn-back" onClick={goBack}>←</button>
            <div className="brand truncate" title={selectedChannel.name}>
              {selectedChannel.name}
            </div>
          </header>
          <main className="content player-content">
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
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
