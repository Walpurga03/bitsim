import React, { useEffect } from 'react';
import styles from './MiningExplanationPopup.module.scss';

interface MiningExplanationPopupProps {
  onClose: () => void;
}

const MiningExplanationPopup: React.FC<MiningExplanationPopupProps> = ({ onClose }) => {
  // Close popup when pressing Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    // Prevent scrolling when popup is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // Close popup when clicking outside the modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Proof-of-Work Erklärung</h2>
        </div>
        <div className={styles.content}>
          <p>
            In diesem vereinfachten Modell erzeugen wir einen zufälligen Blockhash und vergleichen ihn mit einem vorgegebenen Difficulty Target.
            Ist der Hash kleiner als dieses Ziel, gilt der Block als gefunden – so veranschaulichen wir die Grundlogik des Proof-of-Work.
          </p>
          <p>
            Im echten Prozess hingegen arbeiten weltweit tausende Rechner, häufig in Regionen mit überschüssiger, oft erneuerbarer (grüner) Energie,
            insbesondere in Gebieten, in denen Energie im Überfluss vorhanden ist, jedoch nicht genügend Abnehmer existieren.
          </p>
          <p>
            <strong>Finde 5 Blöcke, um weiter zu machen.</strong>
          </p>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.closeButton} onClick={onClose}>Schließen</button>
        </div>
      </div>
    </div>
  );
};

export default MiningExplanationPopup;