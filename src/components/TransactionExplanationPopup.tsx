import React from 'react';
import styles from "../styles/TransactionExplanationPopup.module.scss";

interface TransactionExplanationPopupProps {
  onClose: () => void;
}

const TransactionExplanationPopup: React.FC<TransactionExplanationPopupProps> = ({ onClose }) => {
  const explanationText = `Transaktion und Kryptographie:
Eine Transaktion zwischen Satoshi und Hall wird durch asymmetrische Kryptographie abgesichert.
- Der Private Key wird geheim gehalten und zur Signierung der Transaktion verwendet.
- Der Public Key ist für jeden sichtbar und ermöglicht es, die Signatur zu überprüfen.
Eine gültige Signatur garantiert, dass die Transaktion authentisch ist und nicht manipuliert wurde.`;

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
        <h2>Transaktion erklären</h2>
        <p>{explanationText}</p>
        <button className={styles.closeButton} onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
};

export default TransactionExplanationPopup;
