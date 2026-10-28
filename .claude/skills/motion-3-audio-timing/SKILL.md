---
name: motion-3-audio-timing
description: 모션그래픽 3단계. 음성에서 장면별 시작 시각을 구해 timeline.ts에 반영한다. whisper 없이 무음 구간과 글자 수로 추정한다. "장면 길이를 음성에 맞춰", "타이밍 맞춰줘", "장면이 말과 어긋나"에 사용한다.
---

# 모션그래픽 3단계: 음성에 맞춘 타이밍

## 1. 장면 시작 시각 구하기

```powershell
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
node scripts/find-scene-starts.mjs videos/<slug>/2-motion/voice/narration.mp3 videos/<slug>/2-motion/voice-lines.json 30
```

- `voice-lines.json`의 문장 하나가 장면 하나다. 장면 수와 문장 수가 같아야 한다.
- 방법: `silencedetect`로 무음 구간을 모두 찾고, 장면별 글자 수에 비례하는 길이가 되도록 경계 N-1개를 동적 계획법으로 고른다. 장면 시작은 앞 무음이 끝나는 시각(말이 시작되는 시점)이다.
- 출력의 `STARTS_FRAMES=[...]`, `TOTAL_FRAMES=...`를 쓴다. 마지막 줄의 "오차"가 작을수록(1 이하) 잘 맞은 것이다.
- 이 추정은 **음성을 듣고 맞춘 것이 아니다.** 장면 경계가 최대 0.2초쯤 어긋날 수 있다고 사용자에게 말한다.

## 2. timeline.ts에 넣기

`src/videos/<slug>/timeline.ts`는 장면 시작 프레임 사이의 간격(프레임 수)을 담는다.

```ts
export const timeline = {
  hook: { question: 91, teaser: 94 },                       // 장면 1, 2 길이
  items: [{ mom: 84, thought: 106, good: 104 }, ...],        // 항목별 3박자 길이
  closing: { recap: 101, ask: 165 },                         // 마지막 ask에는 음성 뒤 캡처용 꼬리 포함
} as const;
```

- 길이 = 다음 장면 시작 − 이 장면 시작. 합계가 `TOTAL_FRAMES` + 꼬리와 같아야 한다.
- `starts`(전체 영상 기준 시작 프레임)와 `totalFrames`는 `timeline.ts`가 계산한다. 카메라 키프레임과 자막이 이 값을 쓴다.
- 음성이 끝난 뒤 꼬리(캡처 안내 등)를 두려면 마지막 구간 길이에만 더한다. `Root.tsx`의 `durationInFrames`는 `totalFrames`를 쓴다.

## 3. 확인과 보정

- 스튜디오에서 재생하며 말과 장면이 맞는지 본다. 어긋나는 장면은 사용자에게 "장면 번호 + 빠르다/늦다 + 대략 정도"를 받아 `timeline.ts`의 숫자만 고친다 (스튜디오는 저장 즉시 반영된다).
- **더 정확하게 하려면 전사(whisper)로 문장·단어 시작 시간을 얻는다.** 이 컴퓨터에서는 Windows에서 실행되지 않으므로 `video-edit-4-captions-render`의 WSL 안내를 따른다.

다음 단계: `motion-4-build-scenes`
