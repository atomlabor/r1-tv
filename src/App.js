import React, { useEffect, useRef, useState } from 'react';
import './styles/App.css';

function App() {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState(null);
  const [videoRotation, setVideoRotation] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const [shouldRenderFullscreen, setShouldRenderFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const channelsPerPage = 12;
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const countries = [
    { code: 'de', name: 'Deutschland' },
    { code: 'at', name: 'Österreich' },
    { code: 'ch', name: 'Schweiz' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'us', name: 'United States' },
    { code: 'fr', name: 'France' }
  ];

  const loadChannels = async (countryCode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://iptv-org.github.io/iptv/countries/${countryCode}.json`);
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
      setError('Fehler beim Laden der Sender');
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (selectedChannel) {
      setSelectedChannel(null);
      setError(null);
    } else if (selectedCountry) {
      setSelectedCountry(null);
      setChannels([]);
      setCurrentPage(0);
    }
  };

  const goBackToCountries = () => {
    setSelectedCountry(null);
    setSelectedChannel(null);
    setChannels([]);
    setCurrentPage(0);
    setError(null);
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

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      playerRef.current?.requestFullscreen();
    }
  };

  const exitFs = () => {
    document.exitFullscreen();
  };

  const handleSoftwareBack = () => {
    goBack();
  };

  const softwareBackBtnStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 1000
  };

  const exitBtnStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1000
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFs(!!document.fullscreenElement);
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
          <h1 className="r1-title">r1 tv</h1>
          <img 
            src="https://github.com/atomlabor/r1-tv/blob/main/r1-tv.png?raw=true" 
            alt="r1 tv logo" 
            className="r1-logo"
          />
        </div>
        {(selectedChannel || selectedCountry) && (
          <button className="r1-btn" onClick={goBack}>
            ← zurück
          </button>
        )}
        {shouldRenderFullscreen && (
          <button className="r1-more-tv-btn" onClick={toggleFullscreen} title="toggle fullscreen">
            vollbild
          </button>
        )}
      </header>
      
      {!selectedCountry ? (
        <div className="r1-countries">
          <div className="r1-section-title">Land wählen</div>
          <div className="r1-country-grid">
            {countries.map((country) => (
              <button
                key={country.code}
                className="r1-country-btn"
                onClick={() => handleCountrySelect(country)}
              >
                {country.name}
              </button>
            ))}
          </div>
        </div>
      ) : !selectedChannel ? (
        <div className="r1-channels">
          <div className="r1-channels-header">
            {selectedCountry.name} - Verfügbare Sender
          </div>
          {loading && channels.length === 0 && (
            <div className="r1-loading">Lade Sender...</div>
          )}
          {error && (
            <div className="r1-error">
              {error}
              <button className="r1-btn" onClick={goBackToCountries}>
                ← zurück zur Länderauswahl
              </button>
            </div>
          )}
          {visibleChannels.length > 0 && (
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
          {hasMoreChannels && (
            <div className="r1-load-more">
              <button 
                className="r1-btn r1-load-more-btn" 
                onClick={loadMoreChannels}
                disabled={loading}
              >
                {loading ? 'Lädt...' : 'Mehr laden'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="r1-player-container">
          <header className="r1-player-header">
            {selectedChannel.name}
            <button className="r1-btn" onClick={goBack} title="zurück">
              ↻
            </button>
            {shouldRenderFullscreen && (
              <button className="r1-more-tv-btn" onClick={toggleFullscreen} title="toggle fullscreen">
                vollbild
              </button>
            )}
          </header>
          <div className="r1-player" ref={playerRef}>
            {/* Software back button for upscale+rotated mode (not fullscreen) */}
            {videoRotation === 90 && !isFs && (
              <button
                className="r1-software-back-btn"
                onClick={handleSoftwareBack}
                title="zurück zu sendern"
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
                title="vollbild verlassen"
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
                setError('Stream nicht verfügbar');
              }}
              onLoadStart={() => setError(null)}
              ref={videoRef}
              src={selectedChannel.url}
            >
              Ihr Browser unterstützt keine Videowiedergabe
            </video>
            {error && (
              <div className="player-error">
                {error}
                <button className="r1-btn" onClick={goBack}>
                  ← zurück zu sendern
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
