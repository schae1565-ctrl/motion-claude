---
name: video-edit-2-silence-cuts
description: 영상 편집 2단계. 촬영 영상에서 무음 구간을 제거하고, 말을 버벅인 부분·반복한 부분을 잘라낸다. "무음 제거", "버벅인 부분 삭제", "반복한 부분 제거", "컷 편집"에 사용한다. scripts/edit-video.mjs와 edit.json을 쓴다.
---

# 영상 편집 2단계: 무음 제거와 구간 삭제

## 도구

- 설정: `videos/<slug>/2-motion/edit.json`
- 실행: `node scripts/edit-video.mjs <slug> [--dry]` (`--dry`는 계획만 계산하고 렌더링하지 않는다)
- 결과: `edit.json`의 `output` (보통 `3-footage/cut/<slug>_edit.mp4`), 필터 스크립트는 `2-motion/filter.txt`로 저장된다.

## edit.json 뼈대

```json
{
  "input": "3-footage/raw/<파일>.mp4",
  "output": "3-footage/cut/<slug>_edit.mp4",
  "fps": 30,
  "outputSize": [1920, 1080],
  "silence": { "noiseDb": -45, "minSec": 0.35, "padBefore": 0.12, "padAfter": 0.15, "endAt": 87.8, "audioTrack": 0 },
  "cuts": [],
  "blur": [],
  "zoom": []
}
```

- `silence.noiseDb`: 이보다 작은 소리를 무음으로 본다. 먼저 `volumedetect`로 평균(-31dB 정도)을 보고 -45dB 안팎에서 시작한다.
- `padBefore/padAfter`: 말 앞뒤로 남기는 여유(초). 말끝이 잘리면 늘린다.
- `endAt`: 마지막 말이 끝난 뒤 결과 화면을 보여 줄 끝 시각(원본 초). 없으면 마지막 무음까지 잘린다.
- `cuts`: **직접 삭제할 구간**, 원본 기준 초 `[[시작, 끝], ...]`. 버벅임과 반복을 여기에 넣는다.

## 순서

1. `--dry`로 계획을 본다. "원본 N초 → 편집본 M초(조각 K개)"가 나온다.
2. 버벅임·반복 구간을 `cuts`에 넣는다.
   - **전사(말을 글자로 옮긴 것)가 있어야 찾을 수 있다.** 대본이나 전사 파일을 사용자에게 받거나, whisper가 되면 그 결과를 쓴다 (`video-edit-4-captions-render` 참고).
   - 들을 수 없으므로 추측해서 자르지 않는다. 사용자가 시간을 주면 그대로 넣는다.
   - 반복은 **마지막 시도만 남기고** 앞의 시도를 자른다.
3. 필요하면 `silence` 값을 조정하고 다시 `--dry`.
4. 효과(`zoom`, `blur`)를 설정한 뒤 렌더링한다 (`video-edit-3-zoom-blur`).

## 렌더링

오래 걸리므로 백그라운드로 돌리고 끝나면 확인한다.

```powershell
node scripts/edit-video.mjs <slug>
```

## 주의

- ffmpeg 8 이상에서는 `-filter_complex_script`가 없다. 스크립트는 `-/filter_complex <파일>`을 쓴다.
- 시간은 모두 프레임(30fps) 경계로 맞춘다. 컷 경계에서 소리가 뚝 끊기지 않도록 조각마다 0.02초 페이드를 넣는다.
- 무음이 길어도 화면에서 일이 일어나는 구간(스크롤, 로딩)을 잘라 버릴 수 있다. 사용자가 원한 것이 무음 제거인지 확인하고, 줄인 시간을 보고한다.
- 오디오 트랙이 2개여도 같은 소리면 `audioTrack: 0`만 쓴다.
