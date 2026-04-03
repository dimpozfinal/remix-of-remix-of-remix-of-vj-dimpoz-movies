export default function EasterBanner() {
  return (
    <div
      className="w-full py-2.5 px-4 text-center text-xs font-semibold tracking-wider z-50 relative overflow-hidden"
      style={{
        background: "linear-gradient(90deg, hsl(230 15% 10% / 0.7), hsl(225 12% 8% / 0.8), hsl(230 15% 10% / 0.7))",
        borderBottom: "1px solid hsl(var(--border) / 0.3)",
        color: "hsl(220 12% 65%)",
        letterSpacing: "0.08em",
      }}
    >
      <span className="relative z-10">
        🕊️ DIMPOZ MOVIES — Holy Saturday · "He rested in the tomb." · Matthew 27:59-60 🙏
      </span>
    </div>
  );
}
