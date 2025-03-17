import React from 'react';
import styles from "../styles/ConsensusPage.module.scss";
import { FaUserAlt, FaServer, FaNetworkWired, FaCubes, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';

interface ConsensusPageProps {}

const ConsensusPage: React.FC<ConsensusPageProps> = () => {
  const consensusPrinciples = [
    {
      title: "Dezentralisierung",
      icon: <FaNetworkWired />,
      description: "Kein zentraler Verwalter - stattdessen teilen Tausende Computer (Nodes) die Verantwortung für das Netzwerk."
    },
    {
      title: "Proof-of-Work",
      icon: <FaServer />,
      description: "Miner lösen komplexe mathematische Rätsel, um neue Blöcke zu erzeugen und werden dafür belohnt."
    },
    {
      title: "Längste Kette",
      icon: <FaCubes />,
      description: "Die Blockchain mit der meisten Rechenarbeit wird automatisch als die gültige akzeptiert."
    },
    {
      title: "Unveränderlichkeit",
      icon: <FaCheckCircle />,
      description: "Einmal bestätigte Transaktionen können praktisch nicht mehr verändert werden."
    },
    {
      title: "Offener Zugang",
      icon: <FaUserAlt />,
      description: "Jeder kann am Netzwerk teilnehmen - ohne Erlaubnis oder Registrierung."
    },
    {
      title: "Kryptographische Sicherheit",
      icon: <FaShieldAlt />,
      description: "Starke Verschlüsselungstechniken schützen Transaktionen und das gesamte Netzwerk vor Angriffen."
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Spielregeln des Netzwerks</h1>
        
        <p className={styles.introText}>
          Bitcoin funktioniert ohne zentrale Autorität - aber wie einigt man sich ohne Chef? 
          Die Antwort liegt im <span className={styles.highlight}>Konsens-Mechanismus</span>, 
          einem Regelwerk, das alle Teilnehmer befolgen.
        </p>
        
        <div className={styles.principlesGrid}>
          {consensusPrinciples.map((principle, index) => (
            <div 
              key={index}
              className={styles.principleCard}
            >
              <div className={styles.cardIcon}>
                {principle.icon}
              </div>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </div>
          ))}
        </div>
        
        <div className={styles.consensusExplanation}>
          <h2>Wie funktioniert der Konsens?</h2>
          
          <div className={styles.processList}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4>Transaktionen werden gesammelt</h4>
                <p>Wenn du Bitcoin sendest, wird diese Transaktion an alle Teilnehmer verbreitet.</p>
              </div>
            </div>
            
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4>Miner erstellen Blöcke</h4>
                <p>Miner gruppieren Transaktionen und versuchen durch Rechenarbeit, einen gültigen Block zu finden.</p>
              </div>
            </div>
            
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4>Nodes überprüfen Blöcke</h4>
                <p>Jeder Teilnehmer prüft selbständig, ob neue Blöcke den Regeln entsprechen.</p>
              </div>
            </div>
            
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h4>Längste Kette gewinnt</h4>
                <p>Bei konkurrierenden Versionen setzt sich automatisch die Kette mit der meisten Rechenarbeit durch.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.infoBox}>
          <h3>Wusstest du?</h3>
          <p>Ein Bitcoin-Block wird durchschnittlich alle 10 Minuten gefunden. Die Schwierigkeit passt sich alle 2016 Blöcke automatisch an, um diesen Rhythmus beizubehalten.</p>
        </div>
      </div>
    </div>
  );
};

export default ConsensusPage;
