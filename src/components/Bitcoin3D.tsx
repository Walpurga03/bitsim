// Hauptfunktionalitäten der Bitcoin3D-Komponente:
// 1. Erstellung einer interaktiven 3D-Münze mit THREE.js und react-three-fiber
// 2. Implementierung von Glanzeffekten und realistischen Materialien
// 3. Reaktion auf Mausbewegungen für interaktive Rotation
// 4. Schwebende Animation durch Float-Komponente
// 5. Post-Processing-Effekte für Bloom (Leuchten) und ChromaticAberration (Farbverschiebung)
// 6. Environment-Mapping für realistische Reflexionen (sunset-Preset)
// 7. Optimierte Rendering-Performance durch Suspense und DPI-Anpassung

import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Float
} from '@react-three/drei';
import { TextureLoader, Group, Mesh } from 'three';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import bitcoinLogo from '/img/bitcoin-btc-logo.png';
import styles from '../styles/Bitcoin3D.module.scss';

// Hauptmünze mit fortschrittlichen Materialien
function EnhancedBitcoin({ mousePosition }: { mousePosition: { x: number; y: number } | null }) {
  const coinRef = useRef<Group>(null);
  const coinEdgeRef = useRef<Mesh>(null);
  const logo = useLoader(TextureLoader, bitcoinLogo);
  const [hovered, setHovered] = useState(false);
  
  // Erweiterte Animation mit Mausbewegung
  useFrame((_state, delta) => {
    if (coinRef.current && mousePosition) {
      // Smooth folgen der Mausbewegung
      coinRef.current.rotation.x = Math.PI / 2 + mousePosition.y / 30;
      coinRef.current.rotation.y = mousePosition.x / 30;
    }
    
    // Goldenes Glänzen für den Rand 
    if (coinEdgeRef.current) {
      coinEdgeRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Float 
  speed={1.5} 
  rotationIntensity={0.2}
  floatIntensity={0.5}
  position={[0, 0, 0]} // Zentrieren
>
  <group 
    ref={coinRef}
    scale={1.2} // Hier den Wert verkleinern (von 2.2 auf 1.2)
    onPointerOver={() => setHovered(true)}
    onPointerOut={() => setHovered(false)}
  >
            {/* Münzkörper mit verbessertem Material */}
        <mesh rotation={[Math.PI / 1, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.2, 64]} />
          <meshPhysicalMaterial 
            color={hovered ? "#ffa94d" : "#f7931a"}
            metalness={1} 
            roughness={hovered ? 0.1 : 0.2}
            clearcoat={1}
            clearcoatRoughness={0.2}
            reflectivity={1}
            emissive={hovered ? "#ff6b00" : "#000000"}
            emissiveIntensity={hovered ? 0.2 : 0}
          />
        </mesh>
        
        
        {/* Oberseite mit Logo */}
        <mesh rotation={[Math.PI / 2, 3.15, 3]} position={[0, 0.11, 0]}>
          <circleGeometry args={[0.95, 64]} />
          <meshPhysicalMaterial 
            map={logo} 
            transparent 
            roughness={0.3} 
            metalness={0.9}
            color="#f7931a"
            clearcoat={0.5}
            reflectivity={1}
          />
        </mesh>

        {/* Unterseite mit Logo */}
        <mesh rotation={[Math.PI / 2, 0, Math.PI]} position={[0, -0.11, 0]}>
          <circleGeometry args={[0.95, 64]} />
          <meshPhysicalMaterial 
             map={logo} 
             transparent 
             roughness={0.3} 
             metalness={0.9}
             color="#f7931a"
             clearcoat={0.5}
             reflectivity={1}
          />
        </mesh>
      </group>
    </Float>
  );
}
// Hauptkomponente
export default function Bitcoin3D() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    const y = -((e.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
    setMousePosition({ x, y });
  };
  
  return (
    <div className={styles.bitcoinContainer}>
      {/* Optional: Glow-Effekt */}
      <div className={styles.glowOverlay}></div>
      
      <Canvas 
        className={styles.bitcoinCanvas}
        camera={{ 
          position: [0, 0, 5], 
          fov: 40 
        }}
        onMouseMove={handleMouseMove}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true, 
          premultipliedAlpha: false 
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight 
            position={[5, 5, 5]} 
            angle={0.3} 
            penumbra={1} 
            intensity={1.5} 
            castShadow
          />
          <directionalLight 
            position={[-5, -5, 5]} 
            intensity={0.5} 
            color="#ffedd0" 
          />
          
          <EnhancedBitcoin mousePosition={mousePosition} />
          <Environment preset="sunset" background={false} />
           {/* 
          <Environment preset="city" background={false} /> // Stadtreflexionen
          <Environment preset="studio" background={false} /> // Neutralere Studiolichter
          <Environment preset="dawn" background={false} /> // Morgendämmerung */}
          
          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.2}
              mipmapBlur
              intensity={1.3} 
            />
            <ChromaticAberration offset={[0.0005, 0.0005]} />
          </EffectComposer>
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}