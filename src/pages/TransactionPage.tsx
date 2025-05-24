import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/TransactionPage.module.scss';
import CombinedTransactionWalletsPage from './CombinedTransactionWalletsPage';
import { mineBlock, DIFFICULTY_LEVELS } from '../utils/miningUtils';
import { FaInfoCircle, FaCheck, FaSpinner, FaArrowRight, FaExclamationCircle } from 'react-icons/fa';

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

interface TransactionPageProps {
  onNext: () => void;
}

export const TransactionPage: React.FC<TransactionPageProps> = ({ onNext }) => {
  const [miningResult, setMiningResult] = useState<MiningResult | null>(null);
  const [showCombinedPage, setShowCombinedPage] = useState(false);
  const [chainBlocks, setChainBlocks] = useState<MiningResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [walletInfo, setWalletInfo] = useState({
    balance: 2016 * 50, // Starting with blocks up to 2016 (including the difficulty adjustment)
    halBalance: 0,
    currentBlock: 2016,
    currentReward: 50,
  });
  const [txIdFromCombined, setTxIdFromCombined] = useState<string>('');
  const [pendingTransactionAmount, setPendingTransactionAmount] = useState<number>(0);
  const [transactionCompleted, setTransactionCompleted] = useState(false);
  const [showMiningAnimation, setShowMiningAnimation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [miningProgress, setMiningProgress] = useState(0);

  const satoshiAddress = "1SatoshiPioneerXXX";
  const halAddress = "1HalLegendeXXX";

  // Initialize blockchain with blocks after difficulty adjustment
  useEffect(() => {
    setChainBlocks([
      { blockNumber: 2012, hash: "0.868168", nonce: 2983, target: "0.9", timestamp: "9/29/2009, 12:30:00 AM", transactions: "3 Transaktionen", merkleRoot: "8c4e2f", found: true },
      { blockNumber: 2013, hash: "0.859457", nonce: 5091, target: "0.9", timestamp: "9/29/2009, 12:45:00 AM", transactions: "2 Transaktionen", merkleRoot: "7b3f1d", found: true },
      { blockNumber: 2014, hash: "0.807500", nonce: 4762, target: "0.9", timestamp: "9/29/2009, 1:00:00 AM", transactions: "4 Transaktionen", merkleRoot: "6a2e9b", found: true },
      { blockNumber: 2015, hash: "0.875026", nonce: 3481, target: "0.9", timestamp: "9/29/2009, 1:15:00 AM", transactions: "1 Transaktion", merkleRoot: "5d7c3a", found: true },
      { blockNumber: 2016, hash: "0.821169", nonce: 6237, target: "0.9", timestamp: "9/29/2009, 1:30:00 AM", transactions: "3 Transaktionen", merkleRoot: "4c6b2d", found: true },
    ]);
  }, []);

  useEffect(() => {
    if (showMiningAnimation) {
      const interval = setInterval(() => {
        setMiningProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 50); // 20 Schritte für 1 Sekunde
      
      return () => clearInterval(interval);
    } else {
      setMiningProgress(0);
    }
  }, [showMiningAnimation]);

  const simulateMining = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowMiningAnimation(true);
    
    // Create timestamp
    const now = new Date();
    now.setFullYear(now.getFullYear() - 16);
    const timestamp = now.toLocaleString();

    // Create transaction information
    let transactions: string;
    if (pendingTransactionAmount > 0) {
      transactions = `1 Transaktion (${pendingTransactionAmount} BTC an ${halAddress})`;
    } else {
      const txCount = Math.floor(Math.random() * 4) + 1;
      transactions = `${txCount} Transaktion${txCount > 1 ? 'en' : ''}`;
    }

    // Generate merkle root
    const merkleRoot = Math.random().toString(16).substr(2, 8);

    // Previous block hash
    const previousHash = chainBlocks.length > 0 
      ? chainBlocks[chainBlocks.length - 1].hash.toString()
      : "0";

    // Block data
    const blockData = `${previousHash}-${timestamp}-${merkleRoot}`;

    // Mining with timeout
    setTimeout(() => {
      try {
        const difficulty = DIFFICULTY_LEVELS.MEDIUM;

        const result = mineBlock(blockData, difficulty);

        const newBlock = walletInfo.currentBlock + 1;

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

        if (result.found) {
          setChainBlocks(prev => {
            const newChain = [...prev, newBlockData];
            while (newChain.length > 5) {
              newChain.shift();
            }
            return newChain;
          });

          if (pendingTransactionAmount > 0) {
            setWalletInfo(prev => ({
              ...prev,
              balance: prev.balance + prev.currentReward - pendingTransactionAmount,
              halBalance: prev.halBalance + pendingTransactionAmount,
              currentBlock: newBlock,
            }));
            setTxIdFromCombined('');
            setPendingTransactionAmount(0);
            setTransactionCompleted(true);
          } else {
            setWalletInfo(prev => ({
              ...prev,
              balance: prev.balance + prev.currentReward,
              currentBlock: newBlock,
            }));
          }
        }

        setError(null); // Fehler zurücksetzen
      } catch (err) {
        console.error("Mining-Fehler:", err);
        setError("Bei der Bestätigung der Transaktion ist ein Fehler aufgetreten. Bitte versuche es erneut.");
      } finally {
        setShowMiningAnimation(false);
        setIsAnimating(false);
      }
    }, 1000);
  }, [isAnimating, chainBlocks, walletInfo, pendingTransactionAmount, txIdFromCombined]);

  if (showCombinedPage) {
    return (
      <CombinedTransactionWalletsPage 
        satoshiBalance={walletInfo.balance} 
        onBack={(txId?: string, amount?: number) => {
          if (txId && amount) {
            setTxIdFromCombined(txId);
            setPendingTransactionAmount(amount);
          }
          setShowCombinedPage(false);
        }}
        halBalance={walletInfo.halBalance}
      />
    );
  }

  return (
    <div className={styles.page}>
      {/* Intro Section - nur anzeigen, wenn weder Mining noch Transaktion läuft */}
      {!pendingTransactionAmount && !miningResult && (
        <section className={styles.introSection}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Transaktionen</h1>
            <p className={styles.subtitle}>
              <strong>Bitcoin-Transaktionen</strong> ermöglichen den direkten Transfer von Werten ohne Zwischenhändler. Sie werden durch digitale Signaturen gesichert und von Minern in Blöcken bestätigt.
            </p>
            <p>
              Transaktionen sind die Sprache des Bitcoin-Netzwerks. Mit ihnen kommunizieren Nutzer 
              Wertübertragungen von einer Adresse zur anderen. Jede Transaktion wird in einen Block 
              aufgenommen und von allen Nodes im Netzwerk validiert.
            </p>
            <p>
              In dieser Simulation sendest du Bitcoin von Satoshi´s Wallet an Hal´s Wallet 
              und siehst, wie diese Transaktion in der Blockchain bestätigt wird.
            </p>
          </motion.div>
        </section>
      )}

      {/* Wallets-Sektion - IMMER sichtbar */}
      <section className={styles.walletsSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className={styles.walletsContainer}>
            <div className={styles.walletCard}>
              <h3>Satoshi's Wallet</h3>
              <p className={styles.walletAddress}>{satoshiAddress}</p>
              <div className={styles.walletBalance}>
                <strong>{walletInfo.balance} BTC</strong>
                {pendingTransactionAmount > 0 && (
                  <span className={styles.pendingOutgoing}>
                    -<motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
                      {pendingTransactionAmount}
                    </motion.span> BTC ausstehend
                  </span>
                )}
              </div>
            </div>
            
            <div className={styles.transactionArrow}>
              {pendingTransactionAmount > 0 && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={styles.arrowWithAmount}
                >
                  <span className={styles.txAmount}>{pendingTransactionAmount} BTC</span>
                  <FaArrowRight className={styles.arrow} />
                </motion.div>
              )}
            </div>
            
            <div className={styles.walletCard}>
              <h3>Hal's Wallet</h3>
              <p className={styles.walletAddress}>{halAddress}</p>
              <div className={styles.walletBalance}>
                <strong>{walletInfo.halBalance} BTC</strong>
                {pendingTransactionAmount > 0 && (
                  <span className={styles.pendingIncoming}>
                    +<motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
                      {pendingTransactionAmount}
                    </motion.span> BTC ausstehend
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {pendingTransactionAmount > 0 && (
          <section className={styles.pendingTxSection}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={styles.pendingTransaction}
            >
              <h3><FaSpinner className={styles.spinningIcon} /> Ausstehende Transaktion</h3>
              <p>
                <strong>{pendingTransactionAmount} BTC</strong> von <strong>{satoshiAddress}</strong> an <strong>{halAddress}</strong>
              </p>
              <p>Transaktion-ID: <span className={styles.txId}>{txIdFromCombined}</span></p>
              <p className={styles.pendingNote}>
                <FaInfoCircle /> Diese Transaktion wartet auf Bestätigung im nächsten Block
              </p>
            </motion.div>
          </section>
        )}
      </AnimatePresence>

      <section className={styles.actionSection}>
        {!miningResult ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className={styles.transactionActions}
          >
            {pendingTransactionAmount > 0 ? (
              <button 
                className={styles.mineButton} 
                onClick={simulateMining}
                disabled={isAnimating}
              >
                {isAnimating ? 'Mining läuft...' : 'Transaktion bestätigen (Mining)'}
              </button>
            ) : (
              <button 
                className={styles.actionButton} // Verwende die gleiche Klasse wie bei anderen Aktionsbuttons
                onClick={() => setShowCombinedPage(true)}
              >
                Transaktion erstellen
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`${styles.miningBlock} ${miningResult.found ? styles.foundAnimation : styles.notFoundAnimation}`}
          >
            <h2>Transaktion wird bestätigt</h2>
            
            <div className={styles.hashTarget}>
              <div className={styles.hashDisplay}>
                <strong>Block-Hash:</strong> 
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
                  0.9
                </span>
              </div>
            </div>
            
            {miningResult.found && pendingTransactionAmount > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className={styles.transactionConfirmation}
              >
                <div className={styles.confirmedTx}>
                  <FaCheck className={styles.confirmedIcon} />
                  <div className={styles.txConfirmDetails}>
                    <p><strong>{pendingTransactionAmount} BTC</strong> erfolgreich übertragen</p>
                    <p className={styles.txDetails}>
                      <span>Von: {satoshiAddress.substring(0, 6)}...{satoshiAddress.substring(satoshiAddress.length-3)}</span>
                      <span>An: {halAddress.substring(0, 6)}...{halAddress.substring(halAddress.length-3)}</span>
                    </p>
                    <p className={styles.txConfirmTime}>
                      Bestätigt im Block #{miningResult.blockNumber} • {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <p className={styles.miningStatus}>
              <strong>Status:</strong> {miningResult.found ? 
                "Block gefunden und Transaktion bestätigt! ✅" : 
                "Block nicht gefunden. Transaktion noch ausstehend. ❌"}
            </p>
            
            <div className={styles.blockButtons}>
              {/* Zeige "Mine" Button nur wenn kein Block gefunden wurde oder Mining läuft */}
              {(!miningResult.found || isAnimating) && (
                <button 
                  className={styles.mineButton} 
                  onClick={simulateMining}
                  disabled={isAnimating}
                >
                  {isAnimating ? 'Mining läuft...' : 'Erneut versuchen'}
                </button>
              )}
              
              {/* Zeige nur den "Weiter zum Halving" Button nach erfolgreicher Bestätigung */}
              {transactionCompleted && pendingTransactionAmount === 0 && (
                <button 
                  className={styles.actionButton}
                  onClick={onNext}
                >
                  Weiter
                </button>
              )}
            </div>
          </motion.div>
        )}
      </section>

      {!pendingTransactionAmount && !miningResult && (
        <section className={styles.informationSection}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
          </motion.div>
        </section>
      )}

      {showMiningAnimation && (
        <div className={styles.miningAnimation}>
          <div className={styles.spinner}></div>
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${miningProgress}%` }}
            ></div>
          </div>
          <p>Transaktion wird bestätigt...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          <FaExclamationCircle className={styles.errorIcon} />
          <p>{error}</p>
          <button onClick={() => setError(null)} className={styles.closeButton}>Schließen</button>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;