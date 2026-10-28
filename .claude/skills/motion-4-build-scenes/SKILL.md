---
name: motion-4-build-scenes
description: 모션그래픽 4단계. 승인된 시각화 표대로 Remotion 씬 코드를 만든다. 2D(React)와 3D(three, react-three-fiber)를 모두 다룬다. "씬 코드 작성", "3D로 만들어줘", "Composition 등록", "공용 컴포넌트"에 사용한다.
---

# 모션그래픽 4단계: 씬 만들기

**승인된 표(`motion-1-visual-plan`)가 있을 때만 시작한다.** 음성 타이밍(`timeline.ts`)이 먼저 있어야 길이를 맞출 수 있다.

## 폴더

```
src/
├── Root.tsx                      모든 Composition 등록 (id는 slug와 같게)
├── shared/
│   ├── theme.ts  motion.ts       색, 스프링 (여기 값만 쓴다)
│   ├── ui/  kit/                 2D 공용 요소
│   └── three/                    3D 공용 요소
└── videos/<slug>/
    ├── content.ts  timeline.ts   문구, 프레임
    ├── AdultChildrenTalk3D.tsx   3D 메인 (Hook3D, Item3D, Closing3D, Subtitles)
    └── 2d/                       이전 2D 버전 (지우지 않고 보관)
```

- 화면 1080×1920, 30fps. `remotion.config.ts`: public 폴더 = `videos/`, 3D는 `setChromiumOpenGlRenderer("angle")`.
- 모든 움직임은 `useMotion(kind, delay)`(스프링)로 만든다. CSS 애니메이션·`setTimeout`·`requestAnimationFrame` 금지. 새 움직임은 `motion.ts`에 프리셋으로 추가한다.
- 색은 `theme.ts` 값만 쓴다. 씬 코드에 `#fff` 같은 값을 직접 적지 않는다.
- 장면은 `<Sequence from durationInFrames layout="none">`으로 나눈다. 안쪽 프레임은 0부터 다시 센다.

## 2D

- `AbsoluteFill`로 배치하고 `Series`로 잇는다. 공용 요소: `SpeechBubble`, `ThoughtBubble`, `NumberBadge`, `StrikeMark`, `CheckMark`, `PersonDot`, `Caption`, `NotificationCard`, `CaptureCard` 등.
- 한글 줄바꿈에는 `wordBreak: "keep-all"`을 준다 (단어 중간에서 줄이 바뀌지 않게).

## 3D (three + @react-three/fiber + @remotion/three)

- 한 개의 `ThreeCanvas`(`flat`, `camera={{ position:[0,0,30], fov:35.5 }}`)에 모든 장면을 `Sequence`로 넣는다. 3D 단위 1 = 화면 100px (z=0 평면).
- 공용 요소(`src/shared/three/`): `Slab`(둥근 상자), `TextPlane`(캔버스 글자), `Person3D`, `CameraRig`, `Props3D`(`Coin`, `CoinRain`, `Heart`, `HeartBurst`, `Door3D`, `XMark3D`, `Check3D`, `ThoughtCloud`), `CaptureCard3D`.
- 한글은 `TextPlane`으로 그린다 (3D 글자는 폰트 파일이 필요). `size`·`maxWidth`는 화면 px 기준.
- 카메라는 `CameraRig`의 키프레임(`{ f, pos, look }`)으로 움직이고 스프링으로 이어진다. 흔들림은 `shakes=[프레임]`.
- **카메라 z는 30 이상, 옆 이동은 ±1 안쪽으로.** z 26까지 다가가니 화면 가장자리 물체가 잘렸다.
- 3D 요소의 회전·위치도 스프링 값(`pop`, `soft`, `slow`)에서 계산한다. 낙하 후 튕김은 `pop`의 오버슈트를 쓴다.
- 새 `Composition`은 `Root.tsx`에 등록한다.

## 실제로 겪은 함정

- 첫 프레임이 비면 안 된다. 스프링이 0에서 시작하면 크기가 0이므로 훅의 핵심 물체는 `interpolate(p,[0,1],[0.85,1])`처럼 0이 아닌 값에서 시작한다.
- 효과 객체(X 표시 등)는 `Sequence`의 `durationInFrames`로 수명을 정해 새 요소와 겹치지 않게 한다.
- 입 모양 토러스는 구 표면 앞에 있어야 보인다 (`z ≈ 1.0 × 반지름`).
- 굴러서 다가가는 구는 회전이 도착할 때 0이 되도록 `(1 - p)`를 곱한다 (아니면 얼굴이 옆으로 누운 채 멈춘다).
- 같은 구조가 세 번 반복되면 지루하다. 항목마다 변주(소품, 카메라 방향)를 둔다.

다음 단계: `motion-5-subtitles`, 그다음 `motion-6-verify-render`
