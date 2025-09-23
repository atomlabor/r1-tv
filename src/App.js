import React, { useEffect, useRef, useState } from 'react';
import './styles/App.css';

function App() {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState(null);
  const [videoRotation, setVideoRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  
  const channelsPerPage = 12;
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  
  const countries = [
    { code: 'de', name: 'germany', emoji: '🇩🇪' },
    { code: 'gb', name: 'uk', emoji: '🇬🇧' },
    { code: 'us', name: 'usa', emoji: '🇺🇸' },
    { code: 'fr', name: 'france', emoji: '🇫🇷' },
    { code: 'it', name: 'italy', emoji: '🇮🇹' },
    { code: 'es', name: 'spain', emoji: '🇪🇸' },
    { code: 'at', name: 'austria', emoji: '🇦🇹' },
    { code: 'ch', name: 'switzerland', emoji: '🇨🇭' }
  ];
  
  // Updated loadChannels function to use tv.garden API approach
  const loadChannels = async (countryCode) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Loading channels for country: ${countryCode}`);
      
      // Use tv.garden API proxy or direct access approach
      // First try the tv.garden API-compatible endpoint
      let response;
      try {
        // Try tv.garden API-like endpoint first
        response = await fetch(`https://api.iptv-org.github.io/countries/${countryCode}.json`);
        if (!response.ok) {
          throw new Error(`IPTV-org API error: ${response.status}`);
        }
      } catch (iptvError) {
        console.log('IPTV-org API failed, trying tv.garden channel list fallback');
        // Fallback to original tv-garden-channel-list but with improved handling
        response = await fetch(`https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries/${countryCode}.json`);
        if (!response.ok) {
          throw new Error(`TV Garden API error: ${response.status}`);
        }
      }
      
      const data = await response.json();
      console.log('Loaded channel data:', data);
      
      // Check if data exists and is an array
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('No channels found in response');
      }
      
      // Process and filter channels - enhanced for tv.garden API compatibility
      const processedChannels = data
        .filter(channel => {
          // Enhanced filtering for tv.garden API format
          return channel && 
                 typeof channel === 'object' &&
                 channel.name && 
                 typeof channel.name === 'string' &&
                 channel.name.trim() && 
                 (channel.url || channel.stream_url || channel.stream) && 
                 typeof (channel.url || channel.stream_url || channel.stream) === 'string' &&
                 (channel.url || channel.stream_url || channel.stream).trim() &&
                 ((channel.url || channel.stream_url || channel.stream).startsWith('http') || 
                  (channel.url || channel.stream_url || channel.stream).startsWith('//'));
        })
        .map((channel, index) => {
          // Map different API formats to consistent structure
          const streamUrl = channel.url || channel.stream_url || channel.stream;
          return {
            id: channel.id || channel.tvg_id || `channel-${index}`,
            name: channel.name.trim(),
            url: streamUrl.trim(),
            logo: channel.logo || channel.tvg_logo || null,
            category: channel.category || channel.group_title || 'General',
            country: channel.country || countryCode.toUpperCase()
          };
        });
      
      console.log(`Processed ${processedChannels.length} valid channels from ${data.length} total`);
      
      if (processedChannels.length === 0) {
        throw new Error('No valid channels found after filtering');
      }
      
      setChannels(processedChannels);
      setCurrentPage(0);
    } catch (err) {
      console.error('Error loading channels:', err);
      setError(`Failed to load channels: ${err.message}`);
      setChannels([]);
      setCurrentPage(0);
    } finally {
      setLoading(false);
    }
  };
  
  const goBack = () => {
    if (selectedChannel) {
      setSelectedChannel(null);
      setVideoRotation(0);
      setControlsVisible(false);
      setError(null);
    } else if (selectedCountry) {
      setSelectedCountry(null);
      setChannels([]);
      setCurrentPage(0);
      setError(null);
    }
  };
  
  const handleCountrySelect = (country) => {
    console.log('Country selected:', country);
    setSelectedCountry(country);
    setCurrentPage(0);
    loadChannels(country.code);
  };
  
  const loadMoreChannels = () => {
    setCurrentPage(prev => prev + 1);
  };
  
  const toggleRotate = () => {
    setVideoRotation(prev => (prev === 0 ? 90 : 0));
    setControlsVisible(false);
  };
  
  const exitFullscreen = () => { 
    if (document.fullscreenElement) document.exitFullscreen(); 
  };
  
  // Touch handler for showing controls when rotated
  const handleVideoTouch = () => {
    if (videoRotation === 90) {
      setControlsVisible(true);
      
      // Clear existing timeout
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      // Hide controls after 3 seconds
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      // Cleanup timeout on unmount
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  
  const visibleChannels = channels.slice(0, (currentPage + 1) * channelsPerPage);
  const hasMoreChannels = channels.length > visibleChannels.length;
  
  return (
    <div className="viewport">
      <div className="r1-app">
        <header className="r1-header">
          <div className="r1-header-content">
            <img 
              src="https://github.com/atomlabor/r1-tv/blob/main/r1-tv.png?raw=true"
              alt="r1 tv logo"
              className="r1-logo"
            />
            <h1 className="r1-title">r1 tv</h1>
            
            {selectedCountry && !selectedChannel && hasMoreChannels && (
              <button 
                className="r1-more-tv-header-btn" 
                disabled={loading} 
                onClick={loadMoreChannels}
              >
                {loading ? '...' : 'more tv'}
              </button>
            )}
          </div>
          
          {/* Player Controls in Header Top Right - only show when not rotated */}
          {selectedChannel && videoRotation !== 90 && (
            <div className="r1-player-controls visible">
              <button className="r1-control-btn back" onClick={goBack} title="back">↩</button>
              <button className="r1-control-btn rotate" onClick={toggleRotate} title="rotate">⟳</button>
            </div>
          )}
        </header>
        
        {!selectedCountry ? (
          <div className="r1-countries">
            <div className="r1-section-title">choose country</div>
            <div className="r1-country-grid">
              {countries.map(country => (
                <button
                  key={country.code}
                  className="r1-country-btn"
                  onClick={() => handleCountrySelect(country)}
                >
                  <div className="country-emoji">{country.emoji}</div>
                  <div className="country-name">{country.name}</div>
                </button>
              ))}
            </div>
          </div>
        ) : !selectedChannel ? (
          <div className="r1-channels">
            <div className="r1-channels-header">
              <button className="r1-back-btn" onClick={goBack}>←</button>
              {selectedCountry.name} channels
            </div>
            
            {loading && (
              <div className="r1-loading">loading channels...</div>
            )}
            
            {error && (
              <div className="r1-error">
                {error}
                <button className="r1-btn" onClick={() => loadChannels(selectedCountry.code)}>try again</button>
              </div>
            )}
            
            {/* Channel grid - only show if we have channels */}
            {!loading && !error && visibleChannels.length > 0 && (
              <div className="r1-channel-grid">
                {visibleChannels.map((channel, index) => (
                  <button
                    key={`${channel.id || index}-${channel.name}`}
                    className="r1-channel-btn"
                    onClick={() => setSelectedChannel(channel)}
                    title={channel.name}
                  >
                    <div className="r1-channel-name">{channel.name}</div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Show placeholder grid when loading */}
            {loading && (
              <div className="r1-channel-grid">
                {Array.from({length: 12}, (_, index) => (
                  <button
                    key={`placeholder-${index}`}
                    className="r1-channel-btn r1-channel-placeholder"
                    disabled
                  >
                    <div className="r1-channel-name">...</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="r1-player-container">
            <div
              className={`r1-player ${videoRotation === 90 ? 'rotated' : ''}`}
              ref={playerRef}
            >
              {isFullscreen && (
                <button className="r1-exit-fullscreen" onClick={exitFullscreen} title="exit fullscreen">exit</button>
              )}
              
              <video
                ref={videoRef}
                className="r1-video"
                src={selectedChannel.url}
                autoPlay
                controls={videoRotation !== 90}
                key={selectedChannel.url}
                onClick={handleVideoTouch}
                onError={(e) => { 
                  console.error('stream error:', e); 
                  setError('stream not available'); 
                }}
                onLoadStart={() => setError(null)}
              >
                your browser does not support video playback
              </video>
              
              {/* Touch overlay for rotated video */}
              {videoRotation === 90 && (
                <div className="r1-video-touch-overlay" onClick={handleVideoTouch}></div>
              )}
              
              {/* Controls overlay for rotated player */}
              {videoRotation === 90 && controlsVisible && (
                <div className="r1-player-controls-overlay">
                  <button className="r1-control-btn back" onClick={goBack} title="back">↩</button>
                  <button className="r1-control-btn rotate" onClick={toggleRotate} title="rotate">⟳</button>
                </div>
              )}
              
              {error && (
                <div className="r1-player-error">
                  {error}
                  <button className="r1-btn" onClick={goBack}>← back to channels</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
