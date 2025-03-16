import { useState } from "react";
import styles from "../styles/Landing.module.scss";
import InfoMenu from './InfoMenu';
import ExplanationOverlay from './ExplanationOverlay';
import Simulation from './Simulation';

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
      <h1 className={styles.title}>Bitcoin Simulation</h1>
      <h2 className={styles.subtitle}>Entdecken Sie die faszinierende Welt von Bitcoin</h2>
      <p className={styles.description}>
        Tauchen Sie ein in die Grundlagen der revolutionären Bitcoin-Technologie! In dieser Simulation erleben Sie, wie die dezentrale Blockchain als digitales Kassenbuch alle Transaktionen speichert und warum sie nahezu unveränderlich ist.
      </p>
      <p className={styles.description}>
        Verstehen Sie den Proof-of-Work beim Mining, wo Computer spannende Rechenrätsel lösen, um neue Blöcke zu erzeugen. Erfahren Sie, wie Nodes im Netzwerk zusammenarbeiten und durch den Konsens-Mechanismus ohne zentrale Kontrolle Einigkeit erzielen.
      </p>
      <p className={styles.description}>
        Entdecken Sie clevere Konzepte wie die automatische Schwierigkeitsanpassung und das regelmäßige Halving der Belohnungen. Und nicht zuletzt: Sehen Sie, wie das System aus privaten und öffentlichen Schlüsseln Ihre Bitcoin-Transaktionen sicher macht – ganz ohne Banken oder zentrale Vermittler.
      </p>
      <p className={styles.infoHint}>
        <strong>Tipp:</strong> Klicken Sie auf den INFO-Button oben rechts, um detaillierte Erklärungen zu allen technischen Begriffen zu erhalten!
      </p>
      <p className={styles.note}>
        Hinweis: Diese Simulation dient ausschließlich Lernzwecken und ist vereinfacht dargestellt.
      </p>
      <button className={styles.startButton} onClick={startSimulation}>
        Simulation starten
      </button>
      
      {overlayData && (
        <ExplanationOverlay text={overlayData.explanation} onClose={closeOverlay} audioFile={overlayData.audioFile} />
      )}
    </div>
  );
};

export default Landing;