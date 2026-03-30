export default function EasterBanner() {
  return (
    <div
      className="w-full py-2 px-4 text-center text-xs font-bold tracking-wide z-50 relative overflow-hidden"
      style={{
        background: "linear-gradient(90deg, hsl(280 60% 55% / 0.3), hsl(340 75% 65% / 0.3), hsl(50 90% 65% / 0.3), hsl(150 50% 50% / 0.3))",
        borderBottom: "1px solid hsl(var(--border) / 0.3)",
      }}
    >
      <span className="relative z-10">
        🐣 Happy Easter Week! 🌷 He is Risen! ✝️ Enjoy the season with great movies 🎬
      </span>
    </div>
  );
}
