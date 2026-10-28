import { theme } from "../theme";
import { useMotion } from "../motion";

type Mood = "neutral" | "sad" | "happy";

const mouths: Record<Mood, string> = {
  neutral: "M38 68 L62 68",
  sad: "M36 72 Q50 60 64 72",
  happy: "M36 62 Q50 78 64 62",
};

export const PersonDot: React.FC<{
  kind: "mom" | "child";
  mood?: Mood;
  size?: number;
  label?: string;
  delay?: number;
}> = ({ kind, mood = "neutral", size = 200, label, delay = 0 }) => {
  const p = useMotion("pop", delay);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        fontFamily: theme.font,
        fontSize: size * 0.22,
        fontWeight: 800,
        color: theme.textSoft,
        transform: `scale(${p})`,
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill={kind === "mom" ? theme.mom : theme.child} />
        <circle cx="35" cy="44" r="5" fill={theme.text} />
        <circle cx="65" cy="44" r="5" fill={theme.text} />
        <path
          d={mouths[mood]}
          fill="none"
          stroke={theme.text}
          strokeWidth={5}
          strokeLinecap="round"
        />
      </svg>
      {label ?? (kind === "mom" ? "엄마" : "자녀")}
    </div>
  );
};
