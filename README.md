# R1-TV

TV-App für Rabbit R1 mit Länderauswahl, Senderliste, Player und Favoriten.

## Projektbeschreibung

R1-TV ist eine moderne TV-App speziell für das Rabbit R1 Gerät entwickelt. Die App bietet:

- **Länderauswahl**: Auswahl verschiedener Länder für TV-Kanäle
- **Senderliste**: Übersichtliche Liste verfügbarer TV-Sender
- **Video Player**: Vollbild-Wiedergabe mit Geräte-Rotation
- **Favoritenfunktion**: Speichern und Verwalten von Lieblingssendern
- **Hardwaresteuerung**: Integration über das Rabbit SDK

## Technische Basis

Das Projekt basiert auf folgenden Technologien:

- **R1-create.js**: Framework für Rabbit R1 App-Entwicklung
- **tv.garden API**: Zugriff auf TV-Kanaldaten
- **tv-garden-channel-list**: Kanallisten-Management
- **creations_builder_r1** (optional): Für erweiterte Funktionen

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

1. App auf dem Rabbit R1 Gerät starten
2. Land aus der verfügbaren Liste auswählen
3. Gewünschten TV-Sender aus der Senderliste wählen
4. Stream im Vollbild-Player genießen
5. Sender zu Favoriten hinzufügen (optional)

## Projektstruktur

```
r1-tv/
├── src/
│   ├── components/     # React-Komponenten
│   ├── sdk/           # Rabbit SDK Integration
│   ├── assets/        # Bilder und Medien
│   └── styles/        # CSS/SCSS Styles
├── public/            # Statische Dateien
├── package.json       # Projektabhängigkeiten
└── README.md         # Projektdokumentation
```

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe LICENSE Datei für Details.

## Beiträge

Beiträge sind willkommen! Bitte:

1. Forke das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/neue-funktion`)
3. Committe deine Änderungen (`git commit -am 'Neue Funktion hinzugefügt'`)
4. Pushe den Branch (`git push origin feature/neue-funktion`)
5. Erstelle einen Pull Request

## Support

Bei Fragen oder Problemen öffne bitte ein Issue im GitHub Repository.

---

**Entwickelt für Rabbit R1** 🐰📺
