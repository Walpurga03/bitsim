import React, { useState, useRef, useEffect } from 'react';
import { FaVolumeUp } from 'react-icons/fa';
import styles from './ExplanationOverlay.module.scss';

interface ExplanationOverlayProps {
  text: any; // Stelle sicher, dass hier String erwartet wird oder konvertiere weiter unten
  onClose: () => void;
  audioFile?: string; // optionaler Prop für die Audiodatei
}

const ExplanationOverlay: React.FC<ExplanationOverlayProps> = ({ text, onClose, audioFile }) => {
  // Konvertiere text in einen String, falls er nicht definiert oder kein String ist
  const safeText = text !== null && text !== undefined ? String(text) : '';
  const lines = safeText.split('\n').filter(line => line.trim() !== '');
  const heading = lines.length ? lines[0].trim() : '';
  const paragraphs = lines.slice(1);
  
  const [isPlaying, setIsPlaying] = useState(false);
  // nur wenn eine audioFile vorhanden ist, initialisieren wir die Audio-Referenz
  const audioRef = useRef<HTMLAudioElement | null>(audioFile ? new Audio(audioFile) : null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        {heading && <h2>{heading}</h2>}
        {paragraphs.map((para, index) => (
          <p key={index}>{para.trim()}</p>
        ))}
        {/* Nur anzeigen, wenn ein audioFile übergeben wurde */}
        {audioFile && (
          <button 
            className={styles.audioButton} 
            onClick={toggleAudio}
            style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}
          >
            <FaVolumeUp size={20} color={isPlaying ? 'green' : undefined} />
            <span style={{ marginLeft: '0.5rem' }}>{isPlaying ? 'Sound On' : 'Sound Off'}</span>
          </button>
        )}
        <button className={styles.closeButton} onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
};

export default ExplanationOverlay;
