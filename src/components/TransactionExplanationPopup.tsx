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
  
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <h2>Transaktion erklären</h2>
        <p>{explanationText}</p>
        <button className={styles.closeButton} onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
};

export default TransactionExplanationPopup;
