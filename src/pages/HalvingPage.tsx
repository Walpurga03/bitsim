import React, { useState, useEffect } from 'react';
import styles from '../styles/SatoshiPage.module.scss';
import HalvingExplanationPopup from '../components/HalvingExplanationPopup';
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

interface HalvingPageProps {
  onNext: () => void;
}

const HalvingPage: React.FC<HalvingPageProps> = ({ onNext }) => {
  const [miningResult, setMiningResult] = useState<MiningResult | null>(null);
  const [showHalvingPopup, setShowHalvingPopup] = useState(false);
  const [halvingExplanationShown, setHalvingExplanationShown] = useState(false);
  const [chainBlocks, setChainBlocks] = useState<MiningResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [walletInfo, setWalletInfo] = useState({
    balance: 210000 * 50, // Starting with accumulated balance from first epoch
    currentBlock: 210000, // Just after first halving
    currentReward: 25, // Reward after first halving
    totalMined: 0, // Blocks mined in this session
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
  
  // Initialize blockchain with blocks near halving
  useEffect(() => {
    setChainBlocks([
      { blockNumber: 209997, hash: "0.675026", nonce: 3481, target: "0.5", timestamp: "11/28/2012, 11:45:00 PM", transactions: "2 Transaktionen", merkleRoot: "5d7c3a", found: true },
      { blockNumber: 209998, hash: "0.621169", nonce: 6237, target: "0.5", timestamp: "11/28/2012, 11:50:00 PM", transactions: "3 Transaktionen", merkleRoot: "4c6b2d", found: true },
      { blockNumber: 209999, hash: "0.668168", nonce: 2983, target: "0.5", timestamp: "11/28/2012, 11:55:00 PM", transactions: "4 Transaktionen", merkleRoot: "8c4e2f", found: true },
      { blockNumber: 210000, hash: "0.559457", nonce: 5091, target: "0.5", timestamp: "11/29/2012, 12:00:00 AM", transactions: "1 Transaktion", merkleRoot: "7b3f1d", found: true },
      { blockNumber: 210001, hash: "0.607500", nonce: 4762, target: "0.5", timestamp: "11/29/2012, 12:05:00 AM", transactions: "5 Transaktionen", merkleRoot: "6a2e9b", found: true },
    ]);
  }, []);
  
  // Show halving explanation when the component mounts
  useEffect(() => {
    if (!halvingExplanationShown) {
      setShowHalvingPopup(true);
      setHalvingExplanationShown(true);
    }
  }, [halvingExplanationShown]);
  
  const simulateMining = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
    
    // Create timestamp - set in 2012 for the first halving
    const now = new Date();
    now.setFullYear(2012);
    now.setMonth(11); // December (0-indexed)
    now.setDate(Math.floor(Math.random() * 5) + 1); // 1-5 December 2012
    const timestamp = now.toLocaleString();
    
    // Create transaction information
    const txCount = Math.floor(Math.random() * 5) + 1;
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
      // Use slightly higher difficulty after halving
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
        
        setWalletInfo(prev => ({
          ...prev,
          balance: prev.balance + prev.currentReward,
          currentBlock: newBlock,
          totalMined: prev.totalMined + 1,
        }));
      }
      
      document.body.removeChild(miningAnimation);
    }, 1000);
  };
  
  // Determine which blocks to display based on screen size
  const blocksToDisplay = isMobile ? chainBlocks.slice(-2) : chainBlocks;
  
  return (
    <div className={styles.page}>
      <div className={styles.introSection}>
        <h1>Block-Belohnung & Halving</h1>
        <p>
          Alle 210.000 Blöcke (etwa alle vier Jahre) halbiert sich die Block-Belohnung für Miner.
          Dieses "Halving" ist ein zentraler Mechanismus von Bitcoin, um die Inflation zu kontrollieren
          und die maximale Anzahl von 21 Millionen Bitcoin zu garantieren.
        </p>
        <p>
          Wir befinden uns jetzt nach dem ersten Halving. Die Belohnung wurde von 50 BTC auf 25 BTC pro Block reduziert.
          Dies macht das Mining weniger profitabel, aber der langfristige Werterhalt von Bitcoin wird dadurch gestärkt.
        </p>
        <button className={styles.nextButton} onClick={() => setShowHalvingPopup(true)}>
          Halving erklärt bekommen
        </button>
      </div>
          
      {/* Wallet display area */}
      <div className={styles.walletsContainer}>
        <div className={styles.walletCard}>
          <h2>Satoshi's Wallet</h2>
          <p><strong>Adresse:</strong> {satoshiAddress}</p>
          <p><strong>Balance:</strong> {walletInfo.balance} BTC</p>
        </div>
      </div>
      
      {/* Mining status with epoch information */}
      <div className={styles.miningStatus}>
        <p><strong>Block:</strong> {walletInfo.currentBlock}</p>
        <p><strong>Belohnung:</strong> {walletInfo.currentReward} BTC</p>
        <p><strong>Epoche:</strong> 2 (nach erstem Halving)</p>
        <p><strong>In dieser Sitzung gemint:</strong> {walletInfo.totalMined} Blöcke</p>
      </div>
      
      {/* Visual comparison of old vs new reward */}
      <div className={styles.rewardComparison}>
        <div className={styles.oldReward}>
          <h3>Vorherige Belohnung</h3>
          <div className={styles.rewardAmount}>50 BTC</div>
        </div>
        <div className={styles.arrow}>→</div>
        <div className={styles.newReward}>
          <h3>Aktuelle Belohnung</h3>
          <div className={styles.rewardAmount}>25 BTC</div>
        </div>
      </div>
      
      {/* Blockchain display at top */}
      {chainBlocks.length > 0 && (
        <div className={styles.blockchainDisplay}>
          {blocksToDisplay.map(block => {
            const previous = chainBlocks.find(b => b.blockNumber === (block.blockNumber - 1));
            let prevDisplay = previous ? previous.hash.toString() : `Block ${block.blockNumber - 1}`;
            const isHalvingBlock = block.blockNumber === 210000;
            
            return (
              <div key={block.blockNumber} className={`${styles.block} ${isHalvingBlock ? styles.halvingBlock : ''}`}>
                <p><strong>Block {block.blockNumber}</strong>{isHalvingBlock && " (Halving)"}</p>
                <p>Hash: {block.hash}</p>
                <p>Last: {prevDisplay}</p>
                {isHalvingBlock && (
                  <div className={styles.halvingIndicator}>
                    Belohnung halbiert!
                  </div>
                )}
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
            "Block gefunden! ✅ Du erhältst eine Belohnung von 25 BTC!" : 
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
              Simulation abschließen
            </button>
          </div>
        </div>
      )}
      
      {/* Popups */}
      {showHalvingPopup && (
        <HalvingExplanationPopup onClose={() => {
          setShowHalvingPopup(false);
          setHalvingExplanationShown(true);
        }} />
      )}
      
      {/* Additional information about future halvings */}
      <div className={styles.futureHalvings}>
        <h3>Zukünftige Halvings</h3>
        <ul>
          <li>2. Halving bei Block 420.000: 12,5 BTC Belohnung</li>
          <li>3. Halving bei Block 630.000: 6,25 BTC Belohnung</li>
          <li>4. Halving bei Block 840.000: 3,125 BTC Belohnung</li>
        </ul>
        <p>
          Durch diesen Mechanismus wird die maximale Anzahl von Bitcoin auf 21 Millionen begrenzt,
          was Bitcoin zu einem knappen Gut macht.
        </p>
      </div>
    </div>
  );
};

export default HalvingPage;
