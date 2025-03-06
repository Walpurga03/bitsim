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
  
  // Konvertiere zu einer Zahl zwischen 0 und 9.99
  const normalizedHash = Math.abs(hash % 1000) / 100;
  return parseFloat(normalizedHash.toFixed(2)); // 2 Dezimalstellen für bessere Lesbarkeit
};

/**
 * Sucht nach einem gültigen Block-Hash durch Verändern der Nonce
 * Hash muss unter dem Target-Wert liegen
 */
export const mineBlock = (
  blockData: string, 
  maxAttempts: number = 3000 // Mehr Versuche erlauben
): { hash: number; nonce: number; found: boolean; target: number } => {
  const target = 0.3; // Niedrigeres Target macht es schwieriger (vorher: 1)
  let nonce = Math.floor(Math.random() * 100); // Beginne mit einer zufälligen Nonce
  let hash = 0;
  let found = false;
  
  // Begrenze die Versuche auf maxAttempts (mehr als vorher)
  let attempt;
  for (attempt = 0; attempt < maxAttempts; attempt++) {
    // Kombiniere Block-Daten mit Nonce
    const dataWithNonce = `${blockData}-${nonce}`;
    
    // Hash berechnen (zwischen 0 und 9.99)
    hash = generateSimpleHash(dataWithNonce);
    
    // Prüfe, ob Hash kleiner als Target ist
    if (hash < target) {
      found = true;
      break;
    }
    
    // Nonce erhöhen und neu versuchen
    nonce++;
  }
  
  // Zeige auch einen erfolglosen Hash nach maxAttempts Versuchen
  return { hash, nonce, found, target };
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
