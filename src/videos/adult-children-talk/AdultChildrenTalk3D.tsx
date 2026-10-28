import { AbsoluteFill, Audio, Sequence, interpolateColors, staticFile, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { theme } from "../../shared/theme";
import { useMotion } from "../../shared/motion";
import { CameraRig, type CameraKey } from "../../shared/three/CameraRig";
import { Hook3D } from "./Hook3D";
import { Item3D } from "./Item3D";
import { Closing3D } from "./Closing3D";
import { Subtitles } from "./Subtitles";
import { content } from "./content";
import { NARRATION, closingFrames, hookFrames, itemFrames, starts, timeline } from "./timeline";

const [i1, i2, i3] = starts.items;

// 장면마다 카메라가 다른 각도로 다가가거나 돈다 (카메라는 항상 z=30 부근에서 정면을 본다)
// 화면 가장자리가 잘리지 않도록 z는 30 이상, 옆 이동은 작게 유지한다
const cameraKeys: CameraKey[] = [
  { f: 0, pos: [-1.0, 0.6, 31], look: [0, 1, 0] },
  { f: 50, pos: [0.6, 0.3, 30], look: [0, 1, 0] },
  { f: starts.teaser, pos: [0, 0.8, 35], look: [0, 0.5, 0] },
  { f: i1.mom, pos: [-0.8, 1.0, 31], look: [0, 1.5, 0] },
  { f: i1.thought, pos: [0.8, 0.2, 30.5], look: [-0.3, 0, 0] },
  { f: i1.good, pos: [0, 1.2, 32], look: [0, 2, 0] },
  { f: i2.mom, pos: [0.8, 1.0, 31], look: [0, 1.5, 0] },
  { f: i2.thought, pos: [-0.8, 0.2, 30.5], look: [0.3, 0, 0] },
  { f: i2.good, pos: [0, 1.2, 32], look: [0, 2, 0] },
  { f: i3.mom, pos: [0, 1.8, 30.5], look: [0, 2, 0] },
  { f: i3.thought, pos: [0.8, -0.6, 30.5], look: [0, 0, 0] },
  { f: i3.good, pos: [0, 1.0, 32], look: [0, 2, 0] },
  { f: starts.recap, pos: [0, 0.5, 31], look: [0, 0.5, 0] },
  { f: starts.ask, pos: [0, 1, 33], look: [0, 1, 0] },
];

// 문이 쾅 닫히는 순간(후킹 장면 2, 문 닫힘 시작 + 2프레임)에 화면이 흔들린다
const shakes = [starts.teaser + 52];

export const AdultChildrenTalk3D: React.FC = () => {
  const { width, height } = useVideoConfig();
  const warm = useMotion("slow", starts.recap);

  return (
    <AbsoluteFill
      style={{ background: interpolateColors(warm, [0, 1], [theme.bg, theme.bgWarm]) }}
    >
      <Audio src={staticFile(NARRATION)} />
      <ThreeCanvas
        width={width}
        height={height}
        flat
        camera={{ position: [0, 0, 30], fov: 35.5, near: 1, far: 200 }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 9, 14]} intensity={2.2} />
        <CameraRig keys={cameraKeys} shakes={shakes} />

        <Sequence from={0} durationInFrames={hookFrames} layout="none">
          <Hook3D />
        </Sequence>
        {content.items.map((item, i) => (
          <Sequence key={i} from={starts.items[i].mom} durationInFrames={itemFrames[i]} layout="none">
            <Item3D n={i + 1} {...item} beats={timeline.items[i]} variant={(i + 1) as 1 | 2 | 3} />
          </Sequence>
        ))}
        <Sequence from={starts.recap} durationInFrames={closingFrames} layout="none">
          <Closing3D />
        </Sequence>
      </ThreeCanvas>
      <Subtitles />
    </AbsoluteFill>
  );
};
