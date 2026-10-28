# git에 올리지 않은 큰 파일

용량이 큰 영상 파일은 `.gitignore`로 제외했습니다. 클라우드 드라이브 등 다른 곳에 따로 보관하고, 같은 경로에 두면 그대로 쓸 수 있습니다.

| 파일 | 크기 | 종류 |
|---|---|---|
| `videos/example1028/3-footage/raw/example1028.mp4` | 10.4 MB | 촬영 원본 |
| `videos/example1028/3-footage/cut/example1028_edit.mp4` | 3.8 MB | 편집 완료본 (`edit.json`으로 다시 만들 수 있음) |
| `videos/adult-children-talk/2-motion/adult-children-talk-3d-subs.mp4` | 8.4 MB | 렌더 결과물 (3D, 자막 포함) |
| `videos/adult-children-talk/2-motion/adult-children-talk-3d.mp4` | 7.6 MB | 렌더 결과물 (3D) |
| `videos/adult-children-talk/2-motion/adult-children-talk.mp4` | 4.1 MB | 렌더 결과물 (2D) |

- 렌더 결과물은 `npx remotion render`로 다시 만들 수 있습니다
- 촬영 원본(`3-footage/`)은 다시 만들 수 없으니 꼭 따로 백업하세요
- 함께 제외한 것: `node_modules/`(`npm install`로 복구), `faster-whisper-medium`(공용 모델 폴더로 연결된 junction), `.env`(API 키)
