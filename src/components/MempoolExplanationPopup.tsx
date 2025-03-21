import React, { useEffect } from 'react';
import styles from '../styles/MempoolExplanationPopup.module.scss';
import { FaArrowRight, FaCoins, FaDatabase } from 'react-icons/fa';

interface MempoolExplanationPopupProps {
  onClose: () => void;
}

const MempoolExplanationPopup: React.FC<MempoolExplanationPopupProps> = ({ onClose }) => {
  // Close popup when ESC key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // Close popup when clicking outside content area
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.content}>
        <h2 className={styles.title}>Der Gebührenmarkt im Mempool</h2>
        
        <div className={styles.explanationBlock}>
          <h3>Was ist der Mempool?</h3>
          <p>
            Der Mempool ist das "Wartezimmer" für Bitcoin-Transaktionen. Hier warten alle 
            unbestätigten Transaktionen darauf, von Minern in einen Block aufgenommen zu werden.
          </p>
        </div>
        
        <div className={styles.explanationBlock}>
          <h3>Wie entscheiden Miner welche Transaktionen sie aufnehmen?</h3>
          <p>
            Miner bevorzugen Transaktionen mit höheren Gebühren pro Größe (BTC/vByte). Je höher
            diese Rate, desto profitabler ist die Transaktion für den Miner.
          </p>
        </div>
        
        <div className={styles.transactionSizeExplanation}>
          <h3>Warum haben Transaktionen unterschiedliche Größen?</h3>
          <div className={styles.sizeFactors}>
            <div className={styles.sizeFactor}>
              <FaCoins className={styles.factorIcon} />
              <div>
                <h4>Inputs</h4>
                <p>Jeder Input (Geldquelle) in einer Transaktion erhöht ihre Größe. Eine Transaktion mit vielen kleinen Inputs ist größer als eine mit einem einzelnen großen Input.</p>
              </div>
            </div>
            
            <FaArrowRight className={styles.arrowIcon} />
            
            <div className={styles.sizeFactor}>
              <FaDatabase className={styles.factorIcon} />
              <div>
                <h4>Outputs</h4>
                <p>Jeder Output (Empfänger) erhöht ebenfalls die Transaktionsgröße. Eine Zahlung an mehrere Empfänger braucht mehr Platz im Block.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.walletTips}>
          <h3>Als Miner solltest Du wissen:</h3>
          <ul>
            <li>Der <strong>Block darf nicht größer als 1000 vBytes</strong> sein</li>
            <li>Wähle Transaktionen mit hohen <strong>BTC/vByte</strong> für maximalen Profit</li>
            <li>Größere Transaktionen sollten höhere Gebühren zahlen, um attraktiv zu sein</li>
            <li>Der Gebührenmarkt folgt Angebot (Blockplatz) und Nachfrage (Transaktionen)</li>
          </ul>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.closeButton} onClick={onClose}>
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
};

export default MempoolExplanationPopup;
