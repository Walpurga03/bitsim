import React, { useState } from 'react';
import ConsensusPage from '../pages/ConsensusPage';
import SatoshiIntroPage from '../pages/SatoshiIntroPage';
import BasicMiningPage from '../pages/BasicMiningPage';
import NodeNetworkPage from '../pages/NodeNetworkPage';
import DifficultyAdjustmentPage from '../pages/DifficultyAdjustmentPage';
import { TransactionPage } from '../pages/TransactionPage';
import HalvingPage from '../pages/HalvingPage';
import styles from '../styles/Simulation.module.scss';

const simulationPages = [
  { id: 1, title: 'Konsensus-Mechanismus', component: ConsensusPage },
  { id: 2, title: 'Satoshi Nakamoto: Einführung', component: SatoshiIntroPage },
  { id: 3, title: 'Mining Grundlagen', component: BasicMiningPage },
  { id: 4, title: 'Das Bitcoin-Netzwerk', component: NodeNetworkPage },
  { id: 5, title: 'Schwierigkeitsanpassung', component: DifficultyAdjustmentPage },
  { id: 6, title: 'Transaktionen', component: TransactionPage },
  { id: 7, title: 'Block-Belohnung & Halving', component: HalvingPage },
  // Weitere Seiten können hier hinzugefügt werden.
];

const Simulation: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const goToNextPage = () => {
    if (currentPageIndex < simulationPages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Hier könnte eine bessere "Simulation abgeschlossen" UI implementiert werden
      alert('Simulation abgeschlossen!');
    }
  };

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const CurrentPage = simulationPages[currentPageIndex].component;
  const currentTitle = simulationPages[currentPageIndex].title;

  return (
    <div className={styles.simulation}>
      <h1 className={styles.pageTitle}>{currentTitle}</h1>
      
      <div className={styles.stepContainer}>
        <CurrentPage onNext={goToNextPage} />
        
        <div className={styles.navigationControls}>
          {currentPageIndex > 0 && (
            <button 
              className={styles.prevButton} 
              onClick={goToPrevPage}
            >
              ← Zurück
            </button>
          )}
          
          {currentPageIndex < simulationPages.length - 1 ? (
            <button 
              className={styles.nextButton} 
              onClick={goToNextPage}
            >
              Weiter →
            </button>
          ) : (
            <button 
              className={styles.nextButton} 
              onClick={goToNextPage}
            >
              Ende
            </button>
          )}
        </div>
      </div>

      <div className={styles.progressIndicator}>
        {simulationPages.map((_, index) => (
          <div 
            key={index} 
            className={`${styles.dot} ${index === currentPageIndex ? styles.active : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Simulation;