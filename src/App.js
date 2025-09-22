import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [currentView, setCurrentView] = useState('channels'); // 'channels' | 'player'
  const [videoRotation, setVideoRotation] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  
  // Check if fullscreen API is supported
  const shouldRenderFullscreen = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
  
  useEffect(() => {
    // Load channels from JSON
    fetch('/channels.json')
      .then(res => res.json())
      .then(data => {
        setChannels(data.channels || []);
      })
      .catch(err => {
        console.error('Failed to load channels:', err);
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
  
  const selectChannel = (channel) => {
    setSelectedChannel(channel);
    setCurrentView('player');
    setError(null);
  };
  
  const goBack = () => {
    setCurrentView('channels');
    setSelectedChannel(null);
    setVideoRotation(0);
    setError(null);
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
  
  const exitBtnStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };
  
  const softwareBackBtnStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };
  
  return (
    <div className="App">
      {/* Channel grid view */}
      {currentView === 'channels' && (
        <div className="r1-pane">
          <header className="r1-header">
            <img src="/r1-tv.png" alt="r1 tv logo" style={{height: '18px', marginRight: '8px', verticalAlign: 'middle'}} />
            <div className="r1-title">r1.tv</div>
          </header>
          <div className="r1-grid">
            {channels.map((channel, index) => (
              <button
                key={index}
                className="r1-channel"
                onClick={() => selectChannel(channel)}
                title={channel.originalName}
              >
                <div className="r1-channel-name">{channel.name}</div>
              </button>
            ))}
          </div>
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
            <button className="r1-rotate-btn" onClick={toggleVideoRotation} title="Rotate video (90°)">
              ↻
            </button>
            {shouldRenderFullscreen && (
              <>
                <button className="r1-more-tv-btn" style={{marginLeft: ''}} onClick={toggleFullscreen} title="Toggle fullscreen">
                  fullscreen
                </button>
              </>
            )}
          </header>
          <div className="r1-player" ref={playerRef}>
            {/* Software back button for upscale+rotated mode (not fullscreen) */}
            {videoRotation === 90 && !isFs && (
              <button
                className="r1-software-back-btn"
                onClick={handleSoftwareBack}
                title="Back to channels"
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
                title="Exit fullscreen"
                style={exitBtnStyle}
              >
                ↩
              </button>
            )}
            <video
              autoPlay
              className="r1-video"
              controls
              key={selectedChannel.url}
              onError={(e) => {
                console.error('Stream error:', e);
                setError('stream unavailable');
              }}
              onLoadStart={() => setError(null)}
              ref={videoRef}
              src={selectedChannel.url}
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
