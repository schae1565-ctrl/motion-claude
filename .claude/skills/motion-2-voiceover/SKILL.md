---
name: motion-2-voiceover
description: 모션그래픽 2단계. 대본을 음성으로 만든다. 타입캐스트(Typecast) TTS로 목소리를 고르고 문장별 음성을 만들거나, 사용자가 직접 받은 음성 파일을 프로젝트에 넣는다. "음성 만들어줘", "타입캐스트", "목소리 샘플", "나레이션 파일 추가"에 사용한다.
---

# 모션그래픽 2단계: 음성

## 파일 위치

- 문장 목록: `videos/<slug>/2-motion/voice-lines.json` (장면마다 한 문장 또는 여러 문장의 문자열 배열)
- 문장별 음성: `videos/<slug>/2-motion/voice/01.mp3, 02.mp3 ...`
- 한 파일로 된 나레이션: `videos/<slug>/2-motion/voice/narration.mp3` (파일 이름은 영문으로 바꾼다)
- Remotion에서는 `staticFile("<slug>/2-motion/voice/narration.mp3")`로 부른다. 공용 폴더(public)가 `videos/`로 설정돼 있다.

## 사용자가 직접 음성을 준 경우

1. 파일을 위 위치로 **복사**한다 (원본은 Downloads에 그대로 둔다).
2. `ffprobe`로 길이·샘플레이트를 확인한다. 16kHz 모노면 음질이 높지 않다고 알린다.
3. 길이가 영상 계획과 다르면 `motion-3-audio-timing`으로 간다.

## 타입캐스트로 만드는 경우

- 키는 프로젝트 `.env`의 `TYPECAST_API_KEY`. **값을 출력하거나 다른 파일에 옮기지 않는다.** 스크립트는 `node --env-file=.env ...`로 읽는다.
- 목소리 목록: `node --env-file=.env scripts/typecast-voices.mjs female middle_age` (성별·연령 필터, 이름·`voice_id`·용도 출력). 쇼츠·대화체에는 용도가 `Conversational`, `TikTok/Reels/Shorts`인 것을 고른다.
- 샘플: `node --env-file=.env scripts/typecast-sample.mjs <출력폴더> 이름:voice_id ...` 후보 3개로 같은 문장을 만든다. 샘플 문장에는 훅, 인용 말, 속마음, 마무리 질문을 모두 넣는다.
- 본 생성: `node --env-file=.env scripts/typecast-tts.mjs <slug>` (모델 `ssfm-v30`, 한국어, 이미 있는 파일은 건너뛰고, 오류가 나면 즉시 멈춘다).
- 선택한 목소리는 `CLAUDE.md`에 기록한다 (현재: 혜진 `tc_6a21054564d676539427427e`).

## 오류 대응

- `403 UNUSUAL_ACTIVITY_DETECTED`: 무료 계정이 비정상 사용으로 걸린 것이다. **같은 요청을 반복하거나 우회하지 않는다.** 사용자에게 타입캐스트 API 콘솔에서 계정 상태·사용량을 확인하게 하고, 그동안 미리듣기 링크(`preview_url`)로 목소리만 고르게 한다.
- 키가 없다는 오류는 `.env`에 변수가 있는지 이름만 확인한다 (값은 보지 않는다).

## 음성이 대본과 다를 수 있다

- 직접 받은 음성은 문구가 대본과 조금 다르거나 문장 사이 쉼이 다를 수 있다. 이후 단계는 음성 기준으로 맞춘다.
- 음성에 넣지 않은 문구(예: "캡처해서 써 보세요")는 화면 문구로만 넣을 수 있다고 알린다.

다음 단계: `motion-3-audio-timing`
