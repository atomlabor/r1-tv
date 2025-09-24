<div className={`r1-viewport-wrapper${videoRotation === 90 ? ' rotated' : ''}`}>
  <header className={`r1-header${videoRotation === 90 && selectedChannel ? ' rotated-header' : ''}`}>
    <div className="r1-header-content">
      <img 
        className="r1-logo" 
        src="logo.png" 
        alt="R1 Logo"
        style={{display: videoRotation === 90 ? 'none' : 'inline-block'}}
      />
      <h1 
        className="r1-title"
        style={{display: videoRotation === 90 ? 'none' : 'block'}}
      >
        R1 TV
      </h1>
    </div>
    <div className="r1-player-controls visible">
      {/* Player controls */}
    </div>
  </header>
  <main className="r1-player-container">
    {/* Player container content */}
  </main>
</div>
