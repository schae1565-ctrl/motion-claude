// 타입캐스트 음성 샘플 생성.
// 사용법: node --env-file=.env scripts/typecast-sample.mjs <출력폴더> <이름:voice_id> [<이름:voice_id> ...]
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const key = process.env.TYPECAST_API_KEY;
if (!key) throw new Error("TYPECAST_API_KEY가 .env에 없습니다");

const [outDir, ...voices] = process.argv.slice(2);
if (!outDir || voices.length === 0) throw new Error("출력폴더와 이름:voice_id를 넣어 주세요");

// 후킹, 인용 말, 속마음, 마무리 질문이 모두 들어간 샘플 문장
const text =
  "용돈은 오는데, 전화는 0건. 왜일까요? " +
  "사랑해서 한 이 세 마디가, 마음의 문을 닫아요. " +
  "첫 번째. 내가 너 때문에 어떻게 살았는데. " +
  "자식은 이렇게 들어요. 아, 나는 갚아야 할 빚이구나. " +
  "대신 이렇게요. 너 키우면서 나도 행복했어. " +
  "자식 마음에 쌓인 이 말들, 지금 몇 개일까요?";

await mkdir(outDir, { recursive: true });

for (const item of voices) {
  const [name, voiceId] = item.split(":");
  const res = await fetch("https://api.typecast.ai/v1/text-to-speech", {
    method: "POST",
    headers: { "X-API-KEY": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      voice_id: voiceId,
      text,
      model: "ssfm-v30",
      language: "kor",
      prompt: { emotion_type: "smart" },
      output: { audio_format: "mp3" },
    }),
  });
  if (!res.ok) {
    console.log(`${name}: 실패 ${res.status} ${await res.text()}`);
    continue;
  }
  const file = path.join(outDir, `${name}.mp3`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  console.log(`${name}: 저장 ${file}`);
}
