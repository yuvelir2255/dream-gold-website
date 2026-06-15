'use client';

// 3D-бриллиант в hero. Используем MeshRefractionMaterial — материал drei, созданный
// специально для камней: настоящее преломление света через грани + «огонь» (дисперсия).
// HDR-окружение (useEnvironment) даёт реальные блики/искры. Canvas прозрачный.
// Рендерится только на десктопе при наличии WebGL (гейт в Hero.tsx).
import {Suspense, useRef} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {Float, MeshRefractionMaterial, useEnvironment} from '@react-three/drei';
import * as THREE from 'three';

function Diamond() {
  const ref = useRef<THREE.Mesh>(null);
  // HDR-окружение (грузится один раз) — источник бликов и преломлений.
  const envMap = useEnvironment({preset: 'dawn'});

  useFrame((_, delta) => {
    // медленное вращение, не зависит от FPS
    if (ref.current) ref.current.rotation.y += delta * 0.25;
  });

  return (
    <Float speed={1} rotationIntensity={0.35} floatIntensity={0.6}>
      <mesh ref={ref} scale={1.15}>
        {/* октаэдр читается как огранённый камень */}
        <octahedronGeometry args={[1, 0]} />
        <MeshRefractionMaterial
          envMap={envMap}
          bounces={3}
          aberrationStrength={0.03}
          ior={2.4}
          fresnel={1}
          color="#ffffff"
          fastChroma
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

export default function Gem() {
  return (
    <Canvas
      camera={{position: [0, 0, 4.2], fov: 32}}
      dpr={[1, 2]} // ограничение разрешения ради производительности
      gl={{antialias: true, alpha: true}}
      style={{background: 'transparent'}}
    >
      {/* Suspense — пока грузится HDR-окружение, ничего не показываем (без ошибок) */}
      <Suspense fallback={null}>
        <Diamond />
      </Suspense>
    </Canvas>
  );
}
