import React, { useEffect } from 'react';
import styles from '../styles/MempoolExplanationPopup.module.scss';

interface MempoolExplanationPopupProps {
  onClose: () => void;
}

const MempoolExplanationPopup: React.FC<MempoolExplanationPopupProps> = ({ onClose }) => {
  const explanationText = `Der Mempool ist wie ein Wartezimmer für Bitcoin-Transaktionen:

1. Nutzer zahlen Gebühren, damit ihre Transaktionen schneller verarbeitet werden
2. Als Miner wählen Sie die profitabelsten Transaktionen für Ihren Block aus
3. Die "Gebühr pro vByte" zeigt die Priorität einer Transaktion

Tipp: Achten Sie auf die Blockgröße! Ihr Block darf nicht größer als 1000 vBytes sein.`;

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
        <h2 className={styles.title}>So funktioniert der Mempool</h2>
        <p className={styles.explanationText}>{explanationText}</p>
        <div className={styles.graphicContainer}>
          <div className={styles.mempoolGraphic}>
            <div className={styles.transactions}>
              <div className={styles.highFeeTransaction}></div>
              <div className={styles.mediumFeeTransaction}></div>
              <div className={styles.lowFeeTransaction}></div>
            </div>
            <div className={styles.arrow}></div>
            <div className={styles.block}>
              <div className={styles.blockContent}>Block</div>
            </div>
          </div>
          <p className={styles.graphicCaption}>Die profitabelsten Transaktionen werden zuerst in den Block aufgenommen</p>
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
