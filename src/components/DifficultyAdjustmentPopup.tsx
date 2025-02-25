import React from 'react';
import styles from './DifficultyAdjustmentPopup.module.scss';

interface DifficultyAdjustmentPopupProps {
  onClose: () => void;
}

const DifficultyAdjustmentPopup: React.FC<DifficultyAdjustmentPopupProps> = ({ onClose }) => {
  const explanationText = `Difficulty Adjustment:
Da Satoshi ein Drittel schneller geminet hat als die angestrebten 10 Minuten, wird die Difficulty um 1/3 schwerer.
Das bedeutet, dass das Target gesenkt wird, um den neuen, höheren Anforderungen gerecht zu werden.`;
  
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <h2>Difficulty Adjustment</h2>
        <p>{explanationText}</p>
        <button className={styles.closeButton} onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
};

export default DifficultyAdjustmentPopup;
