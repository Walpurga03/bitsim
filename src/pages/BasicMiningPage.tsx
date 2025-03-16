import React, { useState, useEffect } from 'react';
import styles from '../styles/SatoshiPage.module.scss'; // Aktualisierter Pfad
import MiningExplanationPopup from '../components/MiningExplanationPopup';
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

interface BasicMiningPageProps {
  onNext: () => void;
}

const BasicMiningPage: React.FC<BasicMiningPageProps> = ({ onNext }) => {
  const [miningStarted, setMiningStarted] = useState(false);
  const [miningResult, setMiningResult] = useState<MiningResult | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [preMiningExplanationShown, setPreMiningExplanationShown] = useState(false);
  const [chainBlocks, setChainBlocks] = useState<MiningResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [walletInfo, setWalletInfo] = useState({
    balance: 0,
    currentBlock: 0,
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
  
  // Show mining explanation when first starting
  useEffect(() => {
    if (miningStarted && !preMiningExplanationShown) {
      setShowPopup(true);
      setPreMiningExplanationShown(true);
    }
  }, [miningStarted, preMiningExplanationShown]);
  
  // Move to next page when we reach certain blocks
  useEffect(() => {
    if (walletInfo.currentBlock >= 5) {
      // Can automatically move to next page or show button
    }
  }, [walletInfo.currentBlock]);
  
  const simulateMining = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
    
    // Create timestamp
    const now = new Date();
    now.setFullYear(now.getFullYear() - 16);
    const timestamp = now.toLocaleString();
    
    // Create transaction information
    let transactions: string;
    if (walletInfo.currentBlock + 1 === 1) {
      transactions = "Genesis Block - Keine Transaktionen";
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
      {!miningStarted ? (
        <div className={styles.introSection}>
          <h1 className={styles.title}>Mining Demonstration</h1>
          <p className={styles.description}>
            Im Mining lösen Sie ein mathematisches Puzzle, um einen neuen Block zur Blockchain hinzuzufügen.
            Hier erfahren Sie live, wie Ihr Rechner einen gültigen Block findet und für seine Arbeit belohnt wird.
          </p>
          <button className={styles.nextButton} onClick={() => setMiningStarted(true)}>
            Mining starten
          </button>
        </div>
      ) : (
        <>
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
                {walletInfo.currentBlock >= 5 && (
                  <button className={styles.nextButton} onClick={onNext}>
                    Weiter zum Netzwerk
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Popups */}
      {showPopup && <MiningExplanationPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default BasicMiningPage;
