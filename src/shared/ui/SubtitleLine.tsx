import { theme } from "../theme";
import { useMotion } from "../motion";

/**
 * 화면 아래쪽에 한 번에 한 줄(최대 두 줄)로 보이는 자막.
 * 어두운 바탕에 흰 글자라서 어떤 배경에서도 읽힌다.
 * 쇼츠 하단 UI(제목·설명)에 가리지 않도록 세로 위치를 1920px 기준 약 74~82%에 둔다.
 */
export const SubtitleLine: React.FC<{ text: string; top?: number }> = ({ text, top = 1420 }) => {
  const p = useMotion("soft", 0);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top,
        height: 170,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          padding: "16px 36px",
          borderRadius: 30,
          background: theme.text,
          color: theme.onAccent,
          fontFamily: theme.font,
          fontSize: 62,
          fontWeight: 800,
          lineHeight: 1.3,
          textAlign: "center",
          wordBreak: "keep-all",
        }}
      >
        {text}
      </div>
    </div>
  );
};
