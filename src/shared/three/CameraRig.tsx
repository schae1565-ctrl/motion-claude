import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useThree } from "@react-three/fiber";
import { springs } from "../motion";
import type { V3 } from "./types";

export type CameraKey = { f: number; pos: V3; look: V3 };

/**
 * 키프레임 사이를 스프링으로 부드럽게 오가는 카메라.
 * 첫 키프레임은 f: 0이어야 한다. shakes의 프레임에서는 화면이 쾅 흔들린다.
 */
export const CameraRig: React.FC<{ keys: CameraKey[]; shakes?: number[] }> = ({
  keys,
  shakes = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const camera = useThree((s) => s.camera);

  let index = 0;
  keys.forEach((k, i) => {
    if (frame >= k.f) index = i;
  });
  const cur = keys[index];
  const prev = keys[Math.max(0, index - 1)];
  const p = index === 0 ? 1 : spring({ frame: frame - cur.f, fps, config: springs.slow });
  const mix = (a: V3, b: V3): V3 => [
    a[0] + (b[0] - a[0]) * p,
    a[1] + (b[1] - a[1]) * p,
    a[2] + (b[2] - a[2]) * p,
  ];
  const pos = mix(prev.pos, cur.pos);
  const look = mix(prev.look, cur.look);

  let shake = 0;
  for (const f of shakes) {
    if (frame >= f) shake += 1 - spring({ frame: frame - f, fps, config: springs.shake });
  }

  camera.position.set(pos[0] + shake * 0.35, pos[1] + shake * 0.3, pos[2]);
  camera.lookAt(look[0], look[1], look[2]);
  camera.updateMatrixWorld();
  return null;
};
