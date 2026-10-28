import { Sequence, interpolate } from "remotion";
import { theme } from "../../shared/theme";
import { useMotion } from "../../shared/motion";
import { Slab } from "../../shared/three/Slab";
import { TextPlane } from "../../shared/three/TextPlane";
import { Person3D } from "../../shared/three/Person3D";
import { CoinRain, Door3D } from "../../shared/three/Props3D";
import { content } from "./content";
import { timeline } from "./timeline";

/** 1장면: 스마트폰 통화기록 0건 + 쏟아지는 금화 + 멀어지는 두 사람 */
const Phase1: React.FC = () => {
  const { question } = timeline.hook;
  const pop = useMotion("pop", 0);
  const sway = useMotion("slow", 0);
  const underline = useMotion("soft", 12);
  const card = useMotion("pop", 6);
  const drift = useMotion("slow", 10);
  const exit = useMotion("soft", question);
  const alive = Math.max(0.0001, 1 - exit);
  const away = interpolate(drift, [0, 1], [1.8, 3.4]);

  return (
    <group scale={alive}>
      {/* 스마트폰 */}
      <group
        position={[0, 2.4, 0]}
        rotation={[0.04, interpolate(sway, [0, 1], [-0.45, -0.1]), 0]}
        scale={interpolate(pop, [0, 1], [0.85, 1])}
      >
        <Slab w={5.8} h={9.4} d={0.9} color={theme.text} />
        <Slab w={5.2} h={8.8} d={0.1} color={theme.onAccent} position={[0, 0, 0.5]} />
        <TextPlane text="통화기록" size={72} color={theme.textSoft} position={[0, 2.5, 0.6]} />
        <TextPlane text={content.hook.title.split("\n")[1]} size={250} color={theme.danger} position={[0, 0.3, 0.6]} />
        <Slab
          w={2.7}
          h={0.14}
          d={0.1}
          color={theme.danger}
          position={[0, -1.35, 0.6]}
          scale={[Math.max(underline, 0.0001), 1, 1]}
        />
        <TextPlane text={content.hook.ask} size={96} position={[0, -2.9, 0.6]} />
      </group>

      {/* 용돈 입금 알림 */}
      <group position={[0, 8.5, 0.5]} rotation={[(1 - card) * 0.8, 0, 0]} scale={Math.max(card, 0.0001)}>
        <Slab w={8.6} h={2.3} d={0.6} color={theme.success} />
        <mesh position={[-3.2, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.2, 40]} />
          <meshStandardMaterial color={theme.onAccent} />
        </mesh>
        <TextPlane text="₩" size={80} color={theme.success} position={[-3.2, 0, 0.5]} />
        <TextPlane text={content.hook.money.title} size={44} color={theme.onAccent} position={[0.6, 0.5, 0.4]} />
        <TextPlane text={content.hook.money.amount} size={72} color={theme.onAccent} position={[0.6, -0.4, 0.4]} />
      </group>

      <CoinRain count={12} xRange={[-4.2, 4.2]} floorY={-3.2} spread={0.8} fromY={15} delay={10} gap={3} />

      {/* 멀어지는 엄마와 자녀 */}
      <Person3D kind="mom" mood="neutral" radius={1.0} position={[-away, -7.5, 0]} />
      <Person3D kind="child" mood="sad" radius={1.0} position={[away, -7.5, -away * 0.4]} delay={4} />
    </group>
  );
};

/** 2장면: "?" 말풍선 3개가 쌓이고 마음의 문이 쾅 닫힌다 */
const Phase2: React.FC = () => {
  const ys = [6.4, 3.9, 1.4];
  const delays = [8, 16, 24];
  return (
    <group>
      {ys.map((y, i) => (
        <FlyingBubble key={i} y={y} delay={delays[i]} side={i % 2 === 0 ? -1 : 1} />
      ))}
      {/* 이 장면의 문장은 자막으로 나오므로 문 아래 글자는 넣지 않는다 */}
      <group scale={0.9}>
        <Door3D position={[0, -2.2, 0]} delay={50} />
      </group>
    </group>
  );
};

const FlyingBubble: React.FC<{ y: number; delay: number; side: number }> = ({ y, delay, side }) => {
  const p = useMotion("pop", delay);
  const x = side * 11 * (1 - p);
  return (
    <group position={[x, y, 0]} rotation={[0, 0, side * (1 - p) * 0.6]}>
      <Slab w={6.6} h={1.9} d={0.8} color={theme.bad}>
        <TextPlane text="?" size={96} color={theme.textSoft} position={[0, 0, 0.45]} />
        <Slab w={0.5} h={0.5} d={0.4} color={theme.bad} position={[-2.4, -1.0, 0]} rotation={[0, 0, Math.PI / 4]} />
      </Slab>
    </group>
  );
};

export const Hook3D: React.FC = () => {
  const { question } = timeline.hook;
  return (
    <>
      <Sequence from={0} durationInFrames={question + 20} layout="none">
        <Phase1 />
      </Sequence>
      <Sequence from={question} layout="none">
        <Phase2 />
      </Sequence>
    </>
  );
};
