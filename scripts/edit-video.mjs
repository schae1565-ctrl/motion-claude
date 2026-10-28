// 촬영 영상 편집: 무음 구간 제거 + 구간 삭제(cuts) + 확대·빨간 박스(zoom) + 블러(blur).
// 사용법: node scripts/edit-video.mjs <slug> [--dry]
// 설정은 videos/<slug>/2-motion/edit.json. 좌표는 원본 해상도(픽셀), 시간은 원본 기준 초다.
// 원본(raw)은 읽기만 하고, 결과는 설정의 output(cut 폴더)에 쓴다.
import { execSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const slug = process.argv[2];
const dry = process.argv.includes("--dry");
if (!slug) throw new Error("slug를 넣어 주세요");

const root = path.join("videos", slug);
const cfg = JSON.parse(readFileSync(path.join(root, "2-motion", "edit.json"), "utf8"));
const input = path.join(root, cfg.input);
const output = path.join(root, cfg.output);
const fps = cfg.fps;
const [outW, outH] = cfg.outputSize;
const toF = (sec) => Math.round(sec * fps);

const total = Number(
  execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${input}"`).toString(),
);

// 1) 무음 구간 찾기
const sc = cfg.silence;
const log = spawnSync(
  "ffmpeg",
  ["-hide_banner", "-nostats", "-i", input, "-map", `0:a:${sc.audioTrack}`, "-af",
    `silencedetect=noise=${sc.noiseDb}dB:d=${sc.minSec}`, "-f", "null", "-"],
  { encoding: "utf8", maxBuffer: 1 << 26 },
).stderr;
const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
const silences = starts.map((s, i) => ({ s, e: ends[i] ?? total }));

// 2) 말하는 구간(앞뒤 여유를 붙임) -> 유지할 구간
let speech = [];
let prev = 0;
for (const sl of silences) {
  if (sl.s - prev > 0.1) speech.push([prev, sl.s]);
  prev = sl.e;
}
if (total - prev > 0.1) speech.push([prev, total]);
speech = speech.map(([s, e]) => [Math.max(0, s - sc.padBefore), Math.min(total, e + sc.padAfter)]);
if (sc.endAt) speech[speech.length - 1][1] = sc.endAt;

const merged = [];
for (const seg of speech) {
  const last = merged[merged.length - 1];
  if (last && seg[0] <= last[1]) last[1] = Math.max(last[1], seg[1]);
  else merged.push([...seg]);
}

// 3) 직접 지정한 삭제 구간 빼기
let keep = merged;
for (const [cs, ce] of cfg.cuts) {
  keep = keep.flatMap(([s, e]) => {
    if (ce <= s || cs >= e) return [[s, e]];
    const parts = [];
    if (cs > s) parts.push([s, cs]);
    if (ce < e) parts.push([ce, e]);
    return parts;
  });
}
const keepF = keep.map(([s, e]) => [toF(s), toF(e)]).filter(([a, b]) => b - a >= 3);

// 4) 효과 구간 경계에서 조각내기
const blurs = cfg.blur.map((b) => ({ ...b, a: toF(b.start), b: toF(b.end) }));
const zooms = cfg.zoom.map((z) => ({ ...z, a: toF(z.start), b: toF(z.end), T: 0, k: 0 }));
const bounds = new Set([...blurs, ...zooms].flatMap((w) => [w.a, w.b]));

const pieces = [];
for (const [a, b] of keepF) {
  const cuts = [a, ...[...bounds].filter((t) => t > a && t < b).sort((x, y) => x - y), b];
  for (let i = 0; i < cuts.length - 1; i++) pieces.push({ x: cuts[i], y: cuts[i + 1] });
}
for (const p of pieces) {
  p.blur = blurs.filter((w) => w.a <= p.x && p.y <= w.b);
  p.zoom = zooms.find((w) => w.a <= p.x && p.y <= w.b);
  if (p.zoom) p.zoom.T += p.y - p.x;
}

// 5) ffmpeg 필터 그래프
const N = pieces.length;
const S = [];
S.push(`[0:v]split=${N}${pieces.map((_, i) => `[s${i}]`).join("")}`);
S.push(`[0:a:${sc.audioTrack}]asplit=${N}${pieces.map((_, i) => `[as${i}]`).join("")}`);

for (const [i, p] of pieces.entries()) {
  let cur = `a${i}_0`;
  S.push(`[s${i}]trim=start_frame=${p.x}:end_frame=${p.y},setpts=PTS-STARTPTS[${cur}]`);
  p.blur.forEach((bw, j) => {
    const nx = `a${i}_${j + 1}`;
    S.push(`[${cur}]split=2[${cur}x][${cur}y]`);
    S.push(`[${cur}y]crop=${bw.w}:${bw.h}:${bw.x}:${bw.y},gblur=sigma=45[${cur}b]`);
    S.push(`[${cur}x][${cur}b]overlay=${bw.x}:${bw.y}[${nx}]`);
    cur = nx;
  });
  if (p.zoom) {
    const z = p.zoom;
    const k = z.k;
    const R = 12;
    const cx = z.x + z.w / 2;
    const cy = z.y + z.h / 2;
    const ease = `st(0,max(0,min(1,min((${k}+on)/${R},(${z.T}-${k}-on)/${R}))))`;
    const zexp = `${ease};1+(${z.scale}-1)*ld(0)*ld(0)*(3-2*ld(0))`;
    S.push(
      `[${cur}]drawbox=x=${z.x}:y=${z.y}:w=${z.w}:h=${z.h}:color=red:t=20,` +
        `zoompan=z='${zexp}':x='clip(${cx}-iw/zoom/2,0,iw-iw/zoom)':y='clip(${cy}-ih/zoom/2,0,ih-ih/zoom)':d=1:s=${outW}x${outH}:fps=${fps},setsar=1[v${i}]`,
    );
    z.k += p.y - p.x;
  } else {
    S.push(`[${cur}]scale=${outW}:${outH}:flags=lanczos,setsar=1[v${i}]`);
  }
  const dur = (p.y - p.x) / fps;
  S.push(
    `[as${i}]atrim=start=${p.x / fps}:end=${p.y / fps},asetpts=PTS-STARTPTS,` +
      `afade=t=in:d=0.02,afade=t=out:st=${Math.max(0, dur - 0.02).toFixed(3)}:d=0.02[au${i}]`,
  );
}
S.push(`${pieces.map((_, i) => `[v${i}][au${i}]`).join("")}concat=n=${N}:v=1:a=1[outv][outa]`);

const outFrames = pieces.reduce((n, p) => n + (p.y - p.x), 0);

// 원본 시간 -> 편집본 시간 변환표 (자막 시간을 옮길 때 쓴다)
let outAt = 0;
const map = pieces.map((p) => {
  const row = { srcStart: p.x / fps, srcEnd: p.y / fps, outStart: outAt / fps };
  outAt += p.y - p.x;
  return row;
});
writeFileSync(path.join(root, "2-motion", "pieces.json"), JSON.stringify(map, null, 1), "utf8");
console.log(`원본 ${total.toFixed(1)}초 -> 편집본 약 ${(outFrames / fps).toFixed(1)}초 (조각 ${N}개)`);
console.log(`무음 구간 ${silences.length}개 제거, 직접 삭제 구간 ${cfg.cuts.length}개`);
for (const z of zooms) console.log(`확대+빨간 박스: ${z.label} (${z.start}~${z.end}초, ${z.scale}배)`);
for (const b of blurs) console.log(`블러: ${b.label} (${b.start}~${b.end}초)`);

const scriptPath = path.join(root, "2-motion", "filter.txt");
writeFileSync(scriptPath, S.join(";\n"), "utf8");
if (dry) process.exit(0);

mkdirSync(path.dirname(output), { recursive: true });
const r = spawnSync(
  "ffmpeg",
  ["-hide_banner", "-nostats", "-loglevel", "error", "-y", "-i", input,
    "-/filter_complex", scriptPath, "-map", "[outv]", "-map", "[outa]",
    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", String(fps),
    "-c:a", "aac", "-b:a", "160k", output],
  { stdio: "inherit" },
);
if (r.status !== 0) process.exit(r.status ?? 1);
console.log(`완료: ${output}`);
