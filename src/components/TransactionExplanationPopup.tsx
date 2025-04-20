import React from 'react';
import styles from "../styles/TransactionExplanationPopup.module.scss";
import { FaExchangeAlt } from 'react-icons/fa';

interface TransactionExplanationPopupProps {
  onClose: () => void;
}

const TransactionExplanationPopup: React.FC<TransactionExplanationPopupProps> = ({ onClose }) => {
  // Schließe das Popup bei Klick außerhalb des Inhalts
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC-Taste schließt das Popup
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.content}>
        <div className={styles.headerIcon}>
          <FaExchangeAlt />
        </div>
        <h2>Bitcoin-Transaktionen</h2>
        
        <div className={styles.textContent}>
          <p>
            Bitcoin-Transaktionen ermöglichen den direkten Austausch von Werten ohne Zwischenhändler wie Banken. 
            Sie werden durch digitale Signaturen gesichert, die mit dem privaten Schlüssel des Absenders erstellt werden. 
            Dieser private Schlüssel ist der Eigentumsnachweis für die Bitcoins.
          </p>
          <p>
            Nach der Übertragung bestätigen Miner die Transaktion, indem sie sie in Blöcke aufnehmen. Diese werden anschließend 
            in der Blockchain verankert und damit praktisch unveränderbar. Dies verhindert Doppelausgaben und gewährleistet 
            die Sicherheit des Netzwerks.
          </p>
        </div>
        
        <button className={styles.closeButton} onClick={onClose}>Verstanden</button>
      </div>
    </div>
  );
};

export default TransactionExplanationPopup;
