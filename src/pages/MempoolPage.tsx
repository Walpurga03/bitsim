import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/MempoolPage.module.scss';
import { FaInfoCircle, FaChartBar, FaClock, FaListAlt, FaRedo, FaSort, FaSortAmountDown, FaSortAmountUp, FaWallet } from 'react-icons/fa';

interface Transaction {
  id: string;
  amount: number;
  sender: string;
  recipient: string;
  fee: number;
  feeRate: number;
  size: number;
  priority: 'high' | 'medium' | 'low';
}

interface MempoolPageProps {
  onNext: () => void;
}

const MempoolPage: React.FC<MempoolPageProps> = ({ onNext }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [blockSize, setBlockSize] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'feeRate' | 'amount' | 'size'>('feeRate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isBlockFull, setIsBlockFull] = useState<boolean>(false);
  const [isMining, setIsMining] = useState<boolean>(false);
  const [blockMined, setBlockMined] = useState<boolean>(false);
  const [miningResult, setMiningResult] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);
  
  const MAX_BLOCK_SIZE = 1000000; // 1 MB in Bytes
  
  useEffect(() => {
    // Erst verzögert die Animation aktivieren für bessere UX
    setTimeout(() => setAnimate(true), 100);
    
    // Transaktionen generieren
    generateTransactions();
  }, []);
  
  const generateTransactions = () => {
    // Hier würden Sie in einer realen Anwendung Daten abrufen
    // Für die Simulation generieren wir zufällige Transaktionen
    const newTransactions: Transaction[] = [];
    
    const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
    
    // Generiere 15-25 zufällige Transaktionen
    const numTransactions = Math.floor(Math.random() * 10) + 15;
    
    for (let i = 0; i < numTransactions; i++) {
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      // Gebührenrate basierend auf Priorität
      let feeRate;
      if (priority === 'high') {
        feeRate = Math.floor(Math.random() * 40) + 80; // 80-120 sat/byte
      } else if (priority === 'medium') {
        feeRate = Math.floor(Math.random() * 30) + 30; // 30-60 sat/byte
      } else {
        feeRate = Math.floor(Math.random() * 15) + 5; // 5-20 sat/byte
      }
      
      // Transaktionsgröße zwischen 200 und 600 Bytes
      const size = Math.floor(Math.random() * 400) + 200;
      
      // Gebühr berechnen
      const fee = feeRate * size;
      
      // Transaktion erstellen
      newTransactions.push({
        id: `tx${Math.random().toString(36).substring(2, 10)}`,
        amount: Math.floor(Math.random() * 2) + 0.1,
        sender: `1Sender${Math.random().toString(36).substring(2, 7)}`,
        recipient: `1Recipient${Math.random().toString(36).substring(2, 7)}`,
        fee,
        feeRate,
        size,
        priority
      });
    }
    
    setTransactions(newTransactions);
    setSelectedTransactions([]);
    setBlockSize(0);
    setIsBlockFull(false);
    setBlockMined(false);
    setMiningResult(null);
  };
  
  const toggleTransaction = (tx: Transaction) => {
    // Prüfen, ob die Transaktion bereits ausgewählt ist
    const isSelected = selectedTransactions.some(t => t.id === tx.id);
    
    if (isSelected) {
      // Transaktion entfernen
      const newSelected = selectedTransactions.filter(t => t.id !== tx.id);
      setSelectedTransactions(newSelected);
      setBlockSize(calculateBlockSize(newSelected));
      setIsBlockFull(false);
    } else {
      // Prüfen, ob der Block voll wird
      const newBlockSize = blockSize + tx.size;
      
      if (newBlockSize <= MAX_BLOCK_SIZE) {
        const newSelected = [...selectedTransactions, tx];
        setSelectedTransactions(newSelected);
        setBlockSize(newBlockSize);
        setIsBlockFull(newBlockSize >= MAX_BLOCK_SIZE);
      } else {
        // Block würde zu groß werden
        setIsBlockFull(true);
      }
    }
  };
  
  const calculateBlockSize = (txs: Transaction[]) => {
    return txs.reduce((total, tx) => total + tx.size, 0);
  };
  
  const autoSelectByFee = () => {
    // Sortiere Transaktionen nach Gebührenrate (höchste zuerst)
    const sortedTransactions = [...transactions].sort((a, b) => b.feeRate - a.feeRate);
    
    let totalSize = 0;
    const selected: Transaction[] = [];
    
    // Füge Transaktionen hinzu, bis der Block voll ist
    for (const tx of sortedTransactions) {
      if (totalSize + tx.size <= MAX_BLOCK_SIZE) {
        selected.push(tx);
        totalSize += tx.size;
      } else {
        break;
      }
    }
    
    setSelectedTransactions(selected);
    setBlockSize(totalSize);
    setIsBlockFull(totalSize >= MAX_BLOCK_SIZE);
  };
  
  const handleSortChange = (sortType: 'feeRate' | 'amount' | 'size') => {
    if (sortBy === sortType) {
      // Wenn schon nach diesem Feld sortiert wird, Richtung umkehren
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Sonst neues Sortierfeld mit Standard-Sortierrichtung
      setSortBy(sortType);
      setSortDirection('desc');
    }
  };
  
  const sortedTransactions = [...transactions].sort((a, b) => {
    const factor = sortDirection === 'asc' ? 1 : -1;
    return (a[sortBy] - b[sortBy]) * factor;
  });
  
  const mineBlock = () => {
    if (selectedTransactions.length === 0) return;
    
    setIsMining(true);
    
    // Simuliere Mining-Verzögerung
    setTimeout(() => {
      const totalFees = selectedTransactions.reduce((sum, tx) => sum + tx.fee, 0);
      const blockReward = 6.25 * 100000000; // in Satoshis
      
      setMiningResult(
        `Block erfolgreich gemined! 🎉\n` +
        `Enthaltene Transaktionen: ${selectedTransactions.length}\n` +
        `Gesamte Gebühren: ${totalFees} Satoshis\n` +
        `Block-Reward: ${blockReward} Satoshis (6.25 BTC)\n` +
        `Gesamtbelohnung: ${totalFees + blockReward} Satoshis`
      );
      
      setIsMining(false);
      setBlockMined(true);
    }, 2000);
  };
  
  const resetMining = () => {
    generateTransactions();
  };
  
  return (
    <div className={styles.page}>
      {/* Intro Section */}
      <motion.section 
        className={styles.introSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Mempool & Transaktionsauswahl</h1>
        <p>
          Der <strong>Mempool</strong> ist der Wartebereich für unbestätigte Transaktionen. 
          Miner wählen Transaktionen aus diesem Pool für die Aufnahme in den nächsten Block aus, 
          normalerweise basierend auf den angebotenen Gebühren.
        </p>
      </motion.section>
      
      {/* Explanation Section */}
      <motion.section 
        className={styles.explanationSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2>Wie Transaktionen in Blöcke kommen</h2>
        
        <div className={styles.section}>
          <div className={styles.iconContainer}>
            <FaWallet className={styles.sectionIcon} />
          </div>
          <div>
            <h3>Mempool-Funktionsweise</h3>
            <p>
              Wenn Nutzer Bitcoin-Transaktionen senden, werden diese zunächst im Mempool zwischengespeichert. 
              Dort warten sie, bis ein Miner sie für die Aufnahme in einen Block auswählt.
            </p>
          </div>
        </div>
        
        <div className={styles.section}>
          <div className={styles.iconContainer}>
            <FaChartBar className={styles.sectionIcon} />
          </div>
          <div>
            <h3>Gebührenbasierte Auswahl</h3>
            <p>
              Miner maximieren ihren Gewinn, indem sie Transaktionen mit höheren Gebühren pro Byte priorisieren. 
              Nutzer, die schnellere Bestätigungen wünschen, bieten daher höhere Gebühren an.
            </p>
          </div>
        </div>
        
        <div className={styles.section}>
          <div className={styles.iconContainer}>
            <FaClock className={styles.sectionIcon} />
          </div>
          <div>
            <h3>Verschiedene Prioritätsstufen</h3>
            <p>
              Basierend auf den Gebühren können wir Transaktionen in verschiedene Prioritätsstufen einteilen:
            </p>
          </div>
        </div>
        
        <div className={styles.feeTiers}>
          <div className={styles.feeTier} style={{ background: 'rgba(231, 76, 60, 0.2)' }}>
            <div className={styles.priorityDot} style={{ background: '#e74c3c' }}></div>
            <div>
              <strong>Hohe Priorität</strong>
              <p className={styles.feeDescription}>80-120 sat/vByte, typische Bestätigung: nächster Block</p>
            </div>
          </div>
          
          <div className={styles.feeTier} style={{ background: 'rgba(243, 156, 18, 0.2)' }}>
            <div className={styles.priorityDot} style={{ background: '#f39c12' }}></div>
            <div>
              <strong>Mittlere Priorität</strong>
              <p className={styles.feeDescription}>30-60 sat/vByte, typische Bestätigung: innerhalb weniger Blöcke</p>
            </div>
          </div>
          
          <div className={styles.feeTier} style={{ background: 'rgba(46, 204, 113, 0.2)' }}>
            <div className={styles.priorityDot} style={{ background: '#2ecc71' }}></div>
            <div>
              <strong>Niedrige Priorität</strong>
              <p className={styles.feeDescription}>5-20 sat/vByte, typische Bestätigung: könnte Stunden oder Tage dauern</p>
            </div>
          </div>
        </div>
        
        <div className={styles.instructions}>
          <h3>Deine Aufgabe als Miner</h3>
          <ul>
            <li><FaInfoCircle className={styles.bulletIcon} /> Wähle Transaktionen aus dem Mempool aus, die in deinen Block aufgenommen werden sollen</li>
            <li><FaInfoCircle className={styles.bulletIcon} /> Beachte die Blockgrößenbeschränkung von 1 MB</li>
            <li><FaInfoCircle className={styles.bulletIcon} /> Optimiere für maximale Gebühren oder klicke auf "Beste Auswahl treffen", um Transaktionen mit den höchsten Gebühren automatisch auszuwählen</li>
          </ul>
        </div>
      </motion.section>
      
      {/* Block Size Section */}
      <motion.section 
        className={styles.blockSizeContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3>Block-Größe: {(blockSize / 1000).toFixed(2)} KB / 1000 KB</h3>
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBar}
            style={{ 
              width: `${(blockSize / MAX_BLOCK_SIZE) * 100}%`,
              backgroundColor: blockSize > 0.8 * MAX_BLOCK_SIZE ? '#e74c3c' : blockSize > 0.5 * MAX_BLOCK_SIZE ? '#f39c12' : '#2ecc71'
            }}
          ></div>
        </div>
        
        {isBlockFull && (
          <p className={styles.errorMessage}>
            <FaInfoCircle /> Block ist voll! Du kannst keine weiteren Transaktionen hinzufügen.
          </p>
        )}
      </motion.section>
      
      {/* Mempool Section */}
      <motion.section 
        className={styles.mempoolContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className={styles.mempoolHeader}>
          <h3>Mempool ({transactions.length} Transaktionen)</h3>
          
          <div className={styles.sortInfo}>
            <span>Sortieren nach:</span>
            <button 
              className={`${styles.sortButton} ${sortBy === 'feeRate' ? styles.active : ''}`}
              onClick={() => handleSortChange('feeRate')}
            >
              {sortBy === 'feeRate' ? (sortDirection === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />) : <FaSort />} Gebühr/vByte
            </button>
            
            <button 
              className={`${styles.sortButton} ${sortBy === 'amount' ? styles.active : ''}`}
              onClick={() => handleSortChange('amount')}
            >
              {sortBy === 'amount' ? (sortDirection === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />) : <FaSort />} Betrag
            </button>
            
            <button 
              className={`${styles.sortButton} ${sortBy === 'size' ? styles.active : ''}`}
              onClick={() => handleSortChange('size')}
            >
              {sortBy === 'size' ? (sortDirection === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />) : <FaSort />} Größe
            </button>
          </div>
        </div>
        
        <div className={styles.transactionsHeader}>
          <div className={styles.txColumn}>Transaktion</div>
          <div className={styles.txColumn}>Betrag (BTC)</div>
          <div className={styles.txColumn}>Gebühr (sat)</div>
          <div className={styles.txColumn}>Gebühr/vByte</div>
          <div className={styles.txColumn}>Größe (Bytes)</div>
        </div>
        
        <div className={styles.transactionsList}>
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((tx) => (
              <div
                key={tx.id}
                className={`${styles.transactionRow} ${selectedTransactions.some(t => t.id === tx.id) ? styles.selectedTx : ''}`}
                onClick={() => toggleTransaction(tx)}
              >
                <div className={styles.txColumn}>
                  <div className={styles.txId}>{tx.id}</div>
                  <div className={styles.txAddresses}>
                    Von: {tx.sender.substring(0, 5)}...{tx.sender.substring(tx.sender.length-3)} → 
                    An: {tx.recipient.substring(0, 5)}...{tx.recipient.substring(tx.recipient.length-3)}
                  </div>
                  <div className={styles.priority}>
                    <div 
                      className={styles.priorityIndicator} 
                      style={{ 
                        background: tx.priority === 'high' ? '#e74c3c' : 
                                    tx.priority === 'medium' ? '#f39c12' : '#2ecc71' 
                      }}
                    ></div>
                    {tx.priority === 'high' ? 'Hohe Priorität' : 
                      tx.priority === 'medium' ? 'Mittlere Priorität' : 'Niedrige Priorität'}
                  </div>
                </div>
                <div className={styles.txColumn}>{tx.amount.toFixed(8)}</div>
                <div className={styles.txColumn}>{tx.fee}</div>
                <div className={styles.txColumn}>{tx.feeRate}</div>
                <div className={styles.txColumn}>{tx.size}</div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>Keine Transaktionen im Mempool</div>
          )}
        </div>
      </motion.section>
      
      {/* Action Section */}
      <motion.section 
        className={styles.selectionSummary}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3>Transaktionsauswahl</h3>
        <p>
          Du hast <strong>{selectedTransactions.length}</strong> Transaktionen mit insgesamt <strong>{blockSize} Bytes</strong> ausgewählt.
          {selectedTransactions.length > 0 && (
            <> Die Gesamtgebühren betragen <strong>{selectedTransactions.reduce((sum, tx) => sum + tx.fee, 0)} Satoshis</strong>.</>
          )}
        </p>
        
        <div className={styles.actionButtons}>
          <button 
            className={styles.autoSelectButton} 
            onClick={autoSelectByFee}
            disabled={isMining || blockMined}
          >
            <FaListAlt /> Beste Auswahl treffen
          </button>
          
          <button 
            className={styles.mineButton} 
            onClick={mineBlock}
            disabled={selectedTransactions.length === 0 || isBlockFull || isMining || blockMined}
          >
            {isMining ? "Mining..." : blockMined ? "Block gemined" : "Block minen"}
          </button>
        </div>
        
        {/* Mining Result mit Animation */}
        <AnimatePresence>
          {miningResult && (
            <motion.div 
              className={styles.miningResult}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p>{miningResult}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Post-Mining Aktionen mit Animation */}
        <AnimatePresence>
          {blockMined && (
            <motion.div 
              className={styles.postMiningActions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <button className={styles.autoSelectButton} onClick={resetMining}>
                <FaRedo /> Neue Transaktionen laden
              </button>
              <button className={styles.nextButton} onClick={onNext}>
                Weiter zum Halving
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  );
};

export default MempoolPage;
