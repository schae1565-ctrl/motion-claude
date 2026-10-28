import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export const springs = {
  // 부드러운 등장
  soft: { damping: 200 },
  // 튀어나옴
  pop: { damping: 12, stiffness: 200, mass: 0.6 },
  // 천천히 이동
  slow: { damping: 40, stiffness: 50 },
  // 쾅 닫힐 때 화면이 흔들리고 가라앉음
  shake: { damping: 6, stiffness: 260, mass: 0.5 },
} as const;

export type Motion = keyof typeof springs;

/** 현재 Sequence 기준 delay 프레임 뒤에 시작하는 0→1 스프링 값 */
export const useMotion = (kind: Motion = "soft", delay = 0): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: springs[kind] });
};
