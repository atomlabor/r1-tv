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
  const channelsPerPage = 4; // Changed from 12 to 4 for 1x4 grid paging
  const videoRef = useRef(null);
  const playerRef = useRef(null);

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

  // Accept stream protocols used across sources
  const isValidStreamUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    const u = url.trim();
    return (
      u.startsWith('http://') ||
      u.startsWith('https://') ||
      u.startsWith('rtmp://') ||
      u.startsWith('rtmps://') ||
      u.startsWith('udp://') ||
      u.startsWith('//')
    );
  };

  // Extract first valid stream URL from diverse structures
  const getStreamUrl = (channel) => {
    if (!channel || typeof channel !== 'object') return null;
    // TVGarden format: arrays iptv_urls / youtube_urls
    if (Array.isArray(channel.iptv_urls) && channel.iptv_urls.length) {
      const firstValid = channel.iptv_urls.find(isValidStreamUrl);
      if (firstValid) return firstValid;
    }
    if (Array.isArray(channel.youtube_urls) && channel.youtube_urls.length) {
      const firstValidYt = channel.youtube_urls.find(isValidStreamUrl);
      if (firstValidYt) return firstValidYt;
    }
    // Generic fallbacks
    const possibleFields = ['url', 'stream', 'stream_url', 'src', 'link', 'href', 'uri'];
    for (const f of possibleFields) {
      if (channel[f] && isValidStreamUrl(channel[f])) return channel[f];
    }
    return null;
  };

  // Extract a display name robustly
  const getChannelName = (channel, index) => {
    if (!channel || typeof channel !== 'object') return `channel-${index + 1}`;
    const name = channel.name || channel.title || channel.tvg_name || channel.channel || channel.display_name;
    if (typeof name === 'string' && name.trim()) return name.trim();
    return `channel-${index + 1}`;
  };

  const loadChannels = async (countryCode) => {
    setLoading(true);
    setError(null);
    try {
      const code = (countryCode || '').toLowerCase();
      let response;
      try {
        response = await fetch(`https://api.iptv-org.github.io/countries/${code}.json`);
        if (!response.ok) throw new Error(`IPTV-org API error: ${response.status}`);
      } catch (_) {
        response = await fetch(`https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries/${code}.json`);
        if (!response.ok) throw new Error(`TV Garden API error: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Unexpected response format');

      // Flatten TVGarden channels that may have multiple iptv_urls
      const processed = data.flatMap((ch, idx) => {
        const displayName = getChannelName(ch, idx);
        // Prefer IPTV URLs, then fall back to YouTube/embed if present
        const iptvUrls = Array.isArray(ch.iptv_urls) ? ch.iptv_urls.filter(isValidStreamUrl) : [];
        const ytUrls = Array.isArray(ch.youtube_urls) ? ch.youtube_urls.filter(isValidStreamUrl) : [];
        const genericUrl = getStreamUrl(ch);
        const urls = [];
        if (iptvUrls.length) urls.push(...iptvUrls);
        if (!iptvUrls.length && genericUrl) urls.push(genericUrl);
        if (!urls.length && ytUrls.length) urls.push(...ytUrls);
        // If no urls, return empty list (filtered out later)
        if (!urls.length) return [];
        // Create an entry per URL so UI lists all name + URL options
        return urls.map((u, uIdx) => ({
          id: ch.nanoid || ch.id || ch.tvg_id || `${idx}-${uIdx}`,
          name: displayName,
          url: u,
          logo: ch.logo || ch.tvg_logo || null,
          category: ch.category || ch.group_title || 'General',
          country: ch.country || code.toUpperCase(),
        }));
      });

      const uniqueByKey = new Map();
      for (const c of processed) {
        const key = `${c.name}|${c.url}`;
        if (!uniqueByKey.has(key)) uniqueByKey.set(key, c);
      }
      const finalChannels = Array.from(uniqueByKey.values());
      if (!finalChannels.length) throw new Error('No valid channels found');
      setChannels(finalChannels);
      setCurrentPage(0);
    } catch (e) {
      setError(`Failed to load channels: ${e.message}`);
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

  const loadMoreChannels = () => setCurrentPage((p) => p + 1);
  const goBackChannels = () => setCurrentPage((p) => Math.max(0, p - 1));
  const toggleRotate = () => { setVideoRotation((p) => (p === 0 ? 90 : 0)); };
  const exitFullscreen = () => { if (document.fullscreenElement) document.exitFullscreen(); };

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
    };
  }, []);

  // Show channels in groups of 4 for paging
  const startIndex = currentPage * channelsPerPage;
  const endIndex = startIndex + channelsPerPage;
  const visibleChannels = channels.slice(startIndex, endIndex);
  const hasMoreChannels = channels.length > endIndex;
  const hasPreviousChannels = currentPage > 0;

  return (
    <div className="viewport">
      <div className="r1-app">
        <header className={`r1-header${videoRotation === 90 ? ' rotated-header' : ''}`}>
          {selectedCountry && !selectedChannel && hasPreviousChannels && (
            <button 
              className="r1-back-tv-header-btn" 
              disabled={loading} 
              onClick={goBackChannels}
            >
              {loading ? '...' : 'back'}
            </button>
          )}
          <div className="r1-header-content">
            <img 
              alt="r1 tv logo" 
              className="r1-logo"
              src="https://raw.githubusercontent.com/atomlabor/r1-tv/main/r1-tv.png"
            />
            <h1 className="r1-title">r1 tv</h1>
          </div>
          {selectedCountry && !selectedChannel && hasMoreChannels && (
            <button 
              className="r1-more-tv-header-btn" 
              disabled={loading} 
              onClick={loadMoreChannels}
            >
              {loading ? '...' : 'more tv'}
            </button>
          )}
          {selectedChannel && (
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
              {countries.map((country) => (
                <button 
                  className="r1-country-btn" 
                  key={country.code} 
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
            {loading && <div className="r1-loading">loading channels...</div>}
            {error && (
              <div className="r1-error">
                {error}
                <button className="r1-btn" onClick={() => loadChannels(selectedCountry.code)}>try again</button>
              </div>
            )}
            {!loading && !error && visibleChannels.length > 0 && (
              <div className="r1-channel-grid">
                {visibleChannels.map((channel, index) => (
                  <button 
                    className="r1-channel-btn" 
                    key={`${channel.id}-${index}`} 
                    onClick={() => setSelectedChannel(channel)} 
                    title={channel.name}
                  >
                    <div className="r1-channel-name">{channel.name}</div>
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <div className="r1-channel-grid">
                {Array.from({ length: 4 }, (_, index) => (
                  <button className="r1-channel-btn r1-channel-placeholder" disabled key={`placeholder-${index}`}>
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
                onError={(e) => {
                  console.error('stream error:', e);
                }}
                onLoadStart={() => setError(null)}
              >
                your browser does not support video playback
              </video>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
