import React from 'react';
import styles from '../styles/SatoshiPage.module.scss';

interface SatoshiIntroPageProps {
  onNext: () => void;
}

const SatoshiIntroPage: React.FC<SatoshiIntroPageProps> = ({ onNext }) => {
  return (
    <div className={styles.page}>
      <div className={styles.introSection}>
        <h1 className={styles.title}>Satoshi Nakamoto</h1>
        <p className={styles.description}>
          Satoshi Nakamoto, der geheimnisvolle Schöpfer von Bitcoin, legte den Grundstein für das erste dezentralisierte
          digitale Währungssystem. Durch das eigenständige Erstellen der ersten Blöcke konnte er seinen Bitcoin-Bestand
          stetig vergrößern – ganz ohne Wettbewerb.
        </p>
        <div className={styles.address}>
          1SatoshiPioneerXXX
        </div>
        <p className={styles.description}>
          Tauchen Sie ein in die Geschichte, wie Satoshi das Bitcoin-Netzwerk ins Leben rief und welchen Weg diese revolutionäre
          Idee genommen hat. Entdecken Sie die Anfänge, die Konzepte und die Vision hinter Bitcoin.
        </p>
      </div>
    </div>
  );
};

export default SatoshiIntroPage;
