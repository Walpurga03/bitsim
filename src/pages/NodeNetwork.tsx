import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/NodeNetwork.module.scss'; 
import { mineBlock, DIFFICULTY_LEVELS } from '../utils/miningUtils';

interface MiningResult {
  hash: string;
  nonce: number;
  target: string;
  timestamp: string;
  transactions: string;
  merkleRoot: string;
  found: boolean;
  blockNumber: number;
}

interface Node {
  id: number;
  x: number;
  y: number;
  type: 'miner' | 'full';
  connected: boolean;
  hasLatestBlock: boolean;
  isReceivingBlock?: boolean;
  connections: number[]; // Array von Node-IDs, mit denen dieser Node verbunden ist
}

interface NodeNetworkPageProps {
  onNext: () => void;
}

const NodeNetworkPage: React.FC<NodeNetworkPageProps> = ({}) => {
  const [miningResult, setMiningResult] = useState<MiningResult | null>(null);
  const [chainBlocks, setChainBlocks] = useState<MiningResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [walletInfo, setWalletInfo] = useState({
    balance: 250, // Starting with 5 blocks (5 * 50 BTC)
    currentBlock: 5,
    currentReward: 50,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [propagatingBlock, setPropagatingBlock] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [_networkStats, setNetworkStats] = useState({
    totalNodes: 0,
    miners: 0,
    fullNodes: 0,
    connectedNodes: 0
  });
  const [showMiningAnimation, setShowMiningAnimation] = useState(false);
  
  const networkRef = useRef<HTMLDivElement>(null);
  
  // Handle responsive view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
      generateNodes();
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Optimierte Node-Generierung mit useCallback
  const generateNodes = useCallback(() => {
    if (!networkRef.current) return;
    
    const width = networkRef.current.clientWidth;
    const height = 250; // Reduzierte Höhe
    const nodeCount = isMobile ? 8 : 15; // Noch weniger Nodes für bessere Übersichtlichkeit
    
    const newNodes: Node[] = [];
    
    // Positionierung in einem strukturierten Grid-Layout statt zufällig
    const columns = isMobile ? 4 : 5;
    const rows = Math.ceil(nodeCount / columns);
    const cellWidth = width / columns;
    const cellHeight = height / rows;
    
    for (let i = 0; i < nodeCount; i++) {
      // Berechne Position im Grid mit etwas Zufälligkeit
      const col = i % columns;
      const row = Math.floor(i / columns);
      
      const x = cellWidth * col + cellWidth/2 + (Math.random() * 20 - 10);
      const y = cellHeight * row + cellHeight/2 + (Math.random() * 20 - 10);
      
      // 25% Miner, 75% Full Nodes - leicht erhöhter Miner-Anteil
      const type = Math.random() < 0.25 ? 'miner' : 'full';
      
      // 95% verbundene Nodes für klarere Visualisierung
      const connected = Math.random() > 0.05;
      
      newNodes.push({
        id: i,
        x,
        y,
        type,
        connected,
        hasLatestBlock: connected && i === 0, // Zu Beginn hat nur die erste Node den neuesten Block
        connections: [] // Hier speichern wir später die Verbindungen
      });
    }
    
    // Erstelle die Verbindungen zwischen den Nodes
    createNetworkConnections(newNodes);
    
    setNodes(newNodes);
    
    // Update network stats
    setNetworkStats({
      totalNodes: nodeCount,
      miners: newNodes.filter(n => n.type === 'miner').length,
      fullNodes: newNodes.filter(n => n.type === 'full').length,
      connectedNodes: newNodes.filter(n => n.connected).length
    });
  }, [isMobile, networkRef]);

  // Verwende useCallback für die Verbindungen
  const createNetworkConnections = useCallback((nodesList: Node[]) => {
    // Für jeden Node Verbindungen erstellen
    nodesList.forEach((node, idx) => {
      if (!node.connected) return; // Nicht-verbundene Nodes ignorieren
      
      // Miner haben mehr Verbindungen als normale Nodes
      const connectionCount = node.type === 'miner' ? 
        Math.floor(Math.random() * 3) + 4 : // 4-6 Verbindungen für Miner
        Math.floor(Math.random() * 2) + 2;  // 2-3 Verbindungen für Full Nodes
      
      // Finde die nächsten Nachbarn für diesen Node
      const neighbors = findPotentialNeighbors(nodesList, idx);
      
      // Steuere, wie viele Verbindungen maximal erstellt werden können
      const actualConnectionCount = Math.min(connectionCount, neighbors.length);
      
      // Erstelle die Verbindungen
      for (let i = 0; i < actualConnectionCount && i < neighbors.length; i++) {
        const neighborId = neighbors[i].idx;
        
        // Speichere die Connection-IDs für die spätere Visualisierung (in beiden Richtungen)
        if (!node.connections.includes(neighborId)) {
          node.connections.push(neighborId);
        }
        
        if (!nodesList[neighborId].connections.includes(idx)) {
          nodesList[neighborId].connections.push(idx);
        }
      }
    });
  }, []);

  // Hilfsfunktion: Finde potentielle Nachbarn für einen Node
  const findPotentialNeighbors = (nodesList: Node[], sourceIdx: number): {idx: number, distance: number}[] => {
    const source = nodesList[sourceIdx];
    
    // Berechne Distanzen zu allen anderen Nodes
    return nodesList
      .map((node, idx) => {
        if (idx === sourceIdx || !node.connected) return { idx, distance: Infinity };
        const dx = node.x - source.x;
        const dy = node.y - source.y;
        return { idx, distance: Math.sqrt(dx*dx + dy*dy) };
      })
      .filter(item => item.distance !== Infinity) // Entferne nicht-verbundene und den Quell-Node
      .sort((a, b) => a.distance - b.distance)    // Sortiere nach Distanz
      .slice(0, 6);  // Begrenze die Anzahl potenzieller Nachbarn
  };
  
  // Initialize blockchain and nodes on first render
  useEffect(() => {
    generateNodes();
    
    // Initialize blockchain with initial blocks
    setChainBlocks([
      { blockNumber: 1, hash: "0.175026", nonce: 2481, target: "1", timestamp: "9/1/2009, 12:00:00 AM", transactions: "Genesis Block", merkleRoot: "4a5e1e", found: true },
      { blockNumber: 2, hash: "0.21169", nonce: 1237, target: "1", timestamp: "9/1/2009, 12:15:00 AM", transactions: "1 Transaktion", merkleRoot: "9d0c1e", found: true },
      { blockNumber: 3, hash: "0.68168", nonce: 983, target: "1", timestamp: "9/1/2009, 12:30:00 AM", transactions: "2 Transaktionen", merkleRoot: "8c4e2f", found: true },
      { blockNumber: 4, hash: "0.159457", nonce: 3091, target: "1", timestamp: "9/1/2009, 12:45:00 AM", transactions: "1 Transaktion", merkleRoot: "7b3f1d", found: true },
      { blockNumber: 5, hash: "0.207500", nonce: 1762, target: "1", timestamp: "9/1/2009, 1:00:00 AM", transactions: "3 Transaktionen", merkleRoot: "6a2e9b", found: true },
    ]);
  }, []);
  
  // Vereinfachte Mining-Funktion
  const simulateMining = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowMiningAnimation(true);
    
    // Create timestamp
    const now = new Date();
    now.setFullYear(now.getFullYear() - 16);
    const timestamp = now.toLocaleString();
    
    // Einfachere Transaktionsinformationen
    const txCount = Math.floor(Math.random() * 3) + 1;
    const transactions = `${txCount} Transaktion${txCount > 1 ? 'en' : ''}`;
    
    // Generate merkle root
    const merkleRoot = Math.random().toString(16).substr(2, 8);
    
    // Previous block hash
    const previousHash = chainBlocks.length > 0 
      ? chainBlocks[chainBlocks.length - 1].hash.toString()
      : "0";
    
    // Block data
    const blockData = `${previousHash}-${timestamp}-${merkleRoot}`;
    
    // Mining with timeout
    setTimeout(() => {
      // Use EASY difficulty
      const difficulty = DIFFICULTY_LEVELS.EASY;
      
      // Perform mining with specified difficulty
      const result = mineBlock(blockData, difficulty);
      
      // FIX: Explizit prüfen, ob der Hash tatsächlich kleiner als das Target ist
      // Dies korrigiert mögliche Rundungsfehler beim Vergleich
      const hashValue = parseFloat(result.hash.toString());
      const targetValue = parseFloat(result.target.toString());
      const isActuallyValid = hashValue < targetValue;
      
      // Create new block object
      const newBlock = walletInfo.currentBlock + 1;
      
      const newBlockData: MiningResult = {
        hash: result.hash.toString(),
        nonce: result.nonce,
        target: result.target.toString(),
        timestamp,
        transactions,
        merkleRoot,
        found: isActuallyValid, // Wir verwenden unseren korrigierten Vergleich
        blockNumber: newBlock,
      };
      
      setMiningResult(newBlockData);
      
      // Only if a block was found (hash < target), update the chain
      if (isActuallyValid) {
        setChainBlocks(prev => {
          const newChain = [...prev, newBlockData];
          while (newChain.length > 5) {
            newChain.shift();
          }
          return newChain;
        });
        
        setWalletInfo(prev => ({
          ...prev,
          balance: prev.balance + prev.currentReward,
          currentBlock: newBlock,
        }));
        
        // Vereinfachte Block-Verbreitung simulieren
        simulateBlockPropagation();
      }
      
      setShowMiningAnimation(false);
      setIsAnimating(false);
    }, 1000);
  };
  
  // Noch einfachere Block-Verbreitung, aber mit realistischeren Netzwerkpfaden
  const simulateBlockPropagation = () => {
    setPropagatingBlock(true);
    
    // Reset all nodes' latest block status
    setNodes(prevNodes => prevNodes.map(node => ({
      ...node,
      hasLatestBlock: false
    })));
    
    // Finde einen Miner-Node oder verwende den ersten Node
    const minerNodeIndex = nodes.findIndex(n => n.type === 'miner' && n.connected);
    const startNodeIndex = minerNodeIndex >= 0 ? minerNodeIndex : 0;
    
    // Update the miner node to have the latest block
    setNodes(prevNodes => prevNodes.map((node, i) => 
      i === startNodeIndex ? { ...node, hasLatestBlock: true } : node
    ));
    
    // Verwende die Netzwerkverbindungen für die Block-Verbreitung
    setTimeout(() => {
      // Erste Welle - direkte Nachbarn der Startnode
      setNodes(prevNodes => {
        const updatedNodes = [...prevNodes];
        const startNode = updatedNodes[startNodeIndex];
        
        // Verbreite an direkt verbundene Nodes
        if (startNode && startNode.connections) {
          startNode.connections.forEach(connectedIdx => {
            if (updatedNodes[connectedIdx].connected) {
              updatedNodes[connectedIdx] = { ...updatedNodes[connectedIdx], hasLatestBlock: true };
            }
          });
        }
        
        return updatedNodes;
      });
      
      // Zweite Welle - Verbreitung über zwei Hops
      setTimeout(() => {
        setNodes(prevNodes => {
          const updatedNodes = [...prevNodes];
          const nodesWithBlock = prevNodes
            .map((node, idx) => ({ node, idx }))
            .filter(item => item.node.hasLatestBlock);
          
          // Jeder Node mit Block verbreitet an seine Verbindungen
          nodesWithBlock.forEach(({ node }) => {
            if (node.connections) {
              node.connections.forEach(connectedIdx => {
                if (updatedNodes[connectedIdx].connected) {
                  updatedNodes[connectedIdx] = { ...updatedNodes[connectedIdx], hasLatestBlock: true };
                }
              });
            }
          });
          
          return updatedNodes;
        });
        
        // Dritte Welle - alle restlichen verbundenen Nodes
        setTimeout(() => {
          setNodes(prevNodes => prevNodes.map(node => 
            node.connected ? { ...node, hasLatestBlock: true } : node
          ));
          
          // End propagation animation
          setTimeout(() => {
            setPropagatingBlock(false);
          }, 500);
        }, 800);
      }, 800);
    }, 800);
  };

  const handleButtonClick = () => {
    if (hasLatestBlock) {
      simulateBlockPropagation();
    } else {
      simulateMining();
    }
  };

  const hasLatestBlock = nodes.some(node => node.hasLatestBlock);

  // Vermeide unnötige Re-Renderings mit React.memo
  const NetworkNode = React.memo(({ node, onMouseEnter, onMouseLeave }: { node: Node, isHovered: boolean, onMouseEnter: () => void, onMouseLeave: () => void }) => (
    <div
      className={`
        ${styles.networkNode}
        ${node.hasLatestBlock ? styles.hasLatestBlock : ''}
        ${node.isReceivingBlock ? styles.receivingBlock : ''}
      `}
      style={{ left: node.x, top: node.y }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  ));

  return (
    <div className={styles.page}>
      {/* Intro-Bereich */}
      <section className={styles.introSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.title}>Das Bitcoin-Netzwerk</h1>
          <p className={styles.description}>
            Das Bitcoin-Netzwerk besteht aus tausenden von Nodes (Knotenpunkten), die zusammenarbeiten, 
            um Transaktionen zu bestätigen und die Blockchain zu sichern. Diese dezentrale Struktur 
            ist das Herzstück von Bitcoin - es gibt keine zentrale Kontrolle.
          </p>
        </motion.div>
      </section>

      {/* Node-Informationen */}
      <section className={styles.nodeInfoBox}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3>Typen von Nodes</h3>
          <div className={styles.nodeTypesGrid}>
            <div className={styles.nodeTypeCard}>
              <h4>Miner Nodes</h4>
              <p>Stellen neue Blöcke her und erhalten Block-Belohnungen.</p>
            </div>
            <div className={styles.nodeTypeCard}>
              <h4>Full Nodes</h4>
              <p>Speichern und validieren die gesamte Blockchain und überprüfen alle Regeln.</p>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Netzwerk-Visualisierung */}
      <section className={styles.networkContainer} ref={networkRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className={styles.networkTitle}>
            Peer-to-Peer Netzwerk
          </h3>
          <p className={styles.networkDescription}>
            Im Bitcoin-Netzwerk ist jeder Teilnehmer (Node) direkt mit mehreren anderen verbunden. 
            Neue Blöcke werden von Minern erstellt und dann durch das gesamte Netzwerk verbreitet.
            Auch Miner sind untereinander verbunden, damit neue Blöcke schnell weitergegeben werden können.
          </p>
          <div 
            className={styles.networkVisualization}
            role="region"
            aria-label="Visualisierung des Bitcoin-Netzwerks mit Nodes und Verbindungen"
          >
            {/* Verbindungslinien zuerst rendern, damit sie unter den Nodes liegen */}
            {nodes.map((node, idx) => 
              // Für jeden Node seine Verbindungen visualisieren
              node.connections.map(connectedIdx => 
                // Wir zeigen jede Verbindung nur einmal, indem wir prüfen, ob der Index kleiner ist
                idx < connectedIdx ? (
                  <div 
                    key={`conn-${idx}-${connectedIdx}`} 
                    className={`${styles.connectionLine} ${(node.hasLatestBlock && nodes[connectedIdx].hasLatestBlock) ? styles.activeLine : ''}`}
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      width: `${Math.hypot(nodes[connectedIdx].x - node.x, nodes[connectedIdx].y - node.y)}px`,
                      transform: `rotate(${Math.atan2(nodes[connectedIdx].y - node.y, nodes[connectedIdx].x - node.x)}rad)`
                    }}
                  />
                ) : null
              )
            )}
            
            {/* Dann die Nodes rendern */}
            {nodes.map((node) => (
              <NetworkNode
                key={node.id}
                node={node}
                isHovered={hoveredNode === node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              />
            ))}
          </div>
          {showMiningAnimation && <div className={styles.miningAnimation} />}
          <div className={styles.propagationExplanation}>
            {propagatingBlock ? (
              <p><strong>Block wird verbreitet!</strong> Beobachte, wie der neue Block von Node zu Node weitergegeben wird.</p>
            ) : miningResult && miningResult.found ? (
              <p>Block erfolgreich durch das Netzwerk verbreitet! Alle verbundenen Nodes haben jetzt die aktuellen Daten.</p>
            ) : (
              <p>Klicke auf "Block minen & verbreiten", um zu sehen, wie ein neuer Block im Netzwerk verteilt wird.</p>
            )}
          </div>

          {/* Simplified mining interface */}
          <div className={styles.networkAction}>
            <motion.button
              className={styles.mineButton}
              onClick={handleButtonClick}
              disabled={isAnimating}
              aria-busy={isAnimating}
              aria-label={hasLatestBlock ? "Block im Netzwerk verteilen" : "Neuen Block minen"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {hasLatestBlock
                ? "Block im Netzwerk verteilen"
                : "Block minen"}
            </motion.button>
          </div>

          {/* Neue Info-Box für Netzwerk-Konsens */}
          <div className={styles.infoBox}>
            <h3>Warum ist die Block-Verbreitung so wichtig?</h3>
            <p>
              Schnelle Block-Verbreitung ist entscheidend für die Fairness im Mining-Prozess. Sie reduziert die Häufigkeit von konkurrierenden Blöcken (Orphans), da Miner schneller über neue Blöcke informiert werden und nicht unnötig an bereits gelösten Blöcken arbeiten. 
            </p>
            <p>
              Dies verringert den inhärenten Vorteil größerer Miner und macht den Wettbewerb fairer für kleinere Mining-Teilnehmer. Der Proof-of-Work selbst macht es dagegen unpraktikabel, eine alternative Kette zu bauen.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default NodeNetworkPage;
