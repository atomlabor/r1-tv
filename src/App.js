import React, { useState, useEffect } from 'react';
import './styles/App.css';

/**
 * r1 tv - rabbit r1 optimized tv player  
 * Learned TVGarden/r1-tv.netlify style: per-country category JSON, real names, direct streams, optimal grid
 * Based on analysis of r1-tv.netlify.app/assets/main-iXLiwYm6.js pattern
 */
function App() {
  const [currentView, setCurrentView] = useState('countries');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Countries with their TVGarden category mappings - optimized for 240x254px grid
  const countries = [
    { code: 'us', name: 'usa', flag: '🇺🇸', categories: ['news', 'sports', 'movies', 'entertainment'] },
    { code: 'gb', name: 'uk', flag: '🇬🇧', categories: ['news', 'sports', 'movies', 'entertainment'] },
    { code: 'de', name: 'de', flag: '🇩🇪', categories: ['news', 'sports', 'movies', 'entertainment'] },
    { code: 'fr', name: 'fr', flag: '🇫🇷', categories: ['news', 'sports', 'movies', 'entertainment'] },
    { code: 'es', name: 'es', flag: '🇪🇸', categories: ['news', 'sports', 'movies', 'entertainment'] },
    { code: 'it', name: 'it', flag: '🇮🇹', categories: ['news', 'sports', 'movies', 'entertainment'] },
    { code: 'ca', name: 'ca', flag: '🇨🇦', categories: ['news', 'sports', 'movies', 'entertainment'] },
    { code: 'au', name: 'au', flag: '🇦🇺', categories: ['news', 'sports', 'movies', 'entertainment'] },
    { code: 'jp', name: 'jp', flag: '🇯🇵', categories: ['news', 'sports', 'movies', 'entertainment'] },
    { code: 'kr', name: 'kr', flag: '🇰🇷', categories: ['news', 'sports', 'movies', 'entertainment'] },
    { code: 'br', name: 'br', flag: '🇧🇷', categories: ['news', 'sports', 'movies', 'entertainment'] },
    { code: 'mx', name: 'mx', flag: '🇲🇽', categories: ['news', 'sports', 'movies', 'entertainment'] }
  ];

  // TVGarden categories - following netlify app pattern
  const tvGardenCategories = [
    { name: 'news', url: 'https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/refs/heads/main/channels/raw/categories/news.json' },
    { name: 'sports', url: 'https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/refs/heads/main/channels/raw/categories/sports.json' },
    { name: 'movies', url: 'https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/refs/heads/main/channels/raw/categories/movies.json' },
    { name: 'entertainment', url: 'https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/refs/heads/main/channels/raw/categories/entertainment.json' },
    { name: 'music', url: 'https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/refs/heads/main/channels/raw/categories/music.json' },
    { name: 'kids', url: 'https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/refs/heads/main/channels/raw/categories/kids.json' },
    { name: 'cooking', url: 'https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/refs/heads/main/channels/raw/categories/cooking.json' },
    { name: 'documentary', url: 'https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/refs/heads/main/channels/raw/categories/documentary.json' }
  ];

  // Format channel name for optimal display - following netlify pattern
  const formatChannelName = (channel) => {
    if (!channel || !channel.name) return 'unknown';
    
    let name = channel.name;
    // Remove common prefixes and clean up
    name = name.replace(/^(\d+\s*-\s*|\d+\s*\|\s*|\d+\s+)/i, '');
    name = name.replace(/\s*(HD|FHD|UHD|4K)\s*$/i, '');
    name = name.replace(/\s*(TV|Television)\s*$/i, '');
    name = name.replace(/[\[\(].*?[\]\)]/g, '');
    name = name.replace(/\s+/g, ' ').trim();
    
    // Keep it short for R1 display
    if (name.length > 10) {
      name = name.substring(0, 10) + '…';
    }
    
    return name || 'unknown';
  };

  // Load categories for selected country
  const loadCountryCategories = (country) => {
    setSelectedCountry(country);
    setCategories(tvGardenCategories.slice(0, 8)); // Max 8 for optimal grid
    setCurrentView('categories');
  };

  // Load channels from TVGarden category JSON - following netlify pattern
  const loadCategoryChannels = async (category) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(category);
    
    try {
      const response = await fetch(category.url);
      if (!response.ok) {
        throw new Error('Category not available');
      }
      
      const channelData = await response.json();
      
      // Filter by country and process channels
      const countryChannels = channelData
        .filter(ch => {
          // Match country code in channel data
          return ch.country && ch.country.toLowerCase() === selectedCountry.code.toLowerCase();
        })
        .filter(ch => {
          // Ensure we have playable streams
          return ch.iptv_urls && ch.iptv_urls.length > 0;
        })
        .slice(0, 12) // Perfect grid for R1
        .map((ch, idx) => ({
          id: `${selectedCountry.code}_${category.name}_${idx}`,
          name: formatChannelName(ch),
          originalName: ch.name || 'Unknown Channel',
          country: ch.country || selectedCountry.code,
          category: ch.category || category.name,
          language: ch.language || '',
          logo: ch.logo || '',
          url: ch.iptv_urls[0], // Use first available stream
          allUrls: ch.iptv_urls
        }));
      
      if (countryChannels.length === 0) {
        // Fallback: show any channels from this category
        const fallbackChannels = channelData
          .filter(ch => ch.iptv_urls && ch.iptv_urls.length > 0)
          .slice(0, 12)
          .map((ch, idx) => ({
            id: `${category.name}_${idx}`,
            name: formatChannelName(ch),
            originalName: ch.name || 'Unknown Channel',
            country: ch.country || 'international',
            category: ch.category || category.name,
            language: ch.language || '',
            logo: ch.logo || '',
            url: ch.iptv_urls[0],
            allUrls: ch.iptv_urls
          }));
        
        setChannels(fallbackChannels);
      } else {
        setChannels(countryChannels);
      }
      
      setCurrentView('channels');
      
    } catch (err) {
      console.error('Failed to load category channels:', err);
      setError('loading failed - try another category');
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  const selectChannel = (channel) => {
    setSelectedChannel(channel);
    setCurrentView('player');
  };

  const goBack = () => {
    if (currentView === 'player') {
      setCurrentView('channels');
      setSelectedChannel(null);
    } else if (currentView === 'channels') {
      setCurrentView('categories');
      setChannels([]);
    } else if (currentView === 'categories') {
      setCurrentView('countries');
      setSelectedCountry(null);
      setCategories([]);
    }
  };

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
                onClick={() => loadCountryCategories(country)}
              >
                <span className="flag">{country.flag}</span>
                <span className="name">{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories view */}
      {currentView === 'categories' && (
        <div className="r1-pane">
          <header className="r1-header">
            <button className="r1-back" onClick={goBack}>←</button>
            <div className="r1-title">{selectedCountry?.name}</div>
          </header>
          <div className="r1-grid">
            {categories.map(category => (
              <button
                key={category.name}
                className="r1-btn category-btn"
                onClick={() => loadCategoryChannels(category)}
              >
                <span className="name">{category.name}</span>
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
            <div className="r1-title">{selectedCategory?.name}</div>
          </header>
          
          {loading && <div className="r1-loading">loading channels...</div>}
          
          {error && (
            <div className="r1-error">
              <div className="error-text">{error}</div>
              <button 
                className="r1-btn retry-btn" 
                onClick={() => loadCategoryChannels(selectedCategory)}
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
          </header>
          <div className="r1-player">
            <video
              key={selectedChannel.url}
              controls
              autoPlay
              muted
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
