'use client';

// 3D-акцент в hero: маленький, медленно вращающийся «бриллиант» (октаэдр)
// с преломляющим материалом. Рендерится ТОЛЬКО на десктопе и без reduced-motion
// (гейт стоит в Hero.tsx). Canvas прозрачный — лежит поверх тёмной hero-секции.
import {Canvas, useFrame} from '@react-three/fiber';
import {Environment, Lightformer, Float, MeshTransmissionMaterial} from '@react-three/drei';
import {useRef} from 'react';
import * as THREE from 'three';

// Сам «бриллиант»: низкополигональный октаэдр, медленно крутится вокруг оси Y.
function Diamond() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    // delta — время кадра в секундах, поэтому скорость не зависит от FPS
    if (ref.current) ref.current.rotation.y += delta * 0.3;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[1, 0]} />
      <MeshTransmissionMaterial
        thickness={1.4}
        roughness={0}
        transmission={1}
        ior={2.4}
        chromaticAberration={0.06}
        anisotropy={0.2}
        distortion={0.1}
        distortionScale={0.2}
        color="#ffffff"
      />
    </mesh>
  );
}

export default function Gem() {
  return (
    <Canvas
      camera={{position: [0, 0, 4], fov: 35}}
      dpr={[1, 1.8]} // ограничиваем разрешение ради производительности
      gl={{antialias: true, alpha: true}}
      style={{background: 'transparent'}}
    >
      <ambientLight intensity={0.4} />
      {/* Лёгкое «парение» — добавляет живости без резких движений */}
      <Float speed={1.1} rotationIntensity={0.5} floatIntensity={0.7}>
        <Diamond />
      </Float>
      {/* Окружение из источников-света даёт преломления и блики в гранях.
          Цвета — из палитры бренда (золото + тёплый deep gold). */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} position={[2, 2, 2]} scale={5} color="#C4A052" />
        <Lightformer form="rect" intensity={1.6} position={[-2, -1, 2]} scale={5} color="#ffffff" />
        <Lightformer form="ring" intensity={1.2} position={[0, 0, -3]} scale={3} color="#A07E32" />
      </Environment>
    </Canvas>
  );
}
