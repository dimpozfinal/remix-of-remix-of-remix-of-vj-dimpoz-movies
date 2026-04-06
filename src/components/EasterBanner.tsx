export default function EasterBanner() {
  return (
    <div
      className="w-full py-2.5 px-4 text-center text-xs font-semibold tracking-wider z-50 relative overflow-hidden"
      style={{
        background: "linear-gradient(90deg, hsl(145 55% 48% / 0.12), hsl(170 45% 42% / 0.18), hsl(145 55% 48% / 0.12))",
        borderBottom: "1px solid hsl(145 55% 48% / 0.25)",
        color: "hsl(145 45% 65%)",
        letterSpacing: "0.08em",
      }}
    >
      <span className="relative z-10">
        🌿 DIMPOZ MOVIES — Happy Easter Monday! · "Therefore, if anyone is in Christ, the new creation has come." · 2 Corinthians 5:17 🕊️
      </span>
    </div>
  );
}
