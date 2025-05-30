import React, { useState, useEffect } from 'react';
import styles from '../styles/EndPage.module.scss';
import { FaGithub, FaEnvelope, FaBitcoin, FaBolt, FaHeart, FaQrcode, FaCopy, FaCheckCircle, FaNetworkWired, FaExchangeAlt, FaClock } from 'react-icons/fa';
import { QRCodeSVG as QRCode } from 'qrcode.react';

interface EndPageProps {
  onRestart: () => void;
}

const EndPage: React.FC<EndPageProps> = ({ onRestart }) => {
  const [animate, setAnimate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQRCodeExpanded, setShowQRCodeExpanded] = useState(false);

  const contactConfig = {
    github: "https://github.com/walpurga03",
    lightning: "aldo.barazutti@walletofsatoshi.com",
    nostr: "npub1hht9umpeet75w55uzs9lq6ksayfpcvl9lk64hye75j0yj4husq5ss8xsry"
  };

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const handleCopyLightningAddress = () => {
    navigator.clipboard.writeText(contactConfig.lightning);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLightningPaymentLink = () => {
    return `lightning:${contactConfig.lightning}`;
  };

  return (
    <div className={styles.endPage}>
      <div className={`${styles.header} ${animate ? styles.animate : ''}`}>
        <div className={styles.bitcoinLogo}>
          <FaBitcoin />
        </div>
        <h1>Lightning Network: </h1>
        <p className={styles.congratsText}>
          Gratulation! Du hast alle Etappen der Simulation erfolgreich durchlaufen und ein 
          grundlegendes Verständnis darüber erlangt, wie Bitcoin funktioniert.
        </p>
      </div>
      
      <div className={`${styles.lightningSection} ${animate ? styles.animate : ''}`}>
        <div className={styles.lightningGrid}>
          <div className={styles.lightningCard}>
            <div className={styles.cardIcon}><FaExchangeAlt /></div>
            <h3>Sofortige Transaktionen</h3>
            <p>Im Gegensatz zu On-Chain-Transaktionen ermöglicht Lightning sofortige Zahlungen ohne Wartezeiten auf Blockbestätigungen.</p>
          </div>
          
          <div className={styles.lightningCard}>
            <div className={styles.cardIcon}><FaNetworkWired /></div>
            <h3>Layer-2-Lösung</h3>
            <p>Lightning ist eine Second-Layer-Technologie, die auf der Bitcoin-Blockchain aufbaut und Millionen von Transaktionen pro Sekunde ermöglicht.</p>
          </div>
          
          <div className={styles.lightningCard}>
            <div className={styles.cardIcon}><FaClock /></div>
            <h3>Minimale Gebühren</h3>
            <p>Lightning-Transaktionen kosten nur Bruchteile eines Cents, was Mikrozahlungen und regelmäßige Bitcoin-Nutzung praktikabel macht.</p>
          </div>
        </div>
        
        <div className={styles.lightningExperience}>
          
        <p><strong>Die beste Möglichkeit, Lightning zu verstehen, ist es selbst auszuprobieren!</strong></p>
        </div>
      </div>
      
      <div className={`${styles.donationSection} ${animate ? styles.animate : ''}`}>
        <div className={styles.donationHeader}>
          <FaHeart className={styles.donationIcon} />
          <h2>Motivation durch Wertschätzung</h2>
        </div>
        
        <p className={styles.donationText}>
          Hinter dieser Bitcoin-Simulation stecken viele Stunden Arbeit und Leidenschaft für Bitcoin-Bildung. 
          Mit einer Lightning-Spende kannst du nicht nur Lightning selbst testen, sondern auch deine Wertschätzung für dieses Projekt zeigen.
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
                  value={getLightningPaymentLink()}
                  size={220}
                  level="H"
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  includeMargin={true}
                />
              </div>
              <p className={styles.qrInstructions}>
                Scanne diesen QR-Code mit deiner Lightning-Wallet, um eine Spende zu senden
              </p>
            </div>
          )}
        </div>
        
        <p className={styles.donationFeedback}>
          Deine Unterstützung ist nicht nur ein finanzieller Beitrag, sondern motiviert mich auch, 
          weiter an Bildungsprojekten wie diesem zu arbeiten. Vielen Dank! ⚡
        </p>
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
        <p className={styles.footerp}>©Selbstverständlich können alle Inhalte gemäß den Bestimmungen des Open-Source-Prinzips verwendet werden.</p>
      </div>
    </div>
  );
};

export default EndPage;
