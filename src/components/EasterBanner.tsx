export default function EasterBanner() {
  return (
    <div
      className="w-full py-2.5 px-4 text-center text-xs font-semibold tracking-wider z-50 relative overflow-hidden"
      style={{
        background: "linear-gradient(90deg, hsl(0 30% 15% / 0.6), hsl(0 20% 10% / 0.7), hsl(0 30% 15% / 0.6))",
        borderBottom: "1px solid hsl(var(--border) / 0.4)",
        color: "hsl(0 15% 70%)",
        letterSpacing: "0.08em",
      }}
    >
      <span className="relative z-10">
        ✝️ DIMPOZ MOVIES — Good Friday · "It is finished." · John 19:30 🕊️
      </span>
    </div>
  );
}
