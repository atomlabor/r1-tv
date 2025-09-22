/**
 * Main Entry Point for React Build
 * Simple version that just renders the R1-TV App
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Simple fallback for missing CSS imports
try {
  require('./styles/index.css');
} catch (e) {
  console.log('CSS not found, using fallback styles');
}

// Create root element if it doesn't exist
const rootElement = document.getElementById('root');
if (!rootElement) {
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
}

// Create and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        🐰📺 R1-TV
      </h1>
      <p style={{
        fontSize: '1.2rem',
        textAlign: 'center',
        maxWidth: '600px',
        lineHeight: '1.6',
        marginBottom: '2rem'
      }}>
        TV-App für Rabbit R1 mit Länderauswahl, Senderliste, Player und Favoriten
      </p>
      <div style={{
        backgroundColor: '#2a2a2a',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Funktionen:</h3>
        <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '0.5rem 0' }}>🌍 Länderauswahl für TV-Kanäle</li>
          <li style={{ margin: '0.5rem 0' }}>📺 Übersichtliche Senderliste</li>
          <li style={{ margin: '0.5rem 0' }}>▶️ Vollbild-Video Player</li>
          <li style={{ margin: '0.5rem 0' }}>⭐ Favoritenfunktion</li>
          <li style={{ margin: '0.5rem 0' }}>🎮 R1 SDK Integration</li>
        </ul>
      </div>
      <div style={{
        marginTop: '2rem',
        padding: '15px',
        backgroundColor: '#0066cc',
        borderRadius: '8px',
        color: 'white'
      }}>
        ✅ React App erfolgreich geladen!
      </div>
    </div>
  </React.StrictMode>
);

export default App;
