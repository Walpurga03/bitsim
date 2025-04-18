import React, { useState } from 'react';
import styles from '../styles/SatoshiPage.module.scss';
import { FaLink, FaBitcoin, FaCalendarAlt, FaPizzaSlice} from 'react-icons/fa';
import { CgSmileMouthOpen } from "react-icons/cg";
interface SatoshiIntroPageProps {}

const SatoshiIntroPage: React.FC<SatoshiIntroPageProps> = () => {
  const [activeTab, setActiveTab] = useState('genesis');

  const timeline = [
    {
      id: 'genesis',
      title: 'Bitcoin Whitepaper',
      date: '31. Oktober 2008',
      icon: <FaLink />,
      content: 'Satoshi Nakamoto veröffentlicht das Bitcoin-Whitepaper "Bitcoin: A Peer-to-Peer Electronic Cash System" auf einer Mailingliste für Kryptographie. Dies markiert den ersten Schritt zur Schaffung eines dezentralen digitalen Geldsystems ohne zentrale Autorität.'
    },
    {
      id: 'launch',
      title: 'Genesis-Block',
      date: '3. Januar 2009',
      icon: <FaBitcoin />,
      content:( <>
        Der allererste Block (Genesis-Block) wird von Satoshi geschürft. In diesem Block ist die Nachricht "Chancellor on brink of second bailout for banks" eingebettet - ein Hinweis auf die Finanzkrise und ein Statement für die Notwendigkeit eines alternativen Geldsystems.<br />
        <a
          href="https://mempool.space/de/block/0"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#F7931A", textDecoration: "underline" }}
        >
          <strong>Block:</strong> 0<br />
        </a>
      </>) 
    },
    {
      id: 'transaction',
      title: 'Erste Transaktion',
      date: '12. Januar 2009',
      icon: <FaCalendarAlt />,
      content: (
        <>
          Die erste Bitcoin-Transaktion findet statt: Satoshi sendet 10 BTC an Hal Finney, einen frühen Unterstützer des Projekts. Finney twitterte den inzwischen berühmten Satz: "Running Bitcoin" während er die Software testete.<br />
          <a
            href="https://mempool.space/de/block/170"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#F7931A", textDecoration: "underline" }}
          >
            <strong>Block:</strong> 170<br />
          </a>
        </>
      )
    },
    {
      id: 'pizza',
      title: 'Pizza Tag',
      date: '22. Mai 2010',
      icon: <FaPizzaSlice />,
      content: (
        <>
          Laszlo Hanyecz tätigte die erste reale Transaktion mit Bitcoin: Er kaufte zwei Pizzen für 10.000 BTC (heute mehrere hundert Millionen Euro wert). Dieser Tag markiert den Beginn der praktischen Nutzung von Bitcoin als Tauschmittel und wird jährlich als "Bitcoin Pizza Day" gefeiert.<br />
          <a
            href="https://mempool.space/de/block/57043"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#F7931A", textDecoration: "underline" }}
          >
            <strong>Block:</strong> 57043<br />
          </a>
        </>
      )
    },
    {
      id: 'erbe',
      title: 'Das Erbe',
      date: 'Bitcoin',
      icon: <CgSmileMouthOpen />,
      content: 'Satoshi hinterließ mehr als nur Code. Die Prinzipien von Dezentralisierung und finanzieller Souveränität, die in Bitcoin eingebettet sind, haben eine globale Bewegung ausgelöst. Sein Verschwinden unterstreicht die Idee, dass Bitcoin niemandem gehört – es gehört allen, die Teil des Netzwerks sind.'
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.introSection}>
        <h1 className={styles.title}>Satoshi Nakamoto</h1>
        
        <p className={styles.description}>
          Satoshi Nakamoto ist das Pseudonym des Bitcoin-Erfinders und Autors des legendären Whitepapers. 
          Wer hinter dem Namen steckt, ist bis heute ein Rätsel – doch seine Idee hat die Welt verändert.
          In dieser Etappe lernst du die wichtigsten Meilensteine der Bitcoin-Entstehung kennen.
        </p>
        
        <div className={styles.address}>
          1SatoshiPioneerXXX
        </div>
        
        <div className={styles.satoshiStats}>
          <div className={styles.statItem}>
            <span className={styles.statTitle}>Geminte Blöcke</span>
            <span className={styles.statValue}>~ 1 Million BTC</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statTitle}>Letzter Kontakt</span>
            <span className={styles.statValue}>23. April 2011</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statTitle}>Identität</span>
            <span className={styles.statValue}>Unbekannt</span>
          </div>
        </div>
      </div>
      
      <div className={styles.quoteSection}>
        <blockquote className={styles.quote}>
          "Das grundlegende Problem mit herkömmlichen Währungen ist das Vertrauen, das nötig ist, damit sie funktionieren. Der Zentralbank muss vertraut werden, dass sie die Währung nicht entwertet, aber die Geschichte von Fiat-Währungen ist voll von Vertrauensbrüchen."
          <cite>— Satoshi Nakamoto, 2009</cite>
        </blockquote>
      </div>
      
      <div className={styles.timelineContainer}>
        <h2>Die Bitcoin-Entstehungsgeschichte</h2>
        
        <div className={styles.tabSelector}>
          {timeline.map(item => (
            <button 
              key={item.id}
              className={`${styles.tabButton} ${activeTab === item.id ? styles.active : ''}`} 
              onClick={() => setActiveTab(item.id)}
            >
              <span className={styles.tabIcon}>{item.icon}</span>
              <span className={styles.tabText}>{item.title}</span>
            </button>
          ))}
        </div>
        
        <div className={styles.timelineContent}>
          {timeline.map(item => (
            <div 
              key={item.id} 
              className={`${styles.timelineItem} ${activeTab === item.id ? styles.active : ''}`}
            >
              <div className={styles.timelineDate}>{item.date}</div>
              <div className={styles.timelineText}>
                {typeof item.content === "string" ? item.content : item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SatoshiIntroPage;
