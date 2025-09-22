import React, { useState, useEffect } from 'react';
import './styles/App.css';

/**
 * R1-TV - Modern TV streaming app optimized for Rabbit R1 display
 * Screen: 240x254px content area, 28px status bar offset
 * Total viewport: 240x282px
 * Now integrated with TVGarden API for real channel data
 */
function App() {
  const [currentView, setCurrentView] = useState('categories'); // categories, channels, player
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Categories with TVGarden API integration - focusing on animation, news, sports as requested
  const categories = [
    { id: 'animation', name: 'Animation', emoji: '🎨', apiUrl: 'https://iptv-org.github.io/api/categories/animation.json' },
    { id: 'news', name: 'News', emoji: '📰', apiUrl: 'https://iptv-org.github.io/api/categories/news.json' },
    { id: 'sports', name: 'Sports', emoji: '⚽', apiUrl: 'https://iptv-org.github.io/api/categories/sports.json' },
    { id: 'comedy', name: 'Comedy', emoji: '😂' },
    { id: 'cooking', name: 'Cooking', emoji: '👨‍🍳' },
    { id: 'documentary', name: 'Documentary', emoji: '📚' },
    { id: 'educational', name: 'Educational', emoji: '🎓' },
    { id: 'entertainment', name: 'Entertainment', emoji: '🎭' },
    { id: 'family', name: 'Family', emoji: '👨‍👩‍👧‍👦' },
    { id: 'general', name: 'General', emoji: '📺' },
    { id: 'kids', name: 'Kids', emoji: '🧸' },
    { id: 'lifestyle', name: 'Lifestyle', emoji: '✨' },
    { id: 'movies', name: 'Movies', emoji: '🎬' },
    { id: 'music', name: 'Music', emoji: '🎵' },
    { id: 'travel', name: 'Travel', emoji: '✈️' }
  ];

  // Load channels from TVGarden API
  const loadChannelsForCategory = async (category) => {
    if (!category.apiUrl) {
      // For categories without API integration, show placeholder
      setChannels([{
        id: 'placeholder',
        name: `${category.name} channels coming soon`,
        logo: category.emoji,
        stream: null,
        category: category.id
      }]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(category.apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to load ${category.name} channels`);
      }
      
      const channelData = await response.json();
      
      // Transform TVGarden data to our format
      const transformedChannels = channelData
        .filter(channel => channel.url && channel.url.includes('.m3u8')) // Only M3U8 streams
        .slice(0, 20) // Limit to first 20 channels for performance
        .map((channel, index) => ({
          id: `${category.id}_${index}`,
          name: channel.name || `${category.name} Channel ${index + 1}`,
          logo: getChannelEmoji(channel.name, category.id),
          stream: channel.url,
          category: category.id,
          country: channel.country,
          language: channel.languages ? channel.languages.join(', ') : 'Unknown'
        }));
      
      setChannels(transformedChannels);
    } catch (err) {
      setError(`Failed to load ${category.name} channels: ${err.message}`);
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  // Get appropriate emoji for channel based on name and category
  const getChannelEmoji = (channelName, categoryId) => {
    const name = (channelName || '').toLowerCase();
    
    if (categoryId === 'animation') {
      if (name.includes('cartoon')) return '🎭';
      if (name.includes('anime')) return '🎌';
      if (name.includes('kids')) return '🧸';
      return '🎨';
    }
    
    if (categoryId === 'news') {
      if (name.includes('bbc')) return '🇬🇧';
      if (name.includes('cnn')) return '🇺🇸';
      if (name.includes('france')) return '🇫🇷';
      if (name.includes('deutsch') || name.includes('german')) return '🇩🇪';
      return '📰';
    }
    
    if (categoryId === 'sports') {
      if (name.includes('football') || name.includes('soccer')) return '⚽';
      if (name.includes('basketball')) return '🏀';
      if (name.includes('tennis')) return '🎾';
      if (name.includes('motor') || name.includes('racing')) return '🏎️';
      return '⚽';
    }
    
    return '📺';
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setCurrentView('channels');
    await loadChannelsForCategory(category);
  };

  const handleChannelSelect = (channel) => {
    if (!channel.stream) return; // Don't play placeholder channels
    setSelectedChannel(channel);
    setCurrentView('player');
  };

  const toggleFavorite = (channel) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === channel.id);
      if (isFavorite) {
        return prev.filter(fav => fav.id !== channel.id);
      } else {
        return [...prev, channel];
      }
    });
  };

  const goBack = () => {
    if (currentView === 'player') {
      setCurrentView('channels');
    } else if (currentView === 'channels') {
      setCurrentView('categories');
    }
  };

  return (
    <div className="app r1-optimized">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            🐰📺 <span className="logo-text">R1-TV</span>
          </div>
          <div className="header-info">
            {currentView !== 'categories' && (
              <button className="back-button" onClick={goBack}>
                🔙
              </button>
            )}
            {favorites.length > 0 && (
              <div className="favorites-count">
                ❤️ {favorites.length}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {currentView === 'categories' && (
          <div className="categories-view">
            <h2 className="view-title">Categories</h2>
            <p className="categories-subtitle">{categories.length} categories</p>
            <div className="categories-grid">
              {categories.map(category => (
                <button
                  key={category.id}
                  className="category-button"
                  onClick={() => handleCategorySelect(category)}
                >
                  <span className="category-emoji">{category.emoji}</span>
                  <span className="category-name">{category.name}</span>
                  {category.apiUrl && <span className="live-indicator">🔴 LIVE</span>}
                </button>
              ))}
            </div>
            <div className="navigation-hint">
              Scroll: Navigate • Side Button: Select
            </div>
          </div>
        )}

        {currentView === 'channels' && (
          <div className="channels-view">
            <h2 className="view-title">{selectedCategory?.name} Channels</h2>
            
            {loading && (
              <div className="loading-state">
                <div className="loading-spinner">⏳</div>
                <p>Loading {selectedCategory?.name} channels...</p>
              </div>
            )}
            
            {error && (
              <div className="error-state">
                <p className="error-message">❌ {error}</p>
                <button 
                  className="retry-button" 
                  onClick={() => loadChannelsForCategory(selectedCategory)}
                >
                  🔄 Retry
                </button>
              </div>
            )}
            
            {!loading && !error && (
              <div className="channels-grid">
                {channels.map(channel => (
                  <div className="channel-item" key={channel.id}>
                    <button
                      className={`channel-button ${!channel.stream ? 'disabled' : ''}`}
                      onClick={() => handleChannelSelect(channel)}
                      disabled={!channel.stream}
                    >
                      <span className="channel-logo">{channel.logo}</span>
                      <span className="channel-name">{channel.name}</span>
                      {channel.stream && <span className="stream-indicator">📡</span>}
                      {channel.country && (
                        <span className="channel-country">{channel.country}</span>
                      )}
                    </button>
                    {channel.stream && (
                      <button
                        className={`favorite-button ${
                          favorites.some(fav => fav.id === channel.id) ? 'active' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(channel);
                        }}
                      >
                        {favorites.some(fav => fav.id === channel.id) ? '❤️' : '🤍'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {!loading && !error && channels.length === 0 && (
              <p className="no-channels">
                No {selectedCategory?.name.toLowerCase()} channels available.
              </p>
            )}
          </div>
        )}

        {currentView === 'player' && selectedChannel && (
          <div className="player-view">
            <h2 className="view-title">Now Playing: {selectedChannel.name}</h2>
            <div className="video-container">
              {selectedChannel.stream ? (
                <iframe
                  src={`data:text/html;charset=utf-8,
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <style>
                          body { margin: 0; padding: 0; background: black; }
                          video { width: 100%; height: 100%; object-fit: contain; }
                        </style>
                      </head>
                      <body>
                        <video controls autoplay muted>
                          <source src="${selectedChannel.stream}" type="application/x-mpegURL">
                          Your browser does not support HLS video.
                        </video>
                      </body>
                    </html>`}
                  width="240"
                  height="254"
                  style={{ border: 'none', marginTop: '28px' }}
                  title={selectedChannel.name}
                  allowFullScreen
                />
              ) : (
                <div className="video-placeholder">
                  <div className="channel-display">
                    <span className="playing-logo">{selectedChannel.logo}</span>
                    {selectedChannel.name}
                    <p className="stream-info">Stream not available</p>
                  </div>
                </div>
              )}
            </div>
            <div className="player-controls">
              <button className="control-button">
                ⏮️
              </button>
              <button className="control-button play-button">
                ▶️
              </button>
              <button className="control-button">
                ⏭️
              </button>
              <button
                className={`favorite-button-large ${
                  favorites.some(fav => fav.id === selectedChannel.id) ? 'active' : ''
                }`}
                onClick={() => toggleFavorite(selectedChannel)}
              >
                {favorites.some(fav => fav.id === selectedChannel.id) ? '❤️' : '🤍'}
              </button>
            </div>
            <div className="stream-info">
              <p><strong>Category:</strong> {selectedChannel.category}</p>
              {selectedChannel.country && (
                <p><strong>Country:</strong> {selectedChannel.country}</p>
              )}
              {selectedChannel.language && (
                <p><strong>Language:</strong> {selectedChannel.language}</p>
              )}
              {selectedChannel.stream && (
                <p><strong>Stream:</strong> M3U8 Live Stream</p>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          Entwickelt für Rabbit R1 | TVGarden API Integration
        </div>
      </footer>
    </div>
  );
}

export default App;
