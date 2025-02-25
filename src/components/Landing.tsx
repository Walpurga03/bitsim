import React, { useState } from 'react';
import styles from './Landing.module.scss';
import InfoMenu from './InfoMenu';
import ExplanationOverlay from './ExplanationOverlay';
import Simulation from './Simulation';

const Landing: React.FC = () => {
  const [overlayText, setOverlayText] = useState('');
  const [simulate, setSimulate] = useState(false);

  const startSimulation = () => {
    setSimulate(true);
  };

  const handleMenuItemClick = (explanation: string) => {
    setOverlayText(explanation);
  };

  const closeOverlay = () => {
    setOverlayText('');
  };

  if (simulate) {
    return <Simulation />;
  }

  return (
    <div className={styles.landing}>
      <InfoMenu onMenuItemClick={handleMenuItemClick} hideIcon={overlayText !== ''} />
      <h1 className={styles.title}>Bitcoin Simulation</h1>
      <h2 className={styles.subtitle}>Verstehen Sie die Grundlagen von Blockchain und Bitcoin</h2>
      <p className={styles.description}>
        In dieser interaktiven Simulation erfahren Sie, wie im dezentralen Netzwerk durch den Konsensmechanismus neue Blöcke per Mining (basierend auf Proof-of-Work) erzeugt werden. Erleben Sie, wie Nodes zusammenarbeiten, um die Blockchain als öffentliches, sicheres Kassenbuch zu pflegen. Außerdem lernen Sie, wie Difficulty Adjustment, Halving, Transaktionen und Keypairs zur Integrität und Sicherheit des Systems beitragen.
      </p>
      <p className={styles.note}>
        Hinweis: Diese Simulation entspricht nicht dem echten Bitcoin-Netzwerk, sondern dient ausschließlich zu Lernzwecken bzw. als Vortrag.
      </p>
      <button className={styles.startButton} onClick={startSimulation}>
        Simulation starten
      </button>
      
      {overlayText && (
        <ExplanationOverlay text={overlayText} onClose={closeOverlay} />
      )}
    </div>
  );
};

export default Landing;