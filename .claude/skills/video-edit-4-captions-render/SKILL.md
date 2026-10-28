---
name: video-edit-4-captions-render
description: 영상 편집 4단계. 편집한 촬영 영상에 자막을 넣고 최종 렌더링·확인을 한다. 말을 글자로 옮기는 전사(whisper) 준비 방법과, 이 컴퓨터의 whisper 제약도 담았다. "자막 넣어줘", "전사", "whisper", "최종 렌더링 확인"에 사용한다.
---

# 영상 편집 4단계: 자막과 최종 확인

## 자막에는 전사가 필요하다

화면 녹화·촬영 영상은 말 내용을 대본으로 갖고 있지 않으므로 **말을 글자로 옮긴(전사) 텍스트와 시간**이 있어야 자막을 넣을 수 있다. 우선순위:

1. 사용자가 대본(글)이나 자막 파일(.srt)을 준다. 가장 빠르고 정확하다.
2. whisper로 전사한다 (아래).
3. 둘 다 안 되면 자막을 넣지 못한다고 말한다. 내용을 지어내서 넣지 않는다.

## whisper 상태 (이 컴퓨터)

- 공용 모델: `C:\Users\user\AI-Models\whisper\faster-whisper-medium` (환경 변수 `WHISPER_MODEL_MEDIUM`, 사용자 단위). faster-whisper(CTranslate2) 형식이다.
- 전사 스크립트: `scripts/whisper_transcribe.py <오디오> [--words]`
- **지금은 Windows에서 실행되지 않는다.** 스마트 앱 컨트롤이 켜져 있어(`VerifiedAndReputablePolicyState = 1`) 서명되지 않은 `ctranslate2`·`av`의 `.pyd/.dll`을 차단한다. 우회하지 않는다.
- 해결 방법: **WSL**에 설치한다 (Linux 프로그램은 대상이 아니다). 관리자 PowerShell에서 `wsl --install -d Ubuntu` → 재시작 → Ubuntu에서 `sudo apt install -y python3-venv python3-pip ffmpeg`, `python3 -m venv ~/whisper-env && source ~/whisper-env/bin/activate && pip install faster-whisper` → `export WHISPER_MODEL_MEDIUM=/mnt/c/Users/user/AI-Models/whisper/faster-whisper-medium` → `python /mnt/c/Users/user/Desktop/remotion/scripts/whisper_transcribe.py <오디오>`.
- 직접 연 터미널과 이 앱의 Python 패키지 위치는 서로 다르다. 앱에서 설치한 패키지는 사용자 터미널에서 안 보일 수 있다.
- 시스템 단위 환경 변수와 스마트 앱 컨트롤 변경은 사용자가 직접 한다. 대신 바꾸지 않는다.

## 편집 영상에 자막 넣기

1. 전사 시간은 **원본 기준**이다. 무음·구간 삭제로 편집본 시간이 달라졌으므로, 원본 시간 → 편집본 시간으로 바꾸는 표를 만든다. `node scripts/edit-video.mjs <slug>`(또는 `--dry`)를 실행하면 `2-motion/pieces.json`이 만들어진다. 각 항목은 `srcStart`, `srcEnd`(원본 초)와 `outStart`(편집본 초)이다. 원본 시각 `t`가 `srcStart ≤ t < srcEnd`인 조각을 찾아 `편집본 시각 = outStart + (t - srcStart)`로 바꾼다.
2. 잘려 나간 구간의 자막은 버리고, 걸쳐 있는 자막은 자른다.
3. 자막 모양은 `motion-5-subtitles`와 같다 (어두운 바탕 + 흰 글자, 화면 아래쪽, 한 번에 한 줄). 가로 영상은 글자를 작게(약 44px), 아래쪽 여백 약 8% 지점에 둔다.
4. 이 프로젝트에서 **편집 영상에 자막을 입히는 단계는 아직 실행해 본 적이 없다.** 방법은 (가) Remotion에서 `<OffthreadVideo src=staticFile(...)>` 위에 `SubtitleLine`을 올려 렌더링, (나) ffmpeg `subtitles` 필터로 .srt를 입히기(한글 폰트 지정 필요)가 있다. 처음 쓸 때는 짧은 구간으로 먼저 시험한다.

## 최종 확인

```powershell
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate -of default=nw=1 <결과 영상>
```

- 해상도, fps, 길이가 설정과 같은지 본다. 음성과 영상 길이 차이가 0.1초 안쪽이어야 한다.
- 확대·블러·자막이 들어간 시각의 프레임을 뽑아 눈으로 본다.
- **재생해서 본 것이 아니면 움직임과 소리 타이밍은 확인하지 못했다고 말한다.**
