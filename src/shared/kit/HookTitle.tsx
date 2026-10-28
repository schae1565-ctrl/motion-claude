import { interpolate } from "remotion";
import { theme } from "../theme";
import { useMotion } from "../motion";

/**
 * 첫 프레임부터 글자가 보이는 후킹 문구.
 * 투명하게 시작하지 않고 크기만 살짝 튀어 오른다. emphasis 글자는 강조색 + 밑줄.
 */
export const HookTitle: React.FC<{
  text: string;
  emphasis?: string;
  size?: number;
  underlineDelay?: number;
}> = ({ text, emphasis, size = 100, underlineDelay = 12 }) => {
  const pop = useMotion("pop", 0);
  const underline = useMotion("soft", underlineDelay);
  const scale = interpolate(pop, [0, 1], [0.9, 1]);

  const parts = emphasis ? text.split(emphasis) : [text];

  return (
    <div
      style={{
        fontFamily: theme.font,
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1.3,
        textAlign: "center",
        whiteSpace: "pre-line",
        color: theme.text,
        transform: `scale(${scale})`,
      }}
    >
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {emphasis && i < parts.length - 1 ? (
            <span
              style={{
                color: theme.danger,
                backgroundImage: `linear-gradient(${theme.danger}, ${theme.danger})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0 100%",
                backgroundSize: `${underline * 100}% 10px`,
              }}
            >
              {emphasis}
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
};
