import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Difficulty.module.scss'; // Aktualisierter Pfad
import { mineBlock, DIFFICULTY_LEVELS } from '../utils/miningUtils';
import { FaInfoCircle, FaLink, FaExclamationTriangle, FaAngleDown } from 'react-icons/fa';

interface MiningResult {
  hash: string;
  nonce: number;
  target: string;
  timestamp: string;
  transactions: string;
  merkleRoot: string;
  found: boolean;
  blockNumber: number;
}

interface DifficultyAdjustmentPageProps {
  onNext: () => void;
}

const DifficultyAdjustmentPage: React.FC<DifficultyAdjustmentPageProps> = ({ onNext }) => {
  const [miningResult, setMiningResult] = useState<MiningResult | null>(null);
  const [chainBlocks, setChainBlocks] = useState<MiningResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [walletInfo, setWalletInfo] = useState({
    balance: 2014 * 50, // Starting with blocks up to 2014
    currentBlock: 2014,
    currentReward: 50,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState<'normal' | 'harder'>('normal');
  const [adjustmentMade, setAdjustmentMade] = useState(false);
  const [targetValue, setTargetValue] = useState('1.0');
  
  // Handle responsive view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Initialize blockchain with blocks near difficulty adjustment
  useEffect(() => {
    setChainBlocks([
      { blockNumber: 2010, hash: "0.175026", nonce: 2481, target: "1", timestamp: "9/15/2009, 12:00:00 AM", transactions: "3 Transaktionen", merkleRoot: "4a5e1e", found: true },
      { blockNumber: 2011, hash: "0.21169", nonce: 1237, target: "1", timestamp: "9/15/2009, 12:15:00 AM", transactions: "2 Transaktionen", merkleRoot: "9d0c1e", found: true },
      { blockNumber: 2012, hash: "0.68168", nonce: 983, target: "1", timestamp: "9/15/2009, 12:30:00 AM", transactions: "4 Transaktionen", merkleRoot: "8c4e2f", found: true },
      { blockNumber: 2013, hash: "0.159457", nonce: 3091, target: "1", timestamp: "9/15/2009, 12:45:00 AM", transactions: "1 Transaktion", merkleRoot: "7b3f1d", found: true },
      { blockNumber: 2014, hash: "0.207500", nonce: 1762, target: "1", timestamp: "9/15/2009, 1:00:00 AM", transactions: "2 Transaktionen", merkleRoot: "6a2e9b", found: true },
    ]);
  }, []);
  
  const simulateMining = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
    
    // Create timestamp
    const now = new Date();
    now.setFullYear(now.getFullYear() - 16);
    const timestamp = now.toLocaleString();
    
    // Create transaction information
    const txCount = Math.floor(Math.random() * 4) + 1;
    const transactions = `${txCount} Transaktion${txCount > 1 ? 'en' : ''}`;
    
    // Generate merkle root
    const merkleRoot = Math.random().toString(16).substr(2, 8);
    
    // Previous block hash
    const previousHash = chainBlocks.length > 0 
      ? chainBlocks[chainBlocks.length - 1].hash.toString()
      : "0";
    
    // Block data
    const blockData = `${previousHash}-${timestamp}-${merkleRoot}`;
    
    // Mining animation
    const miningAnimation = document.createElement('div');
    miningAnimation.className = styles.miningAnimation;
    document.body.appendChild(miningAnimation);
    
    // Mining with timeout
    setTimeout(() => {
      // Determine difficulty based on block number
      let difficulty;
      const newBlock = walletInfo.currentBlock + 1;
      
      if (newBlock >= 2016) {
        difficulty = DIFFICULTY_LEVELS.MEDIUM; // After block 2016, use MEDIUM difficulty
      } else {
        difficulty = DIFFICULTY_LEVELS.EASY; // Before block 2016, use EASY difficulty
      }
      
      // Perform mining with specified difficulty
      const result = mineBlock(blockData, difficulty);
      
      // Create new block object
      const newBlockData: MiningResult = {
        hash: result.hash.toString(),
        nonce: result.nonce,
        target: result.target.toString(),
        timestamp,
        transactions,
        merkleRoot,
        found: result.found,
        blockNumber: newBlock,
      };
      
      setMiningResult(newBlockData);
      
      // Only if a block was found (hash < target), update the chain
      if (result.found) {
        setChainBlocks(prev => {
          const newChain = [...prev, newBlockData];
          while (newChain.length > 5) {
            newChain.shift();
          }
          return newChain;
        });
        
        setWalletInfo(prev => ({
          ...prev,
          balance: prev.balance + prev.currentReward,
          currentBlock: newBlock,
        }));

        // NACH erfolgreichem Mining von Block 2016 erst die Difficulty anpassen
        if (newBlock === 2016) {
          setTargetValue('0.9');  // Änderung von 0.7 auf 0.9 (10% statt 30%)
          setAdjustmentMade(true);
          setDifficultyLevel('harder'); // Setze den neuen Schwierigkeitsgrad
        }
      }
      
      document.body.removeChild(miningAnimation);
    }, 1000);
  };
  
  // Determine which blocks to display based on screen size
  const blocksToDisplay = isMobile ? chainBlocks.slice(-2) : chainBlocks;
  
  return (
    <div className={styles.page}>
      {/* Intro */}
      <section className={styles.introSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Difficulty Adjustment (Schwierigkeitsanpassung)</h1>
          <p>
            Alle 2016 Blöcke (etwa alle zwei Wochen) passt das Bitcoin-Netzwerk die Mining-Schwierigkeit an.
            Diese Anpassung stellt sicher, dass die durchschnittliche Zeit zwischen den Blöcken bei etwa 10 Minuten bleibt.
          </p>
        </motion.div>
      </section>

      {/* Blockchain-Visualisierung */}
      <section className={styles.enhancedBlockchainContainer}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3>
            <FaLink style={{marginRight: '8px'}} />
            Aktuelle Blockchain
          </h3>
          {/* Fortschrittsanzeige */}
          <div className={styles.difficultyProgressContainer}>
            <div className={styles.progressLabel}>
              <span className={styles.adjustmentTarget}>
                <FaExclamationTriangle style={{marginRight: '5px'}} />
                Block 2016: Schwierigkeitsanpassung
              </span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{
                  width: `${Math.min(100, ((walletInfo.currentBlock - 2000) / 16) * 100)}%`,
                  background: adjustmentMade ? 
                    'linear-gradient(90deg, rgba(247, 147, 26, 0.5), #e74c3c)' : 
                    'linear-gradient(90deg, rgba(247, 147, 26, 0.5), #f7931a)'
                }}
              ></div>
            </div>
            {walletInfo.currentBlock < 2016 && (
              <div className={styles.blockCountdown}>
                Noch <strong>{2016 - walletInfo.currentBlock}</strong> Blöcke bis zur Schwierigkeitsanpassung
              </div>
            )}
            {adjustmentMade && (
              <div className={styles.adjustmentComplete}>
                <FaAngleDown style={{marginRight: '5px'}} />
                Schwierigkeitsanpassung erfolgt! Das Target wurde gesenkt.
              </div>
            )}
          </div>
          {/* Blockchain-Visualisierung */}
          <div className={styles.blockchainVisualization}>
            {blocksToDisplay.map(block => {
              const previous = chainBlocks.find(b => b.blockNumber === (block.blockNumber - 1));
              let prevDisplay = previous ? previous.hash.toString() : `Block ${block.blockNumber - 1}`;
              return (
                <div key={block.blockNumber} className={styles.block}>
                  <p><strong>Block {block.blockNumber}</strong></p>
                  <p>Hash: {block.hash}</p>
                  <p>Last: {prevDisplay}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Target-Anzeige */}
      <section className={styles.targetDisplay}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {!miningResult && (
            <>
              <h3>Aktuelles Target: <span className={styles.targetValue}>{targetValue}</span></h3>
              <p className={styles.targetExplanation}>
                Der Hash deines Blocks muss <strong>kleiner</strong> als das Target sein, um akzeptiert zu werden.
                {adjustmentMade && <span className={styles.newTarget}> Nach der Anpassung ist das Target niedriger, was das Mining schwieriger macht.</span>}
              </p>
            </>
          )}
        </motion.div>
      </section>

      {/* Mining-Interface */}
      <section className={styles.miningSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {!miningResult ? (
            <button 
              className={styles.mineButton} 
              onClick={simulateMining}
              disabled={isAnimating}
            >
              {isAnimating ? 'Mining läuft...' : 'Block minen'}
            </button>
          ) : (
            <div className={`${styles.miningBlock} ${miningResult.found ? styles.foundAnimation : styles.notFoundAnimation}`}>
              <h2>Mining Block #{miningResult.blockNumber}</h2>
              {adjustmentMade && miningResult.blockNumber >= 2016 && (
                <div className={styles.adjustmentAlert}>
                  <FaInfoCircle />
                  <span>Schwierigkeitsanpassung aktiviert! Mining dauert nun länger.</span>
                </div>
              )}
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
                  <span className={`${styles.target} ${difficultyLevel === 'harder' ? styles.harderTarget : ''}`}>
                    {adjustmentMade && miningResult.blockNumber >= 2016 ? '0.9' : '1.0'}
                  </span>
                </div>
              </div>
              <p><strong>Nonce:</strong> {miningResult.nonce}</p>
              <p><strong>Zeitstempel:</strong> {miningResult.timestamp}</p>
              <p><strong>Transaktionen:</strong> {miningResult.transactions}</p>
              <p><strong>Merkle-Root:</strong> {miningResult.merkleRoot}</p>
              <p><strong>Status:</strong> {miningResult.found ? 
                "Block gefunden! ✅ Du erhältst eine Belohnung!" : 
                "Block nicht gefunden ❌ Versuche es erneut!"}
              </p>
              <div className={styles.blockButtons}>
                <button 
                  className={styles.mineButton} 
                  onClick={simulateMining}
                  disabled={isAnimating}
                >
                  {isAnimating ? 'Mining läuft...' : miningResult?.found ? 'Nächster Block' : 'Erneut versuchen'}
                </button>
                {walletInfo.currentBlock >= 2016 && (
                  <button className={styles.nextButton} onClick={onNext}>
                    Weiter zu Transaktionen
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* Erklärung nach Adjustment */}
      {adjustmentMade && (
        <section className={styles.simpleExplanation}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h3>Was ist passiert?</h3>
            <p>
              Bei Block 2016 wurde die Schwierigkeit erhöht.
              Das bedeutet, dass der Target-Wert von 1.0 auf 0.9 gesenkt wurde.
            </p>
            <p>
              <strong>Warum ist es schwieriger geworden?</strong> Dein Hash muss jetzt 
              kleiner als 0.9 sein (statt kleiner als 1.0). Diese kleinere Zielgröße 
              macht es schwieriger, einen gültigen Block zu finden, da weniger mögliche 
              Hash-Werte akzeptiert werden.
            </p>
            <p className={styles.mathExplanation}>
              <strong>Grund für die Anpassung:</strong> Die ersten 2016 Blöcke wurden etwa 10% schneller 
              gefunden als die Zielzeit von 10 Minuten pro Block. Deshalb wird das Target 
              von 1.0 auf 0.9 gesenkt - eine Erhöhung der Schwierigkeit um genau 10%. 
              Dadurch dauert das Mining länger und die durchschnittliche Blockzeit wird wieder 
              auf 10 Minuten korrigiert.
            </p>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default DifficultyAdjustmentPage;
