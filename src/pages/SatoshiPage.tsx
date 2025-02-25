import React, { useState, useEffect } from 'react';
import styles from './SatoshiPage.module.scss';
import MiningExplanationPopup from '../components/MiningExplanationPopup';
import NodeExplanationPopup from '../components/NodeExplanationPopup';
import DifficultyAdjustmentPopup from '../components/DifficultyAdjustmentPopup';
import TransactionExplanationPopup from '../components/TransactionExplanationPopup';
import CombinedTransactionWalletsPage from './CombinedTransactionWalletsPage'; // Achte auf den korrekten Pfad
import HalvingExplanationPopup from '../components/HalvingExplanationPopup';  // Neuer Import

interface MiningResult {
  hash: number;
  nonce: number;
  target: number;
  timestamp: string;
  transactions: string;
  merkleRoot: string;
  found: boolean;
  blockNumber: number; // new property for absolute block number
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
  // Zustände für Mining und die verschiedenen Ansichten
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
  const [] = useState(false);
  const [] = useState(false);
  const [showCombinedPage, setShowCombinedPage] = useState(false);
  // Neuer State für die Transaktions-ID aus der kombinierten Seite:
  const [txIdFromCombined, setTxIdFromCombined] = useState<string>('');
  const [pendingTransactionAmount, setPendingTransactionAmount] = useState<number>(0);
  const [showHalvingPopup, setShowHalvingPopup] = useState(false);
  // Füge den isMobile-State hinzu:
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  
  useEffect(() => {
    if (miningStarted && !preMiningExplanationShown) {
      setShowPopup(true);
      setPreMiningExplanationShown(true);
    }
  }, [miningStarted, preMiningExplanationShown]);
  
  useEffect(() => {
    if (walletInfo.currentBlock >= 2 && !nodeExplanationShown) {
      setShowNodePopup(true);
    }
  }, [walletInfo.currentBlock, nodeExplanationShown]);
  
  useEffect(() => {
    if (walletInfo.currentBlock === 2016) {
      setShowDifficultyPopup(true);
    }
  }, [walletInfo.currentBlock]);
  
  useEffect(() => {
    if (walletInfo.currentBlock === 2018) {
      // Hier wird showTransactionPopup aktiviert, wenn du den Button "Transaktion simulieren" verwenden möchtest.
      setShowTransactionPopup(true);
    }
  }, [walletInfo.currentBlock]);
  
  const simulateMining = () => {
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
        // Öffne das Halving-Popup, wenn 210000 erreicht wurden
        setShowHalvingPopup(true);
      }
      if (newBlock === 2020) {
        newEpoch = walletInfo.currentEpoch + 1;
        newReward = walletInfo.currentReward / 2;
        // Öffne das Halving-Popup
        setShowHalvingPopup(true);
      }
      // Falls ein Transaktionsbetrag ansteht, aktualisiere die Balances
      if (pendingTransactionAmount > 0) {
        setWalletInfo(prev => ({
          ...prev,
          balance: prev.balance + prev.currentReward - pendingTransactionAmount,
          hallBalance: prev.hallBalance + pendingTransactionAmount,
          currentBlock: newBlock,
          currentEpoch: newEpoch,
          currentReward: newReward,
        }));
        // Entferne die Transaktions-ID, nachdem der Betrag übertragen wurde:
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
  
  // Bestimme, welche Blöcke angezeigt werden sollen:
  const blocksToDisplay = isMobile ? chainBlocks.slice(-2) : chainBlocks;

  // Routenwechsel: Prüfe die Zustände und rendere die jeweilige Seite.
  
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
      {!miningStarted && <h1>Satoshi Nakamoto</h1>}
      {chainBlocks.length > 0 && (
        <div className={styles.blockchainDisplay}>
          {blocksToDisplay.map(block => {
            const previous = chainBlocks.find(b => b.blockNumber === (block.blockNumber - 1));
            let prevDisplay = previous ? previous.hash.toString() : (block.blockNumber > 1 ? `Block ${block.blockNumber - 1}` : "XXXX");
            return (
              <div key={block.blockNumber} className={styles.block}>
                <p><strong>Block {block.blockNumber}</strong></p>
                <p>Hash: {block.hash}</p>
                <p>Last Hash: {prevDisplay}</p>
              </div>
            );
          })}
        </div>
      )}
      {!miningStarted ? (
        <>
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
        </>
      ) : (
        <>
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
          <div className={styles.miningStatus}>
            <p><strong>Aktuelle Epoche:</strong> {walletInfo.currentEpoch}</p>
            <p><strong>Aktueller Block:</strong> {walletInfo.currentBlock}</p>
            <p><strong>Aktuelle Belohnung:</strong> {walletInfo.currentReward} BTC</p>
          </div>
          {!miningResult ? (
            <button className={styles.nextButton} onClick={simulateMining}>
              Block minen
            </button>
          ) : (
            <div className={`${styles.miningBlock} ${miningResult.found ? styles.foundAnimation : ''}`}>
              <h2>Mining Block</h2>
              <div className={styles.hashTarget}>
                <p>
                  <strong>Blockhash:</strong> {miningResult.hash} <span className={styles.lessThan}>&lt;</span> <strong>Difficulty Target:</strong> {miningResult.target}
                </p>
              </div>
              {showPrevHash && walletInfo.currentBlock >= 6 && (
                <p><strong>Vorheriger Blockhash:</strong> {previousBlockHash}</p>
              )}
              <p><strong>Nonce:</strong> {miningResult.nonce}</p>
              <p><strong>Zeitstempel:</strong> {miningResult.timestamp}</p>
              <p><strong>Transaktionen:</strong> {miningResult.transactions}</p>
              <p><strong>Merkle-Root:</strong> {miningResult.merkleRoot}</p>
              <p><strong>Status:</strong> {miningResult.found ? "Block gefunden!" : "Block nicht gefunden!"}</p>
              {/* Wenn eine Transaktions-ID von der kombinierten Seite zurückkam, zeige sie hier an */}
              {txIdFromCombined && (
                <p className={styles.txId}>
                  <strong>Transaktions-ID:</strong> {txIdFromCombined}
                </p>
              )}
              <div className={styles.blockButtons}>
                <button className={styles.nextButton} onClick={simulateMining}>
                  Pow
                </button>
                {walletInfo.currentBlock >= 5 && !showHallsWallet && (
                  <button className={styles.nextButton} onClick={() => {
                      // Alte "Weiter"-Logik, die später zu einer anderen Seite führt:
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
                  }}>
                    Weiter
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
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
          // Wechsel zur kombinierten Seite mit Wallets und Transaktion:
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
