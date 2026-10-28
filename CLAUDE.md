# CLAUDE.md

Remotion(React)으로 모션그래픽 영상을 만드는 프로젝트입니다. 사용자와는 한국어로 대화합니다.

## 작업 순서

1. 대본은 `senior-hook-script` 스킬(`.claude/skills/senior-hook-script`)의 규칙으로 쓰고 `videos/<slug>/1-plan/`에 저장한다. 대본은 문어체가 아니라 귀로 듣는 구어체(해요체)로, 한 문장은 한 호흡(약 15자 안팎)으로 짧게 쓴다. 첫 문장은 0~2초 안에 끝나는 질문으로 시작하고, 마지막 문장은 시청자에게 던지는 질문으로 끝낸다
2. **코드를 쓰기 전에 문장별 시각화 표를 보여주고 승인받는다.** 승인 전에는 씬 코드를 작성하지 않는다

   | # | 문장 | 화면 구성 | 모션 | 사용할 컴포넌트 |
   |---|---|---|---|---|
   | 1 | (대본 문장) | (무엇을 보여줄지) | (어떻게 움직일지) | (`src/shared`의 ui·kit 요소) |

3. 승인된 표대로 `src/videos/<slug>/`에 씬 코드를 작성하고, Composition을 `src/Root.tsx`에 등록한다
4. 음성·타임라인을 맞추고 렌더링한다

## 영상 폴더 구조

영상 하나 = `videos/<slug>` 폴더 하나. `<slug>`는 영문 소문자와 하이픈(`my-first-short`).

```
videos/<slug>/
├── 1-plan/        대본
├── 2-motion/      음성, 타임라인, 렌더 결과물
└── 3-footage/     촬영 영상
    ├── raw/       원본 (절대 덮어쓰지 않음)
    ├── work/      작업용 사본·중간 파일
    └── cut/       편집 완료본
```

- **원본 파일(`raw/`)은 덮어쓰거나 수정·삭제하지 않는다.** 가공이 필요하면 `work/`에 사본을 만들어 작업하고 결과는 `cut/`에 저장한다
- FFmpeg 명령을 쓸 때도 출력 경로가 `raw/`를 가리키지 않는지 확인한다

### 파일 불러오기

- `remotion.config.ts`에서 public 폴더를 `videos/`로 바꿔 두었다. `public/` 폴더는 쓰지 않는다
- 경로는 `videos/` 기준으로 적는다: `staticFile("<slug>/2-motion/voice/01.mp3")`, `staticFile("<slug>/3-footage/cut/intro.mp4")`
- 영상에는 `cut/`(또는 `work/`)의 파일을 쓰고, `raw/` 파일을 직접 불러오지 않는다

## 코드 구조

```
src/
├── index.ts             진입점 (registerRoot)
├── Root.tsx             모든 Composition 등록
├── videos/<slug>/       영상별 씬 코드
└── shared/              여러 영상에서 함께 쓰는 코드
    ├── theme.ts         색상
    ├── motion.ts        스프링 프리셋
    ├── ui/              공용 UI 컴포넌트
    └── kit/             재사용 씬·구성 요소
```

- 새 영상의 Composition은 `src/Root.tsx`에 등록한다. id는 slug와 맞춘다
- 두 개 이상의 영상에서 쓰일 코드는 `src/shared`로 옮긴다

## 3D 규칙

- 3D는 `three`, `@react-three/fiber`, `@remotion/three`를 쓰고, 공용 3D 요소는 `src/shared/three/`에 둔다 (`Slab`, `TextPlane`, `Person3D`, `CameraRig`, `Props3D`, `CaptureCard3D`)
- 3D 단위: 1 = 화면 100px (z=0 평면, 카메라 z=30, fov 35.5). 화면 가장자리가 잘리지 않도록 카메라 z는 30 이상으로 둔다
- 한글은 3D 글자가 아니라 `TextPlane`(캔버스 글자 텍스처)으로 그린다
- 3D 장면의 움직임도 `motion.ts` 스프링만 쓴다. 카메라는 `CameraRig`의 키프레임으로 움직이고, 흔들림은 `shake` 스프링을 쓴다
- 3D 렌더링은 `remotion.config.ts`의 `setChromiumOpenGlRenderer("angle")`가 필요하다. 렌더링이 2D보다 훨씬 느리다
- 영상 하나에 3D 버전과 2D 버전이 함께 있을 수 있다 (`adult-children-talk` = 3D, `adult-children-talk-2d` = 2D, 2D 파일은 `src/videos/<slug>/2d/`)

## 디자인 규칙

- **색은 `theme.ts`에 정의된 값만 쓴다.** 씬 코드에 색상 값(`#fff`, `rgb()` 등)을 직접 적지 않는다. 새 색이 필요하면 `theme.ts`에 추가한다
- **움직임은 `motion.ts`의 스프링만 쓴다.** 씬 코드에서 `spring()` config를 직접 만들지 않는다. 새 움직임이 필요하면 `motion.ts`에 프리셋을 추가한다
- 모든 움직임은 `useCurrentFrame()` 기준으로 만든다. CSS transition·animation, `setTimeout`, `requestAnimationFrame`은 사용하지 않는다
- 장면 구성은 `<Sequence>` / `<Series>`, 레이아웃은 `<AbsoluteFill>`, 미디어는 `<Img>`, `<OffthreadVideo>`, `<Audio>`를 사용한다

## 영상 규격

- 쇼츠: 1080×1920, 30fps

## 명령어

- `npm run dev`: Remotion Studio 실행 (미리보기)
- `npx remotion render <id> videos/<slug>/2-motion/<파일명>.mp4`: 렌더링
- `npx remotion still <id> videos/<slug>/2-motion/<파일명>.png --frame=<번호>`: 특정 프레임 확인
- `npx tsc`: 타입 검사. 코드 작성 후 항상 실행한다

## 환경

- Windows 11, Node v24, Remotion 4.0.539, React 19, TypeScript
- 렌더링용 FFmpeg는 Remotion에 포함. 촬영 영상 가공에는 시스템 FFmpeg 9 (`ffmpeg`, `ffprobe`)를 사용

## Whisper 모델 (공용)

- 모델은 프로젝트 밖 공용 폴더 `C:\Users\user\AI-Models\whisper\`에 한 벌만 둔다. 프로젝트의 `faster-whisper-medium/`은 그 폴더로 연결된 junction이다 (복사하지 않는다)
- 환경 변수 `WHISPER_MODEL_MEDIUM`(medium 모델 폴더), `WHISPER_MODEL_DIR`(공용 폴더)가 사용자 단위로 설정되어 있다
- 형식은 faster-whisper(CTranslate2)이다. whisper.cpp(`ggml-*.bin`)나 OpenAI `whisper` 패키지에는 쓸 수 없다
- 사용법은 공용 폴더의 `README.md`에 있다

## 환경 변수와 TTS

- `.env`에 `TYPECAST_API_KEY`(타입캐스트 TTS API 키)가 있다. `.env`는 git에서 제외되어 있으며, 키 값을 읽어서 출력하거나 다른 파일에 옮겨 적지 않는다
- Remotion은 `.env` 값을 번들에 포함시키므로 컴포넌트 안에서 API를 직접 호출하지 않는다
- 사용 음성: 혜진 (`tc_6a21054564d676539427427e`, 모델 ssfm-v30, 한국어). 타입캐스트가 `403 UNUSUAL_ACTIVITY_DETECTED`를 돌려주면 같은 요청을 반복하지 말고 사용자에게 계정 상태 확인을 요청한다
- 음성은 별도 Node 스크립트(`scripts/`)로 미리 생성해 `videos/<slug>/2-motion/voice/`에 저장하고, `staticFile("<slug>/2-motion/voice/...")`로 불러온다
