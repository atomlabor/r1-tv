import React, { useState, useEffect } from 'react';
import './styles/App.css';
/**
 * r1 tv - rabbit r1 optimized tv player  
 * Country direct channel list, no categories, TVGarden JSON, Rabbit UI
 * Direct load from https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries/{country}.json
 * Extended with paging functionality - 'mehr tv' button loads next 12 channels from country JSON
 */
function App() {
  const [currentView, setCurrentView] = useState('countries');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoRotation, setVideoRotation] = useState(0); // Add rotation state
  const [currentPage, setCurrentPage] = useState(0); // Track current page for paging
  const [allCountryChannels, setAllCountryChannels] = useState([]); // Store all channels from country JSON
  const [hasMoreChannels, setHasMoreChannels] = useState(false); // Track if more channels available
  
  // Countries with their country codes for TVGarden API
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
  
  // Format channel name for optimal display - lowercase and short
  const formatChannelName = (channel) => {
    if (!channel || !channel.name) return 'unknown';
    
    let name = channel.name;
    // Remove common prefixes and clean up
    name = name.replace(/^(\d+\s*-\s*|\d+\s*\|\s*|\d+\s+)/i, '');
    name = name.replace(/\s*(HD|FHD|UHD|4K)\s*$/i, '');
    name = name.replace(/\s*(TV|Television)\s*$/i, '');
    name = name.replace(/[\[\(].*?[\]\)]/g, '');
    name = name.replace(/\s+/g, ' ').trim();
    
    // Convert to lowercase
    name = name.toLowerCase();
    
    // Keep it short for R1 display
    if (name.length > 10) {
      name = name.substring(0, 10) + '…';
    }
    
    return name || 'unknown';
  };
  
  // Toggle video rotation between 0° and 90°
  const toggleVideoRotation = () => {
    setVideoRotation(prev => prev === 0 ? 90 : 0);
  };
  
  // Process channels array into displayable format
  const processChannels = (channelData, startIndex = 0, count = 12) => {
    return channelData
      .filter(ch => {
        // Ensure we have playable streams
        return ch.iptv_urls && ch.iptv_urls.length > 0;
      })
      .slice(startIndex, startIndex + count)
      .map((ch, idx) => ({
        id: `${selectedCountry?.code || 'unknown'}_${startIndex + idx}`,
        name: formatChannelName(ch),
        originalName: ch.name || 'Unknown Channel',
        country: ch.country || selectedCountry?.code || 'unknown',
        category: ch.category || 'general',
        language: ch.language || '',
        logo: ch.logo || '',
        url: ch.iptv_urls[0], // Use first available stream
        allUrls: ch.iptv_urls
      }));
  };
  
  // Load channels directly from TVGarden country JSON
  const loadCountryChannels = async (country) => {
    setLoading(true);
    setError(null);
    setSelectedCountry(country);
    setCurrentPage(0);
    setChannels([]);
    setAllCountryChannels([]);
    
    try {
      // Direct load from TVGarden country JSON
      const url = `https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries/${country.code}.json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Country channels not available');
      }
      
      const channelData = await response.json();
      
      // Store all channels for paging
      const validChannels = channelData.filter(ch => {
        return ch.iptv_urls && ch.iptv_urls.length > 0;
      });
      
      setAllCountryChannels(validChannels);
      
      // Process first page (12 channels)
      const firstPageChannels = processChannels(validChannels, 0, 12);
      
      if (firstPageChannels.length === 0) {
        setError('no channels available for this country');
        setChannels([]);
        setHasMoreChannels(false);
      } else {
        setChannels(firstPageChannels);
        setCurrentView('channels');
        // Check if more channels are available
        setHasMoreChannels(validChannels.length > 12);
      }
      
    } catch (err) {
      console.error('Failed to load country channels:', err);
      setError('loading failed - country not available');
      setChannels([]);
      setHasMoreChannels(false);
    } finally {
      setLoading(false);
    }
  };
  
  // Load next 12 channels from the same country JSON
  const loadMoreChannels = async () => {
    if (!selectedCountry || !hasMoreChannels || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const nextPage = currentPage + 1;
      const startIndex = nextPage * 12;
      
      // Process next 12 channels from already loaded data
      const nextPageChannels = processChannels(allCountryChannels, startIndex, 12);
      
      if (nextPageChannels.length === 0) {
        setError('no more channels available');
        setHasMoreChannels(false);
      } else {
        // Add next page channels to existing ones
        setChannels(prevChannels => [...prevChannels, ...nextPageChannels]);
        setCurrentPage(nextPage);
        
        // Check if even more channels are available
        setHasMoreChannels(allCountryChannels.length > (startIndex + nextPageChannels.length));
      }
      
    } catch (err) {
      console.error('Failed to load more channels:', err);
      setError('loading failed - unable to load more channels');
    } finally {
      setLoading(false);
    }
  };
  
  const selectChannel = (channel) => {
    setSelectedChannel(channel);
    setCurrentView('player');
    setVideoRotation(0); // Reset rotation when selecting new channel
  };
  
  const goBack = () => {
    if (currentView === 'player') {
      setCurrentView('channels');
      setSelectedChannel(null);
      setVideoRotation(0); // Reset rotation when leaving player
    } else if (currentView === 'channels') {
      setCurrentView('countries');
      setSelectedCountry(null);
      setChannels([]);
      setAllCountryChannels([]);
      setCurrentPage(0);
      setHasMoreChannels(false);
    }
  };
  
  return (
    <div className="r1-viewport">
      {/* Countries view */}
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
                onClick={() => loadCountryChannels(country)}
              >
                <span className="flag">{country.flag}</span>
                <span className="name">{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Channels view */}
      {currentView === 'channels' && (
        <div className="r1-pane">
          <header className="r1-header">
            <button className="r1-back" onClick={goBack}>←</button>
            <div className="r1-title">{selectedCountry?.name}</div>
            {hasMoreChannels && (
              <button
                className="r1-more-tv-btn" 
                onClick={loadMoreChannels}
                disabled={loading}
                title="Weitere 12 TV Sender für dieses Land laden"
              >
                mehr tv
              </button>
            )}
          </header>
          
          {loading && <div className="r1-loading">loading channels...</div>}
          
          {error && (
            <div className="r1-error">
              <div className="error-text">{error}</div>
              <button
                className="r1-btn retry-btn" 
                onClick={() => loadCountryChannels(selectedCountry)}
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
                  title={`${channel.originalName} • ${channel.country}`}
                >
                  <span className="name">{channel.name}</span>
                  <span className="meta">{channel.country}</span>
                  <span className="play">▶</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Page indicator */}
          {channels.length > 0 && (
            <div className="r1-page-info">
              {channels.length} Kanäle{hasMoreChannels ? ' (mehr verfügbar)' : ''}
            </div>
          )}
        </div>
      )}
      
      {/* Player view */}
      {currentView === 'player' && selectedChannel && (
        <div className="r1-pane">
          <header className="r1-header">
            <button className="r1-back" onClick={goBack}>←</button>
            <div className="r1-title" title={selectedChannel.originalName}>
              {selectedChannel.name}
            </div>
            <button
              className="r1-rotate-btn"
              onClick={toggleVideoRotation}
              title="Video rotieren (90°)"
            >
              ↻
            </button>
          </header>
          <div className="r1-player">
            <video
              key={selectedChannel.url}
              controls
              autoPlay
              className="r1-video"
              style={{
                transform: `rotate(${videoRotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease'
              }}
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
                {error}
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
