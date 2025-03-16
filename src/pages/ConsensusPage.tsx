import React from 'react';
import styles from "../styles/ConsensusPage.module.scss";

interface ConsensusPageProps {
  onNext: () => void;
}

const ConsensusPage: React.FC<ConsensusPageProps> = ({ onNext }) => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Spielregeln des Netzwerks</h1>
      <div className={styles.card}>
        <p>
          Im Bitcoin-Netzwerk gibt es keinen zentralen Verwalter. Stattdessen stützt sich das System auf einen dezentralen Konsensmechanismus. Jeder Node führt eine vollständige Kopie der Blockchain und verifiziert eigenständig alle Blöcke und Transaktionen.
        </p>
        <p>
          Miner lösen durch Proof-of-Work komplexe mathematische Rätsel, um einen neuen Block zu erzeugen. Wird ein Block erfolgreich gefunden, wird er in die Blockchain aufgenommen – so entsteht ein öffentliches, unveränderliches Register aller Transaktionen.
        </p>
        <p>
          Zur Gewährleistung einer konstanten Blockzeit (ca. 10 Minuten) wird die Schwierigkeit regelmäßig angepasst. Gleichzeitig sorgt die periodische Halbierung der Block-Belohnung dafür, dass die Gesamtzahl der Bitcoins langfristig begrenzt bleibt.
        </p>
      </div>
    </div>
  );
};

export default ConsensusPage;
