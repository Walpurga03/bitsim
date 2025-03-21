import React, { useState, useEffect } from 'react';
import styles from '../styles/MempoolPage.module.scss';
import MempoolExplanationPopup from '../components/MempoolExplanationPopup';
import { mineBlock, DIFFICULTY_LEVELS } from '../utils/miningUtils';
import { FaInfoCircle, FaCoins, FaServer, FaArrowDown, FaChartLine, FaFire, FaRegClock, FaSortAmountDown, FaCheck, FaBolt } from 'react-icons/fa';

interface Transaction {
  id: string;
  sender: string;
  recipient: string;
  amount: number;
  fee: number;
  size: number; // in virtuellen Bytes
  timestamp: string;
  selected: boolean;
  inputs?: number;
  outputs?: number;
}

interface MiningResult {
  hash: string;
  nonce: number;
  target: string;
  timestamp: string;
  transactions: Transaction[];
  blockNumber: number;
  merkleRoot: string;
  found: boolean;
}

interface MempoolPageProps {
  onNext: () => void;
}

const MempoolPage: React.FC<MempoolPageProps> = ({ onNext }) => {
  const [miningResult, setMiningResult] = useState<MiningResult | null>(null);
  const [showMempoolPopup, setShowMempoolPopup] = useState(true); // Auto-open popup
  const [mempool, setMempool] = useState<Transaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [chainBlocks, setChainBlocks] = useState<MiningResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [walletInfo, setWalletInfo] = useState({
    balance: 2020 * 50, // Starting after difficulty adjustment
    currentBlock: 2020,
    currentReward: 50,
    totalFees: 0,
  });
  const [blockSize, setBlockSize] = useState(0); // in virtuellen Bytes
  const MAX_BLOCK_SIZE = 1000; // Simulierter Max-Wert in virtuellen Bytes
  const [isMobile, setIsMobile] = useState(false);
  const [sortBy, setSortBy] = useState<'fee' | 'feeRate' | 'size' | 'time'>('feeRate');
  const [showMarketStats, setShowMarketStats] = useState(false);
  
  // Zufällige Adressen für die Simulation
  const addresses = [
    "1SatoshiXXXXXX", "1AliceXXXXXXX", "1BobXXXXXXXXX", "1CharlieXXXXX", 
    "1DaveXXXXXXXX", "1EveXXXXXXXXX", "1FrankXXXXXXX", "1GraceXXXXXXX", 
    "1HenryXXXXXXX", "1IvanXXXXXXXX"
  ];

  // Handle responsive view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Generate random transactions for the mempool
  useEffect(() => {
    const generateTransactions = () => {
      const count = Math.floor(Math.random() * 15) + 10; // 10-25 transactions
      const transactions: Transaction[] = [];
      
      for (let i = 0; i < count; i++) {
        // Get random sender and recipient, ensuring they're different
        const senderIndex = Math.floor(Math.random() * addresses.length);
        let recipientIndex;
        do {
          recipientIndex = Math.floor(Math.random() * addresses.length);
        } while (recipientIndex === senderIndex);
        
        // Random timestamp within the last hour
        const date = new Date();
        date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60));
        
        transactions.push({
          id: `tx-${Math.random().toString(16).slice(2, 10)}`,
          sender: addresses[senderIndex],
          recipient: addresses[recipientIndex],
          amount: parseFloat((Math.random() * 10 + 0.1).toFixed(8)), // 0.1-10 BTC
          fee: parseFloat((Math.random() * 0.09 + 0.01).toFixed(8)), // 0.01-0.1 BTC fee
          size: Math.floor(Math.random() * 200) + 50, // 50-250 virtual bytes
          timestamp: date.toLocaleTimeString(),
          selected: false,
        });
      }
      
      // Sort initially by fee per byte (higher first)
      return sortTransactions(transactions, 'feeRate');
    };
    
    setMempool(generateTransactions());
  }, []);

  // Sort transactions based on different criteria
  const sortTransactions = (txs: Transaction[], sortType: 'fee' | 'feeRate' | 'size' | 'time') => {
    const sortedTxs = [...txs];
    
    switch(sortType) {
      case 'fee':
        return sortedTxs.sort((a, b) => b.fee - a.fee);
      case 'feeRate':
        return sortedTxs.sort((a, b) => (b.fee / b.size) - (a.fee / a.size));
      case 'size':
        return sortedTxs.sort((a, b) => a.size - b.size);
      case 'time':
        return sortedTxs.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      default:
        return sortedTxs;
    }
  };
  
  // Handle sorting change
  const handleSortChange = (sortType: 'fee' | 'feeRate' | 'size' | 'time') => {
    setSortBy(sortType);
    setMempool(sortTransactions([...mempool], sortType));
  };
  
  // Toggle market stats
  const toggleMarketStats = () => {
    setShowMarketStats(!showMarketStats);
  };
  
  // Handle transaction selection
  const toggleTransactionSelection = (txId: string) => {
    setMempool(prev => {
      const updated = prev.map(tx => {
        if (tx.id === txId) {
          // Toggle selection
          return { ...tx, selected: !tx.selected };
        }
        return tx;
      });
      
      // Update selected transactions and block size
      const selected = updated.filter(tx => tx.selected);
      setSelectedTransactions(selected);
      
      const newBlockSize = selected.reduce((sum, tx) => sum + tx.size, 0);
      setBlockSize(newBlockSize);
      
      return updated;
    });
  };

  // Auto-select best transactions (based on fee/vByte) that fit within block size
  const selectBestTransactions = () => {
    // Sort by fee per byte for optimal selection
    const sortedByFeeRate = [...mempool].sort((a, b) => 
      (b.fee / b.size) - (a.fee / a.size)
    );
    
    let cumulativeSize = 0;
    const selected: string[] = [];
    
    // Select transactions until we reach block size limit
    for (const tx of sortedByFeeRate) {
      if (cumulativeSize + tx.size <= MAX_BLOCK_SIZE) {
        selected.push(tx.id);
        cumulativeSize += tx.size;
      }
    }
    
    // Update selections
    setMempool(prev => 
      prev.map(tx => ({
        ...tx,
        selected: selected.includes(tx.id)
      }))
    );
    
    // Update selected transactions and block size
    const selectedTxs = mempool.filter(tx => selected.includes(tx.id));
    setSelectedTransactions(selectedTxs);
    setBlockSize(cumulativeSize);
  };
  
  // Clear all transaction selections
  const clearSelections = () => {
    setMempool(prev => prev.map(tx => ({ ...tx, selected: false })));
    setSelectedTransactions([]);
    setBlockSize(0);
  };
  
  const simulateMining = () => {
    if (isAnimating || selectedTransactions.length === 0) return;
    
    setIsAnimating(true);
    
    // Mining animation
    const miningAnimation = document.createElement('div');
    miningAnimation.className = styles.miningAnimation;
    document.body.appendChild(miningAnimation);
    
    // Mining with timeout
    setTimeout(() => {
      // Create timestamp
      const now = new Date();
      now.setFullYear(now.getFullYear() - 14); // Set a date from the past
      const timestamp = now.toLocaleString();
      
      // Generate merkle root (simulated)
      const merkleRoot = Math.random().toString(16).substr(2, 8);
      
      // Previous block hash
      const previousHash = chainBlocks.length > 0 
        ? chainBlocks[chainBlocks.length - 1]?.hash.toString() || "0"
        : "0";
      
      // Block data (simplified for simulation)
      const blockData = `${previousHash}-${timestamp}-${merkleRoot}`;
      
      // Use MEDIUM difficulty after difficulty adjustment
      const difficulty = DIFFICULTY_LEVELS.MEDIUM;
      
      // Perform mining with specified difficulty
      const result = mineBlock(blockData, difficulty);
      
      // Calculate total fees from selected transactions
      const totalFees = selectedTransactions.reduce((sum, tx) => sum + tx.fee, 0);
      
      // Create new block object
      const newBlock = walletInfo.currentBlock + 1;
      
      const newBlockData: MiningResult = {
        hash: result.hash.toString(),
        nonce: result.nonce,
        target: result.target.toString(),
        timestamp,
        transactions: selectedTransactions,
        merkleRoot,
        found: result.found,
        blockNumber: newBlock,
      };
      
      setMiningResult(newBlockData);
      
      // Only if a block was found (hash < target), update the chain
      if (result.found) {
        // Add to blockchain
        setChainBlocks(prev => {
          const newChain = [...prev, newBlockData];
          while (newChain.length > 3) {
            newChain.shift(); // Keep only the most recent blocks
          }
          return newChain;
        });
        
        // Update wallet info with block reward + fees
        setWalletInfo(prev => ({
          ...prev,
          balance: prev.balance + prev.currentReward + totalFees,
          currentBlock: newBlock,
          totalFees: prev.totalFees + totalFees,
        }));
        
        // Remove mined transactions from mempool
        setMempool(prev => prev.filter(tx => !tx.selected));
        setSelectedTransactions([]);
        setBlockSize(0);
      }
      
      setIsAnimating(false);
      document.body.removeChild(miningAnimation);
    }, 2000);
  };

  // Calculate mempool statistics
  const calculateMempoolStats = () => {
    if (mempool.length === 0) return null;
    
    // Calculate average fee rate in sat/vByte
    const avgFeeRate = mempool.reduce((sum, tx) => sum + tx.fee / tx.size, 0) / mempool.length;
    
    // Calculate median fee rate
    const feeRates = mempool.map(tx => tx.fee / tx.size).sort((a, b) => a - b);
    const medianFeeRate = feeRates[Math.floor(feeRates.length / 2)];
    
    // Calculate total value waiting in mempool
    const totalValue = mempool.reduce((sum, tx) => sum + tx.amount, 0);
    
    // Calculate total fees waiting in mempool
    const totalFees = mempool.reduce((sum, tx) => sum + tx.fee, 0);
    
    return {
      totalTransactions: mempool.length,
      avgFeeRate: avgFeeRate.toFixed(8),
      medianFeeRate: medianFeeRate.toFixed(8),
      totalValue: totalValue.toFixed(2),
      totalFees: totalFees.toFixed(8),
      lowFeeRate: feeRates[0].toFixed(8),
      highFeeRate: feeRates[feeRates.length - 1].toFixed(8)
    };
  };

  // Get statistics for the mempool
  const mempoolStats = calculateMempoolStats();

  return (
    <div className={styles.page}>
      <div className={styles.introSection}>
        <h1 className={styles.title}>Der Gebührenmarkt im Mempool</h1>
        <p className={styles.description}>
          Im Mempool warten unbestätigte Transaktionen darauf, von Minern in einen Block aufgenommen zu werden.
          Als Miner kannst du Transaktionen mit höheren Gebühren priorisieren, um deinen Profit zu maximieren.
        </p>
        <div className={styles.instructionBox}>
          <p><strong>So funktioniert der Gebührenmarkt:</strong> Nutzer konkurrieren mit Gebühren um den begrenzten Platz in Blöcken. Je höher die Gebühr pro Größe (vByte), desto attraktiver ist eine Transaktion für Miner.</p>
        </div>
      </div>
      
      {/* Verbesserte Wallet-Info mit überarbeiteten Styles */}
      <div className={styles.walletsContainer}>
        <div className={styles.walletCard}>
          <h2>Deine Miner-Wallet</h2>
          <div className={styles.walletInfo}>
            <div className={styles.walletInfoItem}>
              <span>Block-Höhe:</span>
              <strong>{walletInfo.currentBlock}</strong>
            </div>
            <div className={styles.walletInfoItem}>
              <span>Mining-Belohnung:</span>
              <strong>{walletInfo.currentReward} BTC</strong>
            </div>
            <div className={styles.walletInfoItem}>
              <span>Gesammelte Gebühren:</span>
              <strong>{walletInfo.totalFees.toFixed(8)} BTC</strong>
            </div>
          </div>
        </div>
      </div>
      
      {/* Marktstatistik-Button mit verbessertem Styling */}
      <button 
        className={styles.marketStatsButton} 
        onClick={toggleMarketStats}
      >
        <FaChartLine /> {showMarketStats ? 'Marktstatistik ausblenden' : 'Marktstatistik anzeigen'}
      </button>
      
      {/* Marktstatistiken Panel mit neuen Stilen */}
      {showMarketStats && mempoolStats && (
        <div className={styles.marketStatsPanel}>
          <h3>Aktuelle Mempool-Statistiken</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}><FaServer /></div>
              <span>Transaktionen</span>
              <strong>{mempoolStats.totalTransactions}</strong>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}><FaFire /></div>
              <span>Durchschnitt BTC/vByte</span>
              <strong>{mempoolStats.avgFeeRate}</strong>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}><FaArrowDown /></div>
              <span>Niedrigste Gebühr</span>
              <strong>{mempoolStats.lowFeeRate}</strong>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}><FaCoins /></div>
              <span>Wartende BTC</span>
              <strong>{mempoolStats.totalValue}</strong>
            </div>
          </div>
          
          <div className={styles.feeExplanation}>
            <FaInfoCircle className={styles.feeExplanationIcon} />
            <p>
              <strong>Gebührentipp:</strong> Transaktionen mit höheren BTC/vByte-Gebühren werden schneller bestätigt.
              Nutzer bezahlen bei Engpässen höhere Gebühren, um ihre Transaktion zu priorisieren.
              Dies schafft einen Marktmechanismus für Blockplatz.
            </p>
          </div>
        </div>
      )}
      
      {/* Rest des Codes bleibt unverändert, verwendet aber die neuen Stile automatisch */}
      {/* Verbesserte Block-Größen-Anzeige */}
      <div className={styles.blockSizeContainer}>
        <h3>Blockgröße: <span className={blockSize > MAX_BLOCK_SIZE ? styles.oversize : ''}>{blockSize} / {MAX_BLOCK_SIZE} vBytes</span></h3>
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBar}
            style={{ 
              width: `${Math.min(100, (blockSize / MAX_BLOCK_SIZE) * 100)}%`,
              backgroundColor: blockSize > MAX_BLOCK_SIZE ? '#e74c3c' : blockSize > MAX_BLOCK_SIZE * 0.8 ? '#f39c12' : '#2ecc71'
            }}
          />
        </div>
        {blockSize > MAX_BLOCK_SIZE && (
          <p className={styles.errorMessage}>&#9888; Blockgröße überschritten! Entferne einige Transaktionen.</p>
        )}
      </div>
      
      {/* Optimierte Transaktionsauswahl mit Schnellauswahl-Buttons */}
      <div className={`${styles.selectionToolbar} ${isMobile ? styles.mobileSelectionToolbar : ''}`}>
        <div className={styles.selectionInfo}>
          <h3>Ausgewählte Transaktionen: {selectedTransactions.length}</h3>
          <p>Gesamtgebühren: <strong>{selectedTransactions.reduce((sum, tx) => sum + tx.fee, 0).toFixed(8)} BTC</strong></p>
        </div>
        
        <div className={styles.selectionActions}>
          <button 
            className={styles.optimizeButton}
            onClick={selectBestTransactions}
            disabled={mempool.length === 0}
          >
            <FaBolt /> Automatisch optimieren
          </button>
          
          <button 
            className={styles.clearButton}
            onClick={clearSelections}
            disabled={selectedTransactions.length === 0}
          >
            <FaCheck /> Auswahl zurücksetzen
          </button>
        </div>
      </div>
      
      {/* Verbesserte Sortieroptionen */}
      <div className={styles.sortOptionsContainer}>
        <span className={styles.sortLabel}>Sortieren nach:</span>
        <div className={styles.sortOptions}>
          <button 
            className={`${styles.sortButton} ${sortBy === 'feeRate' ? styles.active : ''}`}
            onClick={() => handleSortChange('feeRate')}
          >
            <FaSortAmountDown /> BTC/vByte
          </button>
          <button 
            className={`${styles.sortButton} ${sortBy === 'fee' ? styles.active : ''}`}
            onClick={() => handleSortChange('fee')}
          >
            <FaSortAmountDown /> Gebühr
          </button>
          <button 
            className={`${styles.sortButton} ${sortBy === 'size' ? styles.active : ''}`}
            onClick={() => handleSortChange('size')}
          >
            <FaSortAmountDown /> Größe
          </button>
          <button 
            className={`${styles.sortButton} ${sortBy === 'time' ? styles.active : ''}`}
            onClick={() => handleSortChange('time')}
          >
            <FaRegClock /> Zeit
          </button>
        </div>
      </div>
      
      {/* Vereinfachte Mempool-Transaktionen */}
      <div className={styles.mempoolContainer}>
        <div className={styles.mempoolHeader}>
          <h3>Mempool-Transaktionen ({mempool.length})</h3>
          <div className={styles.sortInfo}>
            Sortiert nach: {
              sortBy === 'feeRate' ? 'BTC/vByte (höchste zuerst)' :
              sortBy === 'fee' ? 'Gebühr (höchste zuerst)' :
              sortBy === 'size' ? 'Größe (kleinste zuerst)' : 
              'Zeitpunkt (älteste zuerst)'
            }
          </div>
        </div>
        
        <div className={styles.transactionsHeader}>
          <span className={styles.txColumn}>Transaktion</span>
          <span className={styles.txColumn}>Betrag</span>
          <span className={styles.txColumn}>Gebühr</span>
          <span className={styles.txColumn}>Größe</span>
          <span className={styles.txColumn}>Priorität</span>
        </div>
        
        <div className={styles.transactionsList}>
          {mempool.map(tx => (
            <div 
              key={tx.id}
              className={`${styles.transactionRow} ${tx.selected ? styles.selectedTx : ''}`}
              onClick={() => toggleTransactionSelection(tx.id)}
            >
              <span className={styles.txColumn}>
                <div className={styles.txId}>{tx.id.substring(0, 8)}...</div>
                <div className={styles.txAddresses}>{tx.sender.substring(0, 6)}... → {tx.recipient.substring(0, 6)}...</div>
              </span>
              <span className={styles.txColumn}>{tx.amount.toFixed(4)} BTC</span>
              <span className={styles.txColumn}>
                {tx.fee.toFixed(6)} BTC
                <div className={styles.feeRate}>≈ {(tx.fee / tx.size).toFixed(8)} BTC/vB</div>
              </span>
              <span className={styles.txColumn}>{tx.size} vB</span>
              <span className={`${styles.txColumn} ${styles.priority}`}>
                <div 
                  className={styles.priorityIndicator}
                  style={{
                    backgroundColor: getPriorityColor(tx.fee / tx.size)
                  }}
                ></div>
                {getPriorityLabel(tx.fee / tx.size)}
              </span>
            </div>
          ))}
          {mempool.length === 0 && (
            <div className={styles.emptyMempool}>
              <p>Alle Transaktionen wurden gemint!</p>
              <button onClick={() => window.location.reload()} className={styles.reloadButton}>
                Neue Transaktionen laden
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mining-Button */}
      <div className={styles.miningActions}>
        <button 
          className={styles.mineButton} 
          onClick={simulateMining}
          disabled={isAnimating || selectedTransactions.length === 0 || blockSize > MAX_BLOCK_SIZE}
        >
          {isAnimating ? 'Mining läuft...' : 'Block mit ausgewählten Transaktionen minen'}
        </button>
      </div>
      
      {/* Mining-Ergebnis */}
      {miningResult && (
        <div className={`${styles.miningBlock} ${miningResult.found ? styles.foundAnimation : styles.notFoundAnimation}`}>
          <h2>Mining Block #{miningResult.blockNumber}</h2>
          <div className={styles.hashTarget}>
            <div className={styles.hashDisplay}>
              <strong>Hash:</strong> 
              <span className={`${styles.hash} ${miningResult.found ? styles.validHash : styles.invalidHash}`}>
                {miningResult.hash}
              </span>
            </div>
            
            <span className={styles.mustBeBelow}>
              muss kleiner sein als
            </span>
            
            <div>
              <strong>Target:</strong>
              <span className={styles.target}>
                {miningResult.target}
              </span>
            </div>
          </div>
          
          <div className={styles.minedTransactionsSummary}>
            <h3>Geminte Transaktionen</h3>
            <ul className={styles.minedTransactionsList}>
              {miningResult.transactions.slice(0, 5).map(tx => (
                <li key={tx.id} className={styles.minedTransactionItem}>
                  <span className={styles.minedTxId}>{tx.id.substring(0, 8)}...</span>
                  <span className={styles.minedTxAmount}>{tx.amount.toFixed(4)} BTC</span>
                  <span className={styles.minedTxFee}>{tx.fee.toFixed(6)} BTC</span>
                </li>
              ))}
              {miningResult.transactions.length > 5 && (
                <li className={styles.minedTransactionMore}>
                  ... und {miningResult.transactions.length - 5} weitere Transaktionen
                </li>
              )}
            </ul>
          </div>
          
          <p><strong>Gesamtzahl Transaktionen:</strong> {miningResult.transactions.length}</p>
          <p><strong>Gebühren:</strong> {miningResult.transactions.reduce((sum, tx) => sum + tx.fee, 0).toFixed(8)} BTC</p>
          <p><strong>Block-Belohnung:</strong> {walletInfo.currentReward} BTC</p>
          <p><strong>Gesamtbelohnung:</strong> {(walletInfo.currentReward + miningResult.transactions.reduce((sum, tx) => sum + tx.fee, 0)).toFixed(8)} BTC</p>
          <p><strong>Status:</strong> {miningResult.found ? 
            "Block erfolgreich gemint und zur Blockchain hinzugefügt! ✅" : 
            "Block nicht gefunden ❌ Versuche es erneut!"}
          </p>
          
          <div className={styles.blockButtons}>
            <button 
              className={styles.mineButton} 
              onClick={simulateMining}
              disabled={isAnimating || selectedTransactions.length === 0 || blockSize > MAX_BLOCK_SIZE}
            >
              {isAnimating ? 'Mining läuft...' : 'Nächsten Block minen'}
            </button>
            
            <button className={styles.nextButton} onClick={onNext}>
              Weiter zum Halving
            </button>
          </div>
        </div>
      )}
      
      {/* Navigation Button */}
      {!miningResult && (
        <div className={styles.navigationButtons}>
          <button className={styles.nextButton} onClick={onNext}>
            Weiter zum Halving
          </button>
        </div>
      )}
      
      {/* Popup */}
      {showMempoolPopup && (
        <MempoolExplanationPopup onClose={() => setShowMempoolPopup(false)} />
      )}
    </div>
  );
  
  // Hilfsfunktionen zur visuellen Darstellung der Priorität
  function getPriorityColor(feeRate: number): string {
    if (feeRate > 0.0005) return '#2ecc71'; // Hoch - Grün
    if (feeRate > 0.0002) return '#f39c12'; // Mittel - Orange
    return '#e74c3c'; // Niedrig - Rot
  }
  
  function getPriorityLabel(feeRate: number): string {
    if (feeRate > 0.0005) return 'Hoch';
    if (feeRate > 0.0002) return 'Mittel';
    return 'Niedrig';
  }
};

export default MempoolPage;
