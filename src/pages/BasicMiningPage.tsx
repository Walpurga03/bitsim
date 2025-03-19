import React, { useState, useEffect } from 'react';
import styles from '../styles/SatoshiPage.module.scss';
import MiningExplanationPopup from '../components/MiningExplanationPopup';
import { mineBlock, DIFFICULTY_LEVELS } from '../utils/miningUtils';
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
  const [showMiningProcess, setShowMiningProcess] = useState(false);
  
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
    setShowMiningProcess(true);
    
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
      
      setIsAnimating(false);
      document.body.removeChild(miningAnimation);
      
      // Hide mining process after result
      setTimeout(() => {
        setShowMiningProcess(false);
      }, 2000);
    }, 3000);
  };
  
  // Determine which blocks to display based on screen size
  const blocksToDisplay = isMobile ? chainBlocks.slice(-2) : chainBlocks;
  
  return (
    <div className={styles.page}>
      {!miningStarted ? (
        <div className={styles.introSection}>
          <h1 className={styles.title}>Mining: Der Herzschlag von Bitcoin</h1>
          <p className={styles.description}>
            Mining ist der Prozess, bei dem neue Bitcoin-Blöcke erzeugt und Transaktionen bestätigt werden. 
            Als Miner wirst du ein mathematisches Rätsel lösen, um einen neuen Block zur Blockchain hinzuzufügen.
          </p>
          
          <div className={styles.miningInfoBox}>
            <h3><FaInfoCircle className={styles.infoIcon} /> So funktioniert Mining:</h3>
            <ol className={styles.miningStepsList}>
              <li>Das Netzwerk sammelt neue Transaktionen in einem Pool</li>
              <li>Du als Miner wählst Transaktionen aus und formst einen Block</li>
              <li>Du versuchst, einen speziellen Zahlenwert (Nonce) zu finden, der einen gültigen Block-Hash erzeugt</li>
              <li>Der Hash muss unter einem bestimmten Zielwert (Target) liegen</li>
              <li>Bei Erfolg erhältst du eine Belohnung in Bitcoin</li>
            </ol>
          </div>
          
          <button className={styles.nextButton} onClick={() => setMiningStarted(true)}>
            Mining starten
          </button>
        </div>
      ) : (
        <>
          {/* Wallet display area */}
          <div className={styles.walletsContainer}>
            <div className={styles.walletCard}>
              <h2>Deine Mining-Wallet</h2>
              <p><strong>Adresse:</strong> {satoshiAddress}</p>
              <p><strong>Balance:</strong> {walletInfo.balance} BTC</p>
              <p><strong>Block-Höhe:</strong> {walletInfo.currentBlock}</p>
              <p><strong>Mining-Belohnung:</strong> {walletInfo.currentReward} BTC pro Block</p>
            </div>
          </div>
          {/* Blockchain display at top */}
          <div className={styles.visualBlockchain}>
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
                    <div key={block.blockNumber} className={`${styles.block} ${idx === blocksToDisplay.length - 1 ? styles.latestBlock : ''}`}>
                      <p className={styles.blockHeader}><strong>Block {block.blockNumber}</strong></p>
                      <div className={styles.blockDetails}>
                        <p>Hash: <span className={styles.blockHash}>{block.hash}</span></p>
                        <p>Last: <span className={styles.blockPrev}>{prevDisplay.substring(0, 8)}</span></p>
                        <p>Nonce: <span className={styles.blockNonce}>{block.nonce}</span></p>
                      </div>
                      {idx < blocksToDisplay.length - 1 && (
                        <div className={styles.blockLink}>
                          <FaAngleDoubleDown />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          {/* Mining interface */}
          {!miningResult ? (
            <div className={styles.miningControls}>
              <button 
                className={styles.mineButton} 
                onClick={simulateMining}
                disabled={isAnimating}
              >
                {isAnimating ? 'Mining läuft...' : 'Block minen'}
              </button>
              
              <div className={styles.difficultyInfo}>
                <p>Aktuelle Schwierigkeit: <span className={styles.difficultyLevel}>Leicht</span></p>
                <p>Target: <span className={styles.targetValue}>1</span></p>
                <p className={styles.difficultyHint}>
                  <FaInfoCircle className={styles.infoIcon} /> 
                  Dein Hash muss kleiner als das Target sein
                </p>
              </div>
            </div>
          ) : (
            <div className={`${styles.miningBlock} ${miningResult.found ? styles.foundAnimation : styles.notFoundAnimation}`}>
              <h2>{miningResult.found ? 'Block erfolgreich gemint!' : 'Mining fehlgeschlagen'}</h2>
              <div className={styles.hashTarget}>
                <div className={styles.hashDisplay}>
                  <strong>Dein Hash:</strong> 
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
              
              <div className={styles.miningDetails}>
                <div className={styles.miningDetailItem}>
                  <p><strong>Nonce:</strong> {miningResult.nonce}</p>
                  <p className={styles.nonceExplanation}>
                    Die "Nonce" ist der Wert, den der Miner bei jedem Versuch ändert
                  </p>
                </div>
                
                <div className={styles.miningDetailItem}>
                  <p><strong>Zeitstempel:</strong> {miningResult.timestamp}</p>
                </div>
                
                <div className={styles.miningDetailItem}>
                  <p><strong>Transaktionen:</strong> {miningResult.transactions}</p>
                </div>
                
                <div className={styles.miningDetailItem}>
                  <p><strong>Merkle-Root:</strong> {miningResult.merkleRoot}</p>
                </div>
              </div>
              
              <div className={styles.miningResult}>
                <p className={styles.miningStatus}>
                  <strong>Status:</strong> {miningResult.found ? 
                    "Block gefunden! ✅ Du erhältst eine Belohnung von 50 BTC!" : 
                    "Block nicht gefunden ❌ Dein Hash ist zu groß - versuche es erneut!"}
                </p>
              </div>
              
              <div className={styles.blockButtons}>
                <button 
                  className={styles.mineButton} 
                  onClick={simulateMining}
                  disabled={isAnimating}
                >
                  {isAnimating ? 'Mining läuft...' : miningResult.found ? 'Nächsten Block minen' : 'Erneut versuchen'}
                </button>
                
                {walletInfo.currentBlock >= 5 && (
                  <button className={styles.nextButton} onClick={onNext}>
                    Weiter zum Netzwerk
                  </button>
                )}
              </div>
            </div>
          )}
              {/* Mining animation indicator */}
              {showMiningProcess && (
            <div className={styles.miningProcessVisualizer}>
              <div className={styles.miningAnimation}>
                <div className={styles.miningIcon}>
                  <FaHammer className={styles.hammer} />
                </div>
                <div className={styles.miningProgress}>
                  <div className={styles.miningProgressBar}></div>
                </div>
                <p>Suche nach gültigem Hash...</p>
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
