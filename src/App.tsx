import { useContext } from 'react';
import Landing from './components/Landing';
import InfoMenu from './components/InfoMenu';
import ExplanationOverlay from './components/ExplanationOverlay';
import { OverlayProvider, OverlayContext } from './context/OverlayContext';

// AppContent component handles the main content and overlay logic
function AppContent() {
  const { text, setText } = useContext(OverlayContext);
  return (
    <>
      <header className="App-header">
        {/* InfoMenu triggers overlay content updates */}
        <InfoMenu onMenuItemClick={(data) => setText(data)} />
      </header>
      <main>
        <Landing />
      </main>
      {text && (
        <ExplanationOverlay
          text={text.explanation}
          onClose={() => setText(null)}
          audioFile={text.audioFile}
        />
      )}
    </>
  );
}

// App component wraps the content with OverlayProvider
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
