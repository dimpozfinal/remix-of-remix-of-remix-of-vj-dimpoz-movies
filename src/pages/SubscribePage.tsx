import { Crown, Zap, Star, Clock, ArrowLeft, Sparkles, Shield } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-context";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PLAN_STYLES = [
  {
    icon: Clock,
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
    glow: "0 0 20px rgba(6,182,212,0.4), 0 0 40px rgba(6,182,212,0.15)",
    border: "border-cyan-500/30",
    btnBg: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500",
  },
  {
    icon: Zap,
    gradient: "from-emerald-400 via-green-500 to-teal-600",
    glow: "0 0 20px rgba(16,185,129,0.4), 0 0 40px rgba(16,185,129,0.15)",
    border: "border-emerald-500/30",
    btnBg: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500",
  },
  {
    icon: Star,
    gradient: "from-amber-400 via-orange-500 to-red-500",
    glow: "0 0 25px rgba(245,158,11,0.5), 0 0 50px rgba(245,158,11,0.2)",
    border: "border-amber-400/40",
    btnBg: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500",
    popular: true,
  },
  {
    icon: Crown,
    gradient: "from-violet-400 via-purple-500 to-indigo-600",
    glow: "0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.15)",
    border: "border-violet-500/30",
    btnBg: "bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500",
  },
  {
    icon: Sparkles,
    gradient: "from-rose-400 via-pink-500 to-fuchsia-600",
    glow: "0 0 20px rgba(244,63,94,0.4), 0 0 40px rgba(244,63,94,0.15)",
    border: "border-rose-500/30",
    btnBg: "bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500",
  },
];

export default function SubscribePage() {
  const navigate = useNavigate();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#07070d] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-cyan-600/6 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[200px] bg-amber-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-3 py-4 md:py-10">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-white/30 hover:text-white/70 text-xs mb-4 md:mb-8 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-4 md:mb-10">
          <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-white mb-1 md:mb-3 tracking-tight">
            Unlock <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">Premium</span>
          </h1>
          <p className="text-white/30 text-[10px] sm:text-xs max-w-sm mx-auto">
            Pay with MTN or Airtel Money
          </p>
        </div>

        {/* Plans — single row */}
        <div className="flex gap-2 sm:gap-2.5 mb-6 md:mb-10 overflow-x-auto pb-2 scrollbar-hide justify-center">
          {SUBSCRIPTION_PLANS.map((plan, i) => {
            const style = PLAN_STYLES[i] || PLAN_STYLES[0];
            const Icon = style.icon;
            const isHovered = hoveredIdx === i;
            const isPopular = style.popular;

            return (
              <div
                key={plan.id}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`relative flex-shrink-0 w-[110px] sm:w-[130px] md:w-[150px] rounded-xl transition-all duration-500 ${
                  isHovered ? "-translate-y-1.5 scale-[1.05]" : ""
                } ${isPopular && !isHovered ? "scale-[1.02]" : ""}`}
                style={{
                  boxShadow: isHovered || isPopular ? style.glow : "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                {isPopular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                    <span className="px-2 py-[2px] bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[7px] font-black rounded-full shadow-lg shadow-amber-500/40 uppercase tracking-wider whitespace-nowrap">
                      Best
                    </span>
                  </div>
                )}

                <div
                  className={`h-full rounded-xl border transition-all duration-500 overflow-hidden backdrop-blur-sm ${
                    isPopular ? style.border : isHovered ? "border-white/15" : "border-white/[0.05]"
                  }`}
                  style={{
                    background: isHovered
                      ? "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)"
                      : "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%)",
                  }}
                >
                  {/* Top glow bar */}
                  <div className={`h-[2px] w-full bg-gradient-to-r ${style.gradient} ${isHovered ? "opacity-100" : "opacity-40"} transition-opacity`} />

                  <div className="p-2 sm:p-2.5 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${style.gradient} flex items-center justify-center mb-1.5`}
                      style={{ boxShadow: isHovered ? style.glow : "none" }}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>

                    <p className="text-white/40 text-[8px] sm:text-[9px] font-medium">{plan.duration}</p>

                    {/* Price */}
                    <div className="my-1">
                      <span className={`text-sm sm:text-base md:text-lg font-black bg-gradient-to-r ${style.gradient} bg-clip-text text-transparent`}>
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-white/25 text-[7px] block">UGX</span>
                    </div>

                    {/* CTA */}
                    <button
                      className={`w-full py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold text-white transition-all duration-300 ${style.btnBg}`}
                      style={{ boxShadow: isHovered ? style.glow : "none" }}
                    >
                      Get
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          {[
            { icon: Shield, label: "Secure", color: "text-emerald-400" },
            { icon: Zap, label: "Instant", color: "text-cyan-400" },
            { icon: Star, label: "MTN & Airtel", color: "text-amber-400" },
          ].map(({ icon: TIcon, label, color }) => (
            <div key={label} className="flex items-center gap-1 text-white/20 text-[9px] sm:text-[10px]">
              <TIcon className={`w-3 h-3 ${color}`} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
