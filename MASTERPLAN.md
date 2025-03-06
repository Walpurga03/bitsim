# Masterplan: Bitcoin-Blockchain-Simulator

## Übersicht und Ziele

Der Bitcoin-Blockchain-Simulator ist eine interaktive Webanwendung, die entwickelt wird, um grundlegende Konzepte der Bitcoin-Blockchain zu veranschaulichen. Das Hauptziel ist es, Menschen mit Grundkenntnissen über Bitcoin ein tieferes Verständnis der zugrunde liegenden Technologie zu vermitteln.

Die Anwendung wird folgende Bitcoin-Konzepte visualisieren:
- Mining-Prozess und Proof-of-Work
- Block-Struktur
- Transaktionen zwischen Wallets
- Public/Private Keys
- Blockkette (Blockchain)

## Zielpublikum

- Bitcoin-Interessierte mit Grundkenntnissen
- Personen, die die technischen Aspekte von Bitcoin besser verstehen möchten
- Einsteiger in die Blockchain-Technologie

## Hauptmerkmale und Funktionalität

### 1. Wallet-Komponente
- Darstellung von mindestens zwei Wallets (z.B. "Satoshi's Wallet" und "Hall's Wallet")
- Anzeige von Adressen, Guthaben, Public und Private Keys
- Möglichkeit, Transaktionen zwischen Wallets durchzuführen

### 2. Block-Mining-Komponente
- Visualisierung eines Blocks mit seinen Bestandteilen:
  - Blockhash
  - Nonce
  - Zeitstempel
  - Transaktionen
  - Merkle Root
  - Difficulty Target
- Interaktiver "Mining starten"-Button, der den Nonce-Wert inkrementiert und prüft, ob der Hash kleiner als das Target ist

### 3. Blockchain-Visualisierung
- Einfache Darstellung von aufeinander aufbauenden Blöcken
- Visualisierung der Verkettung von Blöcken

### 4. Erklärungen und Tooltips
- Kurze, prägnante Erläuterungen zu den wichtigsten Konzepten
- Tooltips für technische Begriffe

## Technischer Stack

- **Frontend**: Vite + React + TypeScript
- **Styling**: SCSS für ansprechende und responsive Benutzeroberfläche
- **Deployment**: GitHub Pages

Diese Technologien wurden gemäß Ihren Anforderungen ausgewählt und bieten eine leistungsstarke, moderne Basis für die Entwicklung Ihrer Webanwendung.

## Konzeptuelles Datenmodell

### Wallet
```
{
  name: string,
  address: string,
  balance: number,
  privateKey: string,
  publicKey: string
}
```

### Transaction
```
{
  sender: string,
  recipient: string,
  amount: number,
  timestamp: number,
  signature: string
}
```

### Block
```
{
  index: number,
  timestamp: number,
  transactions: Transaction[],
  nonce: number,
  previousHash: string,
  hash: string,
  merkleRoot: string,
  difficulty: number
}
```

### Blockchain
```
{
  chain: Block[],
  pendingTransactions: Transaction[],
  difficulty: number,
  miningReward: number
}
```

## Grundsätze für die Gestaltung der Benutzeroberfläche

- **Farbschema**: Dunkler Hintergrund mit orangefarbenen Akzenten (Bitcoin-Thema)
- **Layout**: Klare, modulare Struktur mit separaten Bereichen für verschiedene Funktionen
- **Interaktivität**: Deutlich hervorgehobene Buttons für Aktionen
- **Visualisierung**: Einfache, verständliche Darstellungen der Blockchain-Konzepte
- **Responsive Design**: Anpassung an verschiedene Bildschirmgrößen

## Sicherheitsüberlegungen

- Da es sich um einen Simulator handelt, werden keine echten Kryptowährungen verwendet
- Keine Verbindung zu echten Blockchain-Netzwerken
- Simulierte Keypairs ohne kryptographische Sicherheit für Bildungszwecke

## Entwicklungsphasen

### Phase 1: Grundlegende Struktur und UI
- Einrichtung des Vite+React+TypeScript Projekts
- Implementierung des grundlegenden Layouts
- Erstellung der Wallet-Komponente

### Phase 2: Mining-Simulation
- Implementierung der Block-Struktur
- Visualisierung des Mining-Prozesses
- Interaktiver Mining-Button mit Nonce-Inkrementierung

### Phase 3: Transaktionen
- Implementierung der Transaktion-Funktionalität zwischen Wallets
- Anzeige der Transaktionshistorie

### Phase 4: Blockchain-Visualisierung
- Darstellung mehrerer Blöcke in einer Kette
- Visualisierung der Verkettung

### Phase 5: Dokumentation und Erklärungen
- Hinzufügen von Tooltips und Erklärungen
- Verbesserung der Benutzerfreundlichkeit

### Phase 6: Tests und Deployment
- Tests der Anwendung
- Deployment auf GitHub Pages

## Potenzielle Herausforderungen und Lösungen

### Herausforderung 1: Komplexität der Blockchain-Konzepte
**Lösung**: Vereinfachung der Konzepte für das Zielpublikum; schrittweise Erklärungen

### Herausforderung 2: Mining-Simulation im Browser
**Lösung**: Vereinfachung des Mining-Algorithmus für Bildungszwecke; Reduktion der Difficulty für schnellere Ergebnisse

### Herausforderung 3: Darstellung komplexer Datenstrukturen
**Lösung**: Visuelle Vereinfachung und Fokussierung auf die wichtigsten Aspekte

## Zukünftige Erweiterungsmöglichkeiten

- Detailliertere Darstellung des Merkle-Tree
- Mehrere Nodes für die Simulation des Konsensmechanismus
- Visualisierung von Forks und deren Auflösung
- Advanced Mode mit mehr technischen Details
- Mehrsprachige Unterstützung
- Integration von interaktiven Tutorials