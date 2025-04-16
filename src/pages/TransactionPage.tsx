import React, { useState, useEffect } from 'react';
import styles from '../styles/TransactionPage.module.scss';
import walletStyles from '../styles/components/WalletCard.module.scss'; // Importiere die Wallet-Stile
import TransactionExplanationPopup from '../components/TransactionExplanationPopup';
import CombinedTransactionWalletsPage from './CombinedTransactionWalletsPage';
import { mineBlock, DIFFICULTY_LEVELS } from '../utils/miningUtils';
import { FaInfoCircle, FaArrowRight, FaCheck, FaSpinner } from 'react-icons/fa';

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
  const [showTransactionPopup, setShowTransactionPopup] = useState(false);
  const [transactionExplanationShown, setTransactionExplanationShown] = useState(false);
  const [showCombinedPage, setShowCombinedPage] = useState(false);
  const [chainBlocks, setChainBlocks] = useState<MiningResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [walletInfo, setWalletInfo] = useState({
    balance: 2016 * 50, // Starting with blocks up to 2016 (including the difficulty adjustment)
    hallBalance: 0,
    currentBlock: 2016,
    currentReward: 50,
  });
  const [txIdFromCombined, setTxIdFromCombined] = useState<string>('');
  const [pendingTransactionAmount, setPendingTransactionAmount] = useState<number>(0);
  const [transactionCompleted, setTransactionCompleted] = useState(false);
  
  const satoshiAddress = "1SatoshiPioneerXXX";
  const hallAddress = "1HallLegendeXXX";
  
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
  
  // Show transaction explanation when the component mounts
  useEffect(() => {
    if (!transactionExplanationShown) {
      setShowTransactionPopup(true);
    }
  }, [transactionExplanationShown]);
  
  const simulateMining = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
    
    // Create timestamp
    const now = new Date();
    now.setFullYear(now.getFullYear() - 16);
    const timestamp = now.toLocaleString();
    
    // Create transaction information
    // If there's a pending transaction, mention it explicitly
    let transactions: string;
    if (pendingTransactionAmount > 0) {
      transactions = `1 Transaktion (${pendingTransactionAmount} BTC an ${hallAddress})`;
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
    
    // Mining animation
    const miningAnimation = document.createElement('div');
    miningAnimation.className = styles.miningAnimation;
    document.body.appendChild(miningAnimation);
    
    // Mining with timeout
    setTimeout(() => {
      // Use MEDIUM difficulty (after difficulty adjustment)
      const difficulty = DIFFICULTY_LEVELS.MEDIUM;
      
      // Perform mining with specified difficulty
      const result = mineBlock(blockData, difficulty);
      
      // Create new block object
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
      
      // Only if a block was found (hash < target), update the chain
      if (result.found) {
        setChainBlocks(prev => {
          const newChain = [...prev, newBlockData];
          while (newChain.length > 5) {
            newChain.shift();
          }
          return newChain;
        });
        
        // Handle pending transaction if any
        if (pendingTransactionAmount > 0) {
          setWalletInfo(prev => ({
            ...prev,
            balance: prev.balance + prev.currentReward - pendingTransactionAmount,
            hallBalance: prev.hallBalance + pendingTransactionAmount,
            currentBlock: newBlock,
          }));
          setTxIdFromCombined('');
          setPendingTransactionAmount(0);
          setTransactionCompleted(true); // Markiere, dass mindestens eine Transaktion abgeschlossen wurde
        } else {
          setWalletInfo(prev => ({
            ...prev,
            balance: prev.balance + prev.currentReward,
            currentBlock: newBlock,
          }));
        }
      }
      
      document.body.removeChild(miningAnimation);
    }, 1000);
  };
  
  // Handle navigation to combined page
  if (showCombinedPage) {
    return (
      <CombinedTransactionWalletsPage 
        satoshiBalance={walletInfo.balance} 
        onBack={(txId?: string, amount?: number) => {
          // Wenn eine Transaktion durchgeführt wurde, aktualisiere den Hall-Saldo
          if (txId && amount) {
            setTxIdFromCombined(txId);
            setPendingTransactionAmount(amount);
            // Hall-Balance bleibt erhalten, da sie erst nach Mining aktualisiert wird
          }
          setShowCombinedPage(false);
        }}
        // Übergib den aktuellen Hall-Saldo als Prop
        hallBalance={walletInfo.hallBalance}
      />
    );
  }
  
  return (
    <div className={styles.page}>
      <div className={styles.introSection}>
        <h1>Transaktionen</h1>
        <p>
          Transaktionen sind der Kern des Bitcoin-Netzwerks. Sie ermöglichen es Benutzern,
          Bitcoin von einer Adresse zu einer anderen zu senden. Jede Transaktion wird in einen Block
          aufgenommen und von allen Nodes im Netzwerk validiert.
        </p>
        <p>
          In dieser Simulation sendest du Bitcoin von Satoshis Wallet an Halls Wallet
          und siehst, wie diese Transaktion in der Blockchain bestätigt wird.
        </p>
      </div>
      
      {/* Verbesserte Wallet-Anzeige mit Transaktionsstatus - jetzt mit korrekten Styles */}
      <div className={walletStyles.walletsContainer}>
        <div className={walletStyles.walletCard}>
          <h2>Satoshi's Wallet</h2>
          <p><strong>Adresse:</strong> {satoshiAddress}</p>
          <p><strong>Balance:</strong> {walletInfo.balance} BTC</p>
          <div className={walletStyles.walletStatus}>
            {pendingTransactionAmount > 0 && <span className={walletStyles.outgoingTx}>-{pendingTransactionAmount} BTC ausstehend</span>}
          </div>
        </div>
        <div className={styles.transactionArrow}>
          {pendingTransactionAmount > 0 && (
            <>
              <div className={styles.pendingAmount}>{pendingTransactionAmount} BTC</div>
              <FaArrowRight className={styles.arrowIcon} />
            </>
          )}
        </div>
        <div className={walletStyles.walletCard}>
          <h2>Hall's Wallet</h2>
          <p><strong>Adresse:</strong> {hallAddress}</p>
          <p><strong>Balance:</strong> {walletInfo.hallBalance} BTC</p>
          <div className={walletStyles.walletStatus}>
            {pendingTransactionAmount > 0 && <span className={walletStyles.incomingTx}>+{pendingTransactionAmount} BTC ausstehend</span>}
          </div>
        </div>
      </div>
      
      {/* Verbesserte Anzeige für ausstehende Transaktionen */}
      {pendingTransactionAmount > 0 && (
        <div className={styles.pendingTransaction}>
          <h3><FaSpinner className={styles.spinningIcon} /> Ausstehende Transaktion</h3>
          <p>
            <strong>{pendingTransactionAmount} BTC</strong> von <strong>{satoshiAddress}</strong> an <strong>{hallAddress}</strong>
          </p>
          <p>Transaktion-ID: <span className={styles.txId}>{txIdFromCombined}</span></p>
          <p className={styles.pendingNote}>
            <FaInfoCircle /> Diese Transaktion wartet auf Bestätigung im nächsten Block
          </p>
        </div>
      )}

        {/* Mining interface */}
        {!miningResult ? (
        <div className={styles.transactionActions}>
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
              className={styles.createTxButton} 
              onClick={() => setShowCombinedPage(true)}
            >
              Neue Transaktion erstellen
            </button>
          )}
        </div>
      ) : (
        <div className={`${styles.miningBlock} ${miningResult.found ? styles.foundAnimation : styles.notFoundAnimation}`}>
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
          
          {/* Verbesserte Transaktionsbestätigung */}
          <div className={styles.transactionConfirmation}>
            {miningResult.found && pendingTransactionAmount > 0 && (
              <div className={styles.confirmedTx}>
                <FaCheck className={styles.confirmedIcon} />
                <div className={styles.txConfirmDetails}>
                  <p><strong>{pendingTransactionAmount} BTC</strong> erfolgreich übertragen</p>
                  <p className={styles.txDetails}>
                    <span>Von: {satoshiAddress.substring(0, 6)}...{satoshiAddress.substring(satoshiAddress.length-3)}</span>
                    <span>An: {hallAddress.substring(0, 6)}...{hallAddress.substring(hallAddress.length-3)}</span>
                  </p>
                  <p className={styles.txConfirmTime}>
                    Bestätigt im Block #{miningResult.blockNumber} • {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <p className={styles.miningStatus}>
            <strong>Status:</strong> {miningResult.found ? 
              "Block gefunden und Transaktion bestätigt! ✅" : 
              "Block nicht gefunden. Transaktion noch ausstehend. ❌"}
          </p>
          
          <div className={styles.blockButtons}>
            <button 
              className={styles.mineButton} 
              onClick={simulateMining}
              disabled={isAnimating}
            >
              {isAnimating ? 'Mining läuft...' : 
                miningResult.found ? 'Nächsten Block minen' : 'Erneut versuchen'}
            </button>
            
            {miningResult.found && (
              <button 
                className={styles.createTxButton}
                onClick={() => setShowCombinedPage(true)}
              >
                Neue Transaktion erstellen
              </button>
            )}
            
            {/* Nur anzeigen, wenn mindestens eine Transaktion erfolgreich bestätigt wurde */}
            {transactionCompleted && pendingTransactionAmount === 0 && (
              <button className={styles.nextButton} onClick={onNext}>
                Weiter zum Mempool
              </button>
            )}
          </div>
        </div>
      )}
      
      
      {/* Popups */}
      {showTransactionPopup && (
        <TransactionExplanationPopup onClose={() => {
          setShowTransactionPopup(false);
          setTransactionExplanationShown(true);
          setShowCombinedPage(true);
        }} />
      )}
    </div>
  );
};

export default TransactionPage;