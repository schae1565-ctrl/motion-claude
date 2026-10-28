// 음성(mp3)의 무음 구간에서 장면별 시작 시각을 추정한다. 음성 전사(whisper) 없이 쓸 수 있다.
// 사용법: node scripts/find-scene-starts.mjs <음성 파일> <문장 목록.json> [fps=30]
//   문장 목록.json: 장면마다 한 문장(또는 여러 문장)을 담은 문자열 배열 (예: 2-motion/voice-lines.json)
// 방법: 장면별 글자 수(음절)에 비례하는 길이가 되도록, 무음 구간 중 경계 N-1개를 고른다.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const [file, linesPath, fpsArg] = process.argv.slice(2);
if (!file || !linesPath) throw new Error("사용법: node scripts/find-scene-starts.mjs <음성> <문장.json> [fps]");
const fps = Number(fpsArg ?? 30);

const lines = JSON.parse(readFileSync(linesPath, "utf8"));
const syl = lines.map((l) => (l.match(/[가-힣0-9A-Za-z]/g) ?? []).length);
const N = lines.length;

const total = Number(
  execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${file}"`).toString(),
);
const out = execSync(
  `ffmpeg -hide_banner -i "${file}" -af silencedetect=noise=-30dB:d=0.1 -f null - 2>&1`,
).toString();

const s = [...out.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
const e = [...out.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
const sil = s.map((a, i) => ({ s: a, e: e[i] ?? total, m: (a + (e[i] ?? total)) / 2 }));
const K = sil.length;
console.log(`길이 ${total.toFixed(2)}초, 장면 ${N}개, 무음 후보 ${K}개`);
if (K < N - 1) throw new Error("무음 후보가 장면 경계보다 적습니다. 임계값을 조정하세요");

let best = { cost: Infinity };
for (let a = 0.08; a <= 0.26; a += 0.005) {
  for (let b = 0; b <= 1.0; b += 0.1) {
    const dp = Array.from({ length: N - 1 }, () => Array(K).fill(Infinity));
    const from = Array.from({ length: N - 1 }, () => Array(K).fill(-1));
    for (let k = 0; k < K; k++) dp[0][k] = (sil[k].m - (a * syl[0] + b)) ** 2;
    for (let j = 1; j < N - 1; j++) {
      for (let k = 0; k < K; k++) {
        for (let p = 0; p < k; p++) {
          if (dp[j - 1][p] === Infinity) continue;
          const c = dp[j - 1][p] + (sil[k].m - sil[p].m - (a * syl[j] + b)) ** 2;
          if (c < dp[j][k]) {
            dp[j][k] = c;
            from[j][k] = p;
          }
        }
      }
    }
    for (let k = 0; k < K; k++) {
      if (dp[N - 2][k] === Infinity) continue;
      const c = dp[N - 2][k] + (total - sil[k].m - (a * syl[N - 1] + b)) ** 2;
      if (c < best.cost) {
        const path = [k];
        for (let j = N - 2; j > 0; j--) path.unshift(from[j][path[0]]);
        best = { cost: c, a, b, path };
      }
    }
  }
}

console.log(`맞춤: 음절당 ${best.a.toFixed(3)}초 + ${best.b.toFixed(1)}초, 오차 ${best.cost.toFixed(2)}`);
// 장면 시작 = 앞 무음이 끝나는 시각(말이 시작되는 시점)
const starts = [0, ...best.path.map((k) => sil[k].e)];
starts.forEach((t, i) => {
  console.log(`장면 ${String(i + 1).padStart(2)}: ${t.toFixed(2)}초 (${Math.round(t * fps)}프레임)  ${lines[i]}`);
});
console.log("STARTS_FRAMES=" + JSON.stringify(starts.map((t) => Math.round(t * fps))));
console.log("TOTAL_FRAMES=" + Math.round(total * fps));
