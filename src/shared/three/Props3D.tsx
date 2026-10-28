import { useMemo } from "react";
import * as THREE from "three";
import { random } from "remotion";
import { theme } from "../theme";
import { useMotion } from "../motion";
import { Slab } from "./Slab";
import type { V3 } from "./types";

/** 금화 한 개. 앞면이 카메라를 향한다. */
export const Coin: React.FC<{ position?: V3; rotation?: V3; radius?: number; color?: string }> = ({
  position = [0, 0, 0],
  rotation = [Math.PI / 2, 0, 0],
  radius = 0.55,
  color = theme.gold,
}) => (
  <mesh position={position} rotation={rotation}>
    <cylinderGeometry args={[radius, radius, 0.22, 32]} />
    <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
  </mesh>
);

/** 위에서 금화가 떨어져 바닥에 쌓인다. 튕기며 착지하고, 위치는 고정된 난수로 정한다. */
export const CoinRain: React.FC<{
  count?: number;
  xRange?: [number, number];
  floorY?: number;
  fromY?: number;
  delay?: number;
  gap?: number;
}> = ({ count = 12, xRange = [-4, 4], floorY = -4, fromY = 14, delay = 0, gap = 3 }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <FallingCoin
        key={i}
        x={xRange[0] + random(`cx${i}`) * (xRange[1] - xRange[0])}
        landY={floorY - random(`cy${i}`) * 1.4}
        z={random(`cz${i}`) * 1.6}
        spin={(random(`cs${i}`) - 0.5) * 3}
        fromY={fromY}
        delay={delay + i * gap}
      />
    ))}
  </>
);

const FallingCoin: React.FC<{
  x: number;
  landY: number;
  z: number;
  spin: number;
  fromY: number;
  delay: number;
}> = ({ x, landY, z, spin, fromY, delay }) => {
  const p = useMotion("pop", delay);
  const y = fromY + (landY - fromY) * p;
  return <Coin position={[x, y, z]} rotation={[Math.PI / 2 + (1 - p) * 4, 0, spin * 0.3]} />;
};

const heartShape = () => {
  const s = new THREE.Shape();
  s.moveTo(0, 0.25);
  s.bezierCurveTo(0, 0.55, -0.5, 0.55, -0.5, 0.2);
  s.bezierCurveTo(-0.5, -0.1, -0.1, -0.25, 0, -0.5);
  s.bezierCurveTo(0.1, -0.25, 0.5, -0.1, 0.5, 0.2);
  s.bezierCurveTo(0.5, 0.55, 0, 0.55, 0, 0.25);
  return s;
};

/** 하트 한 개 */
export const Heart: React.FC<{ position?: V3; scale?: number; rotationZ?: number }> = ({
  position = [0, 0, 0],
  scale = 1,
  rotationZ = 0,
}) => {
  const geometry = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(heartShape(), {
      depth: 0.25,
      bevelEnabled: true,
      bevelSize: 0.06,
      bevelThickness: 0.06,
      bevelSegments: 3,
    });
    g.center();
    return g;
  }, []);
  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={[0, 0, rotationZ]}
      scale={Math.max(scale, 0.0001)}
    >
      <meshStandardMaterial color={theme.heart} roughness={0.6} />
    </mesh>
  );
};

/** 하트가 위로 떠오르며 사라진다 */
export const HeartBurst: React.FC<{
  position?: V3;
  count?: number;
  delay?: number;
  rise?: number;
}> = ({ position = [0, 0, 0], count = 6, delay = 0, rise = 5 }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <RisingHeart
        key={i}
        base={[position[0] + (i - (count - 1) / 2) * 0.95, position[1], position[2] + 0.5]}
        rise={rise + random(`hr${i}`) * 1.5}
        delay={delay + i * 5}
        tilt={(random(`ht${i}`) - 0.5) * 0.6}
      />
    ))}
  </>
);

const RisingHeart: React.FC<{ base: V3; rise: number; delay: number; tilt: number }> = ({
  base,
  rise,
  delay,
  tilt,
}) => {
  const p = useMotion("soft", delay);
  const size = 0.9 * Math.min(1, p * 4) * (1 - Math.max(0, (p - 0.7) / 0.3));
  return <Heart position={[base[0], base[1] + rise * p, base[2]]} scale={size} rotationZ={tilt} />;
};

/** 가운데 선을 축으로 열리고 닫히는 문. close가 0이면 열림, 1이면 닫힘. */
export const Door3D: React.FC<{ position?: V3; delay?: number }> = ({
  position = [0, 0, 0],
  delay = 0,
}) => {
  const appear = useMotion("soft", 0);
  const close = useMotion("pop", delay);
  return (
    <group position={position} scale={Math.max(appear, 0.0001)}>
      <Slab w={3.2} h={4.8} d={0.6} color={theme.text} />
      <group position={[-1.3, 0, 0.35]} rotation={[0, -(1 - close) * 1.3, 0]}>
        <Slab w={2.6} h={4.4} d={0.4} color={theme.mom} position={[1.3, 0, 0]}>
          <mesh position={[0.95, 0, 0.3]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color={theme.bg} />
          </mesh>
        </Slab>
      </group>
    </group>
  );
};

/** 두 획으로 박히는 붉은 X */
export const XMark3D: React.FC<{ position?: V3; size?: number; delay?: number }> = ({
  position = [0, 0, 0],
  size = 3.6,
  delay = 0,
}) => {
  const a = useMotion("pop", delay);
  const b = useMotion("pop", delay + 6);
  return (
    <group position={position}>
      <Slab w={size} h={0.38} d={0.3} color={theme.danger} rotation={[0, 0, Math.PI / 4]} scale={[a, 1, 1]} />
      <Slab w={size} h={0.38} d={0.3} color={theme.danger} rotation={[0, 0, -Math.PI / 4]} scale={[b, 1, 1]} />
    </group>
  );
};

/** 돌며 나타나는 초록 체크 */
export const Check3D: React.FC<{ position?: V3; delay?: number; size?: number }> = ({
  position = [0, 0, 0],
  delay = 0,
  size = 1,
}) => {
  const p = useMotion("pop", delay);
  return (
    <group
      position={position}
      rotation={[0, (1 - p) * Math.PI * 2, 0]}
      scale={Math.max(p * size, 0.0001)}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.3, 40]} />
        <meshStandardMaterial color={theme.success} roughness={0.7} />
      </mesh>
      <Slab w={0.36} h={0.14} d={0.14} color={theme.onAccent} position={[-0.2, -0.1, 0.2]} rotation={[0, 0, -Math.PI / 4]} />
      <Slab w={0.7} h={0.14} d={0.14} color={theme.onAccent} position={[0.1, 0.02, 0.2]} rotation={[0, 0, Math.PI / 3.2]} />
    </group>
  );
};

/** 말풍선 모양 생각 구름. 둥근 슬래브에 구를 붙여 몽글몽글하게 만든다. */
export const ThoughtCloud: React.FC<{
  position?: V3;
  w?: number;
  h?: number;
  color?: string;
  delay?: number;
  children?: React.ReactNode;
}> = ({ position = [0, 0, 0], w = 6.2, h = 2.8, color = theme.thought, delay = 0, children }) => {
  const p = useMotion("pop", delay);
  const bumps: [number, number, number][] = [
    [-w * 0.32, h / 2, 0.95],
    [0, h / 2 + 0.1, 1.05],
    [w * 0.32, h / 2, 0.95],
    [-w * 0.32, -h / 2, 0.85],
    [0, -h / 2 - 0.1, 0.9],
    [w * 0.32, -h / 2, 0.85],
  ];
  return (
    <group position={position} scale={Math.max(p, 0.0001)}>
      <Slab w={w} h={h} d={0.9} color={color} />
      {bumps.map(([x, y, r], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <sphereGeometry args={[r * 0.85, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      ))}
      {children}
    </group>
  );
};
