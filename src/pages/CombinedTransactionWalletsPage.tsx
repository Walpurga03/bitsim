import React, { useState } from 'react';
import styles from '../styles/CombinedTransactionWalletsPage.module.scss';
import { computeTransactionId } from '../utils/cryptoTransactionDemo';

interface Wallet {
  name: string;
  address: string;
  balance: number;
  privKey: string;
  pubKey: string;
}

// Füge "onBack" als optionalen Prop hinzu und zeige einen Zurück-Button
interface CombinedTransactionWalletsPageProps {
  satoshiBalance: number;
  onBack: (txId?: string, amount?: number) => void;
}

const CombinedTransactionWalletsPage: React.FC<CombinedTransactionWalletsPageProps> = ({ satoshiBalance, onBack }) => {
  // Verwende die tatsächliche Balance von Satoshi, die als Prop übergeben wird:
  const satoshiWallet: Wallet = {
    name: "Satoshi's Wallet",
    address: "1SatoshiPioneerXXX",
    balance: satoshiBalance, // dynamisch aus Prop
    privKey: "satoshiPriv",
    pubKey: "satoshiPub"
  };
  // Demo-Daten für Hall bleiben unverändert.
  const hallWallet: Wallet = {
    name: "Hall's Wallet",
    address: "1HallLegendeXXX",
    balance: 0,
    privKey: "hallPriv",
    pubKey: "hallPub"
  };

  const [amount, setAmount] = useState<number>(0);
  const [inputHallPub, setInputHallPub] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [txId, setTxId] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if(amount <= 0 || amount > satoshiWallet.balance) {
      setError('Bitte geben Sie einen Betrag ein, der kleiner oder gleich Satoshis Balance ist.');
      return;
    }
    if(!inputHallPub.trim()){
      setError('Bitte geben Sie den Public Key von Hall ein.');
      return;
    }
    // Validierung: Nur "hallPub" wird akzeptiert.
    if(inputHallPub.trim() !== 'hallPub'){
      setError('Ungültiger Public Key. Bitte geben Sie "hallPub" ein.');
      return;
    }
    const transactionData = `Satoshi (${satoshiWallet.address}) sendet ${amount} BTC an Hall (${inputHallPub})`;
    const id = await computeTransactionId(transactionData);
    setTxId(id);
  };

  return (
    <div className={styles.page}>
      <h1>Wallets &amp; Transaktion</h1>
      <div className={styles.walletsContainer}>
        <div className={styles.walletCard}>
          <h2>{satoshiWallet.name}</h2>
          <p><strong>Adresse:</strong> {satoshiWallet.address}</p>
          <p><strong>Balance:</strong> {satoshiWallet.balance} BTC</p>
          <p><strong>Private Key:</strong> {satoshiWallet.privKey}</p>
          <p><strong>Public Key:</strong> {satoshiWallet.pubKey}</p>
        </div>
        <div className={styles.walletCard}>
          <h2>{hallWallet.name}</h2>
          <p><strong>Adresse:</strong> {hallWallet.address}</p>
          <p><strong>Balance:</strong> {hallWallet.balance} BTC</p>
          <p><strong>Private Key:</strong> {hallWallet.privKey}</p>
          <p><strong>Public Key:</strong> {hallWallet.pubKey}</p>
        </div>
      </div>
      <div className={styles.transactionForm}>
        <h2>Transaktion durchführen</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Betrag (max {satoshiWallet.balance} BTC):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              step="0.0001"
              min="0"
              max={satoshiWallet.balance}
              required
            />
          </div>
          <div>
            <label>Hall's Public Key:</label>
            <input
              type="text"
              value={inputHallPub}
              onChange={(e) => setInputHallPub(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">Transaktion durchführen</button>
        </form>
        {txId && (
          <div className={styles.result}>
            <h3>Transaktions-ID</h3>
            <p>{txId.substring(0, 12)}</p>
          </div>
        )}
      </div>
      {/* Zurück-Button */}
      <button className={styles.backButton} onClick={() => onBack(txId, amount)}>
        Zurück
      </button>
    </div>
  );
};

export default CombinedTransactionWalletsPage;
