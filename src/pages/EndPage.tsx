import React from 'react';
import styles from '../styles/EndPage.module.scss';
import { FaTwitter, FaGithub, FaEnvelope, FaBolt, FaHeart, FaExternalLinkAlt } from 'react-icons/fa';

interface EndPageProps {
  onRestart: () => void;
}

const EndPage: React.FC<EndPageProps> = ({ onRestart }) => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Vielen Dank!</h1>
        
        <div className={styles.content}>
          <div className={styles.messageBox}>
            <h2 className={styles.subtitle}>Du hast das Ende des Simulators erreicht</h2>
            <p className={styles.text}>
              Ich hoffe, diese Simulation hat dir geholfen, die grundlegenden Konzepte von Bitcoin
              besser zu verstehen. Von Mining über Transaktionen bis hin zum Halving wurden
              die wichtigsten Mechanismen demonstriert.
            </p>
            
            <div className={styles.learnMoreSection}>
              <h3>Möchtest du mehr über Bitcoin lernen?</h3>
              <div className={styles.resourceLinks}>
                <a href="https://bitcoin.org/bitcoin.pdf" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
                  <span>Bitcoin Whitepaper</span>
                  <FaExternalLinkAlt />
                </a>
                <a href="https://bitcoincore.org/" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
                  <span>Bitcoin Core</span>
                  <FaExternalLinkAlt />
                </a>
                <a href="https://en.bitcoin.it/wiki/Main_Page" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
                  <span>Bitcoin Wiki</span>
                  <FaExternalLinkAlt />
                </a>
              </div>
            </div>
          </div>
          
          <div className={styles.feedbackSection}>
            <div className={styles.supportOption}>
              <h3><FaHeart className={styles.iconHeart} /> Unterstütze dieses Projekt</h3>
              <p>
                Bitcoin-Lernmaterial wird immer wichtiger. Wenn dir dieser Simulator gefallen hat
                und du meine Arbeit unterstützen möchtest, freue ich mich über eine kleine Spende.
              </p>
              
              <div className={styles.donationOptions}>
                <div className={styles.lightningOption}>
                  <FaBolt className={styles.lightningIcon} />
                  <div>
                    <h4>Lightning-Spende</h4>
                    <div className={styles.lightningAddress}>
                      <code>dummy@getalby.com</code>
                    </div>
                  </div>
                </div>
                
                <button className={styles.copyButton} onClick={() => navigator.clipboard.writeText('dummy@getalby.com')}>
                  Adresse kopieren
                </button>
              </div>
            </div>
            
            <div className={styles.feedbackOption}>
              <h3>Feedback geben</h3>
              <p>
                Dein Feedback hilft mir, diesen Simulator zu verbessern und weiterzuentwickeln.
                Bitte teile mir mit, was dir gefallen hat und wo es noch Verbesserungspotential gibt.
              </p>
              
              <div className={styles.contactLinks}>
                <a href="https://twitter.com/dummy" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                  <FaTwitter /> Twitter
                </a>
                <a href="https://github.com/dummy/bitsim" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                  <FaGithub /> GitHub
                </a>
                <a href="mailto:dummy@example.com" className={styles.contactLink}>
                  <FaEnvelope /> E-Mail
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.buttonContainer}>
          <button className={styles.restartButton} onClick={onRestart}>
            Simulation neu starten
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndPage;
