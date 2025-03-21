import React, { useState } from 'react';
import ConsensusPage from '../pages/ConsensusPage';
import SatoshiIntroPage from '../pages/SatoshiIntroPage';
import BasicMiningPage from '../pages/BasicMiningPage';
import NodeNetworkPage from '../pages/NodeNetworkPage';
import DifficultyAdjustmentPage from '../pages/DifficultyAdjustmentPage';
import { TransactionPage } from '../pages/TransactionPage';
import MempoolPage from '../pages/MempoolPage';
import HalvingPage from '../pages/HalvingPage';
import EndPage from '../pages/EndPage';
import styles from '../styles/Simulation.module.scss';

const simulationPages = [
  { id: 1, title: 'Konsensus-Mechanismus', component: ConsensusPage },
  { id: 2, title: 'Satoshi Nakamoto: Einführung', component: SatoshiIntroPage },
  { id: 3, title: 'Mining Grundlagen', component: BasicMiningPage },
  { id: 4, title: 'Das Bitcoin-Netzwerk', component: NodeNetworkPage },
  { id: 5, title: 'Schwierigkeitsanpassung', component: DifficultyAdjustmentPage },
  { id: 6, title: 'Transaktionen', component: TransactionPage },
  { id: 7, title: 'Mempool & Gebührenmarkt', component: MempoolPage },
  { id: 8, title: 'Block-Belohnung & Halving', component: HalvingPage },
  { id: 9, title: 'Abschluss', component: EndPage },
];

const Simulation: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const goToNextPage = () => {
    if (currentPageIndex < simulationPages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const restartSimulation = () => {
    setCurrentPageIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const CurrentPage = simulationPages[currentPageIndex].component;
  const isEndPage = currentPageIndex === simulationPages.length - 1;

  // Wenn wir bei der EndPage sind, ersetzen wir die normale onNext-Funktion durch restartSimulation
  const pageProps = {
    onNext: goToNextPage,
    onRestart: restartSimulation
  };

  return (
    <div className={styles.simulation}>
      <div className={styles.stepContainer}>
        <CurrentPage {...pageProps} />
        
        {!isEndPage && (
          <div className={styles.navigationControls}>
            {currentPageIndex > 0 && (
              <button 
                className={styles.prevButton} 
                onClick={goToPrevPage}
              >
                ← Zurück
              </button>
            )}
            
            {currentPageIndex < simulationPages.length - 2 && (
              <button 
                className={styles.nextButton} 
                onClick={goToNextPage}
              >
                Weiter →
              </button>
            )}
          </div>
        )}
      </div>

      {!isEndPage && (
        <div className={styles.progressIndicator}>
          {simulationPages.slice(0, simulationPages.length - 1).map((_, index) => (
            <div 
              key={index} 
              className={`${styles.dot} ${index === currentPageIndex ? styles.active : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Simulation;