import { useMemo } from "react";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { V3 } from "./types";

/** 점토 느낌의 둥근 상자. 말풍선, 카드, 숫자 블록에 쓴다. 크기는 3D 단위(1 = 100px). */
export const Slab: React.FC<{
  w: number;
  h: number;
  d?: number;
  color: string;
  opacity?: number;
  position?: V3;
  rotation?: V3;
  scale?: number | V3;
  children?: React.ReactNode;
}> = ({
  w,
  h,
  d = 0.9,
  color,
  opacity = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  children,
}) => {
  const geometry = useMemo(
    () => new RoundedBoxGeometry(w, h, d, 5, Math.min(d / 2, w / 2, h / 2) - 0.001),
    [w, h, d],
  );
  const s = typeof scale === "number" ? Math.max(scale, 0.0001) : scale;
  return (
    <group position={position} rotation={rotation} scale={s}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={color}
          roughness={0.85}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
      {children}
    </group>
  );
};
