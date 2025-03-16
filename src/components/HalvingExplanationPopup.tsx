import React, { useEffect } from 'react';
import styles from '../styles/HalvingExplanationPopup.module.scss';

interface HalvingExplanationPopupProps {
  onClose: () => void;
}

const HalvingExplanationPopup: React.FC<HalvingExplanationPopupProps> = ({ onClose }) => {
  const explanationText = `Halving-Event:
Nach 210000 Blöcken werden die Mining-Rewards halbiert.
Dies dient dazu, die Gesamtmenge der im Umlauf befindlichen Bitcoins zu verlangsamen und langfristig für eine deflationäre Entwicklung zu sorgen.
Das bedeutet, dass Miner ab diesem Punkt nur noch die Hälfte der bisherigen Belohnung erhalten.`;

  // Close popup when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent body scrolling while popup is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
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
        <h2>Halving erklärt</h2>
        <p>{explanationText}</p>
        <button className={styles.closeButton} onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
};

export default HalvingExplanationPopup;