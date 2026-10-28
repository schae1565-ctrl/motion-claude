import { theme } from "../theme";
import { useMotion } from "../motion";
import type { V3 } from "./types";

type Mood = "neutral" | "sad" | "happy";

/** 엄마(주황)와 자녀(파랑) 구. 눈과 입이 있고 표정이 바뀐다. */
export const Person3D: React.FC<{
  kind: "mom" | "child";
  mood?: Mood;
  radius?: number;
  position?: V3;
  rotationZ?: number;
  scale?: number;
  delay?: number;
}> = ({ kind, mood = "neutral", radius: R = 1.2, position = [0, 0, 0], rotationZ = 0, scale = 1, delay = 0 }) => {
  const p = useMotion("pop", delay);
  const body = kind === "mom" ? theme.mom : theme.child;

  return (
    <group
      position={position}
      rotation={[0, 0, rotationZ]}
      scale={Math.max(p * scale, 0.0001)}
    >
      <mesh>
        <sphereGeometry args={[R, 48, 48]} />
        <meshStandardMaterial color={body} roughness={0.8} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.3 * R, 0.15 * R, 0.93 * R]}>
          <sphereGeometry args={[0.075 * R, 16, 16]} />
          <meshStandardMaterial color={theme.text} />
        </mesh>
      ))}
      {mood === "neutral" ? (
        <mesh position={[0, -0.25 * R, 0.96 * R]}>
          <boxGeometry args={[0.42 * R, 0.07 * R, 0.07 * R]} />
          <meshStandardMaterial color={theme.text} />
        </mesh>
      ) : (
        <mesh
          position={[0, mood === "happy" ? -0.02 * R : -0.5 * R, 1.02 * R]}
          rotation={[0, 0, mood === "happy" ? Math.PI : 0]}
        >
          <torusGeometry args={[0.24 * R, 0.045 * R, 12, 24, Math.PI]} />
          <meshStandardMaterial color={theme.text} />
        </mesh>
      )}
    </group>
  );
};
