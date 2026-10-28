import { Sequence, interpolate } from "remotion";
import { theme } from "../../shared/theme";
import { useMotion } from "../../shared/motion";
import { TextPlane } from "../../shared/three/TextPlane";
import { Person3D } from "../../shared/three/Person3D";
import { HeartBurst, XMark3D } from "../../shared/three/Props3D";
import { CaptureCard3D } from "../../shared/three/CaptureCard3D";
import { content } from "./content";
import { timeline } from "./timeline";

const R = 1.5;

/** 굴러서 가까워져 맞닿는 두 사람 */
const RollingPair: React.FC<{ y: number; radius?: number; from?: number; to?: number }> = ({
  y,
  radius = R,
  from = 3.2,
  to = 1.1,
}) => {
  const p = useMotion("slow", 20);
  const x = interpolate(p, [0, 1], [from, to]);
  // 굴러서 다가가다가 맞닿으면 얼굴이 바로 서도록 도착할수록 회전이 줄어든다
  const roll = ((from - x) / radius) * (1 - p) * 1.5;
  return (
    <>
      <Person3D kind="mom" mood="happy" radius={radius} position={[-x, y, 0]} rotationZ={-roll} />
      <Person3D kind="child" mood="happy" radius={radius} position={[x, y, 0]} rotationZ={roll} delay={4} />
    </>
  );
};

const Recap: React.FC = () => {
  const right = useMotion("pop", 30);
  return (
    <group>
      <group position={[0, 6.0, 0]}>
        <TextPlane text={content.closing.wrong} size={110} color={theme.textSoft} />
        <XMark3D position={[0, 0, 0.8]} size={2.4} delay={14} />
      </group>
      <TextPlane
        text={content.closing.right}
        size={130}
        color={theme.accent}
        position={[0, 3.4 + (1 - right) * -1.2, 0.5]}
        scale={right}
      />
      <RollingPair y={-0.6} />
      <HeartBurst position={[0, 1.4, 1]} count={5} delay={70} rise={4} />
    </group>
  );
};

const Ask: React.FC = () => {
  const q = useMotion("pop", 0);
  return (
    <group>
      <TextPlane text={content.closing.ask} size={104} maxWidth={980} position={[0, 6.2, 0.5]} scale={q} />
      <CaptureCard3D
        title={content.closing.captureTitle}
        lines={content.items.map((item) => `“${item.good}”`)}
        position={[0, 0.2, 0]}
        delay={20}
      />
      <RollingPair y={-6.4} radius={0.95} from={1.1} to={1.0} />
      <HeartBurst position={[0, -5.0, 1]} count={5} delay={40} rise={3} />
    </group>
  );
};

export const Closing3D: React.FC = () => {
  const { recap } = timeline.closing;
  return (
    <>
      <Sequence from={0} durationInFrames={recap} layout="none">
        <Recap />
      </Sequence>
      <Sequence from={recap} layout="none">
        <Ask />
      </Sequence>
    </>
  );
};
