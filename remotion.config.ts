import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// 3D(WebGL) 장면을 헤드리스 크롬에서 렌더링하려면 angle 렌더러가 필요하다
Config.setChromiumOpenGlRenderer("angle");
// 영상별 음성·촬영 파일을 staticFile("<slug>/...")로 불러오기 위해 public 대신 videos/를 쓴다
Config.setPublicDir("./videos");
