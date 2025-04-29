import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import Bitcoin3D from './Bitcoin3D';
import Simulation from './Simulation';
import { useTypingEffect } from '../hooks/useTypingEffect';
import styles from "../styles/Landing.module.scss";

const Landing = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const [simulate, setSimulate] = useState(false);
  
  // Typing-Effekt verwenden
  const words = ['Blockchain', 'Consensus', 'Mining', 'Network', 'Nodes', 'Difficulty', 'Transactions', 'Mempool', 'Halving'];
  const { text } = useTypingEffect(words, { 
    typeSpeed: 100, 
    eraseSpeed: 80, 
    delayBetween: 2000 
  });
  
  // Funktion zum Starten der Simulation
  const startSimulation = () => setSimulate(true);
  
  // Parallax-Effekt basierend auf Scroll-Position
  const bitcoinY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  
  useEffect(() => {
    // GSAP für erweiterte Animationen registrieren
    gsap.registerPlugin(ScrollTrigger);
    
    // Fortgeschrittene Sequenz-Animation beim Laden
    const tl = gsap.timeline();
    
    tl.fromTo(
      heroRef.current, 
      { opacity: 0, scale: 0.9 }, 
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.7)" },
      "-=0.5" // Überlappung
    )
    .fromTo(
      descRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.7, stagger: 0.2 },
      "-=0.3"
    );
    
    // Panels Scroll-Trigger
    const panels = document.querySelectorAll(`.${styles.panel}`);
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
    
    return () => {
      // Cleanup
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Wenn simulate true ist, zeige die Simulation statt der Landing Page
  if (simulate) {
    return <Simulation />;
  }

  return (
    <div className={styles.landingContainer}>
      <section ref={heroRef} className={styles.heroSection}>
        <div className={styles.particleOverlay}></div>

        {/* Title */}
        <motion.div 
          ref={titleRef}
          className={styles.titleWrapper}
        >
          <h1 className={styles.glassTitle}>
            <div className={styles.typingContainer}>
              <span className={styles.staticTxt}>Bitcoin</span>
              <span className={styles.typingText}>{text}</span>
            </div>
          </h1>
        </motion.div>

        {/* Bitcoin-3D */}
        <motion.div 
          className={styles.bitcoinWrapper}
          style={{ y: bitcoinY }}
        >
          <Bitcoin3D />
        </motion.div>

        {/* Info-Hinweis */}
        <motion.div 
          className={styles.infoHintContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className={styles.infoHint}>
            <FaInfoCircle size={20} className={styles.infoIcon} />
            <p>
              <strong>Tipp:</strong> Klicke auf den <strong>INFO-Button</strong> rechts oben, um tiefergehende 
              technische Erklärungen zu vielen Bitcoin-Begriffen zu erhalten!
            </p>
          </div>
        </motion.div>

        {/* Notiz */}
        <motion.p 
          className={styles.note}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          Diese Simulation dient ausschließlich Lernzwecken und ist vereinfacht dargestellt.
        </motion.p>

        {/* CTA-Button für Navigation */}
        <motion.div 
          className={styles.ctaWrapper}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <button 
            className={styles.ctaButton}
            onClick={startSimulation}
          >
            Simulation starten
            <FaArrowRight className={styles.buttonIcon} />
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;


