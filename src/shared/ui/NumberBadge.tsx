import { theme } from "../theme";
import { useMotion } from "../motion";

export const NumberBadge: React.FC<{
  n: number;
  delay?: number;
  size?: number;
}> = ({ n, delay = 0, size = 150 }) => {
  const p = useMotion("pop", delay);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: theme.accent,
        color: theme.onAccent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.6,
        fontWeight: 800,
        fontFamily: theme.font,
        transform: `scale(${p})`,
      }}
    >
      {n}
    </div>
  );
};
