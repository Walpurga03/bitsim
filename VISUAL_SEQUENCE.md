# Visuelle Erklärung des Simulationsablaufs

## Ablaufübersicht (aktualisiert)
1. **Landing Page**  
   - Animierte Startseite mit Überschriften, Beschreibung und "Simulation starten"-Button.
2. **Info-Menü Interaktion**  
   - Beim Klick auf den INFO-Button öffnet sich das Dropdown mit erklärenden Begriffen.
3. **Erklärungsoverlay**  
   - Auswahl eines Begriffs öffnet ein Overlay mit ausführlichen Erklärungen.
4. **Simulationsstart**  
   - Nach Schließen des Overlays und Klick auf "Simulation starten" beginnt die interaktive Simulation.
5. **Mining und Blockfindung**  
   - Ein Button löst die Blockerzeugung aus.  
   - Bei einem gefundenen Block erscheint ein visueller "Pop"-Effekt.
6. **Blockchain-Display**  
   - Gefundene Blöcke werden oben als Teil einer animierten, chronologischen Blockchain angezeigt.
7. **Fortschritt & Weiterführung**  
   - Nach mehreren gefundenen Blöcken kann der Benutzer fortfahren.

## Diagramm

```
      +------------------------------+
      |       Landing Page           |
      | (Animation, "Simulation      |
      |         starten)             |
      +--------------+---------------+
                     |
                     ▼
         +---------------------+
         | INFO-Button (oben)  |  
         +---------------------+
                     |
                     ▼
         +---------------------+
         | Dropdown-Menü mit   | 
         | Erklärungen         |
         +---------------------+
                     |
                     ▼
         +---------------------+
         | Erklärungsoverlay   |
         | (Begriffsauswahl)   |
         +---------------------+
                     │
                     ▼
         +---------------------+
         | Simulation starten  |
         | (Button Klick)      |
         +---------------------+
                     │
                     ▼
         +--------------------------+
         | Interaktive Simulation   |
         | (Mining-Dashboard)       |
         +------------+-------------+
                      │
                      ▼
         +-------------------------+
         | "Block minen" Button    |   ──► (Klick: Block wird generiert)
         +-------------------------+
                      │
                      ▼
         +-------------------------+
         | Gefundener Block        |
         | (Pop-Effekt Animation)  |
         +-------------------------+
                      │
                      ▼
         +-------------------------+
         | Blockchain-Display      |
         | (Animierte Anzeige,     |
         |  Chronologische Reihenfolge) 
         +-------------------------+
```

Dieses Diagramm fasst den aktualisierten Ablauf der Simulation zusammen.
