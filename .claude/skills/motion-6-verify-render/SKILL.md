---
name: motion-6-verify-render
description: 모션그래픽 6단계. 만든 Remotion 영상을 타입 검사하고, 주요 프레임을 이미지로 렌더링해 확인한 뒤, 전체 영상을 렌더링하고 결과 파일을 점검한다. 스튜디오를 여는 방법도 담았다. "프레임 확인", "렌더링", "스튜디오 열어줘", "결과 확인"에 사용한다.
---

# 모션그래픽 6단계: 확인과 렌더링

## 1. 타입 검사

```powershell
npx tsc -p .
```

출력이 없고 종료 코드가 0이면 통과다. 코드를 고칠 때마다 먼저 한다.

## 2. 주요 프레임 확인

`npx remotion still <CompositionId> <출력.png> --frame=<번호>`로 한 장씩 뽑아 눈으로 본다. 임시 이미지는 `$env:TEMP`에 둔다.

```powershell
foreach ($f in 0,60,150,300,430,1060,1230) { npx remotion still <id> "$env:TEMP\chk\f$f.png" --frame=$f --log=error }
```

고르는 프레임: **0프레임(첫 화면에 글자가 있는가)**, 후킹 전환, 항목마다 앞·중간·뒤(말 → 속마음 → 대신), 마무리 요약, 마지막 질문, 음성이 끝난 뒤 꼬리.

볼 것:
- 글자가 잘리거나 단어 중간에서 줄이 바뀌지 않는가
- 화면 가장자리에서 물체가 잘리지 않는가 (3D는 카메라 거리)
- 요소끼리, 자막과 소품이 겹치지 않는가
- 효과(X, 체크, 하트)가 남아서 다음 요소를 가리지 않는가

문제를 찾으면 고치고 해당 프레임만 다시 뽑는다.

## 3. 전체 렌더링

오래 걸리므로 **백그라운드**로 돌린다. 3D는 1286프레임에 몇 분~10분 걸린다.

```powershell
npx remotion render <id> videos/<slug>/2-motion/<파일명>.mp4 --log=error
```

- 파일 이름 규칙: 2D `<slug>.mp4`, 3D `<slug>-3d.mp4`, 자막 포함 `<slug>-3d-subs.mp4`. 이전 결과는 지우지 않는다.
- 3D는 `remotion.config.ts`에 `Config.setChromiumOpenGlRenderer("angle")`가 있어야 한다.

## 4. 결과 점검

```powershell
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
ffprobe -v error -show_entries format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate -of default=nw=1 <파일>
```

해상도 1080×1920, 30fps, h264 + aac, 길이가 계획(음성 + 꼬리)과 같은지 본다.

## 5. 보고할 때

- 확인한 것(타입 검사, 프레임, 파일 정보)과 **확인하지 못한 것**(움직임, 소리 타이밍은 재생해 봐야 안다)을 나눠 말한다.
- 사용자에게 어긋나는 장면을 "장면 번호 + 정도"로 받겠다고 안내한다.

## 스튜디오로 미리 보기

`.claude/launch.json`에 `remotion-studio`(`npm run dev -- --port=3000 --no-open`)가 있다. `preview_start`로 `remotion-studio`를 시작하면 `http://localhost:3000`에서 열린다. 저장하면 즉시 반영된다. 끝나면 사용자가 원할 때 서버를 끈다.
