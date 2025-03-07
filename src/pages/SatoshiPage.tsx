import React, { useState, useEffect } from 'react';
import styles from './SatoshiPage.module.scss';
import MiningExplanationPopup from '../components/MiningExplanationPopup';
import NodeExplanationPopup from '../components/NodeExplanationPopup';
import DifficultyAdjustmentPopup from '../components/DifficultyAdjustmentPopup';
import TransactionExplanationPopup from '../components/TransactionExplanationPopup';
import CombinedTransactionWalletsPage from './CombinedTransactionWalletsPage';
import HalvingExplanationPopup from '../components/HalvingExplanationPopup';
import { mineBlock, DIFFICULTY_LEVELS } from '../utils/miningUtils';

interface MiningResult {
  hash: string; // Ändern von number zu string für hexadezimale Hash-Darstellung
  nonce: number;
  target: string; // Ändern zu string, um Ziel mit führenden Nullen darzustellen
  timestamp: string;
  transactions: string;
  merkleRoot: string;
  found: boolean;
  blockNumber: number;
}

interface WalletInfo {
  balance: number;
  hallBalance: number;
  currentBlock: number;
  currentEpoch: number;
  currentReward: number;
}

interface SatoshiPageProps {
  onNext: () => void;
}

const SatoshiPage: React.FC<SatoshiPageProps> = ({ onNext }) => {
  // States for mining and different views
  const [miningStarted, setMiningStarted] = useState(false);
  const [miningResult, setMiningResult] = useState<MiningResult | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [preMiningExplanationShown, setPreMiningExplanationShown] = useState(false);
  const [showNodePopup, setShowNodePopup] = useState(false);
  const [nodeExplanationShown, setNodeExplanationShown] = useState(false);
  const [chainBlocks, setChainBlocks] = useState<MiningResult[]>([]);
  const [showPrevHash] = useState(false);
  const [showHallsWallet, setShowHallsWallet] = useState(false);
  const [showDifficultyPopup, setShowDifficultyPopup] = useState(false);
  const [showTransactionPopup, setShowTransactionPopup] = useState(false);
  const [showCombinedPage, setShowCombinedPage] = useState(false);
  const [txIdFromCombined, setTxIdFromCombined] = useState<string>('');
  const [pendingTransactionAmount, setPendingTransactionAmount] = useState<number>(0);
  const [showHalvingPopup, setShowHalvingPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    balance: 0,
    hallBalance: 0,
    currentBlock: 0,
    currentEpoch: 1,
    currentReward: 50,
  });
  
  const satoshiAddress = "1SatoshiPioneerXXX";
  const hallAddress = "1HallLegendeXXX";
  const initialTarget = 210000;

  
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
  
  // Show node explanation after second block
  useEffect(() => {
    if (walletInfo.currentBlock >= 2 && !nodeExplanationShown) {
      setShowNodePopup(true);
    }
  }, [walletInfo.currentBlock, nodeExplanationShown]);
  
  // Show difficulty adjustment popup at block 2016
  useEffect(() => {
    if (walletInfo.currentBlock === 2016) {
      setShowDifficultyPopup(true);
    }
  }, [walletInfo.currentBlock]);
  
  // Show transaction popup at block 2018
  useEffect(() => {
    if (walletInfo.currentBlock === 2018) {
      setShowTransactionPopup(true);
    }
  }, [walletInfo.currentBlock]);
  
  const simulateMining = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
    
    // Erstelle den Zeitstempel
    const now = new Date();
    now.setFullYear(now.getFullYear() - 16);
    const timestamp = now.toLocaleString();
    
    // Erstelle Transaktionsinformationen
    let transactions: string;
    if (walletInfo.currentBlock + 1 === 1) {
      transactions = "Genesis Block - Keine Transaktionen";
    } else {
      const txCount = Math.floor(Math.random() * 4) + 1;
      transactions = `${txCount} Transaktion${txCount > 1 ? 'en' : ''}`;
    }
    
    // Erzeuge die Merkle-Root (ohne Transaktionsanzahl, da diese separat angezeigt wird)
    const merkleRoot = Math.random().toString(16).substr(2, 8);
    
    // Vorheriger Block-Hash
    const previousHash = chainBlocks.length > 0 
      ? chainBlocks[chainBlocks.length - 1].hash.toString()
      : "0";
    
    // Block-Daten
    const blockData = `${previousHash}-${timestamp}-${merkleRoot}`;
    
    // Mining-Animation zeigen
    const miningAnimation = document.createElement('div');
    miningAnimation.className = styles.miningAnimation;
    document.body.appendChild(miningAnimation);
    
    // Mining mit Timeout
    setTimeout(() => {
      // Wähle die Schwierigkeit basierend auf verschiedenen Bedingungen:
      let difficulty;
      
      // Nach Block 2016 verwenden wir MEDIUM (0.7)
      if (walletInfo.currentBlock >= 2016) {
        difficulty = DIFFICULTY_LEVELS.MEDIUM; // 0.7
        console.log("NACH Block 2016: Target auf 0.7 (MEDIUM) gesetzt");
      } else {
        // Vor Block 2016 EASY (1)
        difficulty = DIFFICULTY_LEVELS.EASY; // 1
        console.log("VOR Block 2016: Target auf 1 (EASY)");
      }
      
      // Mining mit expliziter Schwierigkeit durchführen
      const result = mineBlock(blockData, difficulty);
      
      console.log(`Mining abgeschlossen. Hash: ${result.hash}, Target: ${result.target}, Gefunden: ${result.found}`);
      
      // Neues Block-Objekt erstellen
      const newBlock = walletInfo.currentBlock + 1;
      
      const newBlockData: MiningResult = {
        hash: result.hash.toString(),
        nonce: result.nonce,
        target: result.target.toString(), // Hier wird der tatsächliche Target-Wert gespeichert
        timestamp,
        transactions,
        merkleRoot,
        found: result.found,  // Verwende das tatsächliche Ergebnis
        blockNumber: newBlock,
      };
      
      setMiningResult(newBlockData);
      
      // Nur wenn ein Block gefunden wurde (hash < target), aktualisiere die Chain
      if (result.found) {
        setChainBlocks(prev => {
          const newChain = [...prev, newBlockData];
          while (newChain.length > 5) {
            newChain.shift();
          }
          return newChain;
        });
        
        let newEpoch = walletInfo.currentEpoch;
        let newReward = walletInfo.currentReward;
        
        if (newBlock % 210000 === 0) {
          newEpoch = walletInfo.currentEpoch + 1;
          newReward = walletInfo.currentReward / 2;
          setShowHalvingPopup(true);
        }
        
        if (newBlock === 2020) {
          newEpoch = walletInfo.currentEpoch + 1;
          newReward = walletInfo.currentReward / 2;
          setShowHalvingPopup(true);
        }
        
        // Handle pending transaction if any
        if (pendingTransactionAmount > 0) {
          setWalletInfo(prev => ({
            ...prev,
            balance: prev.balance + prev.currentReward - pendingTransactionAmount,
            hallBalance: prev.hallBalance + pendingTransactionAmount,
            currentBlock: newBlock,
            currentEpoch: newEpoch,
            currentReward: newReward,
          }));
          setTxIdFromCombined('');
          setPendingTransactionAmount(0);
        } else {
          setWalletInfo(prev => ({
            ...prev,
            balance: prev.balance + prev.currentReward,
            currentBlock: newBlock,
            currentEpoch: newEpoch,
            currentReward: newReward,
          }));
        }
      } else {
        // Block NICHT gefunden: Keine Änderung an Wallet oder Chain
        console.log("Block nicht gefunden. Keine Belohnung.");
      }
      
      document.body.removeChild(miningAnimation);
    }, 1000);
  };
  
  const previousBlockHash = chainBlocks.length > 0 
    ? chainBlocks[chainBlocks.length - 1].hash 
    : "Nicht vorhanden";
  
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
  
  // Skip to advanced blocks
  const skipToAdvancedBlocks = () => {
    setChainBlocks([
      { blockNumber: 2010, hash: "0.175026", nonce: 0, target: initialTarget.toString(), timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
      { blockNumber: 2011, hash: "0.21169", nonce: 0, target: initialTarget.toString(), timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
      { blockNumber: 2012, hash: "0.68168", nonce: 0, target: initialTarget.toString(), timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
      { blockNumber: 2013, hash: "0.159457", nonce: 0, target: initialTarget.toString(), timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
      { blockNumber: 2014, hash: "0.207500", nonce: 0, target: initialTarget.toString(), timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
    ]);
    setWalletInfo({
      ...walletInfo,
      currentBlock: 2014,
      balance: 2014 * 50,
    });
    setShowHallsWallet(true);
    onNext();
  };
  
  return (
    <div className={styles.page}>
      {/* Initial intro screen */}
      {!miningStarted ? (
        <div className={styles.introSection}>
          <h1>Satoshi Nakamoto</h1>
          <p>
            Satoshi Nakamoto, der Schöpfer von Bitcoin, hat die ersten Blöcke selbst erstellt.
            Als einziger Teilnehmer des Netzwerks wuchs sein Bitcoin-Bestand allmählich,
            da er ohne Wettbewerb minen konnte. Seine simulierte Adresse ist:
          </p>
          <div className={styles.address}>{satoshiAddress}</div>
          <p>
            Drücken Sie den folgenden Button, um einen Mining-Durchlauf zu demonstrieren und zu sehen,
            wie sich sein Bitcoin-Bestand durch das Erzeugen des ersten Blocks vergrößert.
          </p>
          <button className={styles.nextButton} onClick={() => setMiningStarted(true)}>
            Mining demonstrieren
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
            {showHallsWallet && (
              <div className={styles.walletCard}>
                <h2>Hall's Wallet</h2>
                <p><strong>Adresse:</strong> {hallAddress}</p>
                <p><strong>Balance:</strong> {walletInfo.hallBalance} BTC</p>
              </div>
            )}
          </div>
          
          {/* Mining status */}
          <div className={styles.miningStatus}>
            <p><strong>Epoche:</strong> {walletInfo.currentEpoch}</p>
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
              
              {showPrevHash && walletInfo.currentBlock >= 6 && (
                <p><strong>Vorheriger Hash:</strong> {previousBlockHash}</p>
              )}
              <p><strong>Nonce:</strong> {miningResult.nonce}</p>
              <p><strong>Zeitstempel:</strong> {miningResult.timestamp}</p>
              <p><strong>Transaktionen:</strong> {miningResult.transactions}</p>
              <p><strong>Merkle-Root:</strong> {miningResult.merkleRoot}</p>
              <p><strong>Status:</strong> {miningResult.found ? 
                "Block gefunden! ✅ Du erhältst eine Belohnung!" : 
                "Block nicht gefunden ❌ Versuche es erneut!"}
              </p>
              
              {/* Transaction ID if available */}
              {txIdFromCombined && (
                <p className={styles.txId}>
                  <strong>Transaktions-ID:</strong> {txIdFromCombined}
                </p>
              )}
              
              <div className={styles.blockButtons}>
                <button 
                  className={styles.mineButton} 
                  onClick={simulateMining}
                  disabled={isAnimating}
                >
                  {isAnimating ? 'Mining läuft...' : miningResult.found ? 'Nächster Block' : 'Erneut versuchen'}
                </button>
                {walletInfo.currentBlock >= 5 && !showHallsWallet && (
                  <button className={styles.nextButton} onClick={skipToAdvancedBlocks}>
                    Weiter
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Popups */}
      {showPopup && <MiningExplanationPopup onClose={() => setShowPopup(false)} />}
      {showNodePopup && (
        <NodeExplanationPopup onClose={() => {
          setShowNodePopup(false);
          setNodeExplanationShown(true);
        }} />
      )}
      {showDifficultyPopup && (
        <DifficultyAdjustmentPopup onClose={() => {
          setShowDifficultyPopup(false);
          // Hier nicht mehr nötig, da wir direkt auf die Block-Nummer prüfen
        }} />
      )}
      {showTransactionPopup && (
        <TransactionExplanationPopup onClose={() => {
          setShowTransactionPopup(false);
          setShowCombinedPage(true);
        }} />
      )}
      {showHalvingPopup && (
        <HalvingExplanationPopup 
          onClose={() => {
            setShowHalvingPopup(false);
            setChainBlocks([
              { blockNumber: 200996, hash: "0.175026", nonce: 0, target: initialTarget.toString(), timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
              { blockNumber: 200997, hash: "0.21169", nonce: 0, target: initialTarget.toString(), timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
              { blockNumber: 200998, hash: "0.68168", nonce: 0, target: initialTarget.toString(), timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
              { blockNumber: 200999, hash: "0.159457", nonce: 0, target: initialTarget.toString(), timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
              { blockNumber: 210000, hash: "0.207500", nonce: 0, target: initialTarget.toString(), timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
            ]);
            // Aktualisiere den aktuellen Block auf 21000, sodass beim nächsten Minting 21001 berechnet wird.
            setWalletInfo(prev => ({ ...prev, currentBlock: 210000 }));
          }} 
        />
      )}
    </div>
  );
};

export default SatoshiPage;
