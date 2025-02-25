import { useContext } from 'react';
import Landing from './components/Landing';
import InfoMenu from './components/InfoMenu';
import ExplanationOverlay from './components/ExplanationOverlay';
import { OverlayProvider, OverlayContext } from './context/OverlayContext';

function AppContent() {
  const { text, setText } = useContext(OverlayContext);
  return (
    <>
      <header className="App-header">
        <InfoMenu onMenuItemClick={(explanation) => setText(explanation)} />
      </header>
      <main>
        <Landing />
      </main>
      {text && <ExplanationOverlay text={text} onClose={() => setText('')} />}
    </>
  );
}

function App() {
  return (
    <OverlayProvider>
      <div className="App">
        <AppContent />
      </div>
    </OverlayProvider>
  );
}

export default App;
