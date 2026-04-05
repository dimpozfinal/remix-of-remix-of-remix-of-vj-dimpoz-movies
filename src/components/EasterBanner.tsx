export default function EasterBanner() {
  return (
    <div
      className="w-full py-2.5 px-4 text-center text-xs font-semibold tracking-wider z-50 relative overflow-hidden"
      style={{
        background: "linear-gradient(90deg, hsl(45 85% 55% / 0.15), hsl(35 70% 50% / 0.2), hsl(45 85% 55% / 0.15))",
        borderBottom: "1px solid hsl(45 85% 55% / 0.3)",
        color: "hsl(45 80% 70%)",
        letterSpacing: "0.08em",
      }}
    >
      <span className="relative z-10">
        ✝️ DIMPOZ MOVIES — Happy Easter! · "He is not here; He has risen!" · Matthew 28:6 🌅
      </span>
    </div>
  );
}
