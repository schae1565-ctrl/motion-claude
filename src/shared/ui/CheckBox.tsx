import { interpolateColors } from "remotion";
import { theme } from "../theme";
import { useMotion } from "../motion";

/** 숫자가 적힌 상자. delay 뒤에 튀어나오고 색이 차오른다 */
export const CheckBox: React.FC<{
  n: number;
  delay?: number;
  size?: number;
}> = ({ n, delay = 0, size = 190 }) => {
  const pop = useMotion("pop", delay);
  const fill = useMotion("soft", delay + 10);
  const bg = interpolateColors(fill, [0, 1], [theme.bg, theme.good]);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 40,
        border: `10px solid ${theme.accent}`,
        boxSizing: "border-box",
        background: bg,
        color: theme.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: theme.font,
        fontSize: size * 0.5,
        fontWeight: 800,
        transform: `scale(${pop})`,
      }}
    >
      {n}
    </div>
  );
};
