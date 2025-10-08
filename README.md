![r1-tv Banner](https://github.com/atomlabor/r1-tv/blob/main/r1-tv.png?raw=true)

<div align="center">

# r1 tv

**A modern TV streaming app for Rabbit R1 devices with comprehensive country selection, automatic channel loading, and responsive grid-based interface**

Developed by [Atomlabor](https://www.atomlabor.de/)

[![QR Code](https://github.com/atomlabor/r1-tv/blob/main/r1-tv-qr.png?raw=true)](https://atomlabor.github.io/r1-tv)


[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/E1E51DRUM)
</div>

## 🌐 Live Demo

**Try it now:** https://atomlabor.github.io/r1-tv

The app can be tested directly in your browser via GitHub Pages. The web version offers all main features with full responsive design, optimized for both desktop and Rabbit R1 devices.

## ✨ Features (September 2025)

r1 tv is a modern TV streaming app with the latest features:

- **🌍 Country Selection & Direct Paging**: Choose from various countries with automatic loading from TVGarden API (de.json, fr.json, etc.) - organized only by country with instant updates
- **📺 Dynamic Channel Loading**: Real-time fetching and paging of TV channels from the expanded TVGarden API
- **➕ "More TV" Button & Pagination**: Load 4 additional channels per click with seamless pagination
- **🔄 Dynamic Channel Updates**: Channel names and content update dynamically as more pages are loaded
- **🎥 Stream/Video Player Integration**: Built-in player component specifically optimized for Rabbit R1 devices
- **🐰 Rabbit-Style UI with Rotation Button**: New responsive interface with rabbit-style design elements and interactive rotation controls
- **📋 Enhanced Selection Lists**: Country and channel selection with rabbit-style display and instant visual feedback
- **🌐 Expanded TVGarden API Integration**: Full integration with multiple country endpoints (de.json, fr.json, and more)
- **📱 Responsive Design**: Fully adaptive UI optimized for desktop, mobile, and Rabbit R1 environments
- **🎯 Fixed Header with Logo**: Clean interface with persistent r1-tv branding and navigation controls
- **📐 1x4 Grid Layout**: Optimized four-channel grid display per page for maximum visibility

## 🔧 Technical Foundation (September 2025)

Built with modern technologies and latest architecture:

- **⚛️ Modern React Components**: Latest React architecture with functional components and hooks
- **🎬 Integrated Player Component**: Custom video player optimized for streaming on Rabbit R1
- **🌐 Enhanced TVGarden API**: Real-time access to TV channel data from multiple countries with expanded endpoints
- **🎨 Advanced UI Logic**: New rotation controls, rabbit-style interfaces, and dynamic content updates
- **📱 Responsive CSS Grid**: Optimized 1x4 grid layout with mobile-first design approach
- **🔄 Smart Auto-pagination**: Intelligent loading system that handles large channel lists efficiently
- **⚡ Performance Optimized**: Fast loading times and smooth interactions for Rabbit R1 devices

## 📥 Installation

```bash
# Clone repository
git clone https://github.com/atomlabor/r1-tv.git
cd r1-tv

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📱 Usage

1. **Start the app** in your browser or on your Rabbit R1 device
2. **Select a country** from the enhanced country selection list
3. **Browse channels** in the optimized 1x4 grid layout (4 channels per page)
4. **Load more content** using the "More TV" button for additional channel pages
5. **Start streaming** by clicking on any channel to open the integrated player
6. **Use rotation controls** to navigate and enhance your viewing experience
7. **Enjoy the responsive interface** that adapts to different screen sizes and devices

## 📁 Project Structure

```
r1-tv/
├── src/
│   ├── components/     # React components with grid layout and player
│   │   ├── Player/     # Video player component for Rabbit R1
│   │   ├── Grid/       # Channel grid display components
│   │   └── Controls/   # Rotation and navigation controls
│   ├── assets/        # Images, logos and media files
│   ├── styles/        # Responsive CSS/SCSS styles
│   └── api/           # TVGarden API integration
├── public/            # Static files and manifests
├── .github/           # GitHub Actions workflows
├── package.json       # Project dependencies and scripts
├── webpack.web.config.js  # Web build configuration
└── README.md         # Project documentation
```

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/new-feature`)
3. **Commit your changes** (`git commit -am 'Add new feature'`)
4. **Push to the branch** (`git push origin feature/new-feature`)
5. **Create a Pull Request**

## 💬 Support

For questions or issues, please open an issue in the GitHub repository.

---

**Developed for Rabbit R1 🐰📺 by [Atomlabor](https://www.atomlabor.de/)**

---

# r1 tv (Deutsch)

![r1-tv Banner](https://github.com/atomlabor/r1-tv/blob/main/r1-tv.png?raw=true)

<div align="center">

**Eine moderne TV-Streaming-App für Rabbit R1-Geräte mit umfassender Länderauswahl, automatischem Kanalladen und responsivem Grid-Interface**

Entwickelt von [Atomlabor](https://www.atomlabor.de/)

[![QR Code](https://github.com/atomlabor/r1-tv/blob/main/r1-tv-qr.png?raw=true)](https://atomlabor.github.io/r1-tv)

</div>

## 🌐 Live-Demo

**Jetzt testen:** https://atomlabor.github.io/r1-tv

Die App kann direkt über GitHub Pages im Browser getestet werden. Die Web-Version bietet alle Hauptfunktionen mit vollständig responsivem Design, optimiert für Desktop und Rabbit R1-Geräte.

## ✨ Funktionen (September 2025)

r1 tv ist eine moderne TV-Streaming-App mit den neuesten Features:

- **🌍 Länderauswahl & Direktes Paging**: Auswahl verschiedener Länder mit automatischem Laden von der TVGarden-API (de.json, fr.json, etc.) - nur nach Ländern organisiert mit sofortigen Updates
- **📺 Dynamisches Kanalladen**: Echtzeit-Laden und Paging von TV-Kanälen aus der erweiterten TVGarden-API
- **➕ "More TV"-Button & Paginierung**: Laden von 4 zusätzlichen Kanälen pro Klick mit nahtloser Paginierung
- **🔄 Dynamische Kanal-Updates**: Kanalnamen und Inhalte werden dynamisch aktualisiert, wenn weitere Seiten geladen werden
- **🎥 Stream/Video-Player-Integration**: Eingebaute Player-Komponente speziell für Rabbit R1-Geräte optimiert
- **🐰 Rabbit-Style UI mit Rotations-Button**: Neues responsives Interface mit rabbit-style Design-Elementen und interaktiven Rotations-Kontrollen
- **📋 Erweiterte Auswahl-Listen**: Länder- und Kanalauswahl mit rabbit-style Anzeige und sofortigem visuellen Feedback
- **🌐 Erweiterte TVGarden-API-Integration**: Vollständige Integration mit mehreren Länder-Endpunkten (de.json, fr.json und mehr)
- **📱 Responsive Design**: Vollständig adaptives UI optimiert für Desktop, Mobile und Rabbit R1-Umgebungen
- **🎯 Fester Header mit Logo**: Saubere Oberfläche mit persistentem r1-tv-Branding und Navigationselementen
- **📐 1x4-Grid-Layout**: Optimierte Vier-Kanal-Raster-Anzeige pro Seite für maximale Sichtbarkeit

## 🔧 Technische Basis (September 2025)

Erstellt mit modernen Technologien und neuester Architektur:

- **⚛️ Moderne React-Komponenten**: Neueste React-Architektur mit funktionalen Komponenten und Hooks
- **🎬 Integrierte Player-Komponente**: Benutzerdefinierter Video-Player optimiert für Streaming auf Rabbit R1
- **🌐 Erweiterte TVGarden-API**: Echtzeit-Zugriff auf TV-Kanaldaten aus mehreren Ländern mit erweiterten Endpunkten
- **🎨 Erweiterte UI-Logik**: Neue Rotations-Kontrollen, rabbit-style Interfaces und dynamische Inhalts-Updates
- **📱 Responsive CSS Grid**: Optimiertes 1x4-Grid-Layout mit Mobile-First-Design-Ansatz
- **🔄 Intelligente Auto-Paginierung**: Intelligentes Ladesystem, das große Kanallisten effizient verwaltet
- **⚡ Performance-Optimiert**: Schnelle Ladezeiten und flüssige Interaktionen für Rabbit R1-Geräte

## 📥 Installation

```bash
# Repository klonen
git clone https://github.com/atomlabor/r1-tv.git
cd r1-tv

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm start

# Für Produktion erstellen
npm run build

# Auf GitHub Pages deployen
npm run deploy
```

## 📱 Nutzung

1. **App starten** im Browser oder auf dem Rabbit R1-Gerät
2. **Land auswählen** aus der erweiterten Länder-Auswahl-Liste
3. **Kanäle durchsuchen** im optimierten 1x4-Grid-Layout (4 Kanäle pro Seite)
4. **Mehr Inhalte laden** mit dem "More TV"-Button für zusätzliche Kanalseiten
5. **Streaming starten** durch Klicken auf einen beliebigen Kanal zum Öffnen des integrierten Players
6. **Rotations-Kontrollen verwenden** zum Navigieren und Verbessern des Seherlebnisses
7. **Responsive Interface genießen**, das sich an verschiedene Bildschirmgrößen und Geräte anpasst

## 📁 Projektstruktur

```
r1-tv/
├── src/
│   ├── components/     # React-Komponenten mit Grid-Layout und Player
│   │   ├── Player/     # Video-Player-Komponente für Rabbit R1
│   │   ├── Grid/       # Kanal-Grid-Anzeige-Komponenten
│   │   └── Controls/   # Rotations- und Navigations-Kontrollen
│   ├── assets/        # Bilder, Logos und Mediendateien
│   ├── styles/        # Responsive CSS/SCSS-Styles
│   └── api/           # TVGarden-API-Integration
├── public/            # Statische Dateien und Manifeste
├── .github/           # GitHub Actions Workflows
├── package.json       # Projektabhängigkeiten und Skripte
├── webpack.web.config.js  # Web-Build-Konfiguration
└── README.md         # Projektdokumentation
```

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) Datei für Details.

## 🤝 Beiträge

Beiträge sind willkommen! Bitte:

1. **Repository forken**
2. **Feature-Branch erstellen** (`git checkout -b feature/neue-funktion`)
3. **Änderungen committen** (`git commit -am 'Neue Funktion hinzugefügt'`)
4. **Branch pushen** (`git push origin feature/neue-funktion`)
5. **Pull Request erstellen**

## 💬 Support

Bei Fragen oder Problemen öffne bitte ein Issue im GitHub Repository.

---

**Entwickelt für Rabbit R1 🐰📺 von [Atomlabor](https://www.atomlabor.de/)**
