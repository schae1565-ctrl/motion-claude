import { useMemo } from "react";
import * as THREE from "three";
import { theme } from "../theme";
import { UNIT, type V3 } from "./types";

const SAMPLE = 1.5; // 글자를 선명하게 그리기 위한 해상도 배율

/**
 * 한글 글자를 캔버스에 그려 3D 평면에 입힌다. size, maxWidth는 화면 px 기준이다.
 * 띄어쓰기에서만 줄을 바꾸고, "\n"으로 줄을 강제로 나눌 수 있다.
 */
export const TextPlane: React.FC<{
  text: string;
  size?: number;
  color?: string;
  maxWidth?: number;
  weight?: number;
  lineHeight?: number;
  position?: V3;
  rotation?: V3;
  scale?: number;
  opacity?: number;
}> = ({
  text,
  size = 60,
  color = theme.text,
  maxWidth = 800,
  weight = 800,
  lineHeight = 1.3,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  opacity = 1,
}) => {
  const { texture, w, h } = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const font = `${weight} ${size * SAMPLE}px ${theme.font}`;
    ctx.font = font;

    const lines: string[] = [];
    for (const paragraph of text.split("\n")) {
      let current = "";
      for (const word of paragraph.split(" ")) {
        const next = current ? `${current} ${word}` : word;
        if (current && ctx.measureText(next).width > maxWidth * SAMPLE) {
          lines.push(current);
          current = word;
        } else {
          current = next;
        }
      }
      lines.push(current);
    }

    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
    const pad = size * SAMPLE * 0.3;
    const lh = size * SAMPLE * lineHeight;
    canvas.width = Math.ceil(widest + pad * 2);
    canvas.height = Math.ceil(lines.length * lh + pad * 2);

    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    lines.forEach((line, i) => ctx.fillText(line, canvas.width / 2, pad + lh * (i + 0.5)));

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return {
      texture: tex,
      w: canvas.width / SAMPLE / UNIT,
      h: canvas.height / SAMPLE / UNIT,
    };
  }, [text, size, color, maxWidth, weight, lineHeight]);

  return (
    <mesh position={position} rotation={rotation} scale={Math.max(scale, 0.0001)}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
};
