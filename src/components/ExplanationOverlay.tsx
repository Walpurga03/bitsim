import React from 'react';
import styles from './ExplanationOverlay.module.scss';

interface ExplanationOverlayProps {
  text: string;
  onClose: () => void;
}

const ExplanationOverlay: React.FC<ExplanationOverlayProps> = ({ text, onClose }) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const heading = lines.length ? lines[0].trim() : '';
  const paragraphs = lines.slice(1);

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        {heading && <h2>{heading}</h2>}
        {paragraphs.map((para, index) => (
          <p key={index}>{para.trim()}</p>
        ))}
        <button className={styles.closeButton} onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
};

export default ExplanationOverlay;
