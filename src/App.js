import React, { useEffect, useRef, useState } from 'react';
import './styles/App.css';
/**
 * r1 tv - rabbit r1 optimized tv player  
 * Country direct channel list, no categories, TVGarden JSON, Rabbit UI
 * Direct load from https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries/{country}.json
 * Extended with paging functionality - 'more tv' button loads next 12 channels from country JSON
 */
function App() {
  const [currentView, setCurrentView] = useState('countries');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoRotation, setVideoRotation] = useState(0); // rotation state, persists across modes
  const [currentPage, setCurrentPage] = useState(0); // paging
  const [allCountryChannels, setAllCountryChannels] = useState([]); // cache
  const [hasMoreChannels, setHasMoreChannels] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  // refs for video and player wrapper to control fullscreen and styles
  const videoRef = useRef(null);
  const playerRef = useRef(null);
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
    name = name.replace(/^(\d+\s*-\s*|\d+\s*\|\s*|\d+\s+)/i, '');
    name = name.replace(/\s*(HD|FHD|UHD|4K)\s*$/i, '');
    name = name.replace(/\s*(TV|Television)\s*$/i, '');
    name = name.replace(/[\[\(].*?[\]\)]/g, '');
    name = name.replace(/\s+/g, ' ').trim();
    name = name.toLowerCase();
    if (name.length > 10) name = name.substring(0, 10) + '…';
    return name || 'unknown';
  };
  // Toggle video rotation between 0° and 90° — keep applied in all modes
  const toggleVideoRotation = () => {
    setVideoRotation(prev => (prev === 0 ? 90 : 0));
  };
  // Apply rotation style consistently (including after fullscreen changes)
  const applyRotationStyle = () => {
    const v = videoRef.current;
    if (!v) return;
    const deg = videoRotation;
    const rotate = `rotate(${deg}deg)`;
    v.style.transform = rotate;
    v.style.webkitTransform = rotate;
    v.style.msTransform = rotate;
    v.style.transformOrigin = 'center center';
    v.style.webkitTransformOrigin = 'center center';
    v.style.transition = 'transform 0.3s ease';
    v.style.webkitTransition = '-webkit-transform 0.3s ease';
    // Ensure objectFit remains in fullscreen as well
    v.style.objectFit = 'contain';
    // Make video occupy container in fullscreen
    v.style.width = '100%';
    v.style.height = '100%';
    // When rotated 90deg, help with sizing in some browsers
    if (deg === 90) {
      v.style.maxWidth = '100%';
      v.style.maxHeight = '100%';
    }
  };

  // Detect if fullscreen APIs and exit paths are available
  useEffect(() => {
    const fsAvailable = !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.msFullscreenEnabled ||
      document.mozFullScreenEnabled
    );
    setFullscreenSupported(fsAvailable);
  }, []);

  useEffect(() => {
    applyRotationStyle();
  }, [videoRotation, selectedChannel, currentView]);

  // Fullscreen helpers with vendor-prefixed fallbacks
  const isFullscreen = () => {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement ||
      document.mozFullScreenElement ||
      null
    );
  };
  const requestFs = (el) => {
    if (!el) return;
    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen(); // Safari
    if (el.msRequestFullscreen) return el.msRequestFullscreen(); // IE/Edge legacy
    if (el.mozRequestFullScreen) return el.mozRequestFullScreen(); // old Firefox
  };
  const exitFs = () => {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
    if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
  };
  const toggleFullscreen = () => {
    const container = playerRef.current || videoRef.current;
    if (!container) return;
    if (isFullscreen()) {
      exitFs();
    } else {
      requestFs(container);
    }
  };
  // Listen to fullscreenchange and re-apply styles to ensure rotation persists
  useEffect(() => {
    const handler = () => {
      applyRotationStyle();
    };
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    document.addEventListener('msfullscreenchange', handler);
    document.addEventListener('mozfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
      document.removeEventListener('msfullscreenchange', handler);
      document.removeEventListener('mozfullscreenchange', handler);
    };
  }, []);

  // Process channels array into displayable format
  const processChannels = (channelData, startIndex = 0, count = 12) => {
    return channelData
      .filter(ch => ch.iptv_urls && ch.iptv_urls.length > 0)
      .slice(startIndex, startIndex + count)
      .map((ch, idx) => ({
        id: `${selectedCountry?.code || 'unknown'}_${startIndex + idx}`,
        name: formatChannelName(ch),
        originalName: ch.name || 'Unknown Channel',
        country: ch.country || selectedCountry?.code || 'unknown',
        category: ch.category || 'general',
        language: ch.language || '',
        logo: ch.logo || '',
        url: ch.iptv_urls[0],
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
      const url = `https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries/${country.code}.json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Country channels not available');
      const channelData = await response.json();
      const validChannels = channelData.filter(ch => ch.iptv_urls && ch.iptv_urls.length > 0);
      setAllCountryChannels(validChannels);
      const firstPageChannels = processChannels(validChannels, 0, 12);
      if (firstPageChannels.length === 0) {
        setError('no channels available for this country');
        setChannels([]);
        setHasMoreChannels(false);
      } else {
        setChannels(firstPageChannels);
        setCurrentView('channels');
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
  // Load next 12 channels (page view)
  const loadMoreChannels = async () => {
    if (!selectedCountry || !hasMoreChannels || loading) return;
    setLoading(true);
    setError(null);
    try {
      const nextPage = currentPage + 1;
      const startIndex = nextPage * 12;
      const nextPageChannels = processChannels(allCountryChannels, startIndex, 12);
      if (nextPageChannels.length === 0) {
        setError('no more channels available');
        setHasMoreChannels(false);
      } else {
        setChannels(nextPageChannels);
        setCurrentPage(nextPage);
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
    setVideoRotation(videoRotation);
    setTimeout(applyRotationStyle, 0);
  };
  const goBack = () => {
    if (currentView === 'player') {
      setCurrentView('channels');
      setSelectedChannel(null);
    } else if (currentView === 'channels') {
      setCurrentView('countries');
      setSelectedCountry(null);
      setChannels([]);
      setAllCountryChannels([]);
      setCurrentPage(0);
      setHasMoreChannels(false);
    }
  };

  // Determine if we should render fullscreen button:
  // Only if fullscreen API is supported AND we can render an on-screen Exit Fullscreen button
  const shouldRenderFullscreen = fullscreenSupported;

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
                title="Load 12 more TV channels for this country"
              >
                more tv
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
          {channels.length > 0 && (
            <div className="r1-page-info">
              Page {currentPage + 1} • {channels.length} channels{hasMoreChannels ? ' (more available)' : ''}
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
              title="Rotate video (90°)"
            >
              ↻
            </button>
            {shouldRenderFullscreen && (
              <>
                <button
                  className="r1-more-tv-btn"
                  onClick={toggleFullscreen}
                  title="Toggle fullscreen"
                  style={{ marginLeft: 6 }}
                >
                  fullscreen
                </button>
                {isFullscreen() && (
                  <button
                    className="r1-more-tv-btn"
                    onClick={exitFs}
                    title="Exit fullscreen"
                    style={{ marginLeft: 6 }}
                  >
                    exit fullscreen
                  </button>
                )}
              </>
            )}
          </header>
          <div className="r1-player" ref={playerRef}>
            <video
              key={selectedChannel.url}
              ref={videoRef}
              controls
              autoPlay
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
