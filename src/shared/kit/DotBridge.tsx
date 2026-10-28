import { AbsoluteFill, interpolate, Sequence, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { useMotion, useMotionAccel } from "../motion";

/**
 * 점 하나로 두 장면을 잇는 전환.
 * 앞 장면이 점(x, y)을 향해 원형으로 오므라들고, 그 자리에 점이 톡 튀어나와 잠깐 머문 뒤,
 * 점이 커지면서 다음 장면이 원형으로 열린다.
 *
 * - cut: 앞 장면이 완전히 사라지는 프레임. 다음 장면(to)은 이 프레임부터 0프레임으로 시작한다
 * - color: 점 색. 다음 장면의 배경색과 맞추면 "점이 다음 화면이 되는" 느낌이 난다
 * - bg: 앞 장면이 오므라드는 동안 뒤에 보이는 바탕색
 */
export const DotBridge: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  cut: number;
  x?: number;
  y?: number;
  dotSize?: number;
  color?: string;
  bg?: string;
  collapse?: number;
  hold?: number;
  expand?: number;
}> = ({
  from,
  to,
  cut,
  x,
  y,
  dotSize = 48,
  color = theme.accent,
  bg = theme.bg,
  collapse = 14,
  hold = 6,
  expand = 18,
}) => {
  const { width, height } = useVideoConfig();
  const cx = x ?? width / 2;
  const cy = y ?? height / 2;
  // 점에서 가장 먼 모서리까지 닿아야 화면이 다 덮인다
  const cover = Math.max(
    Math.hypot(cx, cy),
    Math.hypot(width - cx, cy),
    Math.hypot(cx, height - cy),
    Math.hypot(width - cx, height - cy),
  );

  const shrink = useMotionAccel("snap", cut - collapse, collapse);
  const dot = useMotion("overshoot", cut - Math.round(collapse / 2));
  const grow = useMotion("snap", cut + hold, expand);

  const fromR = interpolate(shrink, [0, 1], [cover, 0]);
  const toR = interpolate(grow, [0, 1], [0, cover]);
  const circle = (r: number) => `circle(${r}px at ${cx}px ${cy}px)`;

  return (
    <AbsoluteFill style={{ background: bg }}>
      <Sequence durationInFrames={cut}>
        <AbsoluteFill style={{ clipPath: circle(fromR) }}>{from}</AbsoluteFill>
      </Sequence>
      <div
        style={{
          position: "absolute",
          left: cx - dotSize / 2,
          top: cy - dotSize / 2,
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: color,
          transform: `scale(${dot})`,
        }}
      />
      <AbsoluteFill style={{ clipPath: circle(toR) }}>
        <Sequence from={cut}>{to}</Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
