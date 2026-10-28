import { interpolate } from "remotion";
import { theme } from "../theme";
import { useMotion } from "../motion";

/** delay 뒤에 문이 쾅 닫힌다 */
export const DoorIcon: React.FC<{ size?: number; delay?: number }> = ({
  size = 280,
  delay = 0,
}) => {
  const appear = useMotion("soft", 0);
  const close = useMotion("pop", delay);
  const doorScale = interpolate(close, [0, 1], [0.3, 1]);

  return (
    <svg
      viewBox="0 0 140 200"
      width={size * 0.7}
      height={size}
      style={{ opacity: appear }}
    >
      <rect x="6" y="6" width="128" height="188" rx="10" fill={theme.text} />
      <g style={{ transformOrigin: "10px 100px", transform: `scaleX(${doorScale})` }}>
        <rect x="10" y="10" width="120" height="180" rx="6" fill={theme.mom} />
        <circle cx="108" cy="104" r="8" fill={theme.bg} />
      </g>
    </svg>
  );
};
