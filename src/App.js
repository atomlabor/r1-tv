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
    setChannels([]);
    
    try {
      const response = await fetch(`https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries/${countryCode}.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if data exists and has channels
      if (!data || !Array.isArray(data) || data.length === 0) {
        setError('No channels found');
        setChannels([]);
        setCurrentPage(0);
        setLoading(false);
        return;
      }
      
      // Only use real channels from TVGarden, no dummy fallback
      const cleanChannels = data.filter(c => c && c.name && c.url).map(c => ({
        ...c,
        id: c.id || `channel-${c.name}`,
      }));
      
      if (cleanChannels.length === 0) {
        setError('No channels found');
        setChannels([]);
      } else {
        setChannels(cleanChannels);
      }
      setCurrentPage(0);
    } catch (err) {
      setError('Failed to load channels');
      setChannels([]);
      console.error('Error loading channels:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedChannel(null);
    loadChannels(country.code);
  };
  
  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
  };
  
  const rotateVideo = () => {
    setVideoRotation(prev => (prev + 90) % 360);
  };
  
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current?.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current?.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current?.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  const getCurrentPageChannels = () => {
    const startIndex = currentPage * channelsPerPage;
    const endIndex = startIndex + channelsPerPage;
    return channels.slice(startIndex, endIndex);
  };
  
  const totalPages = Math.ceil(channels.length / channelsPerPage);
  
  return (
    <div className="app">
      <header className="header">
        <h1>📺 R1 TV</h1>
        <p>Select a country to browse live TV channels</p>
      </header>
      
      {!selectedCountry ? (
        <div className="country-selection">
          <h2>Choose Your Country</h2>
          <div className="countries-grid">
            {countries.map(country => (
              <button
                key={country.code}
                className="country-button"
                onClick={() => handleCountrySelect(country)}
              >
                <span className="country-emoji">{country.emoji}</span>
                <span className="country-name">{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="main-content">
          <div className="country-info">
            <button className="back-button" onClick={() => setSelectedCountry(null)}>
              ← Back to Countries
            </button>
            <h2>{selectedCountry.emoji} {selectedCountry.name} Channels</h2>
          </div>
          
          {loading && <div className="loading">Loading channels...</div>}
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {!loading && channels.length > 0 && (
            <>
              <div className="channels-grid">
                {getCurrentPageChannels().map(channel => (
                  <button
                    key={channel.id}
                    className={`channel-button ${
                      selectedChannel?.id === channel.id ? 'selected' : ''
                    }`}
                    onClick={() => handleChannelSelect(channel)}
                  >
                    <div className="channel-name">{channel.name}</div>
                  </button>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                  >
                    ←
                  </button>
                  <span>{currentPage + 1} / {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
          
          {selectedChannel && (
            <div className="video-container">
              <div className="video-header">
                <h3>Now Playing: {selectedChannel.name}</h3>
                <div className="video-controls">
                  <button onClick={rotateVideo}>↻ Rotate</button>
                  <button onClick={toggleFullscreen}>
                    {isFullscreen ? '⊟ Exit Fullscreen' : '⊞ Fullscreen'}
                  </button>
                </div>
              </div>
              <div className="video-wrapper">
                <video
                  ref={videoRef}
                  src={selectedChannel.url}
                  controls
                  autoPlay
                  style={{
                    transform: `rotate(${videoRotation}deg)`,
                    transformOrigin: 'center'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
