import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { useMotion } from "../../../shared/motion";
import { HookTitle } from "../../../shared/kit/HookTitle";
import { PersonDot } from "../../../shared/ui/PersonDot";
import { SpeechBubble } from "../../../shared/ui/SpeechBubble";
import { DoorIcon } from "../../../shared/ui/DoorIcon";
import { Caption } from "../../../shared/ui/Caption";
import { NotificationCard } from "../../../shared/ui/NotificationCard";
import { content } from "../content";
import { timeline } from "../timeline";

const center = {
  position: "absolute",
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
} as const;

const DriftingPair: React.FC = () => {
  const p = useMotion("slow", 10);
  const gap = interpolate(p, [0, 1], [110, 250]);
  return (
    <>
      <div style={{ transform: `translateX(${-gap}px)` }}>
        <PersonDot kind="mom" mood="neutral" />
      </div>
      <div style={{ transform: `translateX(${gap}px)` }}>
        <PersonDot kind="child" mood="sad" delay={4} />
      </div>
    </>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { question } = timeline.hook;

  // "통화기록 0건 / 왜일까요?"가 위로 올라가며 작아진다
  const move = useMotion("slow", question);
  const top = interpolate(move, [0, 1], [420, 130]);
  const scale = interpolate(move, [0, 1], [1, 0.45]);
  const phase1Opacity = interpolate(frame, [question - 8, question], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          ...center,
          top,
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <HookTitle text={content.hook.title} emphasis={content.hook.emphasis} size={170} />
        <Caption size={96} delay={20}>
          {content.hook.ask}
        </Caption>
      </div>

      <Sequence from={0} durationInFrames={question} layout="none">
        <div style={{ ...center, top: 200, opacity: phase1Opacity }}>
          <NotificationCard
            title={content.hook.money.title}
            amount={content.hook.money.amount}
            delay={6}
          />
        </div>
        <div style={{ ...center, top: 1250, opacity: phase1Opacity }}>
          <DriftingPair />
        </div>
      </Sequence>

      <Sequence from={question} layout="none">
        <div
          style={{
            ...center,
            top: 520,
            flexDirection: "column",
            alignItems: "center",
            gap: 36,
          }}
        >
          <SpeechBubble variant="hidden" width={620} fontSize={44} delay={8} />
          <SpeechBubble variant="hidden" width={620} fontSize={44} delay={16} />
          <SpeechBubble variant="hidden" width={620} fontSize={44} delay={24} />
        </div>
        <div style={{ ...center, top: 1130 }}>
          <DoorIcon delay={50} />
        </div>
        <div style={{ ...center, top: 1490 }}>
          <Caption size={58} delay={36}>
            {content.hook.teaser}
          </Caption>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
