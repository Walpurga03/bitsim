import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Consensus from '../pages/Consensus';
import SatoshiIntroPage from '../pages/Blockchain';
import BasicMiningPage from '../pages/Mining';
import NodeNetworkPage from '../pages/NodeNetwork';
import DifficultyAdjustmentPage from '../pages/Difficulty';
import TransactionPage from '../pages/TransactionPage';
import MempoolPage from '../pages/MempoolPage';
import HalvingPage from '../pages/Halving';
import EndPage from '../pages/EndPage';
import styles from '../styles/Simulation.module.scss';

const simulationPages = [
  { id: 1, title: 'Satoshi Nakamoto: Einführung', component: SatoshiIntroPage },
  { id: 2, title: 'Konsensus-Mechanismus', component: Consensus },
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
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateToPage = (index: number) => {
    if (index >= 0 && index < simulationPages.length && !isNavigating) {
      setIsNavigating(true);
      setCurrentPageIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Kurze Verzögerung, um schnelles Klicken zu verhindern
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

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
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPageIndex}
          className={styles.stepContainer}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <CurrentPage {...pageProps} />
          
          {!isEndPage && (
            <motion.div
              className={styles.navigationControls}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentPageIndex > 0 && (
                <motion.button 
                  className={styles.prevButton} 
                  onClick={goToPrevPage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Zurück
                </motion.button>
              )}
              
              {currentPageIndex < simulationPages.length - 2 && (
                <motion.button 
                  className={styles.nextButton} 
                  onClick={goToNextPage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Weiter →
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {!isEndPage && (
        <motion.div 
          className={styles.progressIndicator}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {simulationPages.slice(0, simulationPages.length - 1).map((_, index) => (
            <div 
              key={index} 
              className={`${styles.dot} ${index === currentPageIndex ? styles.active : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => navigateToPage(index)}
              onKeyDown={(e) => e.key === 'Enter' && navigateToPage(index)}
              aria-label={`Gehe zu Seite ${index + 1}: ${simulationPages[index].title}`}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Simulation;