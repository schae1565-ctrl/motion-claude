import { theme } from "../theme";
import { useMotion } from "../motion";

/** 입금 알림처럼 위에서 튀어나오는 초록색 카드 */
export const NotificationCard: React.FC<{
  title: string;
  amount: string;
  delay?: number;
}> = ({ title, amount, delay = 0 }) => {
  const p = useMotion("pop", delay);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 32,
        padding: "32px 56px 32px 40px",
        borderRadius: 56,
        background: theme.success,
        color: theme.onAccent,
        fontFamily: theme.font,
        transform: `scale(${p})`,
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: theme.onAccent,
          color: theme.success,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 60,
          fontWeight: 800,
        }}
      >
        ₩
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 44, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 70, fontWeight: 800 }}>{amount}</div>
      </div>
    </div>
  );
};
