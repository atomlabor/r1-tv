import React, { useState, useEffect } from 'react';
import './styles/App.css';
/**
 * r1 tv - rabbit r1 optimized tv player  
 * Country direct channel list, no categories, TVGarden JSON, Rabbit UI
 * Direct load from https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries/{country}.json
 * Extended with 'mehr tv' button for additional general channel list - only on channel selection page
 */
function App() {
  const [currentView, setCurrentView] = useState('countries');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
  
  // Load channels directly from TVGarden country JSON
  const loadCountryChannels = async (country) => {
    setLoading(true);
    setError(null);
    setSelectedCountry(country);
    
    try {
      // Direct load from TVGarden country JSON
      const url = `https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries/${country.code}.json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Country channels not available');
      }
      
      const channelData = await response.json();
      
      // Process channels - take max 12 for optimal grid
      const processedChannels = channelData
        .filter(ch => {
          // Ensure we have playable streams
          return ch.iptv_urls && ch.iptv_urls.length > 0;
        })
        .slice(0, 12) // Perfect grid for R1 (12 channels max)
        .map((ch, idx) => ({
          id: `${country.code}_${idx}`,
          name: formatChannelName(ch),
          originalName: ch.name || 'Unknown Channel',
          country: ch.country || country.code,
          category: ch.category || 'general',
          language: ch.language || '',
          logo: ch.logo || '',
          url: ch.iptv_urls[0], // Use first available stream
          allUrls: ch.iptv_urls
        }));
      
      if (processedChannels.length === 0) {
        setError('no channels available for this country');
        setChannels([]);
      } else {
        setChannels(processedChannels);
        setCurrentView('channels');
      }
      
    } catch (err) {
      console.error('Failed to load country channels:', err);
      setError('loading failed - country not available');
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Load additional channels from general.json for the selected country
  const loadMoreChannels = async () => {
    if (!selectedCountry) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const url = 'https://raw.githubusercontent.com/TVGarden/iptv-channel-list/main/channel-lists/general.json';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('General channels not available');
      }
      
      const channelData = await response.json();
      
      // Filter channels that match the selected country and process them
      const countryCode = selectedCountry.code.toUpperCase();
      const countryName = selectedCountry.name.toLowerCase();
      
      const additionalChannels = channelData
        .filter(ch => {
          // Ensure we have playable streams
          if (!ch.stream_url && (!ch.iptv_urls || ch.iptv_urls.length === 0)) return false;
          
          // Filter by country - check country code or name
          if (ch.country) {
            const chCountry = ch.country.toLowerCase();
            const chCode = ch.country.toUpperCase();
            return chCode === countryCode || chCountry.includes(countryName) || countryName.includes(chCountry);
          }
          
          // If no country info, check title/name for country references
          const title = (ch.name || ch.title || '').toLowerCase();
          return title.includes(countryName) || title.includes(selectedCountry.code);
        })
        .slice(0, 12) // Max 12 additional channels
        .map((ch, idx) => ({
          id: `${selectedCountry.code}_more_${idx}`,
          name: formatChannelName(ch),
          originalName: ch.name || ch.title || 'Unknown Channel',
          country: ch.country || selectedCountry.code,
          category: ch.category || 'general',
          language: ch.language || '',
          logo: ch.logo || ch.icon || '',
          url: ch.stream_url || ch.iptv_urls[0], // Use stream_url or first iptv_url
          allUrls: ch.iptv_urls || [ch.stream_url]
        }));
      
      if (additionalChannels.length === 0) {
        setError('no additional channels found for this country');
      } else {
        // Add additional channels to existing ones
        setChannels(prevChannels => [...prevChannels, ...additionalChannels]);
      }
      
    } catch (err) {
      console.error('Failed to load additional channels:', err);
      setError('loading failed - additional channels not available');
    } finally {
      setLoading(false);
    }
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
            <button
              className="r1-more-tv-btn" 
              onClick={loadMoreChannels}
              disabled={loading}
              title="Weitere TV Sender für dieses Land"
            >
              mehr tv
            </button>
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
          </header>
          <div className="r1-player">
            <video
              key={selectedChannel.url}
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
