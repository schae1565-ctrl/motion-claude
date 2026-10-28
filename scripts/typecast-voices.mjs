// 타입캐스트 음성 목록 조회. 사용법: node --env-file=.env scripts/typecast-voices.mjs [성별] [연령]
// 예) node --env-file=.env scripts/typecast-voices.mjs female middle_age
const key = process.env.TYPECAST_API_KEY;
if (!key) throw new Error("TYPECAST_API_KEY가 .env에 없습니다");

const [gender, age] = process.argv.slice(2);

const res = await fetch("https://api.typecast.ai/v3/voices", {
  headers: { "X-API-KEY": key },
});
if (!res.ok) throw new Error(`voices ${res.status}: ${await res.text()}`);

const data = await res.json();
const list = Array.isArray(data) ? data : (data.voices ?? data.result ?? data);

const count = (pick) =>
  Object.entries(
    list.reduce((acc, v) => ((acc[pick(v)] = (acc[pick(v)] ?? 0) + 1), acc), {}),
  )
    .map(([k, n]) => `${k}:${n}`)
    .join("  ");

console.log(`총 ${list.length}개`);
console.log("성별:", count((v) => v.gender));
console.log("연령:", count((v) => v.age));

const picked = list.filter((v) => (!gender || v.gender === gender) && (!age || v.age === age));
console.log(`\n조건 일치 ${picked.length}개`);
for (const v of picked) {
  const name = v.voice_name.kor ?? v.voice_name.eng;
  const models = v.models.map((m) => m.version).join("/");
  console.log(`${v.voice_id}\t${name}\t${v.age}\t${models}\t${(v.use_cases ?? []).join(",")}`);
}
