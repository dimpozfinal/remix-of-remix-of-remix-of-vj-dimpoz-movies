import { Check, Crown, Zap, Star, Clock, ArrowLeft, Sparkles, Shield, Tv, Download, Film } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-context";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PLAN_STYLES = [
  {
    icon: Clock,
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
    glow: "shadow-cyan-500/25",
    ring: "ring-cyan-400/30",
    badge: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
    btnBg: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500",
  },
  {
    icon: Zap,
    gradient: "from-emerald-400 via-green-500 to-teal-600",
    glow: "shadow-emerald-500/25",
    ring: "ring-emerald-400/30",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    btnBg: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500",
  },
  {
    icon: Star,
    gradient: "from-amber-400 via-orange-500 to-red-500",
    glow: "shadow-amber-500/30",
    ring: "ring-amber-400/30",
    badge: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    btnBg: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500",
    popular: true,
  },
  {
    icon: Crown,
    gradient: "from-violet-400 via-purple-500 to-indigo-600",
    glow: "shadow-violet-500/25",
    ring: "ring-violet-400/30",
    badge: "bg-violet-500/15 text-violet-300 border-violet-400/30",
    btnBg: "bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500",
  },
  {
    icon: Sparkles,
    gradient: "from-rose-400 via-pink-500 to-fuchsia-600",
    glow: "shadow-rose-500/25",
    ring: "ring-rose-400/30",
    badge: "bg-rose-500/15 text-rose-300 border-rose-400/30",
    btnBg: "bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500",
  },
];

const FEATURES = [
  { icon: Tv, label: "Unlimited streaming" },
  { icon: Film, label: "HD quality content" },
  { icon: Download, label: "Download offline" },
  { icon: Star, label: "All movies & series" },
];

export default function SubscribePage() {
  const navigate = useNavigate();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-amber-600/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: "2s" }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-14">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/80 text-sm mb-10 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-[11px] font-medium mb-5 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Choose Your Experience
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-[1.1]">
            Unlock <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">Premium</span> Access
          </h1>
          <p className="text-white/40 text-sm md:text-base max-w-md mx-auto">
            Stream unlimited movies, series & more. Pay easily with MTN or Airtel Money.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-14">
          {SUBSCRIPTION_PLANS.map((plan, i) => {
            const style = PLAN_STYLES[i] || PLAN_STYLES[0];
            const Icon = style.icon;
            const isHovered = hoveredIdx === i;
            const isPopular = i === 2;

            return (
              <div
                key={plan.id}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`relative group rounded-2xl transition-all duration-500 ${
                  isHovered ? `shadow-2xl ${style.glow} -translate-y-2 scale-[1.02]` : "shadow-lg shadow-black/20"
                } ${isPopular ? "lg:scale-[1.04] lg:z-10" : ""}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <span className="px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-black rounded-full shadow-lg shadow-amber-500/30 uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`h-full rounded-2xl border transition-all duration-500 overflow-hidden ${
                  isPopular ? "border-amber-400/40" : isHovered ? "border-white/20" : "border-white/[0.06]"
                }`}
                  style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)" }}
                >
                  {/* Top gradient line */}
                  <div className={`h-1 w-full bg-gradient-to-r ${style.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

                  <div className="p-5 flex flex-col h-full">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-lg ${style.glow} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Plan info */}
                    <h3 className="text-white font-bold text-base mb-0.5">{plan.name}</h3>
                    <p className="text-white/30 text-xs mb-4">{plan.duration}</p>

                    {/* Price */}
                    <div className="mb-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-white/40 text-[10px] font-semibold">UGX</span>
                        <span className={`text-3xl font-black bg-gradient-to-r ${style.gradient} bg-clip-text text-transparent`}>
                          {plan.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-5 flex-1">
                      {FEATURES.map(({ icon: FIcon, label }) => (
                        <div key={label} className="flex items-center gap-2">
                          <FIcon className="w-3.5 h-3.5 text-white/20" />
                          <span className="text-[11px] text-white/40">{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      className={`w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 ${style.btnBg} shadow-lg ${isHovered ? style.glow : ""}`}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust bar */}
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {[
            { icon: Shield, label: "Secure Payment", color: "text-emerald-400" },
            { icon: Zap, label: "Instant Access", color: "text-cyan-400" },
            { icon: Star, label: "MTN & Airtel Money", color: "text-amber-400" },
          ].map(({ icon: TIcon, label, color }) => (
            <div key={label} className="flex items-center gap-2 text-white/30 text-xs">
              <TIcon className={`w-4 h-4 ${color}`} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
