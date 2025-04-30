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
    typeSpeed: 100,      // Zeit pro Zeichen beim Tippen (ms)
    eraseSpeed: 80,      // Zeit pro Zeichen beim Löschen (ms)
    delayBetween: 2000   // Pause zwischen Wörtern (ms)
  });
  
  // Funktion zum Wechseln zur Simulationsansicht
  const startSimulation = () => setSimulate(true);
  
  
  useEffect(() => {
    // GSAP für komplexe Animationssequenzen einrichten
    gsap.registerPlugin(ScrollTrigger);
    
    // Timeline-Animation definieren (Sequenz von Animationsschritten)
    const tl = gsap.timeline();
    
    // Animation 1: Gesamter Herobereich einblenden mit leichter Skalierung
    tl.fromTo(
      heroRef.current, 
      { opacity: 0, scale: 0.9 },             // Startzustand
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out" } // Endzustand
    )
    // Animation 2: Titel von unten einfahren mit Überschneidung zur vorigen Animation
    .fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },                  // Startzustand
      { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.7)" },
      "-=0.5"                                 // Überlappung mit voriger Animation
    )
    // Animation 3: Beschreibung einblenden
    .fromTo(
      descRef.current,
      { opacity: 0 },                         // Startzustand
      { opacity: 1, duration: 0.7, stagger: 0.2 }, // Endzustand (stagger = zeitversetzt)
      "-=0.3"                                 // Überlappung mit voriger Animation
    );
    
    // ScrollTrigger-Setup für Panel-Animationen beim Scrollen
    const panels = document.querySelectorAll(`.${styles.panel}`);
    panels.forEach(panel => {
      ScrollTrigger.create({
        trigger: panel,                       // Element, das Animation auslöst
        start: "top bottom",                  // Starttrigger: Oberkante des Panels trifft Unterkante des Viewports
        end: "bottom top",                    // Endtrigger: Unterkante des Panels trifft Oberkante des Viewports
        onEnter: () => panel.classList.add(styles.active),      // Beim Eintreten aktivieren
        onLeave: () => panel.classList.remove(styles.active),   // Beim Verlassen deaktivieren
        onEnterBack: () => panel.classList.add(styles.active),  // Beim Zurückkommen aktivieren
        onLeaveBack: () => panel.classList.remove(styles.active)// Beim Zurückverlassen deaktivieren
      });
    });
    
    // Cleanup-Funktion: Entfernt alle ScrollTrigger beim Komponentenabbau
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
            duration: 2,                       // Animationsdauer in Sekunden
            ease: "easeOut",                   // Easing-Funktion (Beschleunigung)
            delay: 5                           // Verzögerung vor Animationsstart
          }}
        >
          <h1 className={styles.glassTitle}>   {/* Glasmorphismus-Effekt */}
            <div className={styles.typingContainer}>
              <span className={styles.staticTxt}>Bitcoin</span>
              <span className={styles.typingText}>{text}</span> {/* Dynamischer Text aus Hook */}
            </div>
          </h1>
        </motion.div>

        {/* Bitcoin 3D-Modell (50% Höhe - Hauptblickfang) */}
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

        {/* Info-Hinweis (10% Höhe) */}
        <motion.div 
          className={styles.infoHintContainer}
          initial={{ opacity: 0, y: 20 }}      // Startet unsichtbar und versetzt
          animate={{ opacity: 1, y: 0 }}       // Wird sichtbar und bewegt sich nach oben
          transition={{ 
            duration: 1, 
            ease: "easeOut", 
            delay: 6                           // Erscheint nach Titel
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
            delay: 7                          // Erscheint nach Info-Hinweis
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
            delay: 8                          // Erscheint als letztes Element
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


