export default function EasterBanner() {
  return (
    <div
      className="w-full py-2.5 px-4 text-center text-xs font-semibold tracking-wider z-50 relative overflow-hidden"
      style={{
        background: "linear-gradient(90deg, hsl(40 70% 50% / 0.15), hsl(30 40% 30% / 0.2), hsl(40 70% 50% / 0.15))",
        borderBottom: "1px solid hsl(var(--border) / 0.4)",
        color: "hsl(40 60% 75%)",
        letterSpacing: "0.08em",
      }}
    >
      <span className="relative z-10">
        ✝️ Holy Week — "For God so loved the world" · John 3:16 🕊️
      </span>
    </div>
  );
}
