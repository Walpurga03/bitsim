// Dieses Modul enthält Funktionen zur realistischeren Simulation des Bitcoin-Mining-Prozesses

/**
 * Vereinfachte Mining-Logik für die Bitcoin-Simulation
 */

/**
 * Berechnet einen Pseudo-Hash zwischen 0 und 9.99
 * @param input Beliebiger Eingabe-String inkl. Nonce
 * @returns Eine Nummer zwischen 0 und 9.99 als Pseudo-Hash
 */
export const generateSimpleHash = (input: string): number => {
  // Einfacher Algorithmus zur Erzeugung einer "Zufalls"-Zahl basierend auf dem Input
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Konvertiere zu 32bit Integer
  }
  
  // Normalisiere den Hash in den Bereich [0.00001, 5.00000]:
  const minVal = 0.00001;
  const maxVal = 5.00000;
  const range = maxVal - minVal;
  // Verwende abs(hash % 1000) und dividiere durch 1000, um einen Wert zwischen 0 und 1 zu erhalten.
  const normalized = Math.abs(hash % 1000) / 1000;
  return parseFloat((minVal + normalized * range).toFixed(5));
};

/**
 * Bestimmt die aktuelle Mining-Schwierigkeit basierend auf der Blockhöhe
 */
export const getTargetForBlock = (blockHeight: number): number => {
  // Start mit einfacher Schwierigkeit, dann zunehmend schwerer
  if (blockHeight < 5) return 0.5;     // Sehr einfach am Anfang
  if (blockHeight < 20) return 0.3;    // Mittelschwer
  if (blockHeight < 100) return 0.2;   // Schwerer
  return 0.1;                          // Sehr schwer für fortgeschrittene Blöcke
};

// Aktualisierte Difficulty-Level innerhalb des gewünschten Zahlenbereichs
export const DIFFICULTY_LEVELS = {
  EASY:     1.00000,   // Einfach
  MEDIUM:   0.70000,   // Mittel
  HARD:     0.50000,   // Schwer
};

// Zusätzliche Utility-Funktion zum Finden des Namens der Difficulty
export const getDifficultyName = (target: number): string => {
  const entry = Object.entries(DIFFICULTY_LEVELS).find(
    ([_, value]) => Math.abs(value - target) < 0.001
  );
  return entry ? entry[0] : 'CUSTOM';
};

// Ein realistischeres Maximum für Mining-Versuche setzen
const MAX_MINING_ATTEMPTS = 40; // Erhöhen für realistischeres Mining

/**
 * Verbesserter mineBlock mit flexibler Difficulty-Einstellung
 * @param blockData Die Block-Daten (Hash des vorherigen Blocks + Timestamp + Merkle-Root)
 * @param difficulty Optionale explizite Schwierigkeit (Target-Wert zwischen 0 und 1)
 * @param blockHeight Optional für automatische Schwierigkeitsbestimmung, wenn difficulty nicht angegeben
 * @param maxAttempts Maximale Anzahl von Versuchen
 */
export const mineBlock = (
  blockData: string,
  difficulty?: number,        // Neuer Parameter für manuelle Difficulty-Einstellung
  blockHeight: number = 0,    // Optional für automatische Difficulty
): { hash: number; nonce: number; found: boolean; target: number; attempts: number } => {
  // Verwende entweder explizite Schwierigkeit oder berechne sie aus der Blockhöhe
  const target = difficulty !== undefined ? difficulty : getTargetForBlock(blockHeight);
  
  // Starte mit einer zufälligen Nonce
  let nonce = Math.floor(Math.random() * 100);
  let hash = 0;
  let found = false;
  let attempts = 0;
  
  // Mining versuchen
  for (attempts = 0; attempts < MAX_MINING_ATTEMPTS; attempts++) {
    const dataWithNonce = `${blockData}-${nonce}`;
    hash = generateSimpleHash(dataWithNonce);
    
    // DEBUG-LOG für jeden Versuch:
    console.log(`Versuch ${attempts+1}: Hash=${hash.toFixed(2)}, Target=${target.toFixed(2)}`);
    
    if (hash < target) {
      found = true;
      break;
    }
    
    nonce++;
  }
  
  // Gib die Anzahl der Versuche explizit mit zurück
  return { hash, nonce, found, target, attempts: attempts + 1 };
};

/**
 * Schätzt, wie viele Versuche für ein bestimmtes Target benötigt werden.
 * @param target Der Target-Wert (0-1, je kleiner desto schwieriger)
 * @returns Geschätzte Anzahl der benötigten Versuche
 */
export const estimatedAttemptsForTarget = (target: number): number => {
  // Grobe Schätzung: Bei Target = 1 braucht man im Durchschnitt 1 Versuch,
  // bei Target = 0.5 etwa 2 Versuche, bei Target = 0.1 etwa 10 Versuche
  return Math.round(1 / target);
};

/**
 * Bestimmt die aktuelle Mining-Schwierigkeit basierend auf der Blockhöhe
 */
export const getCurrentDifficulty = (blockHeight: number): number => {
  // Bitcoin passt die Difficulty alle 2016 Blöcke an
  // Hier verwenden wir eine vereinfachte Version
  if (blockHeight < 10) return 1;       // Sehr einfach zu Beginn
  if (blockHeight < 50) return 2;       // Etwas schwerer
  if (blockHeight < 200) return 3;      // Noch schwerer
  if (blockHeight < 2000) return 4;     // Anspruchsvoll
  return 5;                             // Sehr anspruchsvoll
};
