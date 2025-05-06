import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaMinus } from 'react-icons/fa';
import styles from '../styles/Halving.module.scss';

interface HalvingPageProps {
  onNext: () => void;
}

interface HalvingEvent {
  blockHeight: number;
  date: string;
  rewardBefore: number;
  rewardAfter: number;
  status: 'past' | 'current' | 'future';
  keyEvents?: string;
  circulatingSupply: string;
}

// Hilfsfunktion zum Extrahieren des Prozentsatzes
const extractPercentage = (supplyText: string): number => {
  const match = supplyText.match(/\((\d+(?:\,\d+)?)%\)/);
  if (match && match[1]) {
    return parseFloat(match[1].replace(',', '.'));
  }
  return 0;
};

// Moderne Supply-Visualisierung mit Farbverlauf und Glaseffekt
const ModernSupplyGauge: React.FC<{percentage: number}> = ({ percentage }) => {
  const size = 150;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={styles.modernSupplyContainer}>
      <div className={styles.gaugeWrapper}>
        {/* Hintergrund-Glow-Effekt */}
        <div className={styles.backgroundGlow}></div>
        
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Hintergrund-Track mit Glanzeffekt */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="url(#trackGradient)"
            strokeWidth={strokeWidth}
            className={styles.trackCircle}
          />
          
          {/* Progress-Kreis mit Farbverlauf */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className={styles.progressCircle}
          />
          
          {/* Farbverläufe definieren */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffcc33" />
              <stop offset="100%" stopColor="#f7931a" />
            </linearGradient>
            
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2a2a2a" />
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>
            
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1 0 0 0 0.6 0 0 0 0 0.1 0 0 0 0.8 0" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
        
        <div className={styles.gaugeCenter}>
          <div className={styles.percentageValue}>{percentage}%</div>
          <div className={styles.percentageLabel}>Bitcoin im Umlauf</div>
        </div>
      </div>
      
      <div className={styles.gaugeInfo}>
        <div className={styles.gaugeInfoItem}>
          <div className={styles.gaugeInfoTitle}>Aktueller Bestand</div>
          <div className={styles.gaugeInfoValue}>{((percentage * 21) / 100).toFixed(2)} Mio BTC</div>
        </div>
        <div className={styles.gaugeInfoItem}>
          <div className={styles.gaugeInfoTitle}>Maximum</div>
          <div className={styles.gaugeInfoValue}>21 Mio BTC</div>
        </div>
      </div>
    </div>
  );
};

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
      circulatingSupply: '0 von 21 Millionen BTC (0%)'
    },
    {
      blockHeight: 210000,
      date: "28.11.2012",
      rewardBefore: 50,
      rewardAfter: 25,
      status: 'past',
      circulatingSupply: '10,5 von 21 Millionen BTC (50%)'
    },
    {
      blockHeight: 420000,
      date: "09.07.2016",
      rewardBefore: 25,
      rewardAfter: 12.5,
      status: 'past',
      circulatingSupply: '15,75 von 21 Millionen BTC (75%)'
    },
    {
      blockHeight: 630000,
      date: "11.05.2020",
      rewardBefore: 12.5,
      rewardAfter: 6.25,
      status: 'past',
      circulatingSupply: '18,375 von 21 Millionen BTC (87,5%)'
    },
    {
      blockHeight: 840000,
      date: "20.04.2024",
      rewardBefore: 6.25,
      rewardAfter: 3.125,
      status: 'current',
      circulatingSupply: '19,69 von 21 Millionen BTC (93,75%)'
    },
    {
      blockHeight: 1050000,
      date: "~März 2028",
      rewardBefore: 3.125,
      rewardAfter: 1.5625,
      status: 'future',
      circulatingSupply: '20,34 von 21 Millionen BTC (96,875%)'
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
    <div className={styles.page} style={{border: '2px solid red'}}>
      {/* Intro */}
      <section className={styles.introSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Block-Belohnung & Halving</h1>
          <p>Alle 210.000 Blöcke (~4 Jahre) halbiert sich die Bitcoin-Block-Belohnung</p>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className={styles.timelineContainer}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
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
                <div className={styles.supplyContainer}>
                  <div className={styles.supplyInfo}>
                    <strong>Bitcoin im Umlauf:</strong> {event.circulatingSupply}
                  </div>
                  <ModernSupplyGauge percentage={extractPercentage(event.circulatingSupply)} />
                </div>
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
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Economic Impact */}
      <section className={styles.economicImpact}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
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
        </motion.div>
      </section>

      {/* Navigation */}
      <section className={styles.navigationButtons}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <button className={styles.nextButton} onClick={onNext}>
            Weiter
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default HalvingPage;
