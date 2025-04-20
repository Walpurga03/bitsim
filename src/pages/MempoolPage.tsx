import React, { useState, useEffect } from 'react';
import styles from '../styles/MempoolPage.module.scss';
import { FaFileInvoiceDollar, FaMagic, FaDatabase, FaAngleRight, FaRedo } from 'react-icons/fa';

// Interface für eine unbestätigte Transaktion im Mempool
interface Transaction {
  id: string;
  amount: number;
  fee: number;
  feeRate: number; // Gebühr pro vByte
  size: number; // Größe in vBytes
  from: string;
  to: string;
  priority: 'low' | 'medium' | 'high';
  timeInPool: number; // Zeit in Minuten
}

// Props für die MempoolPage Komponente
interface MempoolPageProps {
  onNext: () => void;
}

const MempoolPage: React.FC<MempoolPageProps> = ({ onNext }) => {
  // State Variablen
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [blockSize, setBlockSize] = useState(0); // Aktuelle Block-Größe in vBytes
  const [isBlockFull, setIsBlockFull] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const [totalFees, setTotalFees] = useState(0);
  const [sortCriteria, setSortCriteria] = useState<'feeRate' | 'amount' | 'time'>('feeRate');
  const [blockMined, setBlockMined] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [miningResult, setMiningResult] = useState<string | null>(null);

  // Konstanten
  const MAX_BLOCK_SIZE = 1000; // 1000 vBytes als Beispiel für die Simulation
  
  // Adressen für die Simulation
  const addresses = [
    "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
    "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
    "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    "bc1q9h0nnxn52ee5fgmjht9p2vzwgvncwtvyc4ausm"
  ];

  // Beim ersten Laden den Mempool initialisieren
  useEffect(() => {
    generateTransactions();
  }, []);

  // Beobachte die ausgewählten Transaktionen und aktualisiere die Blockgröße
  useEffect(() => {
    const totalSize = selectedTransactions.reduce((sum, tx) => sum + tx.size, 0);
    setBlockSize(totalSize);
    
    // Berechne die Gesamtgebühren
    const fees = selectedTransactions.reduce((sum, tx) => sum + tx.fee, 0);
    setTotalFees(fees);
    
    // Überprüfe, ob der Block voll ist
    setIsBlockFull(totalSize > MAX_BLOCK_SIZE);
    
    // Zeige einen Fehler, wenn der Block zu groß ist
    if (totalSize > MAX_BLOCK_SIZE) {
      setErrorMessage(`Block überschreitet das Größenlimit von ${MAX_BLOCK_SIZE} vBytes!`);
    } else {
      setErrorMessage(null);
    }
  }, [selectedTransactions]);

  // Sortiere Transaktionen nach verschiedenen Kriterien
  const sortTransactions = (txs: Transaction[], criteria: 'feeRate' | 'amount' | 'time') => {
    return [...txs].sort((a, b) => {
      if (criteria === 'feeRate') return b.feeRate - a.feeRate;
      if (criteria === 'amount') return b.amount - a.amount;
      return a.timeInPool - b.timeInPool;
    });
  };

  // Generiere zufällige Transaktionen für den Mempool
  const generateTransactions = () => {
    const newTransactions: Transaction[] = [];
    const count = Math.floor(Math.random() * 20) + 10; // 10-30 Transaktionen
    
    for (let i = 0; i < count; i++) {
      const size = Math.floor(Math.random() * 200) + 100; // 100-300 vBytes
      const amount = parseFloat((Math.random() * 10).toFixed(8)); // 0-10 BTC
      
      // Höhere Gebühren für "wichtigere" Transaktionen
      let feeRate: number, priority: 'low' | 'medium' | 'high';
      const rand = Math.random();
      
      if (rand < 0.3) {
        // 30% Low priority
        feeRate = parseFloat((Math.random() * 2 + 1).toFixed(2)); // 1-3 sat/vByte
        priority = 'low';
      } else if (rand < 0.7) {
        // 40% Medium priority
        feeRate = parseFloat((Math.random() * 5 + 3).toFixed(2)); // 3-8 sat/vByte
        priority = 'medium';
      } else {
        // 30% High priority
        feeRate = parseFloat((Math.random() * 15 + 8).toFixed(2)); // 8-23 sat/vByte
        priority = 'high';
      }
      
      const fee = parseFloat((feeRate * size / 100000000).toFixed(8)); // Umrechnung in BTC
      
      // Zufällige Adressen auswählen
      const fromIndex = Math.floor(Math.random() * addresses.length);
      let toIndex = fromIndex;
      while (toIndex === fromIndex) {
        toIndex = Math.floor(Math.random() * addresses.length);
      }
      
      // Transaktion erstellen
      newTransactions.push({
        id: `tx${Math.random().toString(16).slice(2, 10)}`,
        amount,
        fee,
        feeRate,
        size,
        from: addresses[fromIndex],
        to: addresses[toIndex],
        priority,
        timeInPool: Math.floor(Math.random() * 60)
      });
    }
    
    // Sortiere nach Gebührenrate
    const sorted = sortTransactions(newTransactions, sortCriteria);
    setTransactions(sorted);
    setTransactions(sorted);
    setSelectedTransactions([]);
    setBlockMined(false);
  };

  // Handle Sortierungswechsel
  const handleSortChange = (criteria: 'feeRate' | 'amount' | 'time') => {
    setSortCriteria(criteria);
    setTransactions(sortTransactions(transactions, criteria));
  };

  // Toggle Transaktion auswählen/abwählen
  const toggleTransaction = (tx: Transaction) => {
    // Wenn die Transaktion bereits ausgewählt ist, entferne sie
    if (selectedTransactions.some(t => t.id === tx.id)) {
      setSelectedTransactions(prev => prev.filter(t => t.id !== tx.id));
    } else {
      // Sonst füge sie hinzu
      setSelectedTransactions(prev => [...prev, tx]);
    }
  };

  // Automatische Auswahl der Transaktionen mit höchsten Gebühren
  const autoSelectTransactions = () => {
    // Sortiere Transaktionen nach Gebührenrate
    const sortedByFee = [...transactions].sort((a, b) => b.feeRate - a.feeRate);
    
    let totalSize = 0;
    const selected: Transaction[] = [];
    
    // Füge Transaktionen hinzu, bis wir das Block-Limit erreichen
    for (const tx of sortedByFee) {
      if (totalSize + tx.size <= MAX_BLOCK_SIZE) {
        selected.push(tx);
        totalSize += tx.size;
      }
    }
    
    setSelectedTransactions(selected);
  };

  // Block minen
  const mineBlock = () => {
    // Nicht minen, wenn der Block zu groß ist
    if (isBlockFull) {
      return;
    }
    
    // Mining-Status auf true setzen
    setIsMining(true);
    setMiningResult(null); // Reset des vorherigen Ergebnisses
    
    // Mining-Prozess mit Timeout simulieren
    setTimeout(() => {
      // Mining abgeschlossen
      setIsMining(false);
      setBlockMined(true);
      
      // Geminte Transaktionen aus dem Mempool entfernen
      const newTransactions = transactions.filter(tx => 
        !selectedTransactions.some(selected => selected.id === tx.id)
      );
      setTransactions(newTransactions);
      
      // Erstelle einen ausführlichen Ergebnistext
      setMiningResult(`Block erfolgreich gemined! ${selectedTransactions.length} Transaktionen wurden bestätigt 
        und aus dem Mempool entfernt. Du hast ${totalFees.toFixed(8)} BTC an Gebühren gesammelt.`);
    }, 2000); // 2 Sekunden Mining-Zeit für die Simulation
  };

  // Reset-Funktion hinzufügen
  const resetMining = () => {
    // Mining-Zustände zurücksetzen
    setBlockMined(false);
    setMiningResult(null);
    setSelectedTransactions([]);
    setBlockSize(0);
    setTotalFees(0);
    
    // Neue Transaktionen generieren
    generateTransactions();
  };

  return (
    <div className={styles.page}>
      <div className={styles.introSection}>
        <h1>Mempool & Gebührenmarkt</h1>
        <p>
          <strong>Hinweis:</strong> In dieser Simulation darf ein Block maximal <strong>1000 vBytes</strong> groß sein. 
          Das entspricht einer stark vereinfachten Blockgröße, damit du das Prinzip besser nachvollziehen kannst. 
          In der echten Bitcoin-Blockchain sind Blöcke deutlich größer – aktuell bis zu 4 Millionen Weight Units 
          (entspricht etwa 1 Millionen vBytes bzw. ~1 MB), was viel mehr Transaktionen pro Block ermöglicht.
        </p>
      </div>

      {/* Direkt eingebettete Mempool-Erklärung */}
      <div className={styles.explanationSection}>
        <h2>Was ist der Mempool?</h2>
        
        <div className={styles.section}>
          <div className={styles.iconContainer}>
            <FaDatabase className={styles.sectionIcon} />
          </div>
          <div>
            <p>
              Der Mempool (Memory Pool) ist ein "Wartezimmer" für unbestätigte Bitcoin-Transaktionen. 
              Wenn jemand eine Transaktion sendet, landet sie zuerst im Mempool und wartet darauf, 
              von einem Miner in einen Block aufgenommen zu werden.
            </p>
          </div>
        </div>
        
        <div className={styles.section}>
          <div className={styles.iconContainer}>
            <FaFileInvoiceDollar className={styles.sectionIcon} />
          </div>
          <div>
            <h3>Gebührenmarkt</h3>
            <p>
              Jeder Miner kann frei entscheiden, welche Transaktionen er in seinen Block aufnimmt. 
              Da die Blockgröße begrenzt ist, wählen Miner normalerweise die Transaktionen mit den höchsten Gebühren aus,
              um ihren Gewinn zu maximieren.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.iconContainer}>
            <FaFileInvoiceDollar className={styles.sectionIcon} />
          </div>
          <div>
            <h3> So entsteht ein Markt</h3>
            <p>
              Bei hoher Nachfrage (viele Transaktionen) steigen die Gebühren.
              Nutzer, die schnellere Bestätigungen wünschen, bieten höhere Gebühren an.
            </p>
          </div>
        </div>
        
        <div className={styles.feeTiers}>
          <div className={styles.feeTier} style={{backgroundColor: 'rgba(52, 152, 219, 0.1)'}}>
            <div className={styles.priorityDot} style={{backgroundColor: '#3498db'}}></div>
            <div>
              <strong>Niedrige Priorität</strong>
              <div className={styles.feeDescription}>Günstige Gebühren, längere Wartezeit</div>
            </div>
          </div>
          
          <div className={styles.feeTier} style={{backgroundColor: 'rgba(243, 156, 18, 0.1)'}}>
            <div className={styles.priorityDot} style={{backgroundColor: '#f39c12'}}></div>
            <div>
              <strong>Mittlere Priorität</strong>
              <div className={styles.feeDescription}>Ausgewogene Gebühren und Wartezeit</div>
            </div>
          </div>
          
          <div className={styles.feeTier} style={{backgroundColor: 'rgba(231, 76, 60, 0.1)'}}>
            <div className={styles.priorityDot} style={{backgroundColor: '#e74c3c'}}></div>
            <div>
              <strong>Hohe Priorität</strong>
              <div className={styles.feeDescription}>Höhere Gebühren, schnellere Bestätigung</div>
            </div>
          </div>
        </div>
        
        <div className={styles.instructions}>
          <h3>Deine Aufgabe</h3>
          <ul>
            <li><FaAngleRight className={styles.bulletIcon} /> Wähle Transaktionen aus dem Mempool für deinen Block</li>
            <li><FaAngleRight className={styles.bulletIcon} /> Achte auf das Größenlimit des Blocks (1000 vBytes)</li>
            <li><FaAngleRight className={styles.bulletIcon} /> Versuche, die Gebühren zu maximieren</li>
            <li><FaAngleRight className={styles.bulletIcon} /> Mine deinen Block, um die Transaktionen zu bestätigen</li>
          </ul>
        </div>
      </div>

      {/* Block-Größe Visualisierung */}
      <div className={styles.blockSizeContainer}>
        <h3>Block-Größe: {blockSize} / {MAX_BLOCK_SIZE} vBytes</h3>
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBar} 
            style={{ 
              width: `${Math.min(100, (blockSize / MAX_BLOCK_SIZE) * 100)}%`,
              backgroundColor: isBlockFull ? '#e74c3c' : blockSize > MAX_BLOCK_SIZE * 0.8 ? '#f39c12' : '#2ecc71'
            }}
          />
        </div>
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      </div>


      {/* Mempool */}
      <div className={styles.mempoolContainer}>
        <div className={styles.mempoolHeader}>
          <h3>Mempool ({transactions.length} Transaktionen)</h3>
          
          <div className={styles.sortInfo}>
            Sortieren nach: 
            <button 
              className={`${styles.sortButton} ${sortCriteria === 'feeRate' ? styles.active : ''}`} 
              onClick={() => handleSortChange('feeRate')}
            >
              Gebühr/vByte
            </button>
            <button 
              className={`${styles.sortButton} ${sortCriteria === 'amount' ? styles.active : ''}`} 
              onClick={() => handleSortChange('amount')}
            >
              Betrag
            </button>
            <button 
              className={`${styles.sortButton} ${sortCriteria === 'time' ? styles.active : ''}`} 
              onClick={() => handleSortChange('time')}
            >
              Wartezeit
            </button>
          </div>
        </div>

        {transactions.length > 0 ? (
          <>
            <div className={styles.transactionsHeader}>
              <div className={styles.txColumn}>Transaktion</div>
              <div className={styles.txColumn}>Betrag</div>
              <div className={styles.txColumn}>Gebühr</div>
              <div className={styles.txColumn}>Gebühr/vByte</div>
              <div className={styles.txColumn}>Größe</div>
            </div>
            
            <div className={styles.transactionsList}>
              {transactions.map(tx => (
                <div 
                  key={tx.id} 
                  className={`${styles.transactionRow} ${selectedTransactions.some(t => t.id === tx.id) ? styles.selectedTx : ''}`}
                  onClick={() => toggleTransaction(tx)}
                >
                  <div className={styles.txColumn}>
                    <div className={styles.txId}>{tx.id}</div>
                    <div className={styles.txAddresses}>
                      {tx.from.substring(0, 6)}... → {tx.to.substring(0, 6)}...
                    </div>
                    <div className={styles.priority}>
                      <div 
                        className={styles.priorityIndicator} 
                        style={{ 
                          backgroundColor: tx.priority === 'high' ? '#e74c3c' : 
                                          tx.priority === 'medium' ? '#f39c12' : '#3498db' 
                        }}
                      />
                      <span>{tx.priority === 'high' ? 'Hoch' : tx.priority === 'medium' ? 'Mittel' : 'Niedrig'}</span>
                    </div>
                  </div>
                  <div className={styles.txColumn}>{tx.amount.toFixed(8)} BTC</div>
                  <div className={styles.txColumn}>{tx.fee.toFixed(8)} BTC</div>
                  <div className={styles.txColumn}>{tx.feeRate.toFixed(2)} sat/vB</div>
                  <div className={styles.txColumn}>{tx.size} vB</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            Keine Transaktionen im Mempool
          </div>
        )}
      </div>

      {/* Zusammenfassung der Auswahl */}
      <div className={styles.selectionSummary}>
        <h3>Ausgewählte Transaktionen</h3>
        <p>
          <strong>{selectedTransactions.length}</strong> Transaktionen mit <strong>{blockSize} vBytes</strong> ausgewählt
        </p>
        <p>
          Gebühren gesamt: <strong>{totalFees.toFixed(8)} BTC</strong>
        </p>
        
        <div className={styles.actionButtons}>
          {/* Optimale-Auswahl-Button nur anzeigen, wenn noch kein Block gemined wurde */}
          {!blockMined && !miningResult && (
            <button 
              className={styles.autoSelectButton} 
              onClick={autoSelectTransactions}
              disabled={transactions.length === 0 || isMining}
            >
              <FaMagic /> Optimale Auswahl (höchste Gebühren)
            </button>
          )}
          
          <button 
            className={styles.mineButton} 
            onClick={mineBlock}
            disabled={selectedTransactions.length === 0 || isBlockFull || isMining || blockMined}
          >
            {isMining ? "Mining..." : blockMined ? "Block gemined" : "Mine Block"}
          </button>
        </div>
        
        {/* Mining-Ergebnis anzeigen */}
        {miningResult && (
          <div className={styles.miningResult}>
            <p>{miningResult}</p>
          </div>
        )}
        
        {blockMined && (
          <div className={styles.postMiningActions}>
            <button className={styles.nextButton} onClick={resetMining}>
              <FaRedo /> Neue Transaktionen laden
            </button>
            <button className={styles.nextButton} onClick={onNext}>
              Weiter zum Halving
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MempoolPage;
