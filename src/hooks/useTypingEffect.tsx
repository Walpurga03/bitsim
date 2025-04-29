// hooks/useTypingEffect.js
import { useState, useEffect } from 'react';

interface TypingEffectOptions {
  typeSpeed?: number;
  eraseSpeed?: number;
  delayBetween?: number;
}

export function useTypingEffect(words: string[] = [], options: TypingEffectOptions = {}): {
  text: string;
  isTyping: boolean;
} {
  const { typeSpeed = 150, eraseSpeed = 100, delayBetween = 1500 } = options;
  const [displayedText, setDisplayedText] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  
  useEffect(() => {
    if (words.length === 0) return;
    
    let timeout: ReturnType<typeof setTimeout>;
    
    // Typing-Phase
    if (isTyping) {
      if (displayedText === words[currentIndex]) {
        // Text vollständig getippt
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, delayBetween);
      } else {
        // Text noch nicht vollständig getippt
        timeout = setTimeout(() => {
          setDisplayedText(words[currentIndex].substring(0, displayedText.length + 1));
        }, typeSpeed);
      }
    } 
    // Löschen-Phase
    else {
      if (displayedText === '') {
        // Text vollständig gelöscht
        const nextIndex = (currentIndex + 1) % words.length;
        setCurrentIndex(nextIndex);
        setIsTyping(true);
      } else {
        // Text noch nicht vollständig gelöscht
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.substring(0, displayedText.length - 1));
        }, eraseSpeed);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [displayedText, currentIndex, isTyping, words, typeSpeed, eraseSpeed, delayBetween]);
  
  return { text: displayedText, isTyping };
}