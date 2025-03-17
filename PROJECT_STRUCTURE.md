
## 🔄 Simulationsablauf

Die Anwendung führt den Benutzer durch folgende Schritte:

1. **Landingpage** - Einführung und Projektübersicht
2. **Konsensus-Mechanismus** - Grundregeln des Bitcoin-Netzwerks
3. **Satoshi Nakamoto** - Einführung in die Geschichte des Bitcoin-Erfinders
4. **Mining Grundlagen** - Erklärung des Mining-Prozesses und erste Mining-Simulation
5. **Das Bitcoin-Netzwerk** - Darstellung der dezentralen Netzwerkstruktur
6. **Schwierigkeitsanpassung** - Simulation der Difficulty-Anpassung
7. **Transaktionen** - Durchführung und Bestätigung von Bitcoin-Transaktionen
8. **Mempool & Gebührenmarkt** - Simulation des Mempools und Auswahl von Transaktionen
9. **Block-Belohnung & Halving** - Erklärt den Halving-Mechanismus

## 🧩 Hauptkomponenten

### Seiten (pages/)

- **ConsensusPage.tsx** - Erklärt die Grundregeln des Bitcoin-Netzwerks
- **SatoshiIntroPage.tsx** - Einführung zu Satoshi Nakamoto
- **BasicMiningPage.tsx** - Grundlagen des Mining-Prozesses
- **NodeNetworkPage.tsx** - Visualisierung des Bitcoin-Netzwerks
- **DifficultyAdjustmentPage.tsx** - Simulation der Schwierigkeitsanpassung
- **TransactionPage.tsx** - Durchführung von Bitcoin-Transaktionen
- **MempoolPage.tsx** - Simulation des Mempools und Transaktionsauswahl
- **HalvingPage.tsx** - Erklärt den Halving-Mechanismus
- **CombinedTransactionWalletsPage.tsx** - Wallet-Interface für Transaktionen

### Komponenten (components/)

- **Simulation.tsx** - Hauptkomponente zur Steuerung des Simulationsablaufs
- **Landing.tsx** - Einführungsseite
- **InfoMenu.tsx** - Informationsmenü mit Erklärungen zu Bitcoin-Konzepten
- **ExplanationOverlay.tsx** - Overlay für detaillierte Erklärungen
- **Popups** - Verschiedene Popup-Komponenten für Erklärungen (MiningExplanationPopup, etc.)

### Styles (styles/)

- **SatoshiPage.module.scss** - Hauptstil-Datei für die meisten Seiten
- **Weitere Module** - Spezifische Stile für verschiedene Komponenten

### Utilities (utils/)

- **miningUtils.ts** - Funktionen zur Simulation des Mining-Prozesses
- **cryptoTransactionDemo.ts** - Funktionen zur Simulation von Transaktionen

## 🛠️ Technologien

- **React** - Frontend-Framework
- **TypeScript** - Typisierte JavaScript-Erweiterung
- **SCSS Modules** - Gekapselte Styling-Lösung
- **React Icons** - Icon-Bibliothek

## 📌 Besondere Funktionen

- **Interaktive Mining-Simulation** - Veranschaulichung des Proof-of-Work-Konzepts
- **Mempool-Visualisierung** - Benutzer können Transaktionen nach Gebühren auswählen
- **Responsive Design** - Anpassung an verschiedene Bildschirmgrößen
- **Informatives Popup-System** - Detaillierte Erklärungen zu Bitcoin-Konzepten