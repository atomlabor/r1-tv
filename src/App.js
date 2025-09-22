import React, { useState, useEffect } from 'react';
import './styles/App.css';

/**
 * r1 tv - rabbit r1 style tv player
 * 240x254px content, lowercase ui, tvgarden live streams
 */
function App() {
  const [currentView, setCurrentView] = useState('countries');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // countries with flags for tv streaming
  const countries = [
    { code: 'us', name: 'united states', flag: '🇺🇸' },
    { code: 'gb', name: 'united kingdom', flag: '🇬🇧' },
    { code: 'de', name: 'germany', flag: '🇩🇪' },
    { code: 'fr', name: 'france', flag: '🇫🇷' },
    { code: 'es', name: 'spain', flag: '🇪🇸' },
    { code: 'it', name: 'italy', flag: '🇮🇹' },
    { code: 'ca', name: 'canada', flag: '🇨🇦' },
    { code: 'au', name: 'australia', flag: '🇦🇺' },
    { code: 'jp', name: 'japan', flag: '🇯🇵' },
    { code: 'kr', name: 'south korea', flag: '🇰🇷' },
    { code: 'br', name: 'brazil', flag: '🇧🇷' },
    { code: 'mx', name: 'mexico', flag: '🇲🇽' }
  ];

  // load channels from tvgarden raw api
  const loadChannels = async (countryCode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://tvgarden.vercel.app/api/channels/${countryCode}`);
      if (!response.ok) {
        // fallback to iptv-org api
        const fallbackResponse = await fetch(`https://iptv-org.github.io/api/countries/${countryCode}.json`);
        if (!fallbackResponse.ok) throw new Error('no channels found');
        const fallbackData = await fallbackResponse.json();
        const validChannels = fallbackData
          .filter(ch => ch.url && (ch.url.includes('.m3u8') || ch.url.includes('http')))
          .map((ch, idx) => ({
            id: `${countryCode}_${idx}`,
            name: (ch.name || 'unknown channel').toLowerCase(),
            url: ch.url,
            logo: ch.logo || '',
            category: (ch.category || 'general').toLowerCase()
          }))
          .slice(0, 24); // limit for grid display
        setChannels(validChannels);
        return;
      }
      const data = await response.json();
      const validChannels = data.channels
        .filter(ch => ch.url && (ch.url.includes('.m3u8') || ch.url.includes('http')))
        .map((ch, idx) => ({
          id: `${countryCode}_${idx}`,
          name: (ch.name || 'unknown channel').toLowerCase(),
          url: ch.url,
          logo: ch.logo || '',
          category: (ch.category || 'general').toLowerCase()
        }))
        .slice(0, 24); // limit for grid display
      setChannels(validChannels);
    } catch (err) {
      setError('loading failed');
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  // auto-load channels when country selected
  useEffect(() => {
    if (selectedCountry && currentView === 'channels') {
      loadChannels(selectedCountry.code);
    }
  }, [selectedCountry, currentView]);

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setCurrentView('channels');
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
      
      {/* country selection view */}
      {currentView === 'countries' && (
        <div className="pane">
          <header className="topbar">
            <div className="brand">r1 tv</div>
            <div className="subtitle">select country</div>
          </header>
          <main className="content">
            <div className="country-grid">
              {countries.map(country => (
                <button
                  key={country.code}
                  className="country-button"
                  onClick={() => selectCountry(country)}
                >
                  <div className="country-flag">{country.flag}</div>
                  <div className="country-name">{country.name}</div>
                </button>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* channel list view */}
      {currentView === 'channels' && (
        <div className="pane">
          <header className="topbar">
            <button className="btn-back" onClick={goBack}>←</button>
            <div className="brand">{selectedCountry?.name}</div>
          </header>
          <main className="content">
            {loading && <div className="loading">loading channels...</div>}
            {error && (
              <div className="error">
                <div>{error}</div>
                <button className="retry-btn" onClick={() => loadChannels(selectedCountry.code)}>retry</button>
              </div>
            )}
            {!loading && !error && (
              <div className="channel-grid">
                {channels.map(channel => (
                  <button
                    key={channel.id}
                    className="channel-button"
                    onClick={() => selectChannel(channel)}
                  >
                    <div className="channel-name">{channel.name}</div>
                    <div className="channel-category">{channel.category}</div>
                    <div className="play-icon">▶</div>
                  </button>
                ))}
                {channels.length === 0 && (
                  <div className="no-channels">no channels available</div>
                )}
              </div>
            )}
          </main>
        </div>
      )}

      {/* video player view */}
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
                muted
                className="video-player"
                src={selectedChannel.url}
                onError={() => setError('stream unavailable')}
              >
                your browser does not support video playback.
              </video>
              <div className="player-info">
                <div className="channel-title">{selectedChannel.name}</div>
                <div className="channel-meta">{selectedChannel.category} • {selectedCountry?.name}</div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
