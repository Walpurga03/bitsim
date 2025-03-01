import React, { useEffect } from 'react';
import styles from './DifficultyAdjustmentPopup.module.scss';

interface DifficultyAdjustmentPopupProps {
  onClose: () => void;
}

const DifficultyAdjustmentPopup: React.FC<DifficultyAdjustmentPopupProps> = ({ onClose }) => {
  const explanationText = `Da Satoshi ein Drittel schneller geminet hat als die angestrebten 10 Minuten, wird die Difficulty um 1/3 schwerer.
  
Das bedeutet, dass das Target gesenkt wird, um den neuen, höheren Anforderungen gerecht zu werden.`;

  // Taste ESC schließt das Popup
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // Schließt das Popup bei Klick außerhalb des Inhalts
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.content}>
        <h2 className={styles.title}>Difficulty Adjustment</h2>
        <p className={styles.explanationText}>{explanationText}</p>
        <div className={styles.buttonContainer}>
          <button className={styles.closeButton} onClick={onClose}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default DifficultyAdjustmentPopup;