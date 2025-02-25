import React from 'react';
import styles from './ConsensusPage.module.scss';

interface ConsensusPageProps {
  onNext: () => void;
}

const ConsensusPage: React.FC<ConsensusPageProps> = ({ onNext }) => {
  return (
    <div className={styles.page}>
      <h1>Spielregeln des Netzwerks</h1>
      <p>
        Im Bitcoin-Netzwerk gelten feste Regeln, die für Sicherheit und Stabilität sorgen. Zunächst 
        sorgt der Konsensmechanismus dafür, dass alle Teilnehmer – die sogenannten Nodes – sich auf den 
        aktuellen Stand der Blockchain einigen. Miner erfüllen ihre Aufgabe, indem sie durch den 
        Proof-of-Work neue Blöcke erzeugen, die dann in das öffentliche und unveränderliche Kassenbuch 
        aufgenommen werden.
      </p>
      <p>
        Ein zentraler Bestandteil ist die dynamische Anpassung der Schwierigkeit (Difficulty). Dieser 
        Mechanismus stellt sicher, dass im Durchschnitt alle 10 Minuten ein neuer Block generiert wird, 
        unabhängig von der global eingesetzten Rechenleistung. Überdies wird die Belohnung der Miner, auch 
        als Block Reward bekannt, regelmäßig – alle 210.000 Blöcke – halbiert (Halving). Dadurch wird das 
        Angebot an neuen Bitcoins schrittweise reduziert, was zur langfristigen Wertstabilität beiträgt und 
        vor inflationären Effekten schützt.
      </p>
      <p>
        Zusammen bilden diese Elemente – Konsens, Mining, Difficulty und Halving – die grundlegenden 
        Spielregeln, die das dezentrale System von Bitcoin absichern und stabilisieren.
      </p>
      <button className={styles.nextButton} onClick={onNext}>Weiter</button>
    </div>
  );
};

export default ConsensusPage;
