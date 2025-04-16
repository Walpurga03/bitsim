import React, { useEffect } from 'react';
import styles from '../styles/NodeExplanationPopup.module.scss';

interface NodeExplanationPopupProps {
  onClose: () => void;
}

const NodeExplanationPopup: React.FC<NodeExplanationPopupProps> = ({ onClose }) => {
  // Schließen beim Escape-Tastendruck
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // Schließen beim Klick außerhalb des Modals
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Netzwerk-Visualisierung</h2>
        <div className={styles.content}>
          <p>
            Hier siehst du, wie ein neu geminter Block von einem Miner an alle verbundenen Nodes im Netzwerk weitergegeben wird.
            Die gelben Punkte zeigen Miner, die blauen Punkte Full Nodes. Sobald ein Block verbreitet ist, haben alle verbundenen Nodes die aktuelle Blockchain-Version.
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.closeButton} onClick={onClose}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeExplanationPopup;