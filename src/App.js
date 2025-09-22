import React, { useEffect, useRef, useState } from 'react';
import './styles/App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [currentView, setCurrentView] = useState('countries'); // 'countries' | 'channels' | 'player'
  const [videoRotation, setVideoRotation] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(12);
  
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  
  // Check if fullscreen API is supported
  const shouldRenderFullscreen = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
  
  useEffect(() => {
    // Load countries from API
    fetch('https://iptv-org.github.io/api/countries.json')
      .then(res => res.json())
      .then(data => {
        setCountries(data || []);
      })
      .catch(err => {
        console.error('Failed to load countries:', err);
      });
  }, []);
  
  useEffect(() => {
    // Apply video rotation
    if (videoRef.current) {
      videoRef.current.style.transform = `rotate(${videoRotation}deg)`;
    }
  }, [videoRotation]);
  
  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
      setIsFs(isFullscreen);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
  
  const selectCountry = (country) => {
    setSelectedCountry(country);
    setCurrentView('channels');
    setCurrentPage(0);
    // Load channels for selected country
    fetch(`https://iptv-org.github.io/api/channels.json`)
      .then(res => res.json())
      .then(data => {
        const countryChannels = data.filter(channel => 
          channel.country === country.code && 
          channel.url && 
          channel.url.trim() !== ''
        );
        setChannels(countryChannels || []);
      })
      .catch(err => {
        console.error('Failed to load channels:', err);
        setChannels([]);
      });
  };
  
  const selectChannel = (channel) => {
    setSelectedChannel(channel);
    setCurrentView('player');
    setError(null);
  };
  
  const goBack = () => {
    if (currentView === 'player') {
      setCurrentView('channels');
      setSelectedChannel(null);
      setVideoRotation(0);
      setError(null);
    } else if (currentView === 'channels') {
      setCurrentView('countries');
      setSelectedCountry(null);
      setChannels([]);
      setCurrentPage(0);
    }
  };
  
  const toggleVideoRotation = () => {
    setVideoRotation(prev => (prev + 90) % 360);
  };
  
  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    
    if (!isFs) {
      // Enter fullscreen
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else if (playerRef.current.webkitRequestFullscreen) {
        playerRef.current.webkitRequestFullscreen();
      } else if (playerRef.current.mozRequestFullScreen) {
        playerRef.current.mozRequestFullScreen();
      } else if (playerRef.current.msRequestFullscreen) {
        playerRef.current.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      exitFs();
    }
  };
  
  const exitFs = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };
  
  // Handle software back for upscale+rotated mode
  const handleSoftwareBack = () => {
    setVideoRotation(0);
    setCurrentView('channels');
  };
  
  // Pagination logic
  const totalPages = Math.ceil((currentView === 'countries' ? countries : channels).length / itemsPerPage);
  const currentItems = (currentView === 'countries' ? countries : channels).slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get country flag emoji from country code
  const getCountryFlag = (countryCode) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  };
  
  const exitBtnStyle = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  };
  
  const softwareBackBtnStyle = {
    position: 'absolute',
    top: '8px',
    left: '8px',
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  };
  
  return (
    <div className="App">
      {/* Country selection view */}
      {currentView === 'countries' && (
        <div className="r1-pane">
          <header className="r1-header">
            <div className="r1-title">
              r1 tv 📺
            </div>
          </header>
          <div className="r1-grid">
            {currentItems.map((country, index) => (
              <button
                key={index}
                className="r1-channel"
                onClick={() => selectCountry(country)}
                title={country.name}
              >
                <div className="flag">{getCountryFlag(country.code)}</div>
                <div className="r1-channel-name">{country.name.toLowerCase()}</div>
              </button>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="r1-pagination">
              <button
                className="r1-btn"
                onClick={prevPage}
                disabled={currentPage === 0}
              >
                ← previous
              </button>
              <span className="r1-page-info">
                page {currentPage + 1} of {totalPages}
              </span>
              <button
                className="r1-btn"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
              >
                next →
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Channel grid view */}
      {currentView === 'channels' && (
        <div className="r1-pane">
          <header className="r1-header">
            <button className="r1-back" onClick={goBack}>←</button>
            <div className="r1-title">
              r1 tv 📺 - {selectedCountry?.name.toLowerCase()}
            </div>
          </header>
          <div className="r1-grid">
            {currentItems.map((channel, index) => (
              <button
                key={index}
                className="r1-channel"
                onClick={() => selectChannel(channel)}
                title={channel.name}
              >
                <div className="r1-channel-name">{channel.name.toLowerCase()}</div>
              </button>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="r1-pagination">
              <button
                className="r1-btn"
                onClick={prevPage}
                disabled={currentPage === 0}
              >
                ← previous
              </button>
              <span className="r1-page-info">
                page {currentPage + 1} of {totalPages}
              </span>
              <button
                className="r1-btn"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
              >
                next →
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Player view */}
      {currentView === 'player' && selectedChannel && (
        <div className="r1-pane">
          <header className="r1-header">
            <button className="r1-back" onClick={goBack}>←</button>
            <div className="r1-title" title={selectedChannel.name}>
              {selectedChannel.name.toLowerCase()}
            </div>
            <button className="r1-rotate-btn" onClick={toggleVideoRotation} title="rotate video (90°)">
              ↻
            </button>
            {shouldRenderFullscreen && (
              <button className="r1-more-tv-btn" onClick={toggleFullscreen} title="toggle fullscreen">
                fullscreen
              </button>
            )}
          </header>
          <div className="r1-player" ref={playerRef}>
            {/* Software back button for upscale+rotated mode (not fullscreen) */}
            {videoRotation === 90 && !isFs && (
              <button
                className="r1-software-back-btn"
                onClick={handleSoftwareBack}
                title="back to channels"
                style={softwareBackBtnStyle}
              >
                ←
              </button>
            )}
            
            {/* Small exit fullscreen button shown only when in fullscreen */}
            {isFs && (
              <button
                className="r1-more-tv-btn"
                onClick={exitFs}
                title="exit fullscreen"
                style={exitBtnStyle}
              >
                exit
              </button>
            )}
            <video
              autoPlay
              className="r1-video"
              controls
              key={selectedChannel.url}
              onError={(e) => {
                console.error('stream error:', e);
                setError('stream unavailable');
              }}
              onLoadStart={() => setError(null)}
              ref={videoRef}
              src={selectedChannel.url}
            >
              your browser does not support video playback
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
