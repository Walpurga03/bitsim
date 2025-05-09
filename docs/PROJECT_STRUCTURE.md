
## Hauptkomponenten

### App.tsx
Die Hauptkomponente der Anwendung, die das Routing und den Gesamtkontext verwaltet.

### Simulation.tsx
Die zentrale Komponente, die den Simulationsfluss steuert und verschiedene Lernmodule orchestriert.

### Pages/
Enthält alle Hauptseiten der Anwendung, jede Seite entspricht einem Lernmodul oder einer Erklärungseinheit.

## Stilkonzept

Das Projekt verwendet SCSS-Module für einen komponentenbasierten Styling-Ansatz:

- Jede Hauptkomponente hat ihre eigene `.module.scss`-Datei
- Gemeinsame Stile werden in `global.scss` definiert
- Variablen wie Farben und Abstände sind in `variables.scss` zentralisiert

## Asset-Management

Assets wie Bilder, Audio und andere statische Ressourcen werden im `assets/`-Verzeichnis verwaltet und nach Typ organisiert.

## Hilfskomponenten

- **Overlays und Popups**: Bieten zusätzliche Erklärungen während der Simulation
- **3D-Komponenten**: Interaktive visuelle Elemente zur Verbesserung des Lernerlebnisses
- **Animierte Komponenten**: Verwenden framer-motion für flüssige Übergänge und Animationen

## Architekturprinzipien

1. **Modularität**: Jeder Aspekt von Bitcoin ist in einem eigenen Modul erklärt
2. **Progressive Offenbarung**: Konzepte werden schrittweise eingeführt
3. **Interaktivität**: Benutzer lernen durch direktes Experimentieren
4. **Visuelles Lernen**: Komplexe Konzepte werden visuell dargestellt

## Technologie-Stack

- **React**: Frontend-UI-Bibliothek
- **TypeScript**: Typsicheres JavaScript
- **SCSS-Module**: Komponenten-lokalisierte Stile
- **Framer-Motion**: Animationsbibliothek
- **Vite**: Build-Tool und Entwicklungsumgebung