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
  // 확 나갔다가 길게 멈춤 (expo-out 느낌)
  snap: { damping: 200, stiffness: 400, mass: 0.6 },
  // 목표를 살짝 넘었다가 돌아옴 (back-out 느낌)
  overshoot: { damping: 16, stiffness: 180, mass: 0.8 },
} as const;

export type Motion = keyof typeof springs;

/**
 * 현재 Sequence 기준 delay 프레임 뒤에 시작하는 0→1 스프링 값.
 * duration을 주면 그 프레임 수 안에 끝나도록 스프링을 늘이거나 줄인다.
 */
export const useMotion = (kind: Motion = "soft", delay = 0, duration?: number): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: springs[kind],
    durationInFrames: duration,
  });
};

/**
 * 천천히 출발해 점점 빨라지는 0→1 값 (스프링을 시간을 거꾸로 돌려 재생).
 * delay 프레임에 0에서 출발해 정확히 delay + duration 프레임에 1에 닿는다. 사라지는 동작에 쓴다.
 */
export const useMotionAccel = (kind: Motion, delay: number, duration: number): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.min(Math.max(frame - delay, 0), duration);
  return 1 - spring({ frame: duration - t, fps, config: springs[kind], durationInFrames: duration });
};
