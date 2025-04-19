import React, { useState, useEffect } from 'react';
import styles from '../styles/EndPage.module.scss';
import { FaGithub, FaEnvelope, FaBitcoin, FaBolt, FaHeart, FaQrcode, FaCopy, FaCheckCircle } from 'react-icons/fa';
import { QRCodeSVG as QRCode } from 'qrcode.react';

interface EndPageProps {
  onRestart: () => void;
}

const EndPage: React.FC<EndPageProps> = ({ onRestart }) => {
  const [animate, setAnimate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQRCodeExpanded, setShowQRCodeExpanded] = useState(false);
  
  // Kontaktdaten aus der contactConfig
  const contactConfig = {
    github: "https://github.com/walpurga03",
    lightning: "aldo.barazutti@walletofsatoshi.com",
    nostr: "npub1hht9umpeet75w55uzs9lq6ksayfpcvl9lk64hye75j0yj4husq5ss8xsry"
  };
  
  useEffect(() => {
    // Start animation when component mounts
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const handleCopyLightningAddress = () => {
    navigator.clipboard.writeText(contactConfig.lightning);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.endPage}>
      <div className={`${styles.header} ${animate ? styles.animate : ''}`}>
        <div className={styles.bitcoinLogo}>
          <FaBitcoin />
        </div>
        <h1>Bitcoin Simulation abgeschlossen!</h1>
        <p className={styles.congratsText}>
          Gratulation! Du hast alle Etappen der Simulation erfolgreich durchlaufen und ein 
          grundlegendes Verständnis darüber erlangt, wie Bitcoin funktioniert.
        </p>
      </div>
      
      {/* Vereinfachte Spenden-Sektion mit lokal generiertem QR-Code */}
      <div className={`${styles.donationSection} ${animate ? styles.animate : ''}`}>
        <div className={styles.donationHeader}>
          <FaHeart className={styles.donationIcon} />
          <h2>Unterstütze dieses Projekt</h2>
        </div>
        
        <p className={styles.donationText}>
          Wenn dir diese Bitcoin-Simulation gefallen hat, würde ich mich über eine Lightning-Spende freuen! 
          Damit kann ich weitere Bildungsprojekte entwickeln und verbessern.
        </p>

        <div className={`${styles.lightningContainer} ${showQRCodeExpanded ? styles.expanded : ''}`}>
          <div className={styles.lightningAddress} onClick={handleCopyLightningAddress}>
            <FaBolt className={styles.lightningIcon} />
            <span className={styles.address}>{contactConfig.lightning}</span>
            {copied ? 
              <FaCheckCircle className={styles.copyIcon} /> : 
              <FaCopy className={styles.copyIcon} />
            }
            {copied && <span className={styles.copiedNotification}>Kopiert!</span>}
          </div>
          
          <button 
            className={styles.qrToggleButton} 
            onClick={() => setShowQRCodeExpanded(!showQRCodeExpanded)}
          >
            <FaQrcode /> {showQRCodeExpanded ? 'QR-Code ausblenden' : 'QR-Code anzeigen'}
          </button>
          
          {showQRCodeExpanded && (
            <div className={styles.qrCodeContainer}>
              <div className={styles.qrWrapper}>
                <QRCode
                  value={contactConfig.lightning}
                  size={220}
                  level="H"
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  includeMargin={true}
                />
              </div>
              <p className={styles.qrInstructions}>
                Scanne diesen QR-Code mit deiner Lightning-Wallet um eine Spende zu senden
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className={`${styles.contactSection} ${animate ? styles.animate : ''}`}>
        <h2>Kontakt & Feedback</h2>
        <div className={styles.contactCard}>
          <div className={styles.contactLinks}>
            <a href={contactConfig.github} className={styles.contactLink} target="_blank" rel="noopener noreferrer">
              <FaGithub /> {contactConfig.github.replace('https://', '')}
            </a>
            <a href={`https://njump.me/${contactConfig.nostr}`} className={styles.contactLink} target="_blank" rel="noopener noreferrer">
              <FaEnvelope /> Nostr
            </a>
          </div>
          
          <p className={styles.feedbackNote}>
            Du hast Fragen, Anregungen oder Feedback? Melde dich gerne über mein Nostr-Profil!
            Deine Meinung hilft mir, diese Simulation weiter zu verbessern.
          </p>
        </div>
      </div>
      
      <div className={`${styles.actionButtons} ${animate ? styles.animate : ''}`}>
        <button onClick={onRestart} className={styles.restartButton}>
          Simulation neu starten
        </button>
      </div>
      
      <div className={styles.footer}>
        <p>© 2023 Bitcoin Education | Alle Inhalte dienen ausschließlich Bildungszwecken</p>
      </div>
    </div>
  );
};

export default EndPage;
