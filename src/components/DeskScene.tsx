import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FocusTarget, Language, RedactTargetId } from '../types';
import {
  createMonitorScreenCanvasTexture,
  createNameplateTexture,
  createPartitionGlassTexture,
  createWalnutDeskTexture,
} from '../utils/canvasTextures';
import {
  CoffeeMugMesh,
  DossierFolderMesh,
  InteractableProp,
  LunchboxMesh,
  ManualBookletMesh,
  PolaroidPhotoMesh,
} from './InteractableProp';

interface DeskSceneProps {
  lang: Language;
  focusTarget: FocusTarget;
  quotaCount: number;
  redactedTargets: RedactTargetId[];
  file03Decrypted: boolean;
  file04Delivered: boolean;
  file05Delivered: boolean;
  lensBroken: boolean;
  endingChoice: 'A' | 'B' | null;
  endingARedactedCount: number;
  brightness: number;
  onSelectFocus: (target: FocusTarget) => void;
}

/* ============================================================================
   CAMERA CONTROLLER: SMOOTH DOLLY + ±3° BREATHING SWAY
   ============================================================================ */
const CameraController: React.FC<{ focusTarget: FocusTarget }> = ({ focusTarget }) => {
  const targetPos = useMemo(() => new THREE.Vector3(0, 1.48, 2.15), []);
  const currentLookAt = useMemo(() => new THREE.Vector3(0, 1.06, -0.15), []);
  const desiredLookAt = useMemo(() => new THREE.Vector3(0, 1.06, -0.15), []);

  useFrame((state, delta) => {
    const speed = Math.min(1, delta * 5.5);
    // ±3° (~0.052 rad) subtle mouse breathing sway
    const swayX = state.pointer.x * 0.075;
    const swayY = state.pointer.y * 0.048;

    if (focusTarget === 'monitor') {
      targetPos.set(swayX * 0.18, 1.21 + swayY * 0.15, 0.58);
      desiredLookAt.set(swayX * 0.1, 1.19 + swayY * 0.1, -0.25);
    } else if (focusTarget === 'partition') {
      targetPos.set(swayX * 0.25, 1.66 + swayY * 0.2, 0.55);
      desiredLookAt.set(swayX * 0.2, 1.64 + swayY * 0.15, -0.82);
    } else {
      targetPos.set(swayX, 1.48 + swayY, 2.12);
      desiredLookAt.set(swayX * 1.15, 1.05 + swayY * 0.9, -0.15);
    }

    state.camera.position.lerp(targetPos, speed);
    currentLookAt.lerp(desiredLookAt, speed);
    state.camera.lookAt(currentLookAt);
  });

  return null;
};

/* ============================================================================
   RENDERER EXPOSURE CONTROLLER
   ============================================================================ */
const ExposureController: React.FC<{ brightness: number }> = ({ brightness }) => {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    gl.toneMappingExposure = 1.05 * brightness;
  }, [gl, brightness]);

  return null;
};

/* ============================================================================
   LIGHTING RIG: NORMAL PENDANT LAMP vs. EERIE HYPNOTIC DISCO LIGHTS
   ============================================================================ */
const OfficeAndDiscoLighting: React.FC<{
  lensBroken: boolean;
  endingChoice: 'A' | 'B' | null;
  endingARedactedCount: number;
  brightness: number;
}> = ({ lensBroken, endingChoice, endingARedactedCount, brightness }) => {
  const discoGroupRef = useRef<THREE.Group>(null);
  const pendantSpotRef = useRef<THREE.SpotLight>(null);
  const brokenTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    if (lensBroken) {
      brokenTimestampRef.current = performance.now();
    } else {
      brokenTimestampRef.current = null;
    }
  }, [lensBroken]);

  // Individual beam controls:
  // Branch A redactions extinguish Magenta (1st) -> Cold Cyan (2nd) -> Amber (3rd)
  // Branch B freezes Magenta & Cyan across the desk
  const magentaOn =
    lensBroken && (endingChoice !== 'A' || endingARedactedCount < 1);
  const cyanOn =
    lensBroken && (endingChoice !== 'A' || endingARedactedCount < 2);
  const amberOn =
    lensBroken &&
    endingChoice !== 'B' &&
    (endingChoice !== 'A' || endingARedactedCount < 3);

  const activeBeams =
    (magentaOn ? 1 : 0) + (cyanOn ? 1 : 0) + (amberOn ? 1 : 0);
  const discoFactor = lensBroken ? activeBeams / 3 : 0;
  const normalLampFactor =
    endingChoice === 'A' && endingARedactedCount === 3
      ? 1
      : 1 - discoFactor * 0.85;

  useFrame((_, delta) => {
    // Slow, silent, hypnotic rotation (freezes in Branch B)
    if (discoGroupRef.current && discoFactor > 0 && endingChoice !== 'B') {
      const rotSpeed = 0.56 * discoFactor;
      discoGroupRef.current.rotation.y += delta * rotSpeed;
    }

    // Two-beat overhead lamp glitch flicker right when lensBroken triggers
    if (pendantSpotRef.current) {
      if (lensBroken && brokenTimestampRef.current !== null) {
        const elapsedMs = performance.now() - brokenTimestampRef.current;
        if (elapsedMs < 650) {
          const glitch =
            (elapsedMs > 80 && elapsedMs < 180) ||
            (elapsedMs > 320 && elapsedMs < 440);
          pendantSpotRef.current.intensity = (glitch ? 0.16 : 3.8) * brightness;
          return;
        }
      }
      pendantSpotRef.current.intensity = THREE.MathUtils.lerp(
        pendantSpotRef.current.intensity,
        3.6 * normalLampFactor * brightness,
        delta * 4
      );
    }
  });

  return (
    <>
      <ambientLight
        intensity={(discoFactor > 0 ? 0.42 : 0.62) * brightness}
        color={discoFactor > 0 ? '#cbb8d4' : '#e8dfd1'}
      />

      {/* Overhead Office Pendant Lamp */}
      <spotLight
        ref={pendantSpotRef}
        position={[0, 2.65, 0.35]}
        angle={0.78}
        penumbra={0.65}
        intensity={3.6 * brightness}
        distance={6.5}
        color="#fff0d4"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Warm Desk Lamp Glow from Adjacent Desk #209 Behind Frosted Partition */}
      {!lensBroken && (
        <pointLight
          position={[-0.25, 1.65, -1.15]}
          intensity={1.45 * brightness}
          distance={3.0}
          color="#f5d18c"
        />
      )}

      {/* Eerie Slow-Rotating Disco Lights when Lens is Broken
          Colors: Magenta (#ff007f), Cold Cyan (#00e5ff), Sickly Amber (#ffaa00) */}
      {activeBeams > 0 && (
        <group ref={discoGroupRef} position={[0, 2.25, 0.1]}>
          {/* Beam 1: Magenta (#ff007f) */}
          {magentaOn && (
            <pointLight
              position={[1.15, -0.35, 0.55]}
              color="#ff007f"
              intensity={3.4 * brightness}
              distance={4.8}
            />
          )}
          {/* Beam 2: Cold Cyan (#00e5ff) */}
          {cyanOn && (
            <pointLight
              position={[-1.05, -0.25, 0.45]}
              color="#00e5ff"
              intensity={3.2 * brightness}
              distance={4.8}
            />
          )}
          {/* Beam 3: Sickly Amber (#ffaa00) */}
          {amberOn && (
            <pointLight
              position={[0.1, -0.3, -0.95]}
              color="#ffaa00"
              intensity={3.0 * brightness}
              distance={4.8}
            />
          )}

          {/* Overhead Rotating Disco Fixture Sphere */}
          <mesh position={[0, 0.25, 0]}>
            <octahedronGeometry args={[0.11, 1]} />
            <meshStandardMaterial
              color="#2b262d"
              emissive={magentaOn ? '#ff007f' : cyanOn ? '#00e5ff' : '#ffaa00'}
              emissiveIntensity={0.45 * discoFactor}
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}
    </>
  );
};

/* ============================================================================
   IMMOVABLE OBJECTS: CRT MONITOR (#302) & FROSTED GLASS PARTITION
   ============================================================================ */
const VintageCRTMonitorMesh: React.FC<{
  quotaCount: number;
  file03Decrypted: boolean;
  lensBroken: boolean;
  endingARedactedCount: number;
  lang: Language;
  isFocused: boolean;
  onSelect: () => void;
}> = ({
  quotaCount,
  file03Decrypted,
  lensBroken,
  endingARedactedCount,
  lang,
  isFocused,
  onSelect,
}) => {
  const [hovered, setHovered] = useState(false);

  const screenTex = useMemo(
    () =>
      createMonitorScreenCanvasTexture(
        quotaCount,
        file03Decrypted,
        lensBroken,
        lang,
        endingARedactedCount
      ),
    [quotaCount, file03Decrypted, lensBroken, lang, endingARedactedCount]
  );

  const nameplateTex = useMemo(() => createNameplateTexture(), []);

  return (
    <group
      position={[0, 0.76, -0.18]}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Monitor Pedestal Base */}
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.06, 0.36]} />
        <meshStandardMaterial color="#2b2723" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.09, -0.02]} castShadow>
        <cylinderGeometry args={[0.11, 0.14, 0.08, 16]} />
        <meshStandardMaterial color="#24201c" roughness={0.75} />
      </mesh>

      {/* Rear CRT Cathode Tube Housing */}
      <mesh position={[0, 0.42, -0.16]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 0.48, 0.28]} />
        <meshStandardMaterial color="#292521" roughness={0.72} />
      </mesh>

      {/* Main Sculpted Monitor Casing */}
      <mesh position={[0, 0.43, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.62, 0.24]} />
        <meshStandardMaterial
          color={hovered && !isFocused ? '#3d3731' : '#332e29'}
          roughness={0.65}
        />
      </mesh>

      {/* Dark Recessed Inner Screen Frame */}
      <mesh position={[0, 0.44, 0.135]}>
        <boxGeometry args={[0.66, 0.48, 0.02]} />
        <meshStandardMaterial color="#141210" roughness={0.8} />
      </mesh>

      {/* Glowing Live Monitor Screen Plane */}
      <mesh position={[0, 0.44, 0.148]}>
        <planeGeometry args={[0.62, 0.44]} />
        <meshBasicMaterial map={screenTex} />
      </mesh>

      {/* Physical Metallic Nameplate: TCD-302 (Top Left of Bezel) */}
      <mesh position={[-0.24, 0.7, 0.142]}>
        <planeGeometry args={[0.16, 0.04]} />
        <meshStandardMaterial map={nameplateTex} metalness={0.6} roughness={0.35} />
      </mesh>

      {/* Power Indicator LED (Bottom Right of Bezel) */}
      <mesh position={[0.28, 0.16, 0.143]}>
        <boxGeometry args={[0.022, 0.014, 0.008]} />
        <meshBasicMaterial color={lensBroken ? '#ff2a3c' : '#e0c37b'} />
      </mesh>
    </group>
  );
};

const FrostedPartitionMesh: React.FC<{
  lensBroken: boolean;
  onSelect: () => void;
}> = ({ lensBroken, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const glassTex = useMemo(
    () => createPartitionGlassTexture(lensBroken),
    [lensBroken]
  );

  return (
    <group
      position={[0, 1.56, -0.78]}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Outer Wooden/Steel Partition Frame */}
      <mesh position={[0, 0.34, 0]} castShadow>
        <boxGeometry args={[2.3, 0.05, 0.06]} />
        <meshStandardMaterial
          color={hovered ? '#473e35' : '#2e2822'}
          roughness={0.7}
        />
      </mesh>
      <mesh position={[0, -0.34, 0]} castShadow>
        <boxGeometry args={[2.3, 0.05, 0.06]} />
        <meshStandardMaterial
          color={hovered ? '#473e35' : '#2e2822'}
          roughness={0.7}
        />
      </mesh>
      {/* Vertical Mullion Bars */}
      {[-1.12, -0.38, 0.38, 1.12].map((xPos, idx) => (
        <mesh key={idx} position={[xPos, 0, 0]} castShadow>
          <boxGeometry args={[0.05, 0.72, 0.06]} />
          <meshStandardMaterial
            color={hovered ? '#473e35' : '#2e2822'}
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* Ribbed Frosted Glass Plane */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.22, 0.64]} />
        <meshStandardMaterial
          map={glassTex}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

/* ============================================================================
   MAIN 3D DESK SCENE COMPONENT
   ============================================================================ */
export const DeskScene: React.FC<DeskSceneProps> = ({
  lang,
  focusTarget,
  quotaCount,
  redactedTargets,
  file03Decrypted,
  file04Delivered,
  file05Delivered,
  lensBroken,
  endingChoice,
  endingARedactedCount,
  brightness,
  onSelectFocus,
}) => {
  const walnutTex = useMemo(() => createWalnutDeskTexture(), []);

  const file01Done =
    redactedTargets.includes('f1_target1') &&
    redactedTargets.includes('f1_target2');
  const file03Done = redactedTargets.includes('f3_target1');
  const file04Done = redactedTargets.includes('f4_target1');
  const file05Done = redactedTargets.includes('f5_target1');

  const file03Status: 'locked' | 'decrypted' | 'complete' = !file03Decrypted
    ? 'locked'
    : file03Done
    ? 'complete'
    : 'decrypted';

  return (
    <div
      className="three-canvas-container"
      onContextMenu={(e) => {
        e.preventDefault();
        if (focusTarget !== 'none') {
          onSelectFocus('none');
        }
      }}
    >
      <Canvas
        shadows
        camera={{ fov: 42, position: [0, 1.48, 2.12], near: 0.1, far: 20 }}
        onPointerMissed={() => {
          if (focusTarget !== 'none') {
            onSelectFocus('none');
          }
        }}
      >
        <color attach="background" args={['#080706']} />
        <fogExp2 attach="fog" args={['#080706', 0.15]} />

        <ExposureController brightness={brightness} />
        <CameraController focusTarget={focusTarget} />
        <OfficeAndDiscoLighting
          lensBroken={lensBroken}
          endingChoice={endingChoice}
          endingARedactedCount={endingARedactedCount}
          brightness={brightness}
        />

        {/* ====================================================================
            STATIC 3D OFFICE DESK & CABINET #3 ARCHITECTURE
            ==================================================================== */}
        <group>
          {/* Main Walnut Desk Tabletop */}
          <mesh position={[0, 0.72, 0.05]} receiveShadow castShadow>
            <boxGeometry args={[2.28, 0.08, 1.24]} />
            <meshStandardMaterial map={walnutTex} roughness={0.78} />
          </mesh>

          {/* Dark Matte Desk Pad */}
          <mesh position={[0, 0.763, 0.14]} receiveShadow>
            <boxGeometry args={[1.56, 0.006, 0.86]} />
            <meshStandardMaterial color="#161412" roughness={0.9} />
          </mesh>

          {/* Left & Right Desk Drawer Pedestals */}
          <mesh position={[-0.82, 0.34, 0.05]} receiveShadow castShadow>
            <boxGeometry args={[0.52, 0.68, 1.12]} />
            <meshStandardMaterial map={walnutTex} roughness={0.82} />
          </mesh>
          <mesh position={[0.82, 0.34, 0.05]} receiveShadow castShadow>
            <boxGeometry args={[0.52, 0.68, 1.12]} />
            <meshStandardMaterial map={walnutTex} roughness={0.82} />
          </mesh>

          {/* Looming Archive Cabinet #3 in the Back-Left Shadow */}
          <group position={[-1.42, 0.88, -0.85]} rotation={[0, 0.22, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.68, 1.76, 0.62]} />
              <meshStandardMaterial color="#1d1b18" roughness={0.72} metalness={0.35} />
            </mesh>
            {/* Slightly Ajar Drawer #3 */}
            <mesh position={[0, 0.05, 0.34]} castShadow>
              <boxGeometry args={[0.6, 0.34, 0.12]} />
              <meshStandardMaterial color="#26231f" roughness={0.68} metalness={0.4} />
            </mesh>
          </group>
        </group>

        {/* ====================================================================
            IMMOVABLE INTERACTABLES (CAMERA DOLLY)
            ==================================================================== */}
        <FrostedPartitionMesh
          lensBroken={lensBroken}
          onSelect={() =>
            onSelectFocus(focusTarget === 'partition' ? 'none' : 'partition')
          }
        />

        <VintageCRTMonitorMesh
          quotaCount={quotaCount}
          file03Decrypted={file03Decrypted}
          lensBroken={lensBroken}
          endingARedactedCount={endingARedactedCount}
          lang={lang}
          isFocused={focusTarget === 'monitor'}
          onSelect={() =>
            onSelectFocus(focusTarget === 'monitor' ? 'none' : 'monitor')
          }
        />

        {/* ====================================================================
            MOVABLE INTERACTABLES (PICK UP TO CAMERA FRONT + ±15° PARALLAX)
            ==================================================================== */}

        {/* 1. Taped Polaroid Family_Photo.jpg on Monitor Lower-Left Bezel */}
        <InteractableProp
          restPosition={[-0.36, 1.02, -0.02]}
          restRotation={[0, 0.08, 0.06]}
          inspectPosition={[0, 1.37, 1.48]}
          inspectRotation={[0.04, 0, 0]}
          inspectScale={1.55}
          isFocused={focusTarget === 'polaroid'}
          onSelect={() =>
            onSelectFocus(focusTarget === 'polaroid' ? 'none' : 'polaroid')
          }
        >
          <PolaroidPhotoMesh lensBroken={lensBroken} />
        </InteractableProp>

        {/* 2. Aluminum Lunchbox (Left Desk Surface) */}
        <InteractableProp
          restPosition={[-0.68, 0.766, 0.02]}
          restRotation={[0, 0.28, 0]}
          inspectPosition={[0, 1.31, 1.42]}
          inspectRotation={[0.38, -0.15, 0]}
          inspectScale={1.45}
          isFocused={focusTarget === 'prop_lunchbox'}
          onSelect={() =>
            onSelectFocus(
              focusTarget === 'prop_lunchbox' ? 'none' : 'prop_lunchbox'
            )
          }
        >
          <LunchboxMesh lensBroken={lensBroken} lang={lang} />
        </InteractableProp>

        {/* 3. Stained Ceramic Coffee Mug (Front-Right Desk Surface) */}
        <InteractableProp
          restPosition={[0.48, 0.766, 0.36]}
          restRotation={[0, -0.45, 0]}
          inspectPosition={[0, 1.31, 1.46]}
          inspectRotation={[0.32, -0.35, 0]}
          inspectScale={1.65}
          isFocused={focusTarget === 'prop_mug'}
          onSelect={() =>
            onSelectFocus(focusTarget === 'prop_mug' ? 'none' : 'prop_mug')
          }
        >
          <CoffeeMugMesh lensBroken={lensBroken} />
        </InteractableProp>

        {/* 4. Department Standard Operating Manual Booklet (Front-Left Desk Corner) */}
        <InteractableProp
          restPosition={[-0.58, 0.766, 0.38]}
          restRotation={[0, 0.18, 0]}
          inspectPosition={[-0.38, 1.32, 1.25]}
          inspectRotation={[0.65, 0.12, 0]}
          inspectScale={1.2}
          isFocused={focusTarget === 'manual'}
          onSelect={() =>
            onSelectFocus(focusTarget === 'manual' ? 'none' : 'manual')
          }
        >
          <ManualBookletMesh />
        </InteractableProp>

        {/* 5. Three Fanned Kraft Archival Dossiers (#01, #02, #03 on Right Desk Corner) */}
        <InteractableProp
          restPosition={[0.56, 0.794, 0.06]}
          restRotation={[0, -0.12, 0]}
          inspectPosition={[0.38, 1.32, 1.22]}
          inspectRotation={[0.65, -0.12, 0]}
          inspectScale={1.2}
          isFocused={focusTarget === 'file01'}
          onSelect={() =>
            onSelectFocus(focusTarget === 'file01' ? 'none' : 'file01')
          }
        >
          <DossierFolderMesh
            num="#01"
            status={file01Done ? 'complete' : 'normal'}
          />
        </InteractableProp>

        <InteractableProp
          restPosition={[0.64, 0.78, -0.04]}
          restRotation={[0, -0.22, 0]}
          inspectPosition={[0.38, 1.32, 1.22]}
          inspectRotation={[0.65, -0.12, 0]}
          inspectScale={1.2}
          isFocused={focusTarget === 'file02' || focusTarget === 'compare'}
          onSelect={() =>
            onSelectFocus(focusTarget === 'file02' ? 'none' : 'file02')
          }
        >
          <DossierFolderMesh num="#02" status="normal" />
        </InteractableProp>

        <InteractableProp
          restPosition={[0.72, 0.766, -0.14]}
          restRotation={[0, -0.32, 0]}
          inspectPosition={[0.38, 1.32, 1.22]}
          inspectRotation={[0.65, -0.12, 0]}
          inspectScale={1.2}
          isFocused={focusTarget === 'file03' || focusTarget === 'compare'}
          onSelect={() =>
            onSelectFocus(focusTarget === 'file03' ? 'none' : 'file03')
          }
        >
          <DossierFolderMesh num="#03" status={file03Status} />
        </InteractableProp>

        {file04Delivered && (
          <InteractableProp
            restPosition={[0.82, 0.78, 0.14]}
            restRotation={[0, -0.06, 0]}
            inspectPosition={[0.38, 1.32, 1.22]}
            inspectRotation={[0.65, -0.12, 0]}
            inspectScale={1.2}
            isFocused={focusTarget === 'file04'}
            onSelect={() =>
              onSelectFocus(focusTarget === 'file04' ? 'none' : 'file04')
            }
          >
            <DossierFolderMesh
              num="#04"
              status={file04Done ? 'complete' : 'decrypted'}
            />
          </InteractableProp>
        )}

        {file05Delivered && (
          <InteractableProp
            restPosition={[0.86, 0.794, -0.02]}
            restRotation={[0, -0.18, 0]}
            inspectPosition={[0.38, 1.32, 1.22]}
            inspectRotation={[0.65, -0.12, 0]}
            inspectScale={1.2}
            isFocused={focusTarget === 'file05'}
            onSelect={() =>
              onSelectFocus(focusTarget === 'file05' ? 'none' : 'file05')
            }
          >
            <DossierFolderMesh
              num="#05"
              status={file05Done ? 'complete' : 'decrypted'}
            />
          </InteractableProp>
        )}
      </Canvas>
    </div>
  );
};
