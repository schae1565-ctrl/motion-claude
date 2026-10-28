import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { NumberBadge } from "../../../shared/ui/NumberBadge";
import { SpeechBubble } from "../../../shared/ui/SpeechBubble";
import { ThoughtBubble } from "../../../shared/ui/ThoughtBubble";
import { PersonDot } from "../../../shared/ui/PersonDot";
import { StrikeMark } from "../../../shared/ui/StrikeMark";
import { CheckMark } from "../../../shared/ui/CheckMark";
import { Caption } from "../../../shared/ui/Caption";

const center = {
  position: "absolute",
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
} as const;

/** 엄마 말 → 자식의 속마음 → 대신 할 말 */
export const Item: React.FC<{
  n: number;
  mom: string;
  thought: string;
  good: string;
  beats: { mom: number; thought: number; good: number };
}> = ({ n, mom, thought, good, beats }) => {
  const frame = useCurrentFrame();
  const t1 = beats.mom;
  const t2 = beats.mom + beats.thought;
  const swapAt = t2 + 16;

  const momOpacity = interpolate(frame, [t1, t1 + 10], [1, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <div style={{ ...center, top: 230 }}>
        <NumberBadge n={n} />
      </div>

      {/* 엄마 말: X가 그어진 뒤 따뜻한 말풍선으로 뒤집힌다 */}
      <Sequence from={0} durationInFrames={swapAt} layout="none">
        <div style={{ ...center, top: 470, opacity: momOpacity }}>
          <div style={{ position: "relative" }}>
            <SpeechBubble variant="bad">“{mom}”</SpeechBubble>
            <Sequence from={t2} layout="none">
              <StrikeMark />
            </Sequence>
          </div>
        </div>
      </Sequence>
      <Sequence from={swapAt} layout="none">
        <div style={{ ...center, top: 470 }}>
          <div style={{ position: "relative" }}>
            <SpeechBubble variant="good" flip>
              “{good}”
            </SpeechBubble>
            <div style={{ position: "absolute", right: -10, top: -90 }}>
              <CheckMark delay={14} />
            </div>
          </div>
        </div>
      </Sequence>

      {/* 안내 문구 */}
      <Sequence from={t1} durationInFrames={beats.thought} layout="none">
        <div style={{ ...center, top: 900 }}>
          <Caption size={56} tone="soft">
            자식은 이렇게 들어요.
          </Caption>
        </div>
      </Sequence>
      <Sequence from={t2} layout="none">
        <div style={{ ...center, top: 900 }}>
          <Caption size={56} tone="accent">
            대신 이렇게요.
          </Caption>
        </div>
      </Sequence>

      {/* 자식과 속마음 */}
      <Sequence from={t1} layout="none">
        <div
          style={{
            position: "absolute",
            top: 1010,
            left: 0,
            right: 0,
            padding: "0 90px",
            display: "flex",
            alignItems: "center",
            gap: 80,
          }}
        >
          <PersonDot kind="child" mood={frame >= t2 ? "happy" : "sad"} size={190} />
          {/* 대신 할 말이 나오면 부정적인 속마음은 사라지고 자녀는 웃는다 */}
          <Sequence from={0} durationInFrames={beats.thought} layout="none">
            <ThoughtBubble delay={6}>{thought}</ThoughtBubble>
          </Sequence>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
