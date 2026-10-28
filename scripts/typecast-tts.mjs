// 문장별 음성 생성. 사용법: node --env-file=.env scripts/typecast-tts.mjs <slug>
// videos/<slug>/2-motion/voice-lines.json 의 문장을 읽어 voice/01.mp3, 02.mp3 ... 로 저장한다.
// 이미 있는 파일은 건너뛰고, 오류가 나면 반복하지 않고 바로 멈춘다.
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const VOICE_ID = "tc_6a21054564d676539427427e"; // 혜진

const key = process.env.TYPECAST_API_KEY;
if (!key) throw new Error("TYPECAST_API_KEY가 .env에 없습니다");

const slug = process.argv[2];
if (!slug) throw new Error("slug를 넣어 주세요");

const dir = path.join("videos", slug, "2-motion");
const lines = JSON.parse(await readFile(path.join(dir, "voice-lines.json"), "utf8"));
const outDir = path.join(dir, "voice");
await mkdir(outDir, { recursive: true });

const exists = (f) => access(f).then(() => true, () => false);

for (const [i, text] of lines.entries()) {
  const file = path.join(outDir, `${String(i + 1).padStart(2, "0")}.mp3`);
  if (await exists(file)) {
    console.log(`${i + 1}: 이미 있음, 건너뜀`);
    continue;
  }

  const res = await fetch("https://api.typecast.ai/v1/text-to-speech", {
    method: "POST",
    headers: { "X-API-KEY": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      voice_id: VOICE_ID,
      text,
      model: "ssfm-v30",
      language: "kor",
      prompt: {
        emotion_type: "smart",
        previous_text: lines[i - 1],
        next_text: lines[i + 1],
      },
      output: { audio_format: "mp3" },
    }),
  });

  if (!res.ok) {
    console.error(`${i + 1}: 실패 ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  console.log(`${i + 1}: 저장 ${file}`);
}
