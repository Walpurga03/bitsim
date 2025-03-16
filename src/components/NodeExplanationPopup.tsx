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
        <h2 className={styles.title}>Node Validierung Erklärung</h2>
        <div className={styles.content}>
          <p>
            Nachdem ein Block gefunden wurde, prüft ein Node den Mining Block.
            Der Node kontrolliert, ob der Block den Netzwerkrichtlinien entspricht.
            Ist dies der Fall, wird der Block an die Blockchain angehängt und mit anderen Nodes synchronisiert.
            Außerdem wird der Hash des letzten Blocks als Vorläufer-Blockhash im neuen Block hinterlegt.
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