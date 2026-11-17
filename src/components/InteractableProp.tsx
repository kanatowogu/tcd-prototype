import React, { useMemo, useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { Language } from '../types';
import {
  createDossierFolderTexture,
  createLunchboxNoteTexture,
  createManualCoverTexture,
  createPolaroidCanvasTexture,
} from '../utils/canvasTextures';

interface InteractablePropProps {
  restPosition: [number, number, number];
  restRotation: [number, number, number];
  inspectPosition?: [number, number, number];
  inspectRotation?: [number, number, number];
  inspectScale?: number;
  isFocused: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}

export const InteractableProp: React.FC<InteractablePropProps> = ({
  restPosition,
  restRotation,
  inspectPosition = [0, 1.36, 1.42],
  inspectRotation = [0.25, 0, 0],
  inspectScale = 1.35,
  isFocused,
  onSelect,
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetScale = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const speed = Math.min(1, delta * 8.5);

    if (isFocused) {
      targetPos.set(inspectPosition[0], inspectPosition[1], inspectPosition[2]);
      targetScale.setScalar(inspectScale);

      // ±15° (0.26 rad) mouse-following 3D parallax tilt when held in front of camera
      const tiltX = inspectRotation[0] - state.pointer.y * 0.26;
      const tiltY = inspectRotation[1] + state.pointer.x * 0.26;
      const tiltZ = inspectRotation[2] - state.pointer.x * 0.08;

      groupRef.current.position.lerp(targetPos, speed);
      groupRef.current.scale.lerp(targetScale, speed);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        tiltX,
        speed
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        tiltY,
        speed
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        tiltZ,
        speed
      );
    } else {
      const hoverLift = hovered ? 0.025 : 0;
      targetPos.set(restPosition[0], restPosition[1] + hoverLift, restPosition[2]);
      targetScale.setScalar(hovered ? 1.03 : 1);

      groupRef.current.position.lerp(targetPos, speed);
      groupRef.current.scale.lerp(targetScale, speed);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        restRotation[0],
        speed
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        restRotation[1],
        speed
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        restRotation[2],
        speed
      );
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'default';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <group
      ref={groupRef}
      position={restPosition}
      rotation={restRotation}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {children}
      {/* Subtle rim highlight box/point light when hovered on desk */}
      {hovered && !isFocused && (
        <pointLight position={[0, 0.14, 0]} intensity={0.45} distance={0.55} color="#fff2d6" />
      )}
    </group>
  );
};

/* ============================================================================
   1. ALUMINUM LUNCHBOX 3D LOW-POLY MESH (prop_lunchbox)
   ============================================================================ */
export const LunchboxMesh: React.FC<{ lensBroken: boolean; lang: Language }> = ({
  lensBroken,
  lang,
}) => {
  const noteTex = useMemo(
    () => createLunchboxNoteTexture(lensBroken, lang),
    [lensBroken, lang]
  );

  return (
    <group>
      {/* Lower Tin Box Body */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.26, 0.075, 0.17]} />
        <meshStandardMaterial
          color={lensBroken ? '#422620' : '#b5afa4'}
          roughness={lensBroken ? 0.85 : 0.42}
          metalness={lensBroken ? 0.35 : 0.65}
        />
      </mesh>

      {/* Dark Interior Cavity */}
      <mesh position={[0, 0.079, 0]}>
        <boxGeometry args={[0.24, 0.006, 0.15]} />
        <meshStandardMaterial color={lensBroken ? '#1f080a' : '#2e261f'} roughness={0.9} />
      </mesh>

      {/* Mutated Contents when Lens Broken: Chewed Shredded Files & Bent Red Staples */}
      {lensBroken && (
        <group position={[0, 0.088, 0]}>
          <mesh position={[-0.04, 0.008, 0.01]} rotation={[0.1, 0.4, -0.15]}>
            <boxGeometry args={[0.09, 0.012, 0.06]} />
            <meshStandardMaterial color="#b8ae9c" roughness={0.9} />
          </mesh>
          <mesh position={[0.05, 0.01, -0.02]} rotation={[-0.15, -0.3, 0.2]}>
            <boxGeometry args={[0.08, 0.015, 0.06]} />
            <meshStandardMaterial color="#9e9280" roughness={0.9} />
          </mesh>
          {/* Red Staples */}
          <mesh position={[0, 0.02, 0.02]} rotation={[0, 0.5, 0.2]}>
            <boxGeometry args={[0.045, 0.005, 0.008]} />
            <meshStandardMaterial color="#d92638" roughness={0.4} metalness={0.5} />
          </mesh>
          <mesh position={[-0.03, 0.022, -0.02]} rotation={[0.2, -0.4, -0.1]}>
            <boxGeometry args={[0.045, 0.005, 0.008]} />
            <meshStandardMaterial color="#d92638" roughness={0.4} metalness={0.5} />
          </mesh>
        </group>
      )}

      {/* Slightly Ajar Upper Lid */}
      <group
        position={[0, 0.078, -0.08]}
        rotation={[lensBroken ? -0.52 : -0.16, 0, 0]}
      >
        <mesh position={[0, 0.012, 0.08]} castShadow receiveShadow>
          <boxGeometry args={[0.268, 0.024, 0.176]} />
          <meshStandardMaterial
            color={lensBroken ? '#4d2b24' : '#c4beb2'}
            roughness={lensBroken ? 0.8 : 0.38}
            metalness={lensBroken ? 0.3 : 0.68}
          />
        </mesh>

        {/* Warm Sticky Note / Mutated Patch on Top of Lid */}
        <mesh
          position={[0.01, 0.025, 0.08]}
          rotation={[-Math.PI / 2, 0, -0.06]}
        >
          <planeGeometry args={[0.16, 0.085]} />
          <meshStandardMaterial map={noteTex} roughness={0.85} />
        </mesh>
      </group>

      {/* Front Metal Latch Clasp */}
      <mesh position={[0, 0.055, 0.088]}>
        <boxGeometry args={[0.042, 0.03, 0.01]} />
        <meshStandardMaterial color="#787166" roughness={0.4} metalness={0.7} />
      </mesh>
    </group>
  );
};

/* ============================================================================
   2. STAINED CERAMIC COFFEE MUG 3D LOW-POLY MESH (prop_mug)
   ============================================================================ */
export const CoffeeMugMesh: React.FC<{ lensBroken: boolean }> = ({ lensBroken }) => {
  return (
    <group>
      {/* Square Cork/Paper Coaster */}
      <mesh position={[0, 0.004, 0]} receiveShadow>
        <boxGeometry args={[0.13, 0.008, 0.13]} />
        <meshStandardMaterial
          color={lensBroken ? '#2e1517' : '#a89982'}
          roughness={0.9}
        />
      </mesh>

      {/* Dark Coffee Stain Ring on Coaster */}
      <mesh position={[0.008, 0.009, 0.005]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.042, 0.052, 20]} />
        <meshBasicMaterial
          color={lensBroken ? '#4a0c12' : '#4a3221'}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ceramic Mug Cylinder Body */}
      <mesh position={[0, 0.065, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.048, 0.044, 0.115, 18]} />
        <meshStandardMaterial
          color={lensBroken ? '#6e5e57' : '#dfd7c8'}
          roughness={0.35}
        />
      </mesh>

      {/* Coffee / Coagulated Fluid Surface Inside Mug */}
      <mesh position={[0, 0.112, 0]}>
        <cylinderGeometry args={[0.043, 0.043, 0.01, 18]} />
        <meshStandardMaterial
          color={lensBroken ? '#38060b' : '#2b1b10'}
          roughness={lensBroken ? 0.2 : 0.25}
        />
      </mesh>

      {/* Arthur's Bloodied #209 Plastic ID Badge Protruding when Lens Broken */}
      {lensBroken && (
        <group position={[0.005, 0.125, 0]} rotation={[0.25, 0.3, -0.22]}>
          <mesh>
            <boxGeometry args={[0.058, 0.042, 0.004]} />
            <meshStandardMaterial color="#d8cec0" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.012, 0.003]}>
            <boxGeometry args={[0.054, 0.012, 0.002]} />
            <meshStandardMaterial color="#8a1822" roughness={0.5} />
          </mesh>
        </group>
      )}

      {/* Low-Poly Mug Handle (3 Box Segments) */}
      <group position={[0.054, 0.065, 0]}>
        <mesh position={[0, 0.028, 0]}>
          <boxGeometry args={[0.026, 0.012, 0.014]} />
          <meshStandardMaterial color={lensBroken ? '#6e5e57' : '#dfd7c8'} roughness={0.35} />
        </mesh>
        <mesh position={[0.014, 0, 0]}>
          <boxGeometry args={[0.012, 0.066, 0.014]} />
          <meshStandardMaterial color={lensBroken ? '#6e5e57' : '#dfd7c8'} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.028, 0]}>
          <boxGeometry args={[0.026, 0.012, 0.014]} />
          <meshStandardMaterial color={lensBroken ? '#6e5e57' : '#dfd7c8'} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
};

/* ============================================================================
   3. TAPED POLAROID PHOTO 3D MESH (Family_Photo.jpg / Photo_Truth.png)
   ============================================================================ */
export const PolaroidPhotoMesh: React.FC<{ lensBroken: boolean }> = ({
  lensBroken,
}) => {
  const photoTex = useMemo(
    () => createPolaroidCanvasTexture(lensBroken),
    [lensBroken]
  );

  return (
    <group>
      {/* Polaroid Card Backing */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.16, 0.19, 0.005]} />
        <meshStandardMaterial map={photoTex} roughness={0.65} />
      </mesh>

      {/* Top Scotch Tape Strip (or Heavy Red Staple when Lens Broken) */}
      <mesh position={[0, 0.092, 0.004]} rotation={[0, 0, 0.08]}>
        <boxGeometry
          args={lensBroken ? [0.055, 0.01, 0.004] : [0.065, 0.022, 0.002]}
        />
        <meshStandardMaterial
          color={lensBroken ? '#d92638' : '#dfd3b2'}
          transparent={!lensBroken}
          opacity={lensBroken ? 1 : 0.72}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
};

/* ============================================================================
   4. OPERATING MANUAL BOOKLET 3D MESH (Left Side of Desk)
   ============================================================================ */
export const ManualBookletMesh: React.FC = () => {
  const coverTex = useMemo(() => createManualCoverTexture(), []);

  return (
    <group>
      {/* Inner Cream Paper Pages Block */}
      <mesh position={[0.004, 0.012, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.23, 0.022, 0.31]} />
        <meshStandardMaterial color="#dfd7c8" roughness={0.85} />
      </mesh>
      {/* Top Booklet Cover with Printed Texture */}
      <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.005, 0.32]} />
        <meshStandardMaterial map={coverTex} roughness={0.75} />
      </mesh>
    </group>
  );
};

/* ============================================================================
   5. KRAFT PAPER ARCHIVAL DOSSIER FOLDER 3D MESH (#01 / #02 / #03)
   ============================================================================ */
export const DossierFolderMesh: React.FC<{
  num: '#01' | '#02' | '#03' | '#04' | '#05';
  status: 'normal' | 'locked' | 'decrypted' | 'complete';
}> = ({ num, status }) => {
  const folderTex = useMemo(
    () => createDossierFolderTexture(num, status),
    [num, status]
  );

  return (
    <group>
      {/* Inner Typewriter Paper Stack */}
      <mesh position={[0.005, 0.006, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.23, 0.01, 0.3]} />
        <meshStandardMaterial color="#e8e2d5" roughness={0.85} />
      </mesh>
      {/* Upper Manila Kraft Folder Cover with Stamped #01/#02/#03 */}
      <mesh position={[0, 0.013, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.245, 0.004, 0.32]} />
        <meshStandardMaterial map={folderTex} roughness={0.8} />
      </mesh>
    </group>
  );
};
