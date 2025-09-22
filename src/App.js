import React, { useState, useEffect } from 'react';
import './styles/App.css';

/**
 * r1 tv - rabbit r1 optimized tv player
 * 240x254px grid, no scroll, lowercase ui, tvgarden api, direct player
 * Enhanced to show real channel names from TVGarden/iptv-org API
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

  // clean and format channel name for display
  const formatChannelName = (rawName) => {
    if (!rawName || rawName === 'channel') return 'unnamed';
    
    // Remove common prefixes/suffixes and clean up
    let cleaned = rawName
      .replace(/^(\d+\s*-\s*|\d+\s*\|\s*|\d+\s+)/i, '') // Remove number prefixes
      .replace(/\s*(HD|FHD|UHD|4K)\s*$/i, '') // Remove HD suffixes
      .replace(/\s*(TV|Television)\s*$/i, '') // Remove TV suffixes
      .replace(/[\[\(].*?[\]\)]/g, '') // Remove content in brackets/parentheses
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Limit length for button display but keep readable
    if (cleaned.length > 12) {
      cleaned = cleaned.substring(0, 12) + '…';
    }
    
    return cleaned || 'unnamed';
  };

  // load channels from tvgarden/iptv-org API with better name extraction
  const loadChannels = async (countryCode) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try iptv-org JSON API first for better channel data
      let channelData = [];
      
      try {
        const apiResponse = await fetch(`https://iptv-org.github.io/api/countries/${countryCode}.json`);
        if (apiResponse.ok) {
          const apiData = await apiResponse.json();
          channelData = apiData
            .filter(ch => ch.url && (ch.url.includes('.m3u8') || ch.url.includes('http')))
            .map((ch, idx) => ({
              id: `${countryCode}_${idx}`,
              name: formatChannelName(ch.name),
              originalName: ch.name || 'Unknown Channel',
              url: ch.url,
              logo: ch.logo || '',
              category: (ch.category || 'tv').toLowerCase()
            }))
            .slice(0, 12); // Perfect grid fit for R1 display
        }
      } catch (apiError) {
        console.log('API fallback needed:', apiError.message);
      }
      
      // Fallback to M3U parsing if API fails
      if (channelData.length === 0) {
        const m3uResponse = await fetch(`https://raw.githubusercontent.com/iptv-org/iptv/master/streams/${countryCode}.m3u`);
        if (!m3uResponse.ok) {
          throw new Error('No channel sources available');
        }
        
        const m3uContent = await m3uResponse.text();
        const lines = m3uContent.split('\n');
        
        for (let i = 0; i < lines.length && channelData.length < 12; i++) {
          if (lines[i].startsWith('#EXTINF:')) {
            const nameMatch = lines[i].match(/,(.*)$/);
            const rawName = nameMatch ? nameMatch[1].trim() : 'Unknown Channel';
            const url = lines[i + 1]?.trim();
            
            if (url && url.startsWith('http')) {
              channelData.push({
                id: `${countryCode}_${channelData.length}`,
                name: formatChannelName(rawName),
                originalName: rawName,
                url: url,
                logo: '',
                category: 'tv'
              });
            }
          }
        }
      }
      
      if (channelData.length === 0) {
        throw new Error('No valid streams found');
      }
      
      setChannels(channelData);
      
    } catch (err) {
      console.error('Channel loading failed:', err);
      setError('loading failed - try another country');
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  // auto-load channels when country is selected
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
          
          {loading && <div className="r1-loading">loading channels...</div>}
          
          {error && (
            <div className="r1-error">
              <div className="error-text">{error}</div>
              <button 
                className="r1-btn retry-btn" 
                onClick={() => loadChannels(selectedCountry.code)}
              >
                retry
              </button>
            </div>
          )}
          
          {!loading && !error && (
            <div className="r1-grid">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  className="r1-btn channel-btn"
                  onClick={() => selectChannel(channel)}
                  title={channel.originalName} // Show full name on hover
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
            <div className="r1-title" title={selectedChannel.originalName}>
              {selectedChannel.name}
            </div>
          </header>
          <div className="r1-player">
            <video
              key={selectedChannel.url} // Force reload on channel change
              controls
              autoPlay
              muted
              className="r1-video"
              src={selectedChannel.url}
              onError={(e) => {
                console.error('Stream error:', e);
                setError('stream unavailable');
              }}
              onLoadStart={() => setError(null)}
            >
              Your browser does not support video playback
            </video>
            {error && (
              <div className="player-error">
                <p>{error}</p>
                <button className="r1-btn" onClick={goBack}>
                  ← back to channels
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
