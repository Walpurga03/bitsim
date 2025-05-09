// Importbereich: Lädt alle benötigten Bibliotheken und Komponenten
import { useEffect, useRef, useState } from "react"; // React-Hooks für Zustand und Seiteneffekte
import { motion } from "framer-motion";              // Für UI-Animationen
import { gsap } from "gsap";                         // GreenSock Animation Platform
import { ScrollTrigger } from "gsap/ScrollTrigger";  // Scroll-basierte Animationen
import { FaArrowRight, FaInfoCircle } from 'react-icons/fa'; // Icon-Komponenten
import Bitcoin3D from './Bitcoin3D';                 // 3D-Münz-Komponente
import Simulation from './Simulation';               // Hauptsimulationsseite
import { useTypingEffect } from '../hooks/useTypingEffect'; // Benutzerdefinierter Hook für Typing-Animation
import styles from "../styles/Landing.module.scss";  // Modulares SCSS für Styling

const Landing = () => {
  // DOM-Referenzen für Animationen
  const heroRef = useRef(null);     // Referenz auf Hauptcontainer
  const titleRef = useRef(null);    // Referenz auf Titelbereich
  const descRef = useRef(null);     // Referenz auf Beschreibungsbereich
  
  // State-Management
  const [simulate, setSimulate] = useState(false); // Zustandsvariable für Navigation zur Simulation
  
  // Liste der Bitcoin-Begriffe für die Typing-Animation
  const words = ['Blockchain', 'Consensus', 'Mining', 'Network', 'Nodes', 
                'Difficulty', 'Transactions', 'Mempool', 'Halving'];
  
  // Typing-Effekt-Hook initialisieren mit Geschwindigkeitsparametern
  const { text } = useTypingEffect(words, { 
    typeSpeed: 80,      // Zeit pro Zeichen beim Tippen (ms)
    eraseSpeed: 60,      // Zeit pro Zeichen beim Löschen (ms)
    delayBetween: 1500   // Pause zwischen Wörtern (ms)
  });
  
  // Funktion zum Wechseln zur Simulationsansicht
  const startSimulation = () => setSimulate(true);
  
  useEffect(() => {
    // GSAP für komplexe Animationssequenzen einrichten
    gsap.registerPlugin(ScrollTrigger);
    
    // Starte Animationen nur, wenn alle Refs existieren
    if (heroRef.current && titleRef.current) {
      // Timeline-Animation definieren
      const tl = gsap.timeline();
      
      // Animation 1: Gesamter Herobereich einblenden
      tl.fromTo(
        heroRef.current, 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      );
      
      // Animation 2: Titel von unten einfahren
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.7)" },
        "-=0.5"
      );
      
      // Animation 3 nur ausführen, wenn descRef existiert
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.7, stagger: 0.2 },
          "-=0.3"
        );
      }
    }
    
    // ScrollTrigger-Setup für Panel-Animationen
    const panels = document.querySelectorAll(`.${styles.panel}`);
    if (panels.length > 0) {
      panels.forEach(panel => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => panel.classList.add(styles.active),
          onLeave: () => panel.classList.remove(styles.active),
          onEnterBack: () => panel.classList.add(styles.active),
          onLeaveBack: () => panel.classList.remove(styles.active)
        });
      });
    }
    
    // Cleanup-Funktion
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []); // Leeres Dependency-Array: Effekt nur beim ersten Rendern ausführen

  // Bedingte Weiterleitung zur Simulation, wenn Button geklickt wurde
  if (simulate) {
    return <Simulation />;
  }

  // Hauptinhalt der Landing Page in prozentualer Aufteilung (100vh Höhe total)
  return (
    <div className={styles.landingContainer}>
      <section ref={heroRef} className={styles.heroSection}>
        <div className={styles.particleOverlay}></div> {/* Hintergrundeffekt */}

        {/* Title-Bereich (20% Höhe) */}
        <motion.div 
          ref={titleRef}
          className={styles.titleWrapper}
          initial={{ opacity: 0}}              // Startzustand für Animation
          animate={{ opacity: 1}}              // Zielzustand für Animation
          transition={{ 
            duration: 1.5,                     // Reduzierte Dauer
            ease: "easeOut",                   // Easing-Funktion (Beschleunigung)
            delay: 1                           // Frühere Einblendung
          }}
        >
          <h1 className={styles.glassTitle}>   {/* Glasmorphismus-Effekt */}
            <div className={styles.typingContainer}>
              <span className={styles.staticTxt}>Bitcoin</span>
              <span className={styles.typingText}>{text}</span> {/* Dynamischer Text aus Hook */}
            </div>
          </h1>
        </motion.div>

        {/* Bitcoin 3D-Modell (45% Höhe - Hauptblickfang) */}
        <motion.div 
          className={styles.bitcoinWrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1}}
          transition={{ 
            duration: 5,                       // Längere Dauer für sanftes Einblenden
            ease: "easeOut",
            delay: 0.5                         // Erscheint als erstes Element
          }}
        >
          <Bitcoin3D />                        {/* 3D-Komponente (separate Datei) */}
        </motion.div>

        {/* Info-Hinweis (15% Höhe) */}
        <motion.div 
          ref={descRef}
          className={styles.infoHintContainer}
          initial={{ opacity: 0, y: 20 }}      // Startet unsichtbar und versetzt
          animate={{ opacity: 1, y: 0 }}       // Wird sichtbar und bewegt sich nach oben
          transition={{ 
            duration: 1, 
            ease: "easeOut", 
            delay: 5                           // Erscheint nach Titel
          }}
        >
          <div className={styles.infoHint}>
            <FaInfoCircle size={20} className={styles.infoIcon} /> {/* Icon */}
            <p>
              <strong>INFO-Button</strong> für technische Erklärungen nutzen!
            </p>
          </div>
        </motion.div>

        {/* Rechtliche Notiz (10% Höhe) */}
        <motion.p 
          className={styles.note}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 1, 
            ease: "easeOut", 
            delay: 6                          // Erscheint nach Info-Hinweis
          }}
        >
          Diese Simulation dient ausschließlich Lernzwecken und ist vereinfacht dargestellt.
        </motion.p>

        {/* CTA-Button (10% Höhe) */}
        <motion.div 
          className={styles.ctaWrapper}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            ease: "easeOut",
            delay: 1                          // Erscheint als letztes Element
          }}
        >
          <button 
            className={styles.ctaButton}
            onClick={startSimulation}         // Funktion zum Starten der Simulation
          >
            Simulation starten
            <FaArrowRight className={styles.buttonIcon} /> {/* Pfeil-Icon */}
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;


