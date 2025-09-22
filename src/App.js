import React, { useState, useEffect } from 'react';
import './styles/App.css';

/**
 * R1-TV - Minimalist Weather-App-inspired TV UI for Rabbit R1
 * Content area: 240x254px, Top offset: 28px, Viewport: 240x282px
 * Uses TVGarden (iptv-org) JSON to load real streams for animation/news/sports
 */
function App() {
  // Views: channels (tabs) and player
  const [currentView, setCurrentView] = useState('channels');
  const [activeTab, setActiveTab] = useState('animation'); // animation | news | sports
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [rotation, setRotation] = useState(0); // 0 or 90

  // TVGarden category endpoints (iptv-org)
  const tabs = [
    { id: 'animation', label: 'Animation', apiUrl: 'https://iptv-org.github.io/api/categories/animation.json' },
    { id: 'news', label: 'News', apiUrl: 'https://iptv-org.github.io/api/categories/news.json' },
    { id: 'sports', label: 'Sports', apiUrl: 'https://iptv-org.github.io/api/categories/sports.json' },
  ];

  useEffect(() => {
    const tab = tabs.find(t => t.id === activeTab);
    if (tab) loadChannels(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadChannels = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(tab.apiUrl);
      if (!res.ok) throw new Error('Failed to load channels');
      const data = await res.json();

      // Only include playable m3u8 streams. Normalize minimal card format.
      const list = data
        .filter(ch => (ch.url && ch.url.includes('.m3u8')) || (Array.isArray(ch.urls) && ch.urls.some(u => u.includes('.m3u8'))))
        .map((ch, idx) => {
          const url = ch.url && ch.url.includes('.m3u8')
            ? ch.url
            : (Array.isArray(ch.urls) ? ch.urls.find(u => u.includes('.m3u8')) : null);
          return {
            id: `${tab.id}_${idx}`,
            name: (ch.name || 'Channel').replace(/[^\w\s\-.:]/g, ''), // no emojis/symbols
            stream: url,
            country: ch.country || '',
            lang: Array.isArray(ch.languages) ? ch.languages.join(', ') : (ch.language || ''),
          };
        })
        .filter(ch => !!ch.stream)
        .slice(0, 24);

      setChannels(list);
    } catch (e) {
      setError(e.message);
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  const openPlayer = (ch) => {
    setSelectedChannel(ch);
    setCurrentView('player');
  };

  const closePlayer = () => {
    setCurrentView('channels');
    setSelectedChannel(null);
    setRotation(0);
  };

  const toggleRotation = () => {
    setRotation(prev => (prev === 0 ? 90 : 0));
  };

  const requestFullscreen = () => {
    const iframe = document.getElementById('r1-player');
    if (iframe) {
      if (iframe.requestFullscreen) iframe.requestFullscreen();
      else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
      else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
      // also tell the inner doc to go fullscreen
      iframe.contentWindow && iframe.contentWindow.postMessage('fullscreen', '*');
    }
  };

  return (
    <div className="viewport">
      <div className="status-offset" />

      {currentView === 'channels' && (
        <div className="pane">
          <header className="topbar">
            <div className="brand">R1 TV</div>
            <nav className="tabs" role="tablist">
              {tabs.map(t => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={activeTab === t.id}
                  className={`tab ${activeTab === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </header>

          <main className="content">
            {loading && <div className="state text-dim">Loading…</div>}
            {error && (
              <div className="state text-error">
                {error}
                <button className="btn-ghost" onClick={() => loadChannels(tabs.find(t => t.id === activeTab))}>Retry</button>
              </div>
            )}
            {!loading && !error && (
              <div className="grid">
                {channels.map(ch => (
                  <button key={ch.id} className="card" onClick={() => openPlayer(ch)}>
                    <div className="card-title">{ch.name}</div>
                    <div className="card-meta">
                      <span>{ch.country}</span>
                      <span>{ch.lang}</span>
                    </div>
                  </button>
                ))}
                {channels.length === 0 && (
                  <div className="state text-dim">No channels available</div>
                )}
              </div>
            )}
          </main>
        </div>
      )}

      {currentView === 'player' && selectedChannel && (
        <div className="pane">
          <header className="topbar">
            <button className="btn-ghost" onClick={closePlayer}>Back</button>
            <div className="brand truncate" title={selectedChannel.name}>{selectedChannel.name}</div>
            <div className="actions">
              <button className="btn-ghost" onClick={toggleRotation}>{rotation === 0 ? 'Rotate' : 'Portrait'}</button>
              <button className="btn-ghost" onClick={requestFullscreen}>Fullscreen</button>
            </div>
          </header>

          <main className="content player-wrap">
            {/* Inline minimal player page (keeps 240x254 content area) */}
            <iframe
              id="r1-player"
              className={`player ${rotation === 90 ? 'rotated' : ''}`}
              src={`data:text/html;charset=utf-8,${encodeURIComponent(`
<!DOCTYPE html>
<html>
  <head>
    <meta charset=\"utf-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
    <style>
      html,body{margin:0;background:#000;height:100%;}
      video{width:100%;height:100%;object-fit:contain;background:#000;}
      .wrap{position:relative;width:240px;height:254px;}
    </style>
  </head>
  <body>
    <div class=\"wrap\">
      <video controls autoplay playsinline>
        <source src=\"${selectedChannel.stream}\" type=\"application/x-mpegURL\" />
      </video>
    </div>
    <script>
      window.addEventListener('message', (e)=>{
        if(e.data==='fullscreen' && document.documentElement.requestFullscreen){
          document.documentElement.requestFullscreen();
        }
      });
    <\/script>
  </body>
</html>
              `)}`}
              width="240"
              height="254"
              allowFullScreen
              frameBorder="0"
              title={selectedChannel.name}
            />
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
