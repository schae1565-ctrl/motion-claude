import { interpolateColors } from "remotion";
import { theme } from "../theme";
import { useMotion } from "../motion";

export const ThoughtBubble: React.FC<{
  children: React.ReactNode;
  delay?: number;
  /** 이 프레임부터 밝은 색으로 바뀐다 (Sequence 기준) */
  brightAt?: number;
  fontSize?: number;
}> = ({ children, delay = 0, brightAt, fontSize = 54 }) => {
  const p = useMotion("pop", delay);
  const bright = useMotion("soft", brightAt ?? 1_000_000);
  const bg = interpolateColors(bright, [0, 1], [theme.thought, theme.thoughtBright]);

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        padding: "40px 44px",
        borderRadius: 64,
        background: bg,
        color: theme.thoughtText,
        fontFamily: theme.font,
        fontSize,
        fontWeight: 700,
        lineHeight: 1.4,
        wordBreak: "keep-all",
        transform: `scale(${p})`,
        transformOrigin: "left center",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          left: -34,
          bottom: 30,
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: bg,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -62,
          bottom: 6,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: bg,
        }}
      />
    </div>
  );
};
