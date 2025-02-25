import React from 'react';
import styles from './HalvingExplanationPopup.module.scss';

interface HalvingExplanationPopupProps {
  onClose: () => void;
}

const HalvingExplanationPopup: React.FC<HalvingExplanationPopupProps> = ({ onClose }) => {
  const explanationText = `Halving-Event:
Nach 210000 Blöcken werden die Mining-Rewards halbiert.
Dies dient dazu, die Gesamtmenge der im Umlauf befindlichen Bitcoins zu verlangsamen und langfristig für eine deflationäre Entwicklung zu sorgen.
Das bedeutet, dass Miner ab diesem Punkt nur noch die Hälfte der bisherigen Belohnung erhalten.`;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <h2>Halving erklärt</h2>
        <p>{explanationText}</p>
        <button className={styles.closeButton} onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
};

export default HalvingExplanationPopup;
