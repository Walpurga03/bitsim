import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Mining.module.scss';
import { mineBlock } from '../utils/miningUtils';
import { FaHammer, FaAngleDoubleDown, FaInfoCircle } from 'react-icons/fa';

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

interface BasicMiningPageProps {
  onNext: () => void;
}

// Neue Hilfsfunktion
const formatHash = (hash: string, isMobile: boolean) => {
  if (isMobile && hash.length > 20) {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  }
  return hash;
};

const BasicMiningPage: React.FC<BasicMiningPageProps> = ({ onNext }) => {
  const [miningStarted, setMiningStarted] = useState(false);
  const [miningResult, setMiningResult] = useState<MiningResult | null>(null);
  const [chainBlocks, setChainBlocks] = useState<MiningResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [walletInfo, setWalletInfo] = useState({
    balance: 0,
    currentBlock: 0,
    currentReward: 50,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [showMiningProcess, setShowMiningProcess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [miningProgress, setMiningProgress] = useState(0);
  
    const MAX_MINING_ATTEMPTS = 1000; // Define maximum mining attempts for progress calculation
    const satoshiAddress = "1SatoshiPioneerXXX";
    
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (walletInfo.currentBlock >= 3) {
      setShowMiningProcess(false);
    }
  }, [walletInfo.currentBlock]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showMiningProcess) {
      const interval = setInterval(() => {
        setMiningProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 280); // 280ms * 10 Schritte ≈ 2.8s (Dauer der Animation)
      
      return () => clearInterval(interval);
    } else {
      setMiningProgress(0);
    }
  }, [showMiningProcess]);
  
  const simulateMining = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowMiningProcess(true);
    setMiningProgress(0);
    
    const now = new Date();
    now.setFullYear(now.getFullYear() - 16);
    const timestamp = now.toLocaleString();
    
    let transactions: string;
    if (walletInfo.currentBlock + 1 === 1) {
      transactions = "Genesis Block - Keine Transaktionen";
    } else {
      const txCount = Math.floor(Math.random() * 4) + 1;
      transactions = `${txCount} Transaktion${txCount > 1 ? 'en' : ''}`;
    }
    
    const blockData = {
      timestamp,
      transactions,
      blockHeight: walletInfo.currentBlock + 1
    };
    
    if (window.Worker) {
      const worker = new Worker(new URL('../utils/miningWorker.ts', import.meta.url));
      
      worker.postMessage({ 
        blockData: JSON.stringify(blockData),
        blockHeight: walletInfo.currentBlock + 1
      });
      
      worker.onmessage = (e) => {
        const { type, result, message, attempts } = e.data;
        
        if (type === 'progress') {
          setMiningProgress((attempts / MAX_MINING_ATTEMPTS) * 100);
        }
        else if (type === 'result') {
          const { hash, nonce, found, target } = result;
          
          try {
            setError(null);
            
            const newBlock = walletInfo.currentBlock + 1;
            
            const newBlockData: MiningResult = {
              hash: hash.toString(),
              nonce,
              target: target.toString(),
              timestamp,
              transactions,
              merkleRoot: Math.random().toString(16).substr(2, 8),
              found,
              blockNumber: newBlock,
            };
            
            setMiningResult(newBlockData);
            
            if (found) {
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
            }
            
            setIsAnimating(false);
            
            timeoutRef.current = setTimeout(() => {
              setShowMiningProcess(false);
            }, 1500);
          } catch (err) {
            setError("Ein Fehler ist beim Mining aufgetreten. Bitte versuche es erneut.");
            setIsAnimating(false);
            setShowMiningProcess(false);
          } finally {
            worker.terminate();
          }
        }
        else if (type === 'error') {
          setError(message);
          setIsAnimating(false);
          setShowMiningProcess(false);
          worker.terminate();
        }
      };
    } else {
      timeoutRef.current = setTimeout(() => {
        try {
          const result = mineBlock(JSON.stringify(blockData), undefined, walletInfo.currentBlock + 1);
          setError(null);
          
          const newBlock = walletInfo.currentBlock + 1;
          
          const newBlockData: MiningResult = {
            hash: result.hash.toString(),
            nonce: result.nonce,
            target: result.target.toString(),
            timestamp,
            transactions,
            merkleRoot: Math.random().toString(16).substr(2, 8),
            found: result.found,
            blockNumber: newBlock,
          };
          
          setMiningResult(newBlockData);
          
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
          }
          
          setIsAnimating(false);
          
          timeoutRef.current = setTimeout(() => {
            setShowMiningProcess(false);
          }, 1500);
        } catch (err) {
          setError("Ein Fehler ist beim Mining aufgetreten. Bitte versuche es erneut.");
          setIsAnimating(false);
          setShowMiningProcess(false);
        }
      }, 3000);
    }
  }, [isAnimating, chainBlocks, walletInfo]);
  
  const blocksToDisplay = isMobile ? chainBlocks.slice(-2) : chainBlocks;
  
  return (
    <div className={styles.pageContainer}>
      <section className={styles.miningSection}>
        <AnimatePresence mode="wait">
          {!miningStarted ? (
            <motion.div
              key="intro"
              className={styles.introSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className={styles.title}>Mining: Der Herzschlag von Bitcoin</h1>
              <p className={styles.description}>
                Mining ist der Prozess, bei dem neue Bitcoin-Blöcke erzeugt und Transaktionen bestätigt werden. 
                Als Miner wirst du ein mathematisches Rätsel lösen, um einen neuen Block zur Blockchain hinzuzufügen.
              </p>
              <motion.div 
                className={styles.miningSimulationExplanation}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className={styles.explanationHeader}>
                  <FaInfoCircle className={styles.infoIcon} />
                  <h3>Unsere vereinfachte Mining-Simulation</h3>
                </div>
                
                <div className={styles.miningStepsGrid}>
                  <div className={styles.miningStep}>
                    <p>Wir generieren automatisch einen Hash für deinen Block</p>
                  </div>
                  <div className={styles.miningStep}>
                    <p>Der Hash wird mit dem Target-Wert verglichen</p>
                  </div>
                  <div className={styles.miningStep}>
                    <p>Ist der Hash kleiner als das Target, hast du einen gültigen Block gefunden</p>
                  </div>
                </div>
                
                <div className={styles.blockElements}>
                  <h4>Einige Elemente eines Blocks, die den Hash bestimmen:</h4>
                  <div className={styles.elementsGrid}>
                    <div className={styles.blockElement}>
                      <span className={styles.elementIcon}>🔄</span>
                      <span className={styles.elementName}>Nonce:</span>
                      <p>Eine Zufallszahl, die verändert wird, um verschiedene Hashes zu erzeugen.</p>
                    </div>
                    <div className={styles.blockElement}>
                      <span className={styles.elementIcon}>⛓️</span>
                      <span className={styles.elementName}>Vorheriger Block:</span>
                      <p>Der Hash des letzten Blocks in der Kette.</p>
                    </div>
                    <div className={styles.blockElement}>
                      <span className={styles.elementIcon}>🕒</span>
                      <span className={styles.elementName}>Zeitstempel:</span>
                      <p>Datum und Uhrzeit der Block-Erstellung.</p>
                    </div>
                    <div className={styles.blockElement}>
                      <span className={styles.elementIcon}>💸</span>
                      <span className={styles.elementName}>Transaktionen:</span>
                      <p>Alle im Block enthaltenen Transaktionen (als Merkle Root).</p>
                    </div>
                  </div>
                </div>
                
                <div className={styles.targetExplanation}>
                  <p><strong>Hinweis:</strong> Im realen Bitcoin-Netzwerk probieren spezielle Computer Millionen von Hashes pro Sekunde aus, bis ein gültiger Hash gefunden wird.</p>
                </div>
              </motion.div>
              
              <motion.button 
                className={styles.nextButton} 
                onClick={() => setMiningStarted(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Mining starten
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="mining-interface"
              className={styles.miningSimulation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.miningOverviewSection}>
                <motion.div 
                  className={styles.walletsContainer}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={styles.walletCard}>
                    <h2>Deine Mining-Wallet</h2>
                    <p><strong>Adresse:</strong> {satoshiAddress}</p>
                    <p><strong>Balance:</strong> {walletInfo.balance} BTC</p>
                    <p><strong>Belohnung:</strong> {walletInfo.currentReward} BTC</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className={styles.visualBlockchain}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className={styles.blockchainTitle}>Deine Blockchain</h2>
                  <div className={styles.blockchainDisplay}>
                    {chainBlocks.length === 0 ? (
                      <div className={styles.emptyChain}>
                        <p>Noch keine Blöcke in deiner Blockchain. Mine deinen ersten Block!</p>
                      </div>
                    ) : (
                      blocksToDisplay.map((block, idx) => {
                        const previous = chainBlocks.find(b => b.blockNumber === (block.blockNumber - 1));
                        let prevDisplay = previous ? previous.hash.toString() : (block.blockNumber > 1 ? `Block ${block.blockNumber - 1}` : "XXXX");
                        return (
                          <motion.div 
                            key={block.blockNumber} 
                            className={`${styles.block} ${idx === blocksToDisplay.length - 1 ? styles.latestBlock : ''}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <p className={styles.blockHeader}><strong>Block {block.blockNumber}</strong></p>
                            
                            <div className={styles.blockDetails}>
                              <div className={styles.blockHashContainer}>
                                <p className={styles.blockHashLabel}>Block Hash:</p>
                                <p className={styles.blockHashValue}>
                                  {formatHash(block.hash, isMobile)}
                                </p>
                              </div>
                              
                              <div className={styles.blockPrevContainer}>
                                <p className={styles.blockPrevLabel}>
                                  <span className={styles.chainIcon}>⛓️</span> Hash Block {block.blockNumber - 1}:
                                </p>
                                <p className={styles.blockPrevValue}>
                                  {block.blockNumber === 1 ? "Genesis" : prevDisplay}
                                </p>
                              </div>
                              
                              <p className={styles.blockNonceValue}>Nonce: <span>{block.nonce}</span></p>
                            </div>
                            
                            {idx < blocksToDisplay.length - 1 && (
                              <div className={styles.blockLink}>
                                <div className={styles.chainConnection}>
                                  <div className={styles.chainLine}></div>
                                  <div className={styles.chainArrow}><FaAngleDoubleDown /></div>
                                  <div className={styles.chainExplanation}>Hash wird Teil des nächsten Blocks</div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                className={styles.miningActionSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {error && (
                  <div className={styles.errorMessage}>
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>Schließen</button>
                  </div>
                )}
                {!miningResult ? (
                  <div className={styles.miningControls}>
                    <motion.button 
                      className={styles.mineButton} 
                      onClick={simulateMining}
                      disabled={isAnimating}
                      aria-busy={isAnimating}
                      aria-label={isAnimating ? "Mining läuft gerade" : "Block minen starten"}
                      whileHover={!isAnimating ? { scale: 1.05 } : {}}
                      whileTap={!isAnimating ? { scale: 0.95 } : {}}
                    >
                      {isAnimating ? 'Mining läuft...' : 'Block minen'}
                    </motion.button>
                    
                    <div className={styles.difficultyInfo}>
                      <p>Target: <span className={styles.targetValue}>1</span></p>
                      <p className={styles.difficultyHint}>
                        <FaInfoCircle className={styles.infoIcon} /> 
                        Dein Hash muss kleiner als das Target sein
                      </p>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    className={`${styles.miningBlock} ${miningResult.found ? styles.foundAnimation : styles.notFoundAnimation}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2>{miningResult.found ? 'Block erfolgreich gemint!' : 'Mining fehlgeschlagen'}</h2>
                    
                    <div className={styles.hashComparison}>
                      <div className={styles.comparisonRow}>
                        <div className={styles.comparisonLabel}>Target:</div>
                        <div className={styles.comparisonValue}>
                          <span className={styles.targetValue}>{miningResult.target}</span>
                        </div>
                      </div>
                      
                      <div className={styles.comparisonRow}>
                        <div className={styles.comparisonLabel}>Gefundener Hash:</div>
                        <div className={styles.comparisonValue}>
                          <span className={`${styles.hashValue} ${miningResult.found ? styles.successHash : styles.failureHash}`}>
                            {miningResult.hash}
                          </span>
                        </div>
                      </div>
                      
                      <div className={styles.hashExplanation}>
                        {miningResult.found ? (
                          <>
                            <div className={styles.successIcon}>✓</div>
                            <p>
                              <strong>Erfolg!</strong> Dein Hash ist <span className={styles.highlight}>kleiner</span> als der Target-Wert.
                              Der Block wurde akzeptiert und zur Blockchain hinzugefügt.
                            </p>
                          </>
                        ) : (
                          <>
                            <div className={styles.failureIcon}>✗</div>
                            <p>
                              <strong>Fehlgeschlagen!</strong> Dein Hash ist <span className={styles.highlight}>größer</span> als der Target-Wert.
                              Du musst einen neuen Nonce-Wert ausprobieren.
                            </p>
                          </>
                        )}
                      </div>
                      
                      <div className={styles.miningStats}>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>Nonce:</span>
                          <span className={styles.statValue}>{miningResult.nonce}</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>Zeitstempel:</span>
                          <span className={styles.statValue}>{miningResult.timestamp}</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>Transaktionen:</span>
                          <span className={styles.statValue}>{miningResult.transactions}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.blockButtons}>
                      {walletInfo.currentBlock < 3 && (
                        <motion.button 
                          className={styles.mineButton} 
                          onClick={simulateMining}
                          disabled={isAnimating}
                          aria-busy={isAnimating}
                          aria-label={isAnimating ? "Mining läuft gerade" : "Block minen starten"}
                          whileHover={!isAnimating ? { scale: 1.05 } : {}}
                          whileTap={!isAnimating ? { scale: 0.95 } : {}}
                        >
                          {isAnimating ? 'Mining läuft...' : miningResult.found ? 'Nächsten Block minen' : 'Erneut versuchen'}
                        </motion.button>
                      )}
                      
                      {walletInfo.currentBlock >= 3 && (
                        <motion.button 
                          className={styles.nextButton} 
                          onClick={onNext}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Weiter zum Netzwerk
                        </motion.button>
                      )}
                    </div>
                    
                    {walletInfo.currentBlock >= 3 && (
                      <motion.div 
                        className={styles.miningSuccess}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        🎉 Du hast 3 Blöcke erfolgreich gemint! Entdecke jetzt, wie das Netzwerk funktioniert.
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>
              
              <AnimatePresence>
                {showMiningProcess && (
                  <motion.div 
                    className={styles.miningProcessVisualizer}
                    role="dialog"
                    aria-label="Mining im Gange"
                    aria-live="polite"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }} // Hier Dauer in Sekunden anpassen
                  >
                    <div className={styles.miningAnimation}>
                      <div className={styles.miningIcon}>
                        <motion.div
                          animate={{ rotate: [0, 15, 0, -15, 0] }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 0.8, // Dauer eines Schwungzyklus in Sekunden
                            ease: "easeInOut" // Optional: Art der Animation
                          }}
                        >
                          <FaHammer className={styles.hammer} />
                        </motion.div>
                      </div>
                      <div className={styles.miningProgress}>
                        <motion.div 
                          className={styles.miningProgressBar} 
                          initial={{ width: "0%" }}
                          animate={{ width: `${miningProgress}%` }}
                          transition={{ ease: "easeOut" }}
                        />
                      </div>
                      <p>Suche nach gültigem Hash...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default BasicMiningPage;
