import React, { useState, useEffect } from 'react';
import styles from './SatoshiPage.module.scss';
import MiningExplanationPopup from '../components/MiningExplanationPopup';
import NodeExplanationPopup from '../components/NodeExplanationPopup';
import DifficultyAdjustmentPopup from '../components/DifficultyAdjustmentPopup';
import TransactionExplanationPopup from '../components/TransactionExplanationPopup';
import CombinedTransactionWalletsPage from './CombinedTransactionWalletsPage';
import HalvingExplanationPopup from '../components/HalvingExplanationPopup';

interface MiningResult {
  hash: number;
  nonce: number;
  target: number;
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
    // Prevent rapid clicking
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
    
    const effectiveTarget = walletInfo.currentBlock < 2016 ? initialTarget : 140000;
    const generatedHash = Math.floor(Math.random() * 1000000);
    const nonce = Math.floor(Math.random() * 100000);
    const now = new Date();
    now.setFullYear(now.getFullYear() - 16);
    const timestamp = now.toLocaleString();
    
    let transactions: string;
    let merkleRoot: string;
    
    if (walletInfo.currentBlock + 1 === 1) {
      transactions = "Keine Transaktionen vorhanden";
      merkleRoot = "Nicht vorhanden";
    } else {
      const txCount = Math.floor(Math.random() * 4) + 1;
      transactions = `${txCount}`;
      merkleRoot = `${Math.random().toString(16).substr(2, 8)}${walletInfo.currentBlock + 1}`;
    }
    
    const blockFound = generatedHash < effectiveTarget;
    const newBlock = walletInfo.currentBlock + 1;
    const newBlockData: MiningResult = {
      hash: generatedHash,
      nonce,
      target: effectiveTarget,
      timestamp,
      transactions,
      merkleRoot,
      found: blockFound,
      blockNumber: newBlock,
    };
  
    setMiningResult(newBlockData);
    
    if (blockFound) {
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
    }
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
      { blockNumber: 2010, hash: 175026, nonce: 0, target: initialTarget, timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
      { blockNumber: 2011, hash: 21169, nonce: 0, target: initialTarget, timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
      { blockNumber: 2012, hash: 88168, nonce: 0, target: initialTarget, timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
      { blockNumber: 2013, hash: 159457, nonce: 0, target: initialTarget, timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
      { blockNumber: 2014, hash: 207500, nonce: 0, target: initialTarget, timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
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
          
          {/* Mining interface */}
          {!miningResult ? (
            <button 
              className={styles.mineButton} 
              onClick={simulateMining}
              disabled={isAnimating}
            >
              Block minen
            </button>
          ) : (
            <div className={`${styles.miningBlock} ${miningResult.found ? styles.foundAnimation : ''}`}>
              <h2>Mining Block</h2>
              <div className={styles.hashTarget}>
                <p>
                  <strong>Blockhash:</strong> {miningResult.hash}
                </p>
                <span className={styles.lessThan}>&lt;</span>
                <p>
                  <strong>Difficulty:</strong> {miningResult.target}
                </p>
              </div>
              
              {showPrevHash && walletInfo.currentBlock >= 6 && (
                <p><strong>Vorheriger Hash:</strong> {previousBlockHash}</p>
              )}
              <p><strong>Nonce:</strong> {miningResult.nonce}</p>
              <p><strong>Zeitstempel:</strong> {miningResult.timestamp}</p>
              <p><strong>Transaktionen:</strong> {miningResult.transactions}</p>
              <p><strong>Merkle-Root:</strong> {miningResult.merkleRoot}</p>
              <p><strong>Status:</strong> {miningResult.found ? "Block gefunden! ✅" : "Block nicht gefunden ❌"}</p>
              
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
                  Mining starten
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
      {showDifficultyPopup && <DifficultyAdjustmentPopup onClose={() => setShowDifficultyPopup(false)} />}
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
              { blockNumber: 200996, hash: 175026, nonce: 0, target: initialTarget, timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
              { blockNumber: 200997, hash: 21169, nonce: 0, target: initialTarget, timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
              { blockNumber: 200998, hash: 88168, nonce: 0, target: initialTarget, timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
              { blockNumber: 200999, hash: 159457, nonce: 0, target: initialTarget, timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
              { blockNumber: 210000, hash: 207500, nonce: 0, target: initialTarget, timestamp: new Date().toLocaleString(), transactions: "Fake block", merkleRoot: "Merkle", found: true },
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
