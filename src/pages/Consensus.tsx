import React, { useState } from 'react';
import styles from "../styles/Consensus.module.scss";
import { FaUserAlt, FaServer, FaNetworkWired, FaCubes, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsensusProps {}

const Consensus: React.FC<ConsensusProps> = () => {
  // Prinzipien des Bitcoin-Konsensus
  const consensusPrinciples = [
    {
      title: "Dezentralisierung",
      icon: <FaNetworkWired />,
      description: "Kein zentraler Verwalter – stattdessen teilen Tausende Computer (Nodes) die Verantwortung für das Netzwerk."
    },
    {
      title: "Proof-of-Work",
      icon: <FaServer />,
      description: "Miner lösen komplexe mathematische Rätsel, um neue Blöcke zu erzeugen und werden dafür belohnt."
    },
    {
      title: "Längste Kette",
      icon: <FaCubes />,
      description: "Die Blockchain mit der meisten Rechenarbeit wird automatisch als die gültige akzeptiert."
    },
    {
      title: "Unveränderlichkeit",
      icon: <FaCheckCircle />,
      description: "Einmal bestätigte Transaktionen können praktisch nicht mehr verändert werden."
    },
    {
      title: "Offener Zugang",
      icon: <FaUserAlt />,
      description: "Jeder kann am Netzwerk teilnehmen – ohne Erlaubnis oder Registrierung."
    },
    {
      title: "Kryptographische Sicherheit",
      icon: <FaShieldAlt />,
      description: "Starke Verschlüsselungstechniken schützen Transaktionen und das gesamte Netzwerk vor Angriffen."
    }
  ];

  // Interface für Blöcke
  interface Block {
    height: number;
    size?: number;
    maxCoins?: number;
  }

  // Interface für Nodes
  interface Node {
    supportsChange: boolean;
  }

  // State für die Simulation
  const [nodes, setNodes] = useState<Node[]>(Array(12).fill(0).map(() => ({ 
    supportsChange: false 
  })));
  const [blockSize, setBlockSize] = useState(1);
  const [maxCoins, setMaxCoins] = useState(21);
  const [showFork, setShowFork] = useState(false);
  const [forkPoint, setForkPoint] = useState(5);
  const [_originalChainContinuation, setOriginalChainContinuation] = useState<Block[]>([] as Block[]);
  const [_forkChainContinuation, setForkChainContinuation] = useState<Block[]>([] as Block[]);

  // State für das Popup
  const [popupMessage, setPopupMessage] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Berechne die Anzahl der Nodes, die die Änderung unterstützen
  const supportingNodes = nodes.filter(node => node.supportsChange);

  // Toggle Support für einen Node
  const toggleNodeSupport = (index: number): void => {
    const newNodes = [...nodes];
    
    // Aktueller Status des angeklickten Nodes umkehren
    newNodes[index].supportsChange = !newNodes[index].supportsChange;
    
    // Prüfen, ob alle Nodes zustimmen würden
    const allNodesSupport = newNodes.every(node => node.supportsChange);
    
    // Falls alle zustimmen würden, einen zufälligen Node (außer den gerade angeklickten) wieder deaktivieren
    if (allNodesSupport) {
      // Verfügbare Indizes (alle außer dem gerade angeklickten)
      const availableIndices = Array.from({ length: nodes.length }, (_, i) => i)
        .filter(i => i !== index);
        
      // Zufälligen Index auswählen
      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      
      // Diesen Node wieder deaktivieren
      newNodes[randomIndex].supportsChange = false;
      
      // Popup-Nachricht setzen und anzeigen
      setPopupMessage(`Node ${randomIndex + 1} weigert sich, die Änderungen zu akzeptieren!`);
      setShowPopup(true);
      
      // Popup nach 3 Sekunden automatisch schließen
      setTimeout(() => setShowPopup(false), 3000);
    }
    
    setNodes(newNodes);
  };

  // Prüfen, ob der "Änderungen anwenden"-Button aktiviert sein soll
  const canApplyChanges = (): boolean => {
    // Prüfen, ob mindestens ein Node die Änderung unterstützt
    const hasNodeSupport = nodes.some(node => node.supportsChange);
    
    // Prüfen, ob mindestens eine Regel geändert wurde
    const hasRuleChanges = blockSize > 1 || maxCoins > 21;
    
    // Beide Bedingungen müssen erfüllt sein
    return hasNodeSupport && hasRuleChanges;
  };

  // Simuliere den Fork
  const simulateFork = () => {
    // Füge neue Blöcke für beide Ketten hinzu
    setForkPoint(5);
    
    // Erstelle Fortsetzungsblöcke für beide Ketten
    setOriginalChainContinuation(Array(3).fill(0).map((_, i) => ({ 
      height: forkPoint + i + 1 
    })));
    
    setForkChainContinuation(Array(3).fill(0).map((_, i) => ({ 
      height: forkPoint + i + 1,
      size: blockSize,
      maxCoins: maxCoins
    })));
    
    setShowFork(true);
  };

  // Generiere einen Namen für die Fork-Chain basierend auf den Änderungen
  const generateForkName = () => {
    return "SHITCOIN"; // Immer SHITCOIN nennen, egal was geändert wurde
  };

  return (
    <div className={styles.pageContainer}>
      <section className={styles.consensusSection}>
        {/* Intro-Bereich mit Animation */}
        <motion.div 
          className={styles.introSection}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className={styles.title}>Spielregeln des Netzwerks</h1>
          <p className={styles.description}>
            Bitcoin basiert auf einem Regelwerk, dem alle Teilnehmer folgen. 
            Diese Regeln werden von niemandem kontrolliert, sondern durch gemeinsamen 
            Konsens aller Netzwerkteilnehmer aufrechterhalten.
          </p>
        </motion.div>
        
        {/* Prinzipien-Grid mit Animation */}
        <motion.div 
          className={styles.principlesGrid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {consensusPrinciples.map((principle, index) => (
            <motion.div 
              key={index} 
              className={styles.principleCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className={styles.principleIcon}>{principle.icon}</div>
              <h3>{principle.title}</h3>
              <div className={styles.principleDescription}>
                <p>{principle.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Interaktiver Bereich für die Konsensus-Simulation mit Animation */}
        <motion.div 
          className={styles.consensusSimulation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {/* Titel und Intro/Aha-Moment mit Animation */}
          <AnimatePresence mode="wait">
            {!showFork ? (
              <>
                {/* Überhebliche Einleitung - wird nur angezeigt, wenn kein Fork simuliert wurde */}
                <motion.div
                  key="intro"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2>Satoshi hat's verbockt – WIR machen Bitcoin besser!</h2>
                  <p className={styles.simulationIntro}>
                    Wer braucht schon dieses veraltete Design? <span className={styles.highlight}>Lächerliche 1 MB Blockgröße</span> und <span className={styles.highlight}>nur 21 Millionen Coins</span> – offensichtlich hat Satoshi die Zukunft nicht verstanden! 
                    Endlich kannst DU zeigen, wie man Bitcoin richtig designt. Klicke ein paar Nodes an, schiebe die Regler und beweise, 
                    dass deine Vision überlegen ist. Das Bitcoin-Netzwerk wird dir sicher dankbar sein...
                  </p>
                </motion.div>
              </>
            ) : (
              <>
                {/* Kombinierter Aha-Moment und Fork-Erklärung */}
                <motion.div 
                  key="aha-moment"
                  className={styles.forkExplanation}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={styles.forkHeader}>
                    <div className={styles.forkIcon}>🎉</div>
                    <h3>Herzlichen Glückwunsch zum Shitcoin!</h3>
                  </div>
                  
                  <div className={styles.forkContent}>
                    <div className={styles.resultCard}>
                      <div className={styles.resultStats}>
                        <div className={styles.statItem}>
                          <span className={styles.statValue}>{supportingNodes.length}</span>
                          <span className={styles.statLabel}>Nodes folgen dir</span>
                        </div>
                        <div className={styles.statDivider}></div>
                        <div className={styles.statItem}>
                          <span className={styles.statValue}>{nodes.length - supportingNodes.length}</span>
                          <span className={styles.statLabel}>Nodes bleiben bei Bitcoin</span>
                        </div>
                      </div>
                      
                      <div className={styles.resultMessage}>
                        <span className={styles.highlight}>Wundervoll:</span> Deine "genialen" Regeln haben zu einer Blockchain-Spaltung geführt.
                        Gratulation zu deinem brandneuen Shitcoin, den absolut keine Sau braucht!
                      </div>
                    </div>
                    
                    <div className={styles.forkInsight}>
                        <span className={styles.insightIcon}>💡</span>
                      <p>
                      Solange auch nur ein einziger Node am ursprünglichen Konsens festhält, wird Bitcoin genau so weiterleben wie bisher.
                      unbeeindruckt von jedem Versuch, etwas zu ändern.
                      </p>
                    </div>
                    
                    <motion.div 
                      className={styles.forkActionResult}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <div className={styles.actionResultHeader}>
                        <span className={styles.resultIcon}>❌</span>
                        <span>Die Bitcoin-Realität</span>
                      </div>
                      <p>
                        Hast du ernsthaft geglaubt, du könntest Bitcoin einfach "verbessern"? Konsensus bedeutet nicht 
                        Mehrheit, sondern vollständige Übereinstimmung. Jede Abweichung führt unweigerlich zu einer 
                        Spaltung – und jetzt bist du stolzer Besitzer eines wertlosen Shitcoins!
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          
          {/* Netzwerk-Visualisierung - nur anzeigen, wenn noch kein Fork simuliert wurde */}
          <AnimatePresence mode="wait">
            {!showFork ? (
              <motion.div 
                className={styles.networkVisualization}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.networkNodes}>
                  {nodes.map((node, index) => (
                    <motion.div 
                      key={index} 
                      className={`${styles.node} ${node.supportsChange ? styles.supportChange : ''}`}
                      onClick={() => toggleNodeSupport(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className={styles.nodeIcon}>
                        <FaServer />
                      </div>
                      <div className={styles.nodeLabel}>Node {index+1}</div>
                      <div className={styles.nodeStatus}>
                        {node.supportsChange ? 'Unterstützt Änderung' : 'Folgt Original-Regeln'}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Regeländerungs-Kontrollen */}
                <div className={styles.ruleControls}>
                  <h3>Konsensus-Regeln ändern</h3>
                  
                  <div className={styles.ruleOption}>
                    <label data-value={`${blockSize} MB`}>Blockgröße</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="32" 
                      value={blockSize} 
                      onChange={(e) => setBlockSize(Number(e.target.value))} 
                    />
                  </div>
                  
                  <div className={styles.ruleOption}>
                    <label data-value={`${maxCoins}M`}>Maximale Bitcoin-Anzahl</label>
                    <input 
                      type="range" 
                      min="21" 
                      max="42" 
                      value={maxCoins} 
                      onChange={(e) => setMaxCoins(Number(e.target.value))} 
                    />
                  </div>
                  
                  {!canApplyChanges() && (
                    <div className={styles.applyChangesHint}>
                      {!nodes.some(node => node.supportsChange) ? 
                        "Wähle mindestens einen Node aus, der die Änderung unterstützt." : 
                        "Verändere mindestens einen Parameter (Blockgröße oder Münzen-Limit)."}
                    </div>
                  )}

                  <motion.button 
                    className={`${styles.applyChanges} ${!canApplyChanges() ? styles.applyChangesDisabled : ''}`}
                    onClick={simulateFork}
                    whileHover={canApplyChanges() ? { scale: 1.05 } : {}}
                    whileTap={canApplyChanges() ? { scale: 0.95 } : {}}
                    disabled={!canApplyChanges()}
                  >
                    Änderungen anwenden
                  </motion.button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          
          {/* Visualisierung der Blockchain vor/nach Fork mit Animation */}
          {showFork && (
            <motion.div 
              className={styles.blockchainVisualization}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.originalChain}>
                <h3>Original Bitcoin</h3>
                <div className={styles.chainBlocks}>
                  {/* Zeigt 5 Blöcke mit kleinen Nummern zuerst (oben) */}
                  {[...Array(5)].map((_, i) => {
                    const blockNumber = forkPoint - 4 + i; // Start mit niedrigster Blocknummer (z.B. 1, 2, 3, 4, 5)
                    return (
                      <motion.div 
                        key={`original-${i}`} 
                        className={styles.block}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                      >
                        <div className={styles.blockHeader}>Block {blockNumber}</div>
                        <div className={styles.blockContent}>
                          <p>Größe: 1 MB</p>
                          <p>Max Coins: 21M</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              <div className={styles.forkChain}>
                <h3>{generateForkName()}</h3>
                <div className={styles.chainBlocks}>
                  {/* Zeigt 5 Blöcke der Fork-Chain */}
                  {[...Array(5)].map((_, i) => {
                    const blockNumber = forkPoint - 4 + i; // Start mit niedrigster Blocknummer
                    // Die letzten 3 Blöcke haben die neuen Regeln (die höheren Blocknummern)
                    const isNewRules = i >= 2; // Die unteren 3 Blöcke haben neue Regeln
                    return (
                      <motion.div 
                        key={`fork-${i}`} 
                        className={`${styles.block} ${isNewRules ? styles.newRulesBlock : ''}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                      >
                        <div className={styles.blockHeader}>Block {blockNumber}</div>
                        <div className={styles.blockContent}>
                          <p>Größe: {isNewRules ? blockSize : 1} MB</p>
                          <p>Max Coins: {isNewRules ? maxCoins : 21}M</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        {/* Custom Popup innerhalb des Containers */}
        <AnimatePresence>
          {showPopup && (
            <motion.div 
              className={styles.customPopup}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className={styles.popupContent}>
                <div className={styles.popupIcon}>⚠️</div>
                <p>{popupMessage}</p>
                <motion.button 
                  className={styles.popupCloseButton}
                  onClick={() => setShowPopup(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Verstanden
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Prozessablauf mit visueller Timeline und Animation */}
        <motion.div 
          className={styles.consensusExplanation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <h2 className={styles.processTitle}>Der Konsensus-Prozess im Detail</h2>
          
          <div className={styles.timelineContainer}>
            {[
              { 
                title: "Transaktion wird initiiert", 
                desc: "Ein Nutzer sendet eine Bitcoin-Transaktion",
              },
              { 
                title: "Validierung durch Nodes", 
                desc: "Vollständige Nodes prüfen, ob die Transaktion den Konsensus-Regeln entspricht",
              },
              { 
                title: "Aufnahme in den Mempool", 
                desc: "Gültige Transaktionen werden in die Warteschlange aufgenommen",
              },
              { 
                title: "Mining-Prozess", 
                desc: "Miner nehmen Transaktionen aus dem Mempool und versuchen, einen gültigen Block zu finden",
              },
              { 
                title: "Neuer Block gefunden", 
                desc: "Ein Miner löst das Proof-of-Work-Rätsel und verbreitet seinen Block",
              },
              { 
                title: "Konsensus-Bestätigung", 
                desc: "Andere Nodes prüfen den neuen Block und akzeptieren ihn bei Regelkonformität",
              },
              { 
                title: "Finalisierung", 
                desc: "Mit jeder weiteren Bestätigung wird die Transaktion unumkehrbarer",
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className={styles.timelineStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + (index * 0.15) }}
              >
                
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>{step.title}</h3>
                  <p className={styles.timelineDesc}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Consensus;