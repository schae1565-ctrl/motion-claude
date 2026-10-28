import { Sequence, interpolate, random, useCurrentFrame } from "remotion";
import { theme } from "../../shared/theme";
import { useMotion } from "../../shared/motion";
import { Slab } from "../../shared/three/Slab";
import { TextPlane } from "../../shared/three/TextPlane";
import { Person3D } from "../../shared/three/Person3D";
import { Check3D, Coin, HeartBurst, ThoughtCloud, XMark3D } from "../../shared/three/Props3D";
import type { V3 } from "../../shared/three/types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const BUBBLE_Y = 4.6;
const CHILD: V3 = [-3.6, -1.6, 0];
const CLOUD: V3 = [1.7, -1.4, 0];

/** 쪼개져 떨어지는 말풍선 반쪽 */
const Half: React.FC<{ side: number }> = ({ side }) => {
  const p = useMotion("soft", 0);
  return (
    <group
      position={[side * (2.2 + p * 1.8), BUBBLE_Y - p * 7, 0]}
      rotation={[0, 0, -side * p * 0.7]}
    >
      <Slab w={4.4} h={3.2} d={0.9} color={theme.bad} opacity={1 - p} />
    </group>
  );
};

/** 변형 1: 속마음 구름에서 무거운 동전이 떨어진다 (빚) */
const HeavyCoins: React.FC = () => (
  <>
    {[0, 1, 2, 3].map((i) => (
      <DroppingCoin key={i} x={CLOUD[0] - 1.8 + i * 1.2} delay={14 + i * 6} />
    ))}
  </>
);

const DroppingCoin: React.FC<{ x: number; delay: number }> = ({ x, delay }) => {
  const p = useMotion("soft", delay);
  return <Coin position={[x, CLOUD[1] - 1.2 - p * 6.5, 1.6]} rotation={[Math.PI / 2, 0, p * 3]} radius={0.5} />;
};

/** 변형 2: 자녀 귀 옆으로 작은 말풍선이 겹겹이 쌓인다 (잔소리) */
const PilingBubbles: React.FC = () => (
  <>
    {Array.from({ length: 7 }, (_, i) => (
      <PileBubble key={i} i={i} />
    ))}
  </>
);

const PileBubble: React.FC<{ i: number }> = ({ i }) => {
  const p = useMotion("pop", 8 + i * 5);
  const x = CHILD[0] + 1.8 + random(`pbx${i}`) * 5.6;
  const y = -4.6 + random(`pby${i}`) * 4.2 + i * 0.25;
  return (
    <Slab
      w={1.9}
      h={0.9}
      d={0.5}
      color={theme.bad}
      position={[x + (1 - p) * 6, y, -0.5 + random(`pbz${i}`)]}
      rotation={[0, 0, (random(`pbr${i}`) - 0.5) * 0.9]}
      scale={p}
    />
  );
};

/** 변형 3: 줄 선 다른 집 아이들 */
const OtherKids: React.FC = () => (
  <>
    {[0, 1, 2, 3, 4].map((i) => (
      <KidBall key={i} i={i} />
    ))}
  </>
);

const KidBall: React.FC<{ i: number }> = ({ i }) => {
  const p = useMotion("pop", 6 + i * 4);
  return (
    <mesh position={[-1 + i * 1.7, -0.9 + i * 0.1, -2 - i * 1.6]} scale={Math.max(p, 0.0001)}>
      <sphereGeometry args={[1.1, 32, 32]} />
      <meshStandardMaterial color={i % 2 ? theme.thoughtBright : theme.good} roughness={0.85} />
    </mesh>
  );
};

/** 엄마 말 → 자식의 속마음 → 대신 할 말 */
export const Item3D: React.FC<{
  n: number;
  mom: string;
  thought: string;
  good: string;
  beats: { mom: number; thought: number; good: number };
  variant: 1 | 2 | 3;
}> = ({ n, mom, thought, good, beats, variant }) => {
  const frame = useCurrentFrame();
  const t1 = beats.mom;
  const t2 = beats.mom + beats.thought;
  const breakAt = t2 + 14;
  const swapAt = t2 + 16;

  const drop = useMotion("pop", 0);
  const bubbleIn = useMotion("pop", 6);
  const dim = interpolate(frame, [t1, t1 + 10], [1, 0.45], clamp);
  const textFade = interpolate(frame, [t2, t2 + 8], [1, 0], clamp);
  const shrinkIn = useMotion("slow", t1 + 10);
  const shrinkOut = useMotion("slow", t2);
  const childScale = variant === 3 ? 1 - 0.3 * shrinkIn + 0.3 * shrinkOut : 1;
  const happy = frame >= t2;

  return (
    <group>
      {/* 숫자 블록: 위에서 떨어져 튕긴다 */}
      <group position={[0, 8.0 + (1 - drop) * 7, 0]} rotation={[0, 0, (1 - drop) * 0.8]}>
        <Slab w={1.9} h={1.9} d={1.2} color={theme.accent}>
          <TextPlane text={String(n)} size={130} color={theme.onAccent} position={[0, 0, 0.65]} />
        </Slab>
      </group>

      {/* 엄마 말: X가 박히고 쪼개진 뒤 따뜻한 말풍선으로 뒤집힌다 */}
      <Sequence from={0} durationInFrames={breakAt} layout="none">
        <group
          position={[0, BUBBLE_Y, 0]}
          rotation={[0, (1 - bubbleIn) * -0.6, 0]}
          scale={Math.max(bubbleIn, 0.0001)}
        >
          <Slab w={8.8} h={3.2} d={0.9} color={theme.bad} opacity={dim}>
            <Slab w={0.6} h={0.6} d={0.5} color={theme.bad} position={[-3.6, -1.7, 0]} rotation={[0, 0, Math.PI / 4]} opacity={dim} />
            <TextPlane
              text={`“${mom}”`}
              size={72}
              color={theme.badText}
              maxWidth={740}
              position={[0, 0, 0.5]}
              opacity={dim * textFade}
            />
          </Slab>
        </group>
      </Sequence>
      <Sequence from={t2} durationInFrames={swapAt - t2} layout="none">
        <XMark3D position={[0, BUBBLE_Y, 1.2]} size={3.8} />
      </Sequence>
      <Sequence from={breakAt} durationInFrames={50} layout="none">
        <Half side={-1} />
        <Half side={1} />
      </Sequence>
      <Sequence from={swapAt} layout="none">
        <GoodBubble text={good} />
      </Sequence>

      {/* 안내 문구 */}
      <Sequence from={t1} durationInFrames={beats.thought} layout="none">
        <Label text="자식은 이렇게 들어요." color={theme.textSoft} />
      </Sequence>
      <Sequence from={t2} layout="none">
        <Label text="대신 이렇게요." color={theme.accent} />
      </Sequence>

      {/* 자식과 속마음 */}
      <Sequence from={t1} layout="none">
        <Person3D
          kind="child"
          mood={happy ? "happy" : "sad"}
          radius={1.3}
          position={CHILD}
          scale={childScale}
        />
      </Sequence>
      <Sequence from={t1} durationInFrames={beats.thought} layout="none">
        <ThoughtCloud position={CLOUD} delay={6}>
          <TextPlane text={thought} size={54} color={theme.thoughtText} maxWidth={520} position={[0, 0, 0.5]} />
        </ThoughtCloud>
        <mesh position={[-1.9, -1.0, 0.2]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color={theme.thought} />
        </mesh>
        {variant === 1 ? <HeavyCoins /> : null}
        {variant === 2 ? <PilingBubbles /> : null}
        {variant === 3 ? <OtherKids /> : null}
      </Sequence>

      {/* 대신 할 말이 나오면 하트가 떠오른다 */}
      <Sequence from={t2} layout="none">
        <HeartBurst position={[CHILD[0], CHILD[1] + 1.8, 0.8]} count={5} delay={8} rise={3.2} />
      </Sequence>
    </group>
  );
};

const GoodBubble: React.FC<{ text: string }> = ({ text }) => {
  const p = useMotion("pop", 0);
  return (
    <group position={[0, BUBBLE_Y, 0]} rotation={[(1 - p) * (Math.PI / 2), 0, 0]}>
      <Slab w={8.8} h={3.2} d={0.9} color={theme.good}>
        <Slab w={0.6} h={0.6} d={0.5} color={theme.good} position={[-3.6, -1.7, 0]} rotation={[0, 0, Math.PI / 4]} />
        <TextPlane text={`“${text}”`} size={72} color={theme.goodText} maxWidth={740} position={[0, 0, 0.5]} />
      </Slab>
      <Check3D position={[4.3, 1.7, 1.0]} delay={14} />
    </group>
  );
};

const Label: React.FC<{ text: string; color: string }> = ({ text, color }) => {
  const p = useMotion("soft", 0);
  return <TextPlane text={text} size={56} color={color} position={[0, 1.9 - (1 - p) * 0.3, 0.5]} opacity={p} />;
};
