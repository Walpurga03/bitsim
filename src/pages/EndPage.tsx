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
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  
  // Kontaktdaten aus der contactConfig
  const contactConfig = {
    github: "https://github.com/walpurga03",
    lightning: "aldo.barazutti@walletofsatoshi.com",
    nostr: "npub1hht9umpeet75w55uzs9lq6ksayfpcvl9lk64hye75j0yj4husq5ss8xsry"
  };
  
  // Vordefinierte Spendenbeträge in Sats
  const donationAmounts = [
    { label: '1.000 sats', value: 1000 },
    { label: '5.000 sats', value: 5000 },
    { label: '21.000 sats', value: 21000 },
    { label: '100.000 sats', value: 100000 }
  ];
  
  useEffect(() => {
    // Start animation when component mounts
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const handleCopyLightningAddress = () => {
    navigator.clipboard.writeText(contactConfig.lightning);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generiere Lightning-Zahlungs-URL mit ausgewähltem Betrag
  const getLightningPaymentLink = () => {
    const baseAddress = contactConfig.lightning;
    if (selectedAmount) {
      // Einfache Lightning Address URL mit Betrag
      return `lightning:${baseAddress}?amount=${selectedAmount/100000000}`;
    }
    return baseAddress;
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
      
      {/* Neuer Abschnitt: Lightning Network Erklärung */}
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
          <p>Die <strong>beste Möglichkeit, Lightning zu verstehen, ist es selbst auszuprobieren!</strong></p>
          <p>Unterstütze den Entwickler mit einer kleinen Lightning-Spende und teste gleichzeitig diese revolutionäre Technologie - damit die Motivation für solche Bildungsprojekte nicht verloren geht.</p>
        </div>
      </div>
      
      {/* Verbesserte Spenden-Sektion mit persönlicherem Bezug */}
      <div className={`${styles.donationSection} ${animate ? styles.animate : ''}`}>
        <div className={styles.donationHeader}>
          <FaHeart className={styles.donationIcon} />
          <h2>Motivation durch Wertschätzung</h2>
        </div>
        
        <p className={styles.donationText}>
          Hinter dieser Bitcoin-Simulation stecken viele Stunden Arbeit und Leidenschaft für Bitcoin-Bildung. 
          Mit einer Lightning-Spende kannst du nicht nur Lightning selbst testen, sondern auch deine Wertschätzung 
          für dieses Projekt zeigen und zukünftige Entwicklungen ermöglichen.
        </p>

        {/* Neue Spendenbeträge als Auswahlmöglichkeit */}
        <div className={styles.donationAmounts}>
          {donationAmounts.map((amount) => (
            <button
              key={amount.value}
              className={`${styles.donationButton} ${selectedAmount === amount.value ? styles.selected : ''}`}
              onClick={() => setSelectedAmount(amount.value)}
            >
              {amount.label}
              <span className={styles.satValue}>{(amount.value / 100000000).toFixed(8)} BTC</span>
            </button>
          ))}
        </div>

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
          
          {selectedAmount && (
            <div className={styles.selectedAmount}>
              <span>Ausgewählter Betrag: <strong>{selectedAmount} sats</strong></span>
              <a 
                href={getLightningPaymentLink()}
                className={styles.payButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                Mit Lightning bezahlen <FaBolt />
              </a>
            </div>
          )}
          
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
                  value={selectedAmount ? getLightningPaymentLink() : contactConfig.lightning}
                  size={220}
                  level="H"
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  includeMargin={true}
                />
              </div>
              <p className={styles.qrInstructions}>
                Scanne diesen QR-Code mit deiner Lightning-Wallet, um {selectedAmount ? `${selectedAmount} Satoshis` : 'eine Spende'} zu senden
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
        <p>©Selbstverständlich können alle Inhalte gemäß den Bestimmungen des Open-Source-Prinzips verwendet werden.</p>
      </div>
    </div>
  );
};

export default EndPage;
