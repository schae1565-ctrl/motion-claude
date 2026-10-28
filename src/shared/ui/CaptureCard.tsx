import { theme } from "../theme";
import { useMotion } from "../motion";

const Line: React.FC<{ n: number; text: string; delay: number }> = ({ n, text, delay }) => {
  const p = useMotion("soft", delay);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "16px 0",
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px)`,
      }}
    >
      <div
        style={{
          flex: "none",
          width: 68,
          height: 68,
          borderRadius: "50%",
          background: theme.good,
          color: theme.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          fontWeight: 800,
        }}
      >
        {n}
      </div>
      <div style={{ fontSize: 48, fontWeight: 800, color: theme.text, wordBreak: "keep-all" }}>
        {text}
      </div>
    </div>
  );
};

/** "이 화면을 캡처해서 쓰세요" 안내와 함께 바로 쓸 문장을 모아 보여 주는 카드 */
export const CaptureCard: React.FC<{
  title: string;
  lines: readonly string[];
  delay?: number;
}> = ({ title, lines, delay = 0 }) => {
  const p = useMotion("pop", delay);
  return (
    <div
      style={{
        width: 920,
        boxSizing: "border-box",
        padding: "40px 48px 28px",
        borderRadius: 56,
        background: theme.onAccent,
        border: `8px solid ${theme.accent}`,
        fontFamily: theme.font,
        transform: `scale(${p})`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          marginBottom: 20,
          color: theme.accent,
          fontSize: 54,
          fontWeight: 800,
        }}
      >
        <svg viewBox="0 0 100 80" width={80} height={64}>
          <rect x="4" y="16" width="92" height="60" rx="12" fill={theme.accent} />
          <rect x="30" y="4" width="40" height="18" rx="6" fill={theme.accent} />
          <circle cx="50" cy="46" r="20" fill={theme.onAccent} />
          <circle cx="50" cy="46" r="11" fill={theme.accent} />
        </svg>
        {title}
      </div>
      {lines.map((line, i) => (
        <Line key={line} n={i + 1} text={line} delay={delay + 14 + i * 10} />
      ))}
    </div>
  );
};
