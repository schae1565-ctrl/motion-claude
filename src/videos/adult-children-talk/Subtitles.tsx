import { Sequence } from "remotion";
import { SubtitleLine } from "../../shared/ui/SubtitleLine";
import { content } from "./content";
import { starts } from "./timeline";

// 13개 장면의 시작 프레임 (후킹 2, 항목 3×3, 마무리 2)
const sceneStarts = [
  starts.hook,
  starts.teaser,
  ...starts.items.flatMap((i) => [i.mom, i.thought, i.good]),
  starts.recap,
  starts.ask,
];

const END_GAP = 6; // 문장이 끝난 뒤 다음 장면 시작 전까지 쉬는 프레임

// 장면 안에 같은 글자가 이미 나오는 안내 문구(Item3D의 Label)는 자막으로 다시 보여 주지 않는다
const ON_SCREEN = new Set(["자식은 이렇게 들어요.", "대신 이렇게요."]);
const syllables = (s: string) => (s.match(/[가-힣0-9A-Za-z]/g) ?? []).length;

/**
 * 장면의 말하는 구간을 문장 단위로 나누고, 글자 수에 비례해 시간을 나눈다.
 * 마지막 장면(마무리 질문)은 화면에 큰 글자로 이미 나오므로 자막을 넣지 않는다.
 */
const cues = content.narration.slice(0, -1).flatMap((line, i) => {
  const from = sceneStarts[i];
  const to = sceneStarts[i + 1] - END_GAP;
  const parts = line.split(/(?<=[.?!…])\s+/);
  const total = parts.reduce((n, p) => n + syllables(p), 0);
  let acc = 0;
  return parts
    .map((text, j) => {
      const start = Math.round(from + ((to - from) * acc) / total);
      acc += syllables(text);
      const end = j === parts.length - 1 ? to + 3 : Math.round(from + ((to - from) * acc) / total);
      return { text, start, duration: Math.max(1, end - start) };
    })
    .filter((c) => !ON_SCREEN.has(c.text));
});

export const Subtitles: React.FC = () => (
  <>
    {cues.map((c) => (
      <Sequence key={c.start} from={c.start} durationInFrames={c.duration} layout="none">
        <SubtitleLine text={c.text} />
      </Sequence>
    ))}
  </>
);
