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
  const channelsPerPage = 12;
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const countries = [
    { code: 'de', name: 'germany', emoji: '🇩🇪' },
    { code: 'uk', name: 'uk', emoji: '🇬🇧' },
    { code: 'us', name: 'usa', emoji: '🇺🇸' },
    { code: 'fr', name: 'france', emoji: '🇫🇷' },
    { code: 'it', name: 'italy', emoji: '🇮🇹' },
    { code: 'es', name: 'spain', emoji: '🇪🇸' },
    { code: 'at', name: 'austria', emoji: '🇦🇹' },
    { code: 'ch', name: 'switzerland', emoji: '🇨🇭' }
  ];

  const loadChannels = async (countryCode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries/${countryCode}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Filter and clean channel data
      const cleanChannels = data.filter(channel => 
        channel && channel.name && channel.url
      ).map(channel => ({
        ...channel,
        name: channel.name.toLowerCase()
      }));
      
      setChannels(cleanChannels);
      setCurrentPage(0);
    } catch (err) {
      console.error('Error loading channels:', err);
      setError('error loading channels');
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (selectedChannel) {
      setSelectedChannel(null);
      setVideoRotation(0);
      setError(null);
    } else if (selectedCountry) {
      setSelectedCountry(null);
      setChannels([]);
      setCurrentPage(0);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCurrentPage(0);
    loadChannels(country.code);
  };

  const loadMoreChannels = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  };

  const toggleRotate = () => {
    setVideoRotation(prev => prev === 0 ? 90 : 0);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      playerRef.current?.requestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const visibleChannels = channels.slice(0, (currentPage + 1) * channelsPerPage);
  const hasMoreChannels = channels.length > visibleChannels.length;

  return (
    <div className="r1-app">
      <header className="r1-header">
        <div className="r1-header-content">
          <img 
            src="https://github.com/atomlabor/r1-tv/blob/main/r1-tv.png?raw=true" 
            alt="r1 tv logo" 
            className="r1-logo"
          />
          <h1 className="r1-title">r1 tv</h1>
        </div>
      </header>
      
      {!selectedCountry ? (
        <div className="r1-countries">
          <div className="r1-section-title">choose country</div>
          <div className="r1-country-grid">
            {countries.map((country) => (
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
            <span>{selectedCountry.name} channels</span>
          </div>
          
          {loading && channels.length === 0 && (
            <div className="r1-loading">loading channels...</div>
          )}
          
          {error && (
            <div className="r1-error">
              {error}
              <button className="r1-btn" onClick={() => setSelectedCountry(null)}>
                ← back to countries
              </button>
            </div>
          )}
          
          {visibleChannels.length > 0 && (
            <>
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
              
              {hasMoreChannels && (
                <div className="r1-load-more">
                  <button 
                    className="r1-more-tv-btn" 
                    onClick={loadMoreChannels}
                    disabled={loading}
                  >
                    {loading ? 'loading...' : 'more tv'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="r1-player-container">
          <div 
            className={`r1-player ${videoRotation === 90 ? 'rotated' : ''}`} 
            ref={playerRef}
          >
            {/* Player controls */}
            <div className="r1-player-controls">
              <button className="r1-control-btn back" onClick={goBack} title="back">
                ←
              </button>
              <button className="r1-control-btn rotate" onClick={toggleRotate} title="rotate">
                ↻
              </button>
              <button className="r1-control-btn fullscreen" onClick={toggleFullscreen} title="fullscreen">
                ⛶
              </button>
            </div>
            
            {/* Exit fullscreen button (only visible in fullscreen) */}
            {isFullscreen && (
              <button 
                className="r1-exit-fullscreen"
                onClick={exitFullscreen}
                title="exit fullscreen"
              >
                exit
              </button>
            )}
            
            <video
              ref={videoRef}
              className="r1-video"
              src={selectedChannel.url}
              autoPlay
              controls
              key={selectedChannel.url}
              onError={(e) => {
                console.error('stream error:', e);
                setError('stream not available');
              }}
              onLoadStart={() => setError(null)}
            >
              your browser does not support video playback
            </video>
            
            {error && (
              <div className="r1-player-error">
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
