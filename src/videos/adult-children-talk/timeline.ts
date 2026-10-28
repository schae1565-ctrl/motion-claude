// 프레임 수 (30fps). narration.mp3(40.35초)의 무음 구간에서 추정한 장면 시작 시각 기준.
// 장면 시작 프레임: 0, 91, 185, 269, 375, 479, 551, 663, 758, 828, 930, 1020, 1121 / 끝 1211
export const timeline = {
  hook: { question: 91, teaser: 94 },
  items: [
    { mom: 84, thought: 106, good: 104 },
    { mom: 72, thought: 112, good: 95 },
    { mom: 70, thought: 102, good: 90 },
  ],
  // ask 90프레임은 음성, 나머지 75프레임은 음성이 끝난 뒤 캡처할 시간
  closing: { recap: 101, ask: 165 },
} as const;

/** 각 구간이 시작하는 전체 영상 기준 프레임 */
export const starts = (() => {
  let f = 0;
  const hook = f;
  f += timeline.hook.question + timeline.hook.teaser;
  const items = timeline.items.map((b) => {
    const s = { mom: f, thought: f + b.mom, good: f + b.mom + b.thought };
    f += b.mom + b.thought + b.good;
    return s;
  });
  const recap = f;
  const ask = f + timeline.closing.recap;
  return { hook, teaser: timeline.hook.question, items, recap, ask };
})();

export const NARRATION = "adult-children-talk/2-motion/voice/narration.mp3";

const sum = (...n: number[]) => n.reduce((a, b) => a + b, 0);

export const hookFrames = sum(timeline.hook.question, timeline.hook.teaser);
export const itemFrames = timeline.items.map((b) => sum(b.mom, b.thought, b.good));
export const closingFrames = sum(timeline.closing.recap, timeline.closing.ask);
export const totalFrames = sum(hookFrames, ...itemFrames, closingFrames);
