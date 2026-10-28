import { theme } from "../theme";
import { useMotion } from "../motion";

type Variant = "bad" | "good" | "hidden";

const palette: Record<Variant, { bg: string; fg: string }> = {
  bad: { bg: theme.bad, fg: theme.badText },
  good: { bg: theme.good, fg: theme.goodText },
  hidden: { bg: theme.bad, fg: theme.textSoft },
};

export const SpeechBubble: React.FC<{
  variant: Variant;
  children?: React.ReactNode;
  delay?: number;
  /** true면 뒤집히듯 등장, false면 커지며 등장 */
  flip?: boolean;
  width?: number;
  fontSize?: number;
}> = ({ variant, children, delay = 0, flip = false, width = 880, fontSize = 72 }) => {
  const p = useMotion("pop", delay);
  const { bg, fg } = palette[variant];
  const transform = flip
    ? `perspective(1200px) rotateX(${(1 - p) * 90}deg)`
    : `scale(${p})`;

  return (
    <div
      style={{
        position: "relative",
        width,
        padding: "48px 56px",
        boxSizing: "border-box",
        borderRadius: 56,
        background: bg,
        color: fg,
        fontFamily: theme.font,
        fontSize: variant === "hidden" ? fontSize * 1.2 : fontSize,
        fontWeight: 800,
        lineHeight: 1.35,
        wordBreak: "keep-all",
        textAlign: "center",
        transform,
        opacity: Math.min(1, p * 3),
      }}
    >
      {variant === "hidden" ? "?" : children}
      <div
        style={{
          position: "absolute",
          left: 90,
          bottom: -20,
          width: 44,
          height: 44,
          background: bg,
          transform: "rotate(45deg)",
        }}
      />
    </div>
  );
};
