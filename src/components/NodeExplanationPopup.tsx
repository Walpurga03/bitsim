import React from 'react';
import styles from './NodeExplanationPopup.module.scss';

interface NodeExplanationPopupProps {
  onClose: () => void;
}

const NodeExplanationPopup: React.FC<NodeExplanationPopupProps> = ({ onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Node Validierung Erklärung</h2>
        <p>
          Nachdem ein Block gefunden wurde, prüft ein Node den Mining Block.
          Der Node kontrolliert, ob der Block den Netzwerkrichtlinien entspricht.
          Ist dies der Fall, wird der Block an die Blockchain angehängt und mit anderen Nodes synchronisiert.
          Außerdem wird der Hash des letzten Blocks als Vorläufer-Blockhash im neuen Block hinterlegt.
        </p>
        <button className={styles.closeButton} onClick={handleClose}>
          Schließen
        </button>
      </div>
    </div>
  );
};

export default NodeExplanationPopup;
