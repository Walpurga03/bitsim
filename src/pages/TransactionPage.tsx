import React, { useState, useEffect } from 'react';
import styles from '../styles/SatoshiPage.module.scss'; // Aktualisierter Pfad
import TransactionExplanationPopup from '../components/TransactionExplanationPopup';
import CombinedTransactionWalletsPage from './CombinedTransactionWalletsPage';
import { mineBlock, DIFFICULTY_LEVELS } from '../utils/miningUtils';

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
  const [isMobile, setIsMobile] = useState(false);
  const [txIdFromCombined, setTxIdFromCombined] = useState<string>('');
  const [pendingTransactionAmount, setPendingTransactionAmount] = useState<number>(0);
  
  const satoshiAddress = "1SatoshiPioneerXXX";
  const hallAddress = "1HallLegendeXXX";
  
  // Handle responsive view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Initialize blockchain with blocks after difficulty adjustment
  useEffect(() => {
    setChainBlocks([
      { blockNumber: 2012, hash: "0.668168", nonce: 2983, target: "0.7", timestamp: "9/29/2009, 12:30:00 AM", transactions: "3 Transaktionen", merkleRoot: "8c4e2f", found: true },
      { blockNumber: 2013, hash: "0.559457", nonce: 5091, target: "0.7", timestamp: "9/29/2009, 12:45:00 AM", transactions: "2 Transaktionen", merkleRoot: "7b3f1d", found: true },
      { blockNumber: 2014, hash: "0.607500", nonce: 4762, target: "0.7", timestamp: "9/29/2009, 1:00:00 AM", transactions: "4 Transaktionen", merkleRoot: "6a2e9b", found: true },
      { blockNumber: 2015, hash: "0.675026", nonce: 3481, target: "0.7", timestamp: "9/29/2009, 1:15:00 AM", transactions: "1 Transaktion", merkleRoot: "5d7c3a", found: true },
      { blockNumber: 2016, hash: "0.621169", nonce: 6237, target: "0.7", timestamp: "9/29/2009, 1:30:00 AM", transactions: "3 Transaktionen", merkleRoot: "4c6b2d", found: true },
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
  
  // Determine which blocks to display based on screen size
  const blocksToDisplay = isMobile ? chainBlocks.slice(-2) : chainBlocks;
  
  // Handle navigation to combined page
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
          In dieser Simulation können Sie Bitcoin von Satoshi's Wallet an Hall's Wallet senden
          und sehen, wie diese Transaktion in einem Block bestätigt wird.
        </p>
      </div>
          
      {/* Wallet display area showing both wallets */}
      <div className={styles.walletsContainer}>
        <div className={styles.walletCard}>
          <h2>Satoshi's Wallet</h2>
          <p><strong>Adresse:</strong> {satoshiAddress}</p>
          <p><strong>Balance:</strong> {walletInfo.balance} BTC</p>
        </div>
        <div className={styles.walletCard}>
          <h2>Hall's Wallet</h2>
          <p><strong>Adresse:</strong> {hallAddress}</p>
          <p><strong>Balance:</strong> {walletInfo.hallBalance} BTC</p>
        </div>
      </div>
      
      {/* Transaction pending information */}
      {pendingTransactionAmount > 0 && (
        <div className={styles.pendingTransaction}>
          <h3>Ausstehende Transaktion</h3>
          <p><strong>Von:</strong> {satoshiAddress}</p>
          <p><strong>An:</strong> {hallAddress}</p>
          <p><strong>Betrag:</strong> {pendingTransactionAmount} BTC</p>
          <p><strong>Transaktions-ID:</strong> {txIdFromCombined}</p>
          <p><strong>Status:</strong> Wartet auf Bestätigung im nächsten Block</p>
        </div>
      )}
      
      {/* Mining status */}
      <div className={styles.miningStatus}>
        <p><strong>Block:</strong> {walletInfo.currentBlock}</p>
        <p><strong>Belohnung:</strong> {walletInfo.currentReward} BTC</p>
      </div>
      
      {/* Blockchain display at top */}
      {chainBlocks.length > 0 && (
        <div className={styles.blockchainDisplay}>
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
      )}
      
      {/* Mining interface */}
      {!miningResult ? (
        <div className={styles.transactionActions}>
          <button 
            className={styles.mineButton} 
            onClick={simulateMining}
            disabled={isAnimating}
          >
            {isAnimating ? 'Mining läuft...' : 'Block minen'}
          </button>
        </div>
      ) : (
        <div className={`${styles.miningBlock} ${miningResult.found ? styles.foundAnimation : styles.notFoundAnimation}`}>
          <h2>Mining Block</h2>
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
                <div className={styles.difficultyLabel}>
                  {Object.entries(DIFFICULTY_LEVELS).find(
                    ([value]) => Math.abs(parseFloat(value.toString()) - parseFloat(miningResult.target)) < 0.01
                  )?.[0] || ''}
                </div>
              </span>
            </div>
          </div>
          
          <p><strong>Nonce:</strong> {miningResult.nonce}</p>
          <p><strong>Zeitstempel:</strong> {miningResult.timestamp}</p>
          <p><strong>Transaktionen:</strong> {miningResult.transactions}</p>
          <p><strong>Merkle-Root:</strong> {miningResult.merkleRoot}</p>
          <p><strong>Status:</strong> {miningResult.found ? 
            `Block gefunden! ✅ ${pendingTransactionAmount > 0 ? "Transaktion bestätigt!" : "Du erhältst eine Belohnung!"}` : 
            "Block nicht gefunden ❌ Versuche es erneut!"}
          </p>
          
          <div className={styles.blockButtons}>
            <button 
              className={styles.mineButton} 
              onClick={simulateMining}
              disabled={isAnimating}
            >
              {isAnimating ? 'Mining läuft...' : miningResult.found ? 'Nächster Block' : 'Erneut versuchen'}
            </button>
            <button className={styles.nextButton} onClick={onNext}>
              Zum Halving
            </button>
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