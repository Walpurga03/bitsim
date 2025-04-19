import React, { useState, useEffect } from 'react';
import styles from '../styles/SatoshiPage.module.scss';
import { FaInfoCircle, FaExclamationTriangle,FaMinus } from 'react-icons/fa';

interface HalvingPageProps {
  onNext: () => void;
}

interface HalvingEvent {
  blockHeight: number;
  date: string;
  rewardBefore: number;
  rewardAfter: number;
  status: 'past' | 'current' | 'future';
  priceImpact?: string;
}

const HalvingPage: React.FC<HalvingPageProps> = ({ onNext }) => {
  const [halvingExplanationShown, setHalvingExplanationShown] = useState(false);

  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState(1); // Default to second halving (index 1)

  // Halving events data
  const halvingEvents: HalvingEvent[] = [
    {
      blockHeight: 0,
      date: "03.01.2009",
      rewardBefore: 50,
      rewardAfter: 50,
      status: 'past',
      priceImpact: 'Genesis-Block'
    },
    {
      blockHeight: 210000,
      date: "28.11.2012",
      rewardBefore: 50,
      rewardAfter: 25,
      status: 'past',
      priceImpact: '~$12 → $1,000+ (innerhalb eines Jahres)'
    },
    {
      blockHeight: 420000,
      date: "09.07.2016",
      rewardBefore: 25,
      rewardAfter: 12.5,
      status: 'past',
      priceImpact: '~$650 → $20,000 (innerhalb von 17 Monaten)'
    },
    {
      blockHeight: 630000,
      date: "11.05.2020",
      rewardBefore: 12.5,
      rewardAfter: 6.25,
      status: 'current',
      priceImpact: '~$8,600 → $69,000 (innerhalb von 18 Monaten)'
    },
    {
      blockHeight: 840000,
      date: "~April 2024",
      rewardBefore: 6.25,
      rewardAfter: 3.125,
      status: 'future'
    }
  ];


  // Show halving explanation when the component mounts
  useEffect(() => {
    if (!halvingExplanationShown) {
      setHalvingExplanationShown(true);
    }
  }, [halvingExplanationShown]);

  // Format large numbers with dots as thousand separators
  const formatNumber = (num: number) => {
    return num.toLocaleString('de-DE');
  };

  return (
    <div className={styles.page}>
      <div className={styles.introSection}>
        <h1>Block-Belohnung & Halving</h1>
        <p>Alle 210.000 Blöcke (~4 Jahre) halbiert sich die Bitcoin-Block-Belohnung</p>
      </div>

      {/* Interactive timeline of halvings */}
      <div className={styles.timelineContainer}>
        <h2>Bitcoin Halving Timeline</h2>
        <div className={styles.tabSelector}>
          {halvingEvents.map((event, index) => (
            <button 
              key={index}
              className={`${styles.tabButton} ${selectedTimelineEvent === index ? styles.active : ''}`}
              onClick={() => setSelectedTimelineEvent(index)}
            >
              {event.blockHeight === 0 ? 'Genesis' : `${index}. Halving`}
              {event.status === 'current' && <span className={styles.currentLabel}>• Aktuell</span>}
            </button>
          ))}
        </div>
        <div className={styles.timelineContent}>
          {halvingEvents.map((event, index) => (
            <div 
              key={index}
              className={`${styles.timelineItem} ${selectedTimelineEvent === index ? styles.active : ''}`}
            >
              <div className={styles.timelineDate}>{event.date}</div>
              <h3>Block #{formatNumber(event.blockHeight)}</h3>
              <div className={styles.rewardComparison}>
                <div className={styles.oldReward}>
                  <h3>Belohnung davor</h3>
                  <div className={styles.rewardAmount}>{event.rewardBefore} BTC</div>
                  <div className={styles.rewardCoins}>
                    {Array.from({ length: Math.min(event.rewardBefore, 50) }).map((_, i) => (
                      <span key={i} className={styles.rewardCoin}>₿</span>
                    ))}
                  </div>
                </div>

                <div className={styles.rewardArrow}>
                  <div className={styles.halvingIcon}>
                    <FaMinus />
                  </div>
                </div>

                <div className={styles.newReward}>
                  <h3>Belohnung danach</h3>
                  <div className={styles.rewardAmount}>{event.rewardAfter} BTC</div>
                  <div className={styles.rewardCoins}>
                    {Array.from({ length: Math.min(event.rewardAfter, 50) }).map((_, i) => (
                      <span key={i} className={styles.rewardCoin}>₿</span>
                    ))}
                  </div>
                </div>
              </div>

              {event.priceImpact && (
                <div className={styles.priceImpact}>
                  <h3>Preisauswirkung</h3>
                  <p>{event.priceImpact}</p>
                </div>
              )}

              {event.status === 'future' && (
                <div className={styles.expectationBox}>
                  <FaExclamationTriangle className={styles.warningIcon} />
                  <p>Dieses Halving steht noch bevor und wird die Blockbelohnung auf {event.rewardAfter} BTC reduzieren.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>


      {/* Economic Impact Section */}
      <div className={styles.economicImpact}>
        <h3><FaInfoCircle className={styles.infoIcon} /> Wirtschaftliche Bedeutung des Halvings</h3>
        <p>
          Die programmierte Verknappung durch Halvings macht Bitcoin zu einem deflationären Asset. 
          Während zentrale Banken die Geldmenge beliebig erhöhen können, ist Bitcoins 
          Ausgaberate vorhersehbar und endlich. Damit wird eine künstliche Inflation vermieden.
        </p>
        <div className={styles.impactPoints}>
          <div className={styles.impactPoint}>
            <strong>Reduzierte Inflation:</strong> Mit jedem Halving sinkt die Rate, mit der neue Bitcoins erzeugt werden
          </div>
          <div className={styles.impactPoint}>
            <strong>Angebotsverknappung:</strong> Bei gleichbleibender oder steigender Nachfrage kann dies den Wert steigern
          </div>
          <div className={styles.impactPoint}>
            <strong>Mining-Ökonomie:</strong> Miner müssen effizienter arbeiten oder auf steigende Transaktionsgebühren setzen
          </div>
        </div>
      </div>


      {/* Navigation button to go to next page */}
      <div className={styles.navigationButtons}>
        <button className={styles.nextButton} onClick={onNext}>
          Weiter
        </button>
      </div>
    </div>
  );
};

export default HalvingPage;
