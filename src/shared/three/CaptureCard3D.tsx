import { theme } from "../theme";
import { useMotion } from "../motion";
import { Slab } from "./Slab";
import { TextPlane } from "./TextPlane";
import type { V3 } from "./types";

const Row: React.FC<{ n: number; text: string; y: number; delay: number }> = ({
  n,
  text,
  y,
  delay,
}) => {
  const p = useMotion("soft", delay);
  return (
    <group position={[0, y - (1 - p) * 0.4, 0.5]}>
      <mesh position={[-3.45, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]} scale={Math.max(p, 0.0001)}>
        <cylinderGeometry args={[0.4, 0.4, 0.15, 32]} />
        <meshStandardMaterial color={theme.good} roughness={0.8} />
      </mesh>
      <TextPlane text={String(n)} size={40} color={theme.accent} position={[-3.45, 0, 0.25]} opacity={p} />
      <TextPlane text={text} size={46} maxWidth={640} position={[0.45, 0, 0.1]} opacity={p} />
    </group>
  );
};

/** "이 화면을 캡처해서 쓰세요" 안내와 바로 쓸 문장을 담은 3D 카드 */
export const CaptureCard3D: React.FC<{
  title: string;
  lines: readonly string[];
  position?: V3;
  delay?: number;
}> = ({ title, lines, position = [0, 0, 0], delay = 0 }) => {
  const p = useMotion("pop", delay);
  return (
    <group
      position={position}
      rotation={[(1 - p) * 0.7, 0, 0]}
      scale={Math.max(p, 0.0001)}
    >
      <Slab w={9.4} h={5.8} d={0.8} color={theme.accent} />
      <Slab w={9.0} h={5.4} d={0.3} color={theme.onAccent} position={[0, 0, 0.35]} />
      {/* 카메라 아이콘 */}
      <group position={[-3.1, 1.95, 0.7]}>
        <Slab w={1.0} h={0.7} d={0.3} color={theme.accent} />
        <Slab w={0.4} h={0.2} d={0.2} color={theme.accent} position={[0, 0.4, 0]} />
        <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.12, 24]} />
          <meshStandardMaterial color={theme.onAccent} />
        </mesh>
      </group>
      <TextPlane text={title} size={54} color={theme.accent} position={[0.5, 1.95, 0.55]} />
      {lines.map((line, i) => (
        <Row key={line} n={i + 1} text={line} y={0.55 - i * 1.2} delay={delay + 14 + i * 10} />
      ))}
    </group>
  );
};
