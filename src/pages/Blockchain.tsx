import React, { useState } from 'react';
import styles from '../styles/Blockchain.module.scss';
import { FaBitcoin, FaCalendarAlt, FaPizzaSlice, FaCubes } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface BlockchainProps {}

const Blockchain: React.FC<BlockchainProps> = () => {
  const [activeTab, setActiveTab] = useState('genesis');

  // Blockchain-Events ohne Whitepaper
  const blockchainEvents = [
    {
      id: 'genesis',
      title: 'Genesis-Block',
      date: '3. Januar 2009',
      blockHeight: 0,
      icon: <FaCubes />,
      content: ( <>
        Der allererste Block (Genesis-Block) wird von Satoshi geschürft. In diesem Block ist die Nachricht 
        <strong>"Chancellor on brink of second bailout for banks"</strong> eingebettet - ein ewiger Eintrag in der Blockchain, 
        der die Bankenkrise dokumentiert und Bitcoins Entstehungszweck verdeutlicht.
        <div className={styles.blockchainRecord}>
          <h4>In der Blockchain verewigt:</h4>
          <div className={styles.blockData}>
            <div className={styles.blockProperty}>
              <span className={styles.propertyName}>Block:</span>
              <a
                href={`https://mempool.space/de/block/${0}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.blockLink}
              >
                0
              </a>
            </div>
            <div className={styles.blockProperty}>
              <span className={styles.propertyName}>Hash:</span>
              <span className={styles.propertyValue}>000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f</span>
            </div>
            <div className={styles.blockProperty}>
              <span className={styles.propertyName}>Zeitstempel:</span>
              <span className={styles.propertyValue}>2009-01-03 18:15:05 UTC</span>
            </div>
          </div>
        </div>
      </>) 
    },
    {
      id: 'transaction',
      title: '1. Transaktion',
      date: '12. Januar 2009',
      blockHeight: 170,
      icon: <FaCalendarAlt />,
      content: (
        <>
          Die erste Bitcoin-Transaktion zwischen zwei Personen wird in Block 170 verifiziert und für immer in der Blockchain festgehalten: 
          Satoshi sendet 10 BTC an Hal Finney. Diese Transaktion markiert den ersten echten Werttransfer im Netzwerk.
          <div className={styles.blockchainRecord}>
            <h4>In der Blockchain verewigt:</h4>
            <div className={styles.blockData}>
              <div className={styles.blockProperty}>
                <span className={styles.propertyName}>Block:</span>
                <a
                  href={`https://mempool.space/de/block/${170}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.blockLink}
                >
                  170
                </a>
              </div>
              <div className={styles.blockProperty}>
                <span className={styles.propertyName}>Transaktion:</span>
                <span className={styles.propertyValue}>f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16</span>
              </div>
              <div className={styles.blockProperty}>
                <span className={styles.propertyName}>Betrag:</span>
                <span className={styles.propertyValue}>10 BTC</span>
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'pizza',
      title: 'Pizza Day',
      date: '22. Mai 2010',
      blockHeight: 57043,
      icon: <FaPizzaSlice />,
      content: (
        <>
          Die erste reale Kauftransaktion mit Bitcoin wird in Block 57043 bestätigt. Laszlo Hanyecz kaufte zwei Pizzen für 10.000 BTC - 
          eine Transaktion, die als Beweis dient, dass Bitcoin als Tauschmittel funktionieren kann.
          <div className={styles.blockchainRecord}>
            <h4>In der Blockchain verewigt:</h4>
            <div className={styles.blockData}>
              <div className={styles.blockProperty}>
                <span className={styles.propertyName}>Block:</span>
                <a
                  href={`https://mempool.space/de/block/${57043}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.blockLink}
                >
                  57043
                </a>
              </div>
              <div className={styles.blockProperty}>
                <span className={styles.propertyName}>Datum in Blockchain:</span>
                <span className={styles.propertyValue}>2010-05-22 18:16:42 UTC</span>
              </div>
              <div className={styles.blockProperty}>
                <span className={styles.propertyName}>Heutiger Wert:</span>
                <span className={styles.propertyValue}>~450 Millionen €</span>
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'halving',
      title: 'Erstes Halving',
      date: '28. November 2012',
      blockHeight: 210000,
      icon: <FaBitcoin />,
      content: (
        <>
          Das erste Bitcoin-Halving reduzierte die Block-Belohnung von 50 auf 25 BTC. Dieses programmierte Ereignis 
          ist direkt in der Blockchain verankert und demonstriert, wie Regeln ohne zentrale Autorität durchgesetzt werden.
          <div className={styles.blockchainRecord}>
            <h4>In der Blockchain verewigt:</h4>
            <div className={styles.blockData}>
              <div className={styles.blockProperty}>
                <span className={styles.propertyName}>Block:</span>
                <a
                  href={`https://mempool.space/de/block/${210000}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.blockLink}
                >
                  210000
                </a>
              </div>
              <div className={styles.blockProperty}>
                <span className={styles.propertyName}>Belohnung vorher:</span>
                <span className={styles.propertyValue}>50 BTC</span>
              </div>
              <div className={styles.blockProperty}>
                <span className={styles.propertyName}>Belohnung nachher:</span>
                <span className={styles.propertyValue}>25 BTC</span>
              </div>
            </div>
          </div>
        </>
      )
    }
  ];

  return (
    <div className={styles.pageContainer}>
      <section className={styles.blockchainSection}>
        {/* Intro-Bereich */}
        <motion.div 
          className={styles.introSection}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          >
          <h1 className={styles.title}>Die Blockchain</h1>
          
          <p className={styles.description}>
            Die Blockchain ist nicht nur eine Technologie, sondern ein unveränderliches Geschichtsbuch. 
            Jeder Block enthält Transaktionen und Informationen, die für immer bewahrt werden. 
            Hier siehst du, wie historische Bitcoin-Ereignisse in der Blockchain verewigt sind.
          </p>
        </motion.div>
        
        {/* Interaktive Blockchain-Visualisierung als Navigation */}
        <motion.div 
          className={styles.blockchainNavigation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className={styles.blockchainContainer}>
            {blockchainEvents.map((item, index) => (
              <React.Fragment key={item.id}>
                <button 
                  className={`${styles.blockButton} ${activeTab === item.id ? styles.activeBlock : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <div className={styles.blockInner}>
                    <div className={styles.blockIcon}>{item.icon}</div>
                    <div className={styles.blockInfo}>
                      <span className={styles.blockTitle}>{item.title}</span>
                      <span className={styles.blockHeight}>
                        {typeof item.blockHeight === 'number' ? `Block ${item.blockHeight}` : item.blockHeight}
                      </span>
                    </div>
                    <div className={styles.blockDate}>{item.date}</div>
                  </div>
                </button>
                
                {index < blockchainEvents.length - 1 && (
                  <div className={styles.blockchainLink}>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
        
        {/* Timeline-Inhalt mit verbesserter Darstellung */}
        <motion.div 
          className={styles.timelineSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className={styles.timelineContent}>
            {blockchainEvents.map(item => (
              <motion.div 
                key={item.id} 
                className={`${styles.timelineItem} ${activeTab === item.id ? styles.active : ''}`}
                initial={{ opacity: 0, y: 50 }}
                animate={activeTab === item.id ? 
                  { opacity: 1, y: 0, transition: { duration: 0.5 } } : 
                  { opacity: 0, y: 50, transition: { duration: 0.3 } }
                }
              >
                {/* Header mit Titel und Blockinfo */}
                <div className={styles.timelineHeader}>
                  <div className={styles.headerLeft}>
                    <h3 className={styles.timelineTitle}>
                      <span className={styles.titleIcon}>{item.icon}</span>
                      {item.title}
                    </h3>
                    <div className={styles.timelineDate}>
                      <FaCalendarAlt className={styles.calendarIcon} />
                      {item.date}
                    </div>
                  </div>
                  <div className={styles.timelineBlockHeight}>
                    <FaCubes className={styles.blockIcon} />
                    <span className={styles.blockNumber}>
                      {typeof item.blockHeight === 'number' ? `#${item.blockHeight}` : item.blockHeight}
                    </span>
                  </div>
                </div>
                
                {/* Inhaltsbereich mit verbesserter Animation */}
                <motion.div 
                  className={styles.timelineText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {item.content}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Blockchain;