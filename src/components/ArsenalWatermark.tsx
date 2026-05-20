import arsenalBadge from "@/assets/arsenal-badge.png";

export default function ArsenalWatermark() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden"
    >
      <img
        src={arsenalBadge}
        alt=""
        width={1024}
        height={1024}
        loading="lazy"
        className="w-[80vmin] h-[80vmin] max-w-[720px] max-h-[720px] opacity-[0.04] md:opacity-[0.06] select-none"
        style={{ filter: "drop-shadow(0 0 40px hsl(356 99% 50% / 0.25))" }}
      />
    </div>
  );
}
