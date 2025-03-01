import React, { useState, useRef, useEffect } from 'react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import styles from './ExplanationOverlay.module.scss';

interface ExplanationOverlayProps {
  text: any;
  onClose: () => void;
  audioFile?: string;
}

const ExplanationOverlay: React.FC<ExplanationOverlayProps> = ({ text, onClose, audioFile }) => {
  // Konvertiere text in einen String, falls er nicht definiert oder kein String ist
  const safeText = text !== null && text !== undefined ? String(text) : '';
  const lines = safeText.split('\n').filter(line => line.trim() !== '');
  const heading = lines.length ? lines[0].trim() : '';
  const paragraphs = lines.slice(1);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(audioFile ? new Audio(audioFile) : null);
  
  // Referenz für das Content-Div, um zu prüfen, ob wir scrollen können
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      const playPromise = audioRef.current.play();
      
      // Behandle potenzielle Fehler beim Abspielen (z.B. wenn der Browser das Autoplay blockiert)
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Audio playback failed:', error);
        });
      }
    }
    
    setIsPlaying(!isPlaying);
  };

  // Wenn die Audio-Datei zu Ende gespielt wurde, setze den Status zurück
  useEffect(() => {
    const audio = audioRef.current;
    
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
  }, []);

  // Verhindere, dass der Hintergrund scrollt, wenn das Overlay geöffnet ist
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Schließe das Overlay bei Escape-Taste
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={(e) => {
      // Schließe das Overlay nur, wenn der Hintergrund angeklickt wird
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className={styles.content} ref={contentRef}>
        {heading && <h2>{heading}</h2>}
        
        {paragraphs.map((para, index) => (
          <p key={index}>{para.trim()}</p>
        ))}
        
        <div className={styles.buttonContainer}>
          {audioFile && (
            <button 
              className={`${styles.audioButton} ${isPlaying ? styles.playing : ''}`}
              onClick={toggleAudio}
              aria-label={isPlaying ? 'Audio pausieren' : 'Audio abspielen'}
            >
              {isPlaying ? (
                <>
                  <FaVolumeUp size={18} />
                  <span style={{ marginLeft: '0.5rem' }}>Sound aus</span>
                </>
              ) : (
                <>
                  <FaVolumeMute size={18} />
                  <span style={{ marginLeft: '0.5rem' }}>Sound an</span>
                </>
              )}
            </button>
          )}
          
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Overlay schließen"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationOverlay;