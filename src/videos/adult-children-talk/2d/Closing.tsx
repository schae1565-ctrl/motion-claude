import { Sequence, interpolate } from "remotion";
import { ClosingCard } from "../../../shared/kit/ClosingCard";
import { HookTitle } from "../../../shared/kit/HookTitle";
import { useMotion } from "../../../shared/motion";
import { PersonDot } from "../../../shared/ui/PersonDot";
import { Caption } from "../../../shared/ui/Caption";
import { StrikeMark } from "../../../shared/ui/StrikeMark";
import { CaptureCard } from "../../../shared/ui/CaptureCard";
import { content } from "../content";
import { timeline } from "../timeline";

const center = {
  position: "absolute",
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
} as const;

const ClosingPair: React.FC = () => {
  const p = useMotion("slow", 20);
  const gap = interpolate(p, [0, 1], [300, 80]);
  return (
    <div style={{ ...center, top: 880 }}>
      <div style={{ transform: `translateX(${-gap / 2}px)` }}>
        <PersonDot kind="mom" mood="happy" />
      </div>
      <div style={{ transform: `translateX(${gap / 2}px)` }}>
        <PersonDot kind="child" mood="happy" delay={4} />
      </div>
    </div>
  );
};

export const Closing: React.FC = () => {
  const { recap } = timeline.closing;
  return (
    <ClosingCard>
      {/* 요약: 가르치기를 지우고 들어주기로 */}
      <Sequence from={0} durationInFrames={recap} layout="none">
        <div style={{ ...center, top: 360 }}>
          <div style={{ position: "relative" }}>
            <Caption size={110} tone="soft">
              {content.closing.wrong}
            </Caption>
            <Sequence from={14} layout="none">
              <StrikeMark size={170} />
            </Sequence>
          </div>
        </div>
        <Sequence from={30} layout="none">
          <div style={{ ...center, top: 560 }}>
            <Caption size={130} tone="accent">
              {content.closing.right}
            </Caption>
          </div>
        </Sequence>
        <ClosingPair />
        <div style={{ ...center, top: 1300 }}>
          <Caption size={56} delay={50}>
            {content.closing.recap}
          </Caption>
        </div>
      </Sequence>

      {/* 시청자에게 던지는 질문 */}
      <Sequence from={recap} layout="none">
        <div style={{ ...center, top: 440 }}>
          <HookTitle text={content.closing.ask} size={104} />
        </div>
        {/* 음성이 끝난 뒤에도 카드가 남아서 캡처할 시간을 준다 */}
        <div style={{ ...center, top: 950 }}>
          <CaptureCard
            title={content.closing.captureTitle}
            lines={content.items.map((item) => `“${item.good}”`)}
            delay={20}
          />
        </div>
      </Sequence>
    </ClosingCard>
  );
};
