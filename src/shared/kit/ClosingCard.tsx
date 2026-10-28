import { AbsoluteFill, interpolateColors } from "remotion";
import { theme } from "../theme";
import { useMotion } from "../motion";

/** 배경이 따뜻한 색으로 서서히 밝아지는 마무리 배경 */
export const ClosingCard: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const p = useMotion("slow", delay);
  return (
    <AbsoluteFill
      style={{ background: interpolateColors(p, [0, 1], [theme.bg, theme.bgWarm]) }}
    >
      {children}
    </AbsoluteFill>
  );
};
