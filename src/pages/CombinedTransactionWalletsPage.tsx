import React, { useState, useEffect } from 'react';
import styles from '../styles/CombinedTransactionWalletsPage.module.scss';
import { FaArrowRight, FaWallet, FaCoins, FaCheckCircle, FaExclamationCircle, FaBitcoin, FaLock } from 'react-icons/fa';

interface CombinedTransactionWalletsPageProps {
  satoshiBalance: number;
  onBack: (txId?: string, amount?: number) => void;
  halBalance?: number; // NEU: optionaler Prop für Hal's aktuellen Saldo
}

const CombinedTransactionWalletsPage: React.FC<CombinedTransactionWalletsPageProps> = ({ 
  satoshiBalance, 
  onBack,
  halBalance = 0 // Default auf 0, falls nicht übergeben
}) => {
  const [amount, setAmount] = useState<string>('');
  const [transferComplete, setTransferComplete] = useState(false);
  const [transactionID, setTransactionID] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [transactionStep, setTransactionStep] = useState<number>(1);
  const [animateTransaction, setAnimateTransaction] = useState(false);
  const [signatureComplete, setSignatureComplete] = useState(false);
  const [signatureProgress, setSignatureProgress] = useState(0);
  const [privateKey] = useState("KyT5woSXvMrjS2RS9Lfqxjdgjn9rA7r58RaQQCCB6Cw1rT4qrPXW");

  const satoshiAddress = "1SatoshiPioneerXXX";
  const halAddress = "1HalLegendeXXX";

  useEffect(() => {
    // Generate a random transaction ID
    const generateTxID = (): string => {
      // SHA-like format for the transaction ID
      return Array.from({ length: 64 }, () => 
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('');
    };
    
    setTransactionID(generateTxID());
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Validiere Eingabe (nur Zahlen mit max. 8 Dezimalstellen)
    if (/^\d*\.?\d{0,8}$/.test(value) || value === '') {
      setAmount(value);
      setError(null);
    }
  };

  const handlePrepareTransaction = () => {
    const amountNumber = parseFloat(amount);
    
    // Validierung
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError("Bitte gib einen gültigen Betrag ein");
      return;
    }

    if (amountNumber > satoshiBalance) {
      setError("Nicht genug Bitcoin im Wallet");
      return;
    }

    setError(null);
    // Gehe zum Signieren (Schritt 2)
    setTransactionStep(2);
  };
  
  const handleSignTransaction = () => {
    // Signierungssimulation mit Fortschrittsanzeige
    setSignatureProgress(0);
    const signInterval = setInterval(() => {
      setSignatureProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(signInterval);
          setTimeout(() => {
            setSignatureComplete(true);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  const handleTransfer = () => {
    // Starte Überweisungsanimation
    setTransactionStep(3);
    setAnimateTransaction(true);

    // Nach einer Weile als erfolgreich markieren
    setTimeout(() => {
      setTransactionStep(4);
      setTransferComplete(true);
      setAnimateTransaction(false);
    }, 2500);
  };

  const handleConfirm = () => {
    onBack(transactionID.substring(0, 8), parseFloat(amount));
  };

  return (
    <div className={styles.page}>
      <div className={styles.introSection}>
        <h1>Bitcoin Transaktion erstellen</h1>
        <p>
          Sende Bitcoin von Satoshi's Wallet an Hal's Wallet.
          Nach der Erstellung wartet deine Transaktion auf die Bestätigung im nächsten Block.
        </p>
      </div>

      {/* Verbesserte Wallet-Anzeige mit Transaktionsstatus */}
      <div className={styles.transactionContainer}>
        {/* Fortschrittsanzeige mit 4 Schritten */}
        <div className={styles.transactionProgress}>
          <div className={`${styles.progressStep} ${transactionStep >= 1 ? styles.activeStep : ''}`}>
            <div className={styles.stepNumber}>1</div>
            <span>Betrag eingeben</span>
          </div>
          <div className={`${styles.progressConnector} ${transactionStep >= 2 ? styles.activeConnector : ''}`}></div>
          <div className={`${styles.progressStep} ${transactionStep >= 2 ? styles.activeStep : ''}`}>
            <div className={styles.stepNumber}>2</div>
            <span>Signieren</span>
          </div>
          <div className={`${styles.progressConnector} ${transactionStep >= 3 ? styles.activeConnector : ''}`}></div>
          <div className={`${styles.progressStep} ${transactionStep >= 3 ? styles.activeStep : ''}`}>
            <div className={styles.stepNumber}>3</div>
            <span>Übertragen</span>
          </div>
          <div className={`${styles.progressConnector} ${transactionStep >= 4 ? styles.activeConnector : ''}`}></div>
          <div className={`${styles.progressStep} ${transactionStep >= 4 ? styles.activeStep : ''}`}>
            <div className={styles.stepNumber}>4</div>
            <span>Bestätigen</span>
          </div>
        </div>

        {/* Wallet Karten */}
        <div className={styles.walletsTransactionContainer}>
          <div className={`${styles.walletCard} ${styles.senderWallet}`}>
            <div className={styles.walletHeader}>
              <FaWallet className={styles.walletIcon} />
              <h2>Satoshi's Wallet</h2>
            </div>
            <p className={styles.walletAddress}>{satoshiAddress}</p>
            <div className={styles.balanceDisplay}>
              <FaCoins className={styles.coinsIcon} />
              <span className={styles.balanceAmount}>
                {satoshiBalance} BTC
              </span>
            </div>
            {transferComplete && (
              <div className={styles.pendingOutbound}>
                <span>-{amount} BTC ausstehend</span>
              </div>
            )}
          </div>

          <div className={styles.transactionMiddle}>
            <div className={`${styles.transactionArrowContainer} ${animateTransaction ? styles.animating : ''}`}>
              {/* Schritt 1: Betrag eingeben */}
              {transactionStep === 1 && (
                <div className={styles.betterAmountInputContainer}>
                  <div className={styles.amountInputLabel}>
                    <FaBitcoin /> Sendbetrag eingeben:
                  </div>
                  <div className={styles.amountInputWrapper}>
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0.00000000"
                      className={styles.amountInput}
                      autoFocus
                    />
                    <div className={styles.btcLabel}>BTC</div>
                  </div>
                  <div className={styles.availableBalance}>
                    Verfügbar: <strong>{satoshiBalance} BTC</strong>
                  </div>
                  <button 
                    className={`${styles.transferButton} ${!amount || parseFloat(amount) <= 0 ? styles.disabled : ''}`}
                    onClick={handlePrepareTransaction}
                    disabled={!amount || parseFloat(amount) <= 0}
                  >
                    Weiter zur Signierung
                  </button>
                </div>
              )}

              {/* Schritt 2: Signieren */}
              {transactionStep === 2 && (
                <div className={styles.signatureContainer}>
                  <div className={styles.transactionDetails}>
                    <h3>Transaktion signieren</h3>
                    <div className={styles.txDetails}>
                      <p><strong>Von:</strong> {satoshiAddress.substring(0, 6)}...{satoshiAddress.substring(satoshiAddress.length-3)}</p>
                      <p><strong>An:</strong> {halAddress.substring(0, 6)}...{halAddress.substring(halAddress.length-3)}</p>
                      <p><strong>Betrag:</strong> {amount} BTC</p>
                      <p><strong>Gebühr:</strong> 0.0001 BTC</p>
                      <p><strong>Gesamt:</strong> {(parseFloat(amount) + 0.0001).toFixed(8)} BTC</p>
                    </div>

                    <div className={styles.keyInfo}>
                      <div className={styles.keyContainer}>
                        <FaLock className={styles.keyIcon} /> 
                        <div className={styles.privateKeyMasked}>
                          {privateKey.substring(0, 5)}...{privateKey.substring(privateKey.length-5)}
                        </div>
                      </div>
                    </div>

                    {!signatureComplete ? (
                      <>
                        <div className={styles.signatureProgress}>
                          <div 
                            className={styles.signatureProgressBar}
                            style={{ width: `${signatureProgress}%` }}
                          ></div>
                        </div>
                        <button 
                          className={styles.signButton}
                          onClick={handleSignTransaction}
                          disabled={signatureProgress > 0}
                        >
                          {signatureProgress > 0 ? 'Wird signiert...' : 'Mit privatem Schlüssel signieren'}
                        </button>
                      </>
                    ) : (
                      <div className={styles.signatureComplete}>
                        <FaCheckCircle className={styles.signatureIcon} />
                        <p>Transaktion erfolgreich signiert!</p>
                        <button 
                          className={styles.transferButton}
                          onClick={handleTransfer}
                        >
                          Signierte Transaktion übertragen
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Schritt 3: Übertragen */}
              {transactionStep === 3 && (
                <>
                  <div className={`${styles.transactionAmount} ${animateTransaction ? styles.animating : ''}`}>
                    {amount} BTC
                  </div>
                  <FaArrowRight className={`${styles.transactionArrow} ${animateTransaction ? styles.animating : ''}`} />
                </>
              )}

              {/* Schritt 4: Bestätigen */}
              {transactionStep === 4 && (
                <div className={styles.transactionComplete}>
                  <FaCheckCircle className={styles.completeIcon} />
                  <span>{amount} BTC</span>
                </div>
              )}
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <FaExclamationCircle className={styles.errorIcon} />
                {error}
              </div>
            )}

            {transactionStep === 4 && (
              <div className={styles.transactionDetails}>
                <p className={styles.txIdDisplay}>
                  <strong>Transaktion-ID:</strong> 
                  <span className={styles.txIdValue}>{transactionID.substring(0, 12)}...</span>
                </p>
                <button className={styles.confirmButton} onClick={handleConfirm}>
                  Transaktion bestätigen
                </button>
              </div>
            )}
          </div>

          <div className={`${styles.walletCard} ${styles.receiverWallet}`}>
            <div className={styles.walletHeader}>
              <FaWallet className={styles.walletIcon} />
              <h2>Hal's Wallet</h2>
            </div>
            <p className={styles.walletAddress}>{halAddress}</p>
            <div className={styles.balanceDisplay}>
              <FaCoins className={styles.coinsIcon} />
              <span className={styles.balanceAmount}>
                {halBalance} BTC
              </span>
            </div>
            {transferComplete && (
              <div className={styles.pendingInbound}>
                <span>+{amount} BTC ausstehend</span>
              </div>
            )}
          </div>
        </div>

        {transactionStep === 4 && (
          <div className={styles.transactionInfoBox}>
            <h3>Was passiert als Nächstes?</h3>
            <p>
              Deine Transaktion wurde erstellt, signiert und an das Netzwerk übertragen. Sie wartet nun auf die Bestätigung durch das Mining eines neuen Blocks. 
              Sobald ein Miner deine Transaktion in einem Block aufnimmt und dieser Block der Blockchain 
              hinzugefügt wird, gilt die Überweisung als bestätigt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinedTransactionWalletsPage;
