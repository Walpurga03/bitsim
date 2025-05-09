import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

// Neue Komponente für Transaktionszeilen
const TransactionRow = React.memo(({ 
  transaction, 
  isSelected, 
  onToggle 
}: { 
  transaction: Transaction; 
  isSelected: boolean; 
  onToggle: (tx: Transaction) => void; 
}) => {
  return (
    <div
      className={`${styles.transactionRow} ${isSelected ? styles.selectedTx : ''}`}
      onClick={() => onToggle(transaction)}
      onKeyPress={(e) => e.key === 'Enter' && onToggle(transaction)}
      role="listitem"
      tabIndex={0}
      aria-selected={isSelected}
    >
      <div className={styles.txColumn}>
        <div className={styles.txId}>{transaction.id}</div>
        <div className={styles.txAddresses}>
          Von: {transaction.sender.substring(0, 5)}...{transaction.sender.substring(transaction.sender.length-3)} → 
          An: {transaction.recipient.substring(0, 5)}...{transaction.recipient.substring(transaction.recipient.length-3)}
        </div>
        <div className={styles.priority}>
          <div 
            className={styles.priorityIndicator} 
            style={{ 
              background: transaction.priority === 'high' ? '#e74c3c' : 
                          transaction.priority === 'medium' ? '#f39c12' : '#2ecc71' 
            }}
          ></div>
          {transaction.priority === 'high' ? 'Hohe Priorität' : 
            transaction.priority === 'medium' ? 'Mittlere Priorität' : 'Niedrige Priorität'}
        </div>
      </div>
      <div className={styles.txColumn}>{transaction.amount.toFixed(8)}</div>
      <div className={styles.txColumn}>{Math.round(transaction.fee)}</div>
      <div className={styles.txColumn}>{transaction.feeRate}</div>
      <div className={styles.txColumn}>{(transaction.size / 1000).toFixed(2)} KB</div>
    </div>
  );
});

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
  const [showMiningAnimation, setShowMiningAnimation] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);

  const MAX_BLOCK_SIZE = 1000000; // 1 MB in Bytes

  useEffect(() => {
    // Erst verzögert die Animation aktivieren für bessere UX
    setTimeout(() => setAnimate(true), 100);

    // Transaktionen generieren
    generateTransactions();
  }, []);

  // Optimierte Funktionen mit useCallback
  const generateTransactions = useCallback(() => {
    const newTransactions: Transaction[] = [];
    const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
    const numTransactions = Math.floor(Math.random() * 10) + 15;

    for (let i = 0; i < numTransactions; i++) {
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      let feeRate;
      if (priority === 'high') {
        feeRate = Math.floor(Math.random() * 40) + 80; // 80-120 sat/byte
      } else if (priority === 'medium') {
        feeRate = Math.floor(Math.random() * 30) + 30; // 30-60 sat/byte
      } else {
        feeRate = Math.floor(Math.random() * 15) + 5; // 5-20 sat/byte
      }
      
      // Geändert von 200-600 Bytes auf 30.000-300.000 Bytes (30-300 KB)
      const size = Math.floor(Math.random() * 270000) + 30000;
      
      // Anpassen der Gebühr - eventuell reduzieren, da sonst extrem hohe Gebühren entstehen würden
      // Beispiel: 100 sat/byte * 300.000 bytes = 30.000.000 sat, was sehr unrealistisch ist
      // Wir können die Gebühr pro KB berechnen statt pro Byte
      const fee = feeRate * (size / 1000);

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
  }, []);

  const toggleTransaction = useCallback((tx: Transaction) => {
    const isSelected = selectedTransactions.some(t => t.id === tx.id);

    if (isSelected) {
      const newSelected = selectedTransactions.filter(t => t.id !== tx.id);
      setSelectedTransactions(newSelected);
      setBlockSize(calculateBlockSize(newSelected));
      setIsBlockFull(false);
    } else {
      const newBlockSize = blockSize + tx.size;

      if (newBlockSize <= MAX_BLOCK_SIZE) {
        const newSelected = [...selectedTransactions, tx];
        setSelectedTransactions(newSelected);
        setBlockSize(newBlockSize);
        setIsBlockFull(newBlockSize >= MAX_BLOCK_SIZE);
      } else {
        setIsBlockFull(true);
      }
    }
  }, [selectedTransactions, blockSize, isBlockFull]);

  const autoSelectByFee = useCallback(() => {
    const sortedTransactions = [...transactions].sort((a, b) => b.feeRate - a.feeRate);

    let totalSize = 0;
    const selected: Transaction[] = [];

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
  }, [transactions, MAX_BLOCK_SIZE]);

  const handleSortChange = useCallback((sortType: 'feeRate' | 'amount' | 'size') => {
    if (sortBy === sortType) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortType);
      setSortDirection('desc');
    }
  }, [sortBy, sortDirection]);

  const mineBlock = useCallback(() => {
    if (selectedTransactions.length === 0) return;

    setIsMining(true);
    setShowMiningAnimation(true);

    // Animation starten
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      setMiningProgress(progress);

      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 100);

    // Simuliere Mining-Verzögerung
    setTimeout(() => {
      const totalFees = selectedTransactions.reduce((sum, tx) => sum + tx.fee, 0);
      const blockReward = 6.25 * 100000000; // in Satoshis

      setMiningResult(
        `Block erfolgreich gemined! 🎉\n\n` +
        `Enthaltene Transaktionen: ${selectedTransactions.length}\n` +
        `Gesamte Gebühren: ${Math.round(totalFees)} Satoshis\n` +
        `Block-Reward: ${Math.round(blockReward)} Satoshis (6.25 BTC)\n` +
        `Gesamtbelohnung: ${Math.round(totalFees + blockReward)} Satoshis`
      );

      setIsMining(false);
      setBlockMined(true);
      setShowMiningAnimation(false);
      clearInterval(progressInterval);
    }, 2000);
  }, [selectedTransactions]);

  const resetMining = () => {
    generateTransactions();
  };

  const calculateBlockSize = (txs: Transaction[]) => {
    return txs.reduce((total, tx) => total + tx.size, 0);
  };

  // Optimierte Berechnungen mit useMemo
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const factor = sortDirection === 'asc' ? 1 : -1;
      return (a[sortBy] - b[sortBy]) * factor;
    });
  }, [transactions, sortBy, sortDirection]);

  const selectedStats = useMemo(() => {
    const totalFees = selectedTransactions.reduce((sum, tx) => sum + tx.fee, 0);
    return {
      count: selectedTransactions.length,
      size: blockSize,
      fees: totalFees
    };
  }, [selectedTransactions, blockSize]);

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
          <div className={styles.txColumn}>Größe (KB)</div> {/* Geändert von 'Größe (Bytes)' */}
        </div>
        
        <div 
          className={styles.transactionsList}
          role="list"
          aria-label="Verfügbare Transaktionen im Mempool"
        >
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((tx) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                isSelected={selectedTransactions.some(t => t.id === tx.id)}
                onToggle={toggleTransaction}
              />
            ))
          ) : (
            <div className={styles.emptyState} role="status">Keine Transaktionen im Mempool</div>
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
          Du hast <strong>{selectedStats.count}</strong> Transaktionen mit insgesamt <strong>{(selectedStats.size / 1000).toFixed(2)} KB</strong> ausgewählt.
          {selectedStats.count > 0 && (
            <> Die Gesamtgebühren betragen <strong>{Math.round(selectedStats.fees)} Satoshis</strong>.</>
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
            aria-busy={isMining}
            aria-label={
              isMining ? "Mining läuft..." : 
              blockMined ? "Block wurde bereits gemined" : 
              "Block mit ausgewählten Transaktionen minen"
            }
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
                Weiter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Mining Animation Overlay */}
      {showMiningAnimation && (
        <div className={styles.miningOverlay} role="dialog" aria-label="Mining läuft">
          <div className={styles.miningAnimationContainer}>
            <div className={styles.spinner}></div>
            <div className={styles.progressContainer}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${miningProgress}%` }}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={miningProgress}
              ></div>
            </div>
            <p>Block wird gemined...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MempoolPage;
