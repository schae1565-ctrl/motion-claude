---
name: video-edit-1-ingest
description: 영상 편집 1단계. 촬영 영상·화면 녹화 파일을 프로젝트에 넣고, 원본을 보존하는 폴더 구조로 옮기고, 영상 정보와 내용을 파악해서 편집 준비를 한다. "편집할 영상을 추가했어", "영상 위치 옮겨줘", "영상 정보 알려줘"에 사용한다.
---

# 영상 편집 1단계: 가져오기와 내용 파악

## 폴더

영상 하나 = `videos/<slug>/` 하나. slug는 영문 소문자·숫자·하이픈(파일 이름을 그대로 써도 된다).

```
videos/<slug>/
├── 1-plan/
├── 2-motion/        edit.json, 음성, 렌더 결과
└── 3-footage/
    ├── raw/         원본 (절대 덮어쓰거나 수정하지 않는다)
    ├── work/        작업용 사본·중간 파일
    └── cut/         편집 완료본
```

## 순서

1. 파일을 찾는다. 사용자가 "폴더에 추가했다"고 하면 프로젝트 루트부터 이름으로 검색한다 (`node_modules` 제외).
2. 폴더를 만들고 원본을 `3-footage/raw/`로 **옮긴다**(`Move-Item`). 이미 같은 이름이 있으면 덮어쓰지 말고 알린다.
3. 영상 정보를 확인한다.
   ```powershell
   $env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
   ffprobe -v error -show_entries format=duration,size:stream=index,codec_type,codec_name,width,height,r_frame_rate,channels -of compact <파일>
   ```
   새 터미널이 아니면 `ffmpeg`가 PATH에 없을 수 있어서 위 첫 줄로 PATH를 새로 읽는다.
4. 오디오 트랙이 2개 이상이면 같은 소리인지 본다 (`-af volumedetect`로 평균·최대 음량 비교). 같으면 한 트랙만 쓴다.
5. **내용을 파악한다.** 4초마다 화면을 뽑아 한 장짜리 모음으로 만들어 눈으로 본다.
   ```powershell
   ffmpeg -hide_banner -loglevel error -y -i <raw 파일> -vf "fps=1/4,scale=640:360,tile=3x4" -frames:v 2 sheet_%d.png
   ```
   타일 번호 `i`는 `4 × i`초다. 여기서 편집할 곳(강조), **개인정보가 보이는 구간**(API 키, 이메일, 이름, 전화번호, 카드번호, 주소)을 미리 표시한다.
6. 사용자에게 정보(해상도·길이·코덱·오디오 트랙 수)와 위치를 보고한다.

## 주의

- HEVC나 5K 같은 큰 파일은 Remotion(크롬)에서 바로 못 읽는다. 하지만 `scripts/edit-video.mjs`(ffmpeg)는 raw를 직접 읽으므로 **ffmpeg로 편집할 때는 사본이 필요 없다.** Remotion에서 쓸 때만 `work/`에 h264 1080p 사본을 만든다. 사본은 사용자가 원할 때 만든다.
- 원본(raw)은 읽기만 한다. 결과는 `cut/`에 쓴다.
- 영상 내용(말)은 들을 수 없다. 전사가 필요하면 `video-edit-4-captions-render`의 whisper 안내를 따른다.

다음 단계: `video-edit-2-silence-cuts`
