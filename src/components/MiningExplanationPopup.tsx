import React from 'react';
import styles from './MiningExplanationPopup.module.scss';

interface MiningExplanationPopupProps {
  onClose: () => void;
}

const MiningExplanationPopup: React.FC<MiningExplanationPopupProps> = ({ onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Proof-of-Work Erklärung</h2>
        <p>
          In diesem vereinfachten Modell erzeugen wir einen zufälligen Blockhash und vergleichen ihn mit einem vorgegebenen Difficulty Target.
          Ist der Hash kleiner als dieses Ziel, gilt der Block als gefunden – so veranschaulichen wir die Grundlogik des Proof-of-Work.
          Im echten Prozess hingegen arbeiten weltweit tausende Rechner, häufig in Regionen mit überschüssiger, oft erneuerbarer (grüner) Energie,
          insbesondere in Gebieten, in denen Energie im Überfluss vorhanden ist, jedoch nicht genügend Abnehmer existieren.
          Finde 5 Blöcke, um weiter zu machen.
        </p>
        <button className={styles.closeButton} onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
};

export default MiningExplanationPopup;
