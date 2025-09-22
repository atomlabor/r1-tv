import React, { useState, useEffect } from 'react';
import './styles/App.css';

/**
 * r1 tv - rabbit r1 optimized tv player
 * 240x254px grid, no scroll, lowercase ui, tvgarden api, direct player
 */
function App() {
  const [currentView, setCurrentView] = useState('countries');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // optimized countries grid for 240x254px
  const countries = [
    { code: 'us', name: 'usa', flag: '🇺🇸' },
    { code: 'gb', name: 'uk', flag: '🇬🇧' },
    { code: 'de', name: 'de', flag: '🇩🇪' },
    { code: 'fr', name: 'fr', flag: '🇫🇷' },
    { code: 'es', name: 'es', flag: '🇪🇸' },
    { code: 'it', name: 'it', flag: '🇮🇹' },
    { code: 'ca', name: 'ca', flag: '🇨🇦' },
    { code: 'au', name: 'au', flag: '🇦🇺' },
    { code: 'jp', name: 'jp', flag: '🇯🇵' },
    { code: 'kr', name: 'kr', flag: '🇰🇷' },
    { code: 'br', name: 'br', flag: '🇧🇷' },
    { code: 'mx', name: 'mx', flag: '🇲🇽' }
  ];

  // load channels from tvgarden raw api
  const loadChannels = async (countryCode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://raw.githubusercontent.com/iptv-org/iptv/master/streams/${countryCode}.m3u`);
      if (!response.ok) {
        // fallback to alternative api
        const fallbackResponse = await fetch(`https://iptv-org.github.io/api/countries/${countryCode}.json`);
        if (!fallbackResponse.ok) throw new Error('no channels');
        const fallbackData = await fallbackResponse.json();
        const validChannels = fallbackData
          .filter(ch => ch.url && ch.url.includes('.m3u8'))
          .map((ch, idx) => ({
            id: `${countryCode}_${idx}`,
            name: (ch.name || 'channel').toLowerCase().substring(0, 15),
            url: ch.url,
            logo: ch.logo || '',
            category: (ch.category || 'tv').toLowerCase()
          }))
          .slice(0, 12); // perfect grid fit
        setChannels(validChannels);
        return;
      }
      
      // parse m3u content
      const m3uContent = await response.text();
      const lines = m3uContent.split('\n');
      const channels = [];
      
      for (let i = 0; i < lines.length && channels.length < 12; i++) {
        if (lines[i].startsWith('#EXTINF:')) {
          const nameMatch = lines[i].match(/,(.*)$/);
          const name = nameMatch ? nameMatch[1].toLowerCase().substring(0, 15) : 'channel';
          const url = lines[i + 1];
          
          if (url && url.includes('http')) {
            channels.push({
              id: `${countryCode}_${channels.length}`,
              name,
              url,
              logo: '',
              category: 'tv'
            });
          }
        }
      }
      
      setChannels(channels);
    } catch (err) {
      setError('loading failed');
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  // auto-load channels
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
    <div className="r1-viewport">
      {/* countries view */}
      {currentView === 'countries' && (
        <div className="r1-pane">
          <header className="r1-header">
            <div className="r1-title">r1 tv</div>
          </header>
          <div className="r1-grid">
            {countries.map(country => (
              <button
                key={country.code}
                className="r1-btn country-btn"
                onClick={() => selectCountry(country)}
              >
                <span className="flag">{country.flag}</span>
                <span className="name">{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* channels view */}
      {currentView === 'channels' && (
        <div className="r1-pane">
          <header className="r1-header">
            <button className="r1-back" onClick={goBack}>←</button>
            <div className="r1-title">{selectedCountry?.name}</div>
          </header>
          {loading && <div className="r1-loading">loading...</div>}
          {error && (
            <div className="r1-error">
              <div>{error}</div>
              <button className="r1-btn" onClick={() => loadChannels(selectedCountry.code)}>retry</button>
            </div>
          )}
          {!loading && !error && (
            <div className="r1-grid">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  className="r1-btn channel-btn"
                  onClick={() => selectChannel(channel)}
                >
                  <span className="name">{channel.name}</span>
                  <span className="play">▶</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* player view */}
      {currentView === 'player' && selectedChannel && (
        <div className="r1-pane">
          <header className="r1-header">
            <button className="r1-back" onClick={goBack}>←</button>
            <div className="r1-title">{selectedChannel.name}</div>
          </header>
          <div className="r1-player">
            <video
              controls
              autoPlay
              muted
              className="r1-video"
              src={selectedChannel.url}
              onError={() => setError('stream unavailable')}
            >
              browser not supported
            </video>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
