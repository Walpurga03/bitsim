import React, { useState } from 'react';
import ConsensusPage from '../pages/ConsensusPage';
import SatoshiPage from '../pages/SatoshiPage';

const simulationPages = [
  { id: 1, component: ConsensusPage },
  { id: 2, component: SatoshiPage },
  // Weitere Seiten können hier hinzugefügt werden.
];

const Simulation: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const goToNextPage = () => {
    if (currentPageIndex < simulationPages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      alert('Simulation abgeschlossen!');
    }
  };

  const CurrentPage = simulationPages[currentPageIndex].component;

  return <CurrentPage onNext={goToNextPage} />;
};

export default Simulation;
