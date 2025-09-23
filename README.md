# r1 tv

A modern TV streaming app for Rabbit R1 devices with comprehensive country selection, automatic channel loading, and a responsive grid-based interface. Developed by [Atomlabor](https://www.atomlabor.de/).

## 🌐 Live Demo

**Try it now:** https://atomlabor.github.io/r1-tv

The app can be tested directly in your browser via GitHub Pages. The web version offers all main features of the native R1 app with full responsive design.

## Features

r1 tv is a modern TV app specifically developed for the Rabbit R1 device. The app offers:

- **Country Selection**: Choose from various countries with automatic loading from TVGarden API (de.json, fr.json, etc.)
- **Automatic Channel Loading**: Dynamic fetching and paging of TV channels from the TVGarden API
- **Fixed Header with Logo**: Clean interface with r1-tv branding and persistent navigation controls
- **1x4 Grid Layout**: Four channels displayed per page in an optimized grid format
- **Smart Paging**: "More TV" button for seamless 4-channel pagination through the channel list
- **Always-Visible Player Controls**: Back and Rotate buttons remain accessible at all times
- **Responsive Design**: Stable UI optimized for both Rabbit R1 device and browser environments
- **Hardware Integration**: Full integration via Rabbit SDK for device-specific features

## Technical Foundation

The project is based on the following technologies:

- **R1-create.js**: Framework for Rabbit R1 app development
- **TVGarden API**: Real-time access to TV channel data from multiple countries (de.json, fr.json, etc.)
- **React Components**: Modern component-based architecture
- **Responsive CSS Grid**: Optimized 1x4 grid layout for channel display
- **Auto-pagination**: Intelligent loading and paging system for large channel lists

## Installation

```bash
# Clone repository
git clone https://github.com/atomlabor/r1-tv.git
cd r1-tv

# Install dependencies
npm install

# Start development server
npm start
```

## Usage

1. Start the app on your Rabbit R1 device or browser
2. Select a country from the available list
3. Browse channels in the 1x4 grid layout (4 channels per page)
4. Use "More TV" button to load additional channel pages
5. Click on any channel to start streaming
6. Use the always-visible Back and Rotate controls during playback
7. Enjoy the responsive interface that adapts to device orientation

## Project Structure

```
r1-tv/
├── src/
│   ├── components/     # React components with grid layout
│   ├── sdk/           # Rabbit SDK integration
│   ├── assets/        # Images, logos and media
│   └── styles/        # Responsive CSS/SCSS styles
├── public/            # Static files and manifests
├── package.json       # Project dependencies
└── README.md         # Project documentation
```

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/new-feature)
3. Commit your changes (git commit -am 'Add new feature')
4. Push to the branch (git push origin feature/new-feature)
5. Create a Pull Request

## Support

For questions or issues, please open an issue in the GitHub repository.

Developed for Rabbit R1 🐰📺 by [Atomlabor](https://www.atomlabor.de/)

---

# r1 tv (Deutsch)

Eine moderne TV-Streaming-App für Rabbit R1-Geräte mit umfassender Länderauswahl, automatischem Kanalladen und responsivem Grid-Interface. Entwickelt von [Atomlabor](https://www.atomlabor.de/).

## 🌐 Live-Demo

**Jetzt testen:** https://atomlabor.github.io/r1-tv

Die App kann direkt über GitHub Pages im Browser getestet werden. Die Web-Version bietet alle Hauptfunktionen der nativen R1-App mit vollständig responsivem Design.

## Funktionen

r1 tv ist eine moderne TV-App speziell für das Rabbit R1 Gerät entwickelt. Die App bietet:

- **Länderauswahl**: Auswahl verschiedener Länder mit automatischem Laden von der TVGarden-API (de.json, fr.json, etc.)
- **Automatisches Kanalladen**: Dynamisches Laden und Paging von TV-Kanälen aus der TVGarden-API
- **Fester Header mit Logo**: Saubere Oberfläche mit r1-tv-Branding und persistenten Navigationselementen
- **1x4-Grid-Layout**: Vier Kanäle pro Seite in optimiertem Raster-Format
- **Intelligente Seitenverwaltung**: "More TV"-Button für nahtlose 4-Kanal-Paginierung durch die Kanalliste
- **Stets sichtbare Player-Controls**: Zurück- und Rotations-Buttons bleiben jederzeit zugänglich
- **Responsive Design**: Stabiles UI optimiert für Rabbit R1-Gerät und Browser-Umgebungen
- **Hardware-Integration**: Vollständige Integration über das Rabbit SDK für gerätespezifische Funktionen

## Technische Basis

Das Projekt basiert auf folgenden Technologien:

- **R1-create.js**: Framework für Rabbit R1 App-Entwicklung
- **TVGarden-API**: Echtzeit-Zugriff auf TV-Kanaldaten aus mehreren Ländern (de.json, fr.json, etc.)
- **React-Komponenten**: Moderne komponentenbasierte Architektur
- **Responsive CSS Grid**: Optimiertes 1x4-Grid-Layout für Kanalanzeige
- **Auto-Paginierung**: Intelligentes Lade- und Paging-System für große Kanallisten

## Installation

```bash
# Repository klonen
git clone https://github.com/atomlabor/r1-tv.git
cd r1-tv

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm start
```

## Nutzung

1. App auf dem Rabbit R1 Gerät oder im Browser starten
2. Land aus der verfügbaren Liste auswählen
3. Kanäle im 1x4-Grid-Layout durchsuchen (4 Kanäle pro Seite)
4. "More TV"-Button verwenden, um weitere Kanalseiten zu laden
5. Auf einen beliebigen Kanal klicken, um das Streaming zu starten
6. Die stets sichtbaren Zurück- und Rotations-Controls während der Wiedergabe nutzen
7. Das responsive Interface genießen, das sich an die Geräteausrichtung anpasst

## Projektstruktur

```
r1-tv/
├── src/
│   ├── components/     # React-Komponenten mit Grid-Layout
│   ├── sdk/           # Rabbit SDK Integration
│   ├── assets/        # Bilder, Logos und Medien
│   └── styles/        # Responsive CSS/SCSS Styles
├── public/            # Statische Dateien und Manifeste
├── package.json       # Projektabhängigkeiten
└── README.md         # Projektdokumentation
```

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe LICENSE Datei für Details.

## Beiträge

Beiträge sind willkommen! Bitte:

1. Forke das Repository
2. Erstelle einen Feature-Branch (git checkout -b feature/neue-funktion)
3. Committe deine Änderungen (git commit -am 'Neue Funktion hinzugefügt')
4. Pushe den Branch (git push origin feature/neue-funktion)
5. Erstelle einen Pull Request

## Support

Bei Fragen oder Problemen öffne bitte ein Issue im GitHub Repository.

Entwickelt für Rabbit R1 🐰📺 von [Atomlabor](https://www.atomlabor.de/)
