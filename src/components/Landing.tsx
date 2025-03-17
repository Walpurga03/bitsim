import { useState } from "react";
import styles from "../styles/Landing.module.scss";
import InfoMenu from './InfoMenu';
import ExplanationOverlay from './ExplanationOverlay';
import Simulation from './Simulation';
import { FaInfoCircle, FaArrowRight } from 'react-icons/fa';

// Erklärungstyp anpassen
interface ExplanationData {
  explanation: string;
  audioFile?: string;
}

const Landing: React.FC = () => {
  const [overlayData, setOverlayData] = useState<ExplanationData | null>(null);
  const [simulate, setSimulate] = useState(false);

  const startSimulation = () => {
    setSimulate(true);
  };

  const handleMenuItemClick = (data: ExplanationData) => {
    setOverlayData(data);
  };

  const closeOverlay = () => {
    setOverlayData(null);
  };

  if (simulate) {
    return <Simulation />;
  }

  return (
    <div className={styles.landing}>
      <InfoMenu onMenuItemClick={handleMenuItemClick} hideIcon={!!overlayData} />
      
      <div className={styles.heroSection}>
        <h1 className={styles.title}>Bitcoin Simulation</h1>
        <h2 className={styles.subtitle}>Entdecke die Bausteine von Bitcoin</h2>
      </div>
      
      <div className={styles.contentSection}>
        <p className={styles.description}>
          Willkommen in der interaktiven Bitcoin-Welt! Hier kannst du spielerisch verstehen, wie Bitcoin funktioniert - ohne komplizierte Fachbegriffe.
        </p>
        
        <p className={styles.description}>
          Du wirst selbst Blocks minen, Transaktionen durchführen und lernen, wie das Netzwerk ohne zentrale Kontrolle arbeitet.
        </p>
        
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔍</div>
            <h3>Mining verstehen</h3>
            <p>Finde heraus, wie Computer Rechenrätsel lösen, um neue Bitcoin zu erzeugen</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔄</div>
            <h3>Transaktionen senden</h3>
            <p>Erlebe, wie Bitcoin-Zahlungen funktionieren und bestätigt werden</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Mempool erkunden</h3>
            <p>Wähle als Miner die lukrativsten Transaktionen für deinen Block aus</p>
          </div>
        </div>
      </div>
      
      <div className={styles.infoHintContainer}>
        <div className={styles.infoHint}>
          <FaInfoCircle size={20} className={styles.infoIcon} />
          <p>
            <strong>Tipp:</strong> Klicke auf den <strong>INFO-Button</strong> rechts oben, um tiefergehende 
            technische Erklärungen zu allen Bitcoin-Begriffen zu erhalten!
          </p>
        </div>
      </div>
      
      <p className={styles.note}>
        Diese Simulation dient ausschließlich Lernzwecken und ist vereinfacht dargestellt.
      </p>
      
      <button className={styles.startButton} onClick={startSimulation}>
        Simulation starten <FaArrowRight className={styles.buttonIcon} />
      </button>
      
      {overlayData && (
        <ExplanationOverlay text={overlayData.explanation} onClose={closeOverlay} audioFile={overlayData.audioFile} />
      )}
    </div>
  );
};

export default Landing;