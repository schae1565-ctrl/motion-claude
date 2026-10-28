import { theme } from "../theme";
import { useMotion } from "../motion";

export const CheckMark: React.FC<{ size?: number; delay?: number }> = ({
  size = 130,
  delay = 0,
}) => {
  const pop = useMotion("pop", delay);
  const draw = useMotion("soft", delay + 4);

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ transform: `scale(${pop})` }}
    >
      <circle cx="50" cy="50" r="48" fill={theme.success} />
      <path
        d="M27 52 L44 69 L75 33"
        fill="none"
        stroke={theme.onAccent}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
    </svg>
  );
};
