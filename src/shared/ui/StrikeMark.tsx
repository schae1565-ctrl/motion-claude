import { theme } from "../theme";
import { useMotion } from "../motion";

/** 가운데에 두 획으로 그려지는 붉은 X */
export const StrikeMark: React.FC<{ size?: number; delay?: number }> = ({
  size = 260,
  delay = 0,
}) => {
  const first = useMotion("soft", delay);
  const second = useMotion("soft", delay + 6);
  const line = (p: number) => ({
    stroke: theme.danger,
    strokeWidth: 12,
    strokeLinecap: "round" as const,
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - p,
  });

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <path d="M14 14 L86 86" fill="none" {...line(first)} />
      <path d="M86 14 L14 86" fill="none" {...line(second)} />
    </svg>
  );
};
