import React, { useState, useEffect } from 'react';
import styles from '../styles/SatoshiPage.module.scss'; // Aktualisierter Pfad
import NodeExplanationPopup from '../components/NodeExplanationPopup';
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

interface NodeNetworkPageProps {
  onNext: () => void;
}

const NodeNetworkPage: React.FC<NodeNetworkPageProps> = ({ onNext }) => {
  const [miningResult, setMiningResult] = useState<MiningResult | null>(null);
  const [showNodePopup, setShowNodePopup] = useState(false);
  const [nodeExplanationShown, setNodeExplanationShown] = useState(false);
  const [chainBlocks, setChainBlocks] = useState<MiningResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [walletInfo, setWalletInfo] = useState({
    balance: 250, // Starting with 5 blocks (5 * 50 BTC)
    currentBlock: 5,
    currentReward: 50,
  });
  const [isMobile, setIsMobile] = useState(false);
  
  const satoshiAddress = "1SatoshiPioneerXXX";
  
  // Handle responsive view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Show node explanation when the component mounts
  useEffect(() => {
    if (!nodeExplanationShown) {
      setShowNodePopup(true);
    }
  }, [nodeExplanationShown]);
  
  // Initialize blockchain with initial blocks
  useEffect(() => {
    setChainBlocks([
      { blockNumber: 1, hash: "0.175026", nonce: 2481, target: "1", timestamp: "9/1/2009, 12:00:00 AM", transactions: "Genesis Block", merkleRoot: "4a5e1e", found: true },
      { blockNumber: 2, hash: "0.21169", nonce: 1237, target: "1", timestamp: "9/1/2009, 12:15:00 AM", transactions: "1 Transaktion", merkleRoot: "9d0c1e", found: true },
      { blockNumber: 3, hash: "0.68168", nonce: 983, target: "1", timestamp: "9/1/2009, 12:30:00 AM", transactions: "2 Transaktionen", merkleRoot: "8c4e2f", found: true },
      { blockNumber: 4, hash: "0.159457", nonce: 3091, target: "1", timestamp: "9/1/2009, 12:45:00 AM", transactions: "1 Transaktion", merkleRoot: "7b3f1d", found: true },
      { blockNumber: 5, hash: "0.207500", nonce: 1762, target: "1", timestamp: "9/1/2009, 1:00:00 AM", transactions: "3 Transaktionen", merkleRoot: "6a2e9b", found: true },
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
      // Use EASY difficulty
      const difficulty = DIFFICULTY_LEVELS.EASY;
      
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
        
        setWalletInfo(prev => ({
          ...prev,
          balance: prev.balance + prev.currentReward,
          currentBlock: newBlock,
        }));
      }
      
      document.body.removeChild(miningAnimation);
    }, 1000);
  };
  
  // Determine which blocks to display based on screen size
  const blocksToDisplay = isMobile ? chainBlocks.slice(-2) : chainBlocks;
  
  return (
    <div className={styles.page}>
      {/* Aktualisierter Intro-Bereich */}
      <div className={styles.introSection}>
        <h1 className={styles.title}>Das Bitcoin-Netzwerk</h1>
        <p className={styles.description}>
          Das Netzwerk wächst stetig: Immer mehr Nodes speichern die Blockchain und validieren neue Blöcke.
          Jeder Node trägt zur Dezentralisierung bei, was Bitcoin gegen Manipulationen schützt.
        </p>
      </div>
      
      {/* Wallet display area */}
      <div className={styles.walletsContainer}>
        <div className={styles.walletCard}>
          <h2>Satoshi's Wallet</h2>
          <p><strong>Adresse:</strong> {satoshiAddress}</p>
          <p><strong>Balance:</strong> {walletInfo.balance} BTC</p>
        </div>
      </div>
      
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
            let prevDisplay = previous ? previous.hash.toString() : (block.blockNumber > 1 ? `Block ${block.blockNumber - 1}` : "XXXX");
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
        <button 
          className={styles.mineButton} 
          onClick={simulateMining}
          disabled={isAnimating}
        >
          {isAnimating ? 'Mining läuft...' : 'Block minen'}
        </button>
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
            "Block gefunden! ✅ Du erhältst eine Belohnung!" : 
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
              Zur Schwierigkeitsanpassung
            </button>
          </div>
        </div>
      )}
      
      {/* Popups */}
      {showNodePopup && (
        <NodeExplanationPopup onClose={() => {
          setShowNodePopup(false);
          setNodeExplanationShown(true);
        }} />
      )}
    </div>
  );
};

export default NodeNetworkPage;
