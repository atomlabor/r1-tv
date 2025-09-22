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
  // Create dummy channels for fallback when API returns empty or fails
  const createDummyChannels = (countryName) => {
    const dummyChannels = [];
    for (let i = 1; i <= 12; i++) {
      dummyChannels.push({
        id: `dummy-${i}`,
        name: `${countryName} channel ${i}`,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      });
    }
    return dummyChannels;
  };
  const loadChannels = async (countryCode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries/${countryCode}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Check if data exists and has channels
      if (!data || !Array.isArray(data) || data.length === 0) {
        setError('No channels found');
        // Use dummy channels as fallback
        const countryName = countries.find(c => c.code === countryCode)?.name || countryCode;
        setChannels(createDummyChannels(countryName));
        setCurrentPage(0);
        return;
      }
      
      const cleanChannels = data.filter(c => c && c.name && c.url).map(c => ({
        ...c,
        name: c.name.toLowerCase(),
      }));
      
      // If no valid channels after filtering, show error and use dummy channels
      if (cleanChannels.length === 0) {
        setError('No channels found');
        const countryName = countries.find(c => c.code === countryCode)?.name || countryCode;
        setChannels(createDummyChannels(countryName));
      } else {
        setChannels(cleanChannels);
      }
      setCurrentPage(0);
    } catch (err) {
      console.error('Error loading channels:', err);
      setError('No channels found');
      // Use dummy channels as fallback
      const countryName = countries.find(c => c.code === countryCode)?.name || countryCode;
      setChannels(createDummyChannels(countryName));
      setCurrentPage(0);
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
      setError(null);
    }
  };
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCurrentPage(0);
    loadChannels(country.code);
  };
  const loadMoreChannels = () => {
    setCurrentPage(prev => prev + 1);
  };
  const toggleRotate = () => setVideoRotation(prev => (prev === 0 ? 90 : 0));
  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else playerRef.current?.requestFullscreen();
  };
  const exitFullscreen = () => { 
    if (document.fullscreenElement) document.exitFullscreen(); 
  };
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
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
            
            {loading && channels.length === 0 && (
              <div className="r1-loading">loading channels...</div>
            )}
            
            {error && (
              <div className="r1-error">
                {error}
              </div>
            )}
            
            {/* Always show channel grid - either real channels or dummy channels */}
            {(visibleChannels.length > 0 || channels.length === 0) && (
              <div className="r1-channel-grid">
                {visibleChannels.length > 0 ? (
                  visibleChannels.map((channel, index) => (
                    <button 
                      key={`${channel.id || index}-${channel.name}`}
                      className="r1-channel-btn"
                      onClick={() => setSelectedChannel(channel)}
                      title={channel.name}
                    >
                      <div className="r1-channel-name">{channel.name}</div>
                    </button>
                  ))
                ) : (
                  // Show dummy grid while loading or on error
                  Array.from({length: 12}, (_, index) => (
                    <button 
                      key={`placeholder-${index}`}
                      className="r1-channel-btn r1-channel-placeholder"
                      disabled
                    >
                      <div className="r1-channel-name">...</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="r1-player-container">
            <div 
              className={`r1-player ${videoRotation === 90 ? 'rotated' : ''}`}
              ref={playerRef}
            >
              <div className="r1-player-controls">
                <button className="r1-control-btn back" onClick={goBack} title="back">←</button>
                <button className="r1-control-btn rotate" onClick={toggleRotate} title="rotate">↻</button>
                <button className="r1-control-btn fullscreen" onClick={toggleFullscreen} title="fullscreen">⛶</button>
              </div>
              
              {isFullscreen && (
                <button className="r1-exit-fullscreen" onClick={exitFullscreen} title="exit fullscreen">exit</button>
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
