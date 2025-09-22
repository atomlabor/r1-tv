import React, { useState, useEffect } from 'react';

interface Channel {
  nanoid: string;
  name: string;
  iptv_urls: string[];
  youtube_urls: string[];
  language: string;
  country: string;
  isGeoBlocked: boolean;
  logo?: string;
  streamUrl?: string;
}

interface Country {
  country: string;
  capital: string;
  timeZone: string;
  hasChannels: boolean;
}

interface ChannelListProps {
  selectedCountry: string;
  onChannelSelect: (channel: Channel) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({ selectedCountry, onChannelSelect }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('tv-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (err) {
        console.error('Failed to load favorites:', err);
        localStorage.removeItem('tv-favorites');
      }
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('tv-favorites', JSON.stringify(newFavorites));
  };

  // Toggle favorite status
  const toggleFavorite = (channelId: string) => {
    const newFavorites = favorites.includes(channelId)
      ? favorites.filter(id => id !== channelId)
      : [...favorites, channelId];
    saveFavorites(newFavorites);
  };

  // Fetch channels for selected country
  useEffect(() => {
    if (!selectedCountry) return;

    const fetchChannels = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/TVGarden/tv-garden-channel-list/main/channels/raw/countries/${selectedCountry.toLowerCase()}.json`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch channels for ${selectedCountry}`);
        }
        
        const channelData = await response.json();
        setChannels(channelData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load channels');
        setChannels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [selectedCountry]);

  // Get streaming URL (prefer m3u8, fallback to YouTube)
  const getStreamingUrl = (channel: Channel): string | null => {
    // Prefer IPTV streams (m3u8)
    if (channel.iptv_urls && channel.iptv_urls.length > 0) {
      return channel.iptv_urls[0];
    }
    // Fallback to YouTube
    if (channel.youtube_urls && channel.youtube_urls.length > 0) {
      return channel.youtube_urls[0];
    }
    return null;
  };

  // Handle channel selection
  const handleChannelClick = (channel: Channel) => {
    const streamUrl = getStreamingUrl(channel);
    if (streamUrl) {
      onChannelSelect({
        ...channel,
        streamUrl
      });
    }
  };

  if (!selectedCountry) {
    return (
      <div className="channel-list-empty">
        <h3>Please select a country to view TV channels</h3>
        <p>Choose from countries with available channels using the country selector.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="channel-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading channels for {selectedCountry}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="channel-list-error">
        <h3>Error loading channels</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const favoriteChannels = channels.filter(channel => favorites.includes(channel.nanoid));
  const regularChannels = channels.filter(channel => !favorites.includes(channel.nanoid));

  return (
    <div className="channel-list">
      <div className="channel-list-header">
        <h2>TV Channels - {selectedCountry}</h2>
        <div className="channel-count">
          {channels.length} channels available
        </div>
      </div>

      {favoriteChannels.length > 0 && (
        <div className="channel-section">
          <h3 className="section-title">
            ⭐ Favorites ({favoriteChannels.length})
          </h3>
          <div className="channel-grid">
            {favoriteChannels.map(channel => (
              <ChannelCard
                key={channel.nanoid}
                channel={channel}
                isFavorite={true}
                onToggleFavorite={() => toggleFavorite(channel.nanoid)}
                onClick={() => handleChannelClick(channel)}
                streamUrl={getStreamingUrl(channel)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="channel-section">
        <h3 className="section-title">
          📺 All Channels ({regularChannels.length})
        </h3>
        <div className="channel-grid">
          {regularChannels.map(channel => (
            <ChannelCard
              key={channel.nanoid}
              channel={channel}
              isFavorite={false}
              onToggleFavorite={() => toggleFavorite(channel.nanoid)}
              onClick={() => handleChannelClick(channel)}
              streamUrl={getStreamingUrl(channel)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface ChannelCardProps {
  channel: Channel;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
  streamUrl: string | null;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  isFavorite,
  onToggleFavorite,
  onClick,
  streamUrl
}) => {
  const hasStream = streamUrl !== null;
  const streamType = channel.iptv_urls?.length > 0 ? 'M3U8' : 
                    channel.youtube_urls?.length > 0 ? 'YouTube' : 'No Stream';

  return (
    <div className={`channel-card ${!hasStream ? 'no-stream' : ''}`}>
      <div className="channel-card-header">
        <h4 className="channel-name" title={channel.name}>
          {channel.name}
        </h4>
        <button
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      {channel.logo && (
        <div className="channel-logo">
          <img src={channel.logo} alt={`${channel.name} logo`} />
        </div>
      )}

      <div className="channel-info">
        <div className="channel-language">
          Language: {channel.language || 'Unknown'}
        </div>
        <div className={`stream-type ${streamType.toLowerCase()}`}>
          {streamType}
        </div>
        {channel.isGeoBlocked && (
          <div className="geo-blocked">🌍 Geo-blocked</div>
        )}
      </div>

      {hasStream && (
        <button
          className="play-btn"
          onClick={onClick}
          title={`Play ${channel.name}`}
        >
          ▶️ Play
        </button>
      )}

      {!hasStream && (
        <div className="no-stream-message">
          No stream available
        </div>
      )}
    </div>
  );
};

export default ChannelList;
