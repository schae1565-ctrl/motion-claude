import { theme } from "../theme";
import { useMotion } from "../motion";

const tones = {
  text: theme.text,
  soft: theme.textSoft,
  accent: theme.accent,
  danger: theme.danger,
} as const;

export const Caption: React.FC<{
  children: React.ReactNode;
  size?: number;
  tone?: keyof typeof tones;
  delay?: number;
}> = ({ children, size = 60, tone = "text", delay = 0 }) => {
  const p = useMotion("soft", delay);
  return (
    <div
      style={{
        fontFamily: theme.font,
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1.35,
        textAlign: "center",
        whiteSpace: "pre-line",
        color: tones[tone],
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      {children}
    </div>
  );
};
