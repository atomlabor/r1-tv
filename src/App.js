import React, { useState } from 'react';
import './styles/App.css';

/**
 * R1-TV - Modern TV streaming app optimized for Rabbit R1 display
 * Screen: 240x254px content area, 28px status bar offset
 * Total viewport: 240x282px
 */
function App() {
  const [currentView, setCurrentView] = useState('categories'); // categories, countries, channels, player
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Categories matching r1-tv.netlify.app
  const categories = [
    { id: 'animation', name: 'Animation', emoji: '🎨' },
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
    { id: 'news', name: 'News', emoji: '📰' },
    { id: 'sports', name: 'Sports', emoji: '⚽' },
    { id: 'travel', name: 'Travel', emoji: '✈️' }
  ];

  // Mock countries data
  const countries = [
    { code: 'DE', name: 'Deutschland', flag: '🇩🇪' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'BE', name: 'Belgium', flag: '🇧🇪' }
  ];

  // Mock channels data with categories
  const mockChannels = {
    'DE': {
      'news': [
        { id: 'ard', name: 'ARD', logo: '🇩🇪', stream: 'https://example.com/ard', category: 'news' },
        { id: 'zdf', name: 'ZDF', logo: '📺', stream: 'https://example.com/zdf', category: 'news' }
      ],
      'entertainment': [
        { id: 'rtl', name: 'RTL', logo: '🎆', stream: 'https://example.com/rtl', category: 'entertainment' },
        { id: 'sat1', name: 'Sat.1', logo: '🌟', stream: 'https://example.com/sat1', category: 'entertainment' }
      ],
      'sports': [
        { id: 'sport1', name: 'Sport1', logo: '⚽', stream: 'https://example.com/sport1', category: 'sports' }
      ]
    },
    'US': {
      'news': [
        { id: 'cnn', name: 'CNN', logo: '📰', stream: 'https://example.com/cnn', category: 'news' },
        { id: 'fox', name: 'Fox News', logo: '🦊', stream: 'https://example.com/fox', category: 'news' }
      ],
      'entertainment': [
        { id: 'nbc', name: 'NBC', logo: '📺', stream: 'https://example.com/nbc', category: 'entertainment' }
      ]
    },
    'GB': {
      'news': [
        { id: 'bbc', name: 'BBC One', logo: '📻', stream: 'https://example.com/bbc', category: 'news' }
      ]
    },
    'FR': {
      'general': [
        { id: 'tf1', name: 'TF1', logo: '📺', stream: 'https://example.com/tf1', category: 'general' }
      ]
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentView('countries');
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCurrentView('channels');
  };

  const handleChannelSelect = (channel) => {
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
      setCurrentView('countries');
    } else if (currentView === 'countries') {
      setCurrentView('categories');
    }
  };

  const getChannelsForCategoryAndCountry = () => {
    if (!selectedCountry || !selectedCategory) return [];
    const countryChannels = mockChannels[selectedCountry.code] || {};
    return countryChannels[selectedCategory.id] || [];
  };

  const channels = getChannelsForCategoryAndCountry();

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
                </button>
              ))}
            </div>
            <div className="navigation-hint">
              Scroll: Navigate • Side Button: Select
            </div>
          </div>
        )}

        {currentView === 'countries' && (
          <div className="countries-view">
            <h2 className="view-title">{selectedCategory?.name} Channels</h2>
            <p className="view-subtitle">Select your country</p>
            <div className="countries-grid">
              {countries.map(country => (
                <button
                  key={country.code}
                  className="country-button"
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="country-flag">{country.flag}</span>
                  <span className="country-name">{country.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentView === 'channels' && (
          <div className="channels-view">
            <h2 className="view-title">{selectedCategory?.name} - {selectedCountry?.name}</h2>
            <div className="channels-grid">
              {channels.map(channel => (
                <div className="channel-item" key={channel.id}>
                  <button
                    className="channel-button"
                    onClick={() => handleChannelSelect(channel)}
                  >
                    <span className="channel-logo">{channel.logo}</span>
                    <span className="channel-name">{channel.name}</span>
                  </button>
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
                </div>
              ))}
            </div>
            {channels.length === 0 && (
              <p className="no-channels">No {selectedCategory?.name.toLowerCase()} channels available for {selectedCountry?.name}.</p>
            )}
          </div>
        )}

        {currentView === 'player' && selectedChannel && (
          <div className="player-view">
            <h2 className="view-title">Now Playing: {selectedChannel.name}</h2>
            <div className="video-container">
              <div className="video-placeholder">
                <div className="channel-display">
                  <span className="playing-logo">{selectedChannel.logo}</span>
                  {selectedChannel.name}
                  <p className="stream-info">Live Stream</p>
                </div>
              </div>
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
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          Entwickelt für Rabbit R1 | R1-create.js & tv.garden API
        </div>
      </footer>
    </div>
  );
}

export default App;
