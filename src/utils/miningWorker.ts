// Neue Datei: /utils/miningWorker.ts

// Alle nötigen Funktionen direkt im Worker definieren
const generateSimpleHash = (input: string): number => {
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
  const normalized = Math.abs(hash % 1000) / 1000;
  return parseFloat((minVal + normalized * range).toFixed(5));
};

const getTargetForBlock = (blockHeight: number): number => {
  if (blockHeight < 5) return 1;     // Sehr einfach am Anfang
  if (blockHeight < 20) return 0.3;    // Mittelschwer
  if (blockHeight < 100) return 0.2;   // Schwerer
  return 0.1;                          // Sehr schwer für fortgeschrittene Blöcke
};

// Ein realistischeres Maximum für Mining-Versuche setzen
const MAX_MINING_ATTEMPTS = 40;

const mineBlock = (
  blockData: string,
  difficulty?: number,
  blockHeight: number = 0,
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
    
    // Debug-Logs werden vom Worker nicht an die Konsole gesendet
    // Wir können stattdessen Fortschritts-Updates schicken
    if (attempts % 5 === 0) {
      self.postMessage({ type: 'progress', attempts, hash, target });
    }
    
    if (hash < target) {
      found = true;
      break;
    }
    
    nonce++;
  }
  
  return { hash, nonce, found, target, attempts: attempts + 1 };
};

// Event-Handler für vom Hauptthread empfangene Nachrichten
self.onmessage = (event) => {
  const { blockData, difficulty, blockHeight } = event.data;
  
  try {
    // Mining durchführen
    const result = mineBlock(blockData, difficulty, blockHeight);
    
    // Ergebnis zurück an den Hauptthread senden
    self.postMessage({ 
      type: 'result',
      result 
    });
  } catch (error) {
    // Fehler zurück an den Hauptthread senden
    self.postMessage({ 
      type: 'error',
      message: error instanceof Error ? error.message : 'Unbekannter Fehler beim Mining'
    });
  }
};