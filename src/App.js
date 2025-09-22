import React, { useEffect, useRef, useState } from 'react';

function App() {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);
  const [videoRotation, setVideoRotation] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const [shouldRenderFullscreen, setShouldRenderFullscreen] = useState(false);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const goBack = () => {
    setSelectedChannel(null);
    setError(null);
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

  return (
    <div className="r1-app">
      <header className="r1-header">
        <div className="r1-header-content">
          <h1 className="r1-title">r1 tv</h1>
          <img src="https://github.com/atomlabor/r1-tv/blob/main/r1-tv.png?raw=true" alt="r1 tv logo" style="height:16px;margin-left:6px;vertical-align:middle;" />
        </div>
        {selectedChannel && (
          <button className="r1-btn" onClick={goBack}>
            ← back to channels
          </button>
        )}
        {shouldRenderFullscreen && (
          <button className="r1-more-tv-btn" onClick={toggleFullscreen} title="toggle fullscreen">
            fullscreen
          </button>
        )}
      </header>
      {!selectedChannel ? (
        <div className="r1-channels">
          <h2>Available Channels</h2>
          <div className="r1-channel-grid">
            {channels.map((channel, index) => (
              <button
                key={index}
                className="r1-channel-btn"
                onClick={() => setSelectedChannel(channel)}
              >
                {channel.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="r1-player-container">
          <header className="r1-player-header">
            <h2>{selectedChannel.name}</h2>
            <button className="r1-btn" onClick={goBack} title="back">
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
