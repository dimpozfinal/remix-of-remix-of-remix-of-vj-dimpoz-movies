const eggs = [
  { emoji: "🥚", top: "8%", left: "3%", size: "text-2xl", anim: "easter-egg-float-1", delay: "0s" },
  { emoji: "🐣", top: "15%", right: "5%", size: "text-xl", anim: "easter-egg-float-2", delay: "1s" },
  { emoji: "🐰", bottom: "18%", left: "2%", size: "text-3xl", anim: "easter-egg-float-1", delay: "0.5s" },
  { emoji: "🌷", top: "40%", right: "2%", size: "text-xl", anim: "easter-egg-float-2", delay: "2s" },
  { emoji: "✝️", top: "60%", left: "4%", size: "text-lg", anim: "easter-egg-float-1", delay: "1.5s" },
  { emoji: "🕊️", bottom: "35%", right: "3%", size: "text-2xl", anim: "easter-egg-float-2", delay: "0.8s" },
];

export default function EasterDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden hidden md:block">
      {eggs.map((egg, i) => (
        <span
          key={i}
          className={`absolute ${egg.size} ${egg.anim} opacity-30 select-none`}
          style={{
            top: egg.top,
            left: egg.left,
            right: egg.right,
            bottom: egg.bottom,
            animationDelay: egg.delay,
          }}
        >
          {egg.emoji}
        </span>
      ))}
    </div>
  );
}
