import { Check, Crown, Zap, Star, Clock, ArrowLeft, Sparkles } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-context";
import { useNavigate } from "react-router-dom";

const PLAN_ACCENTS = [
  { icon: Clock, gradient: "from-sky-400 to-blue-500", bg: "bg-sky-500/10", text: "text-sky-400" },
  { icon: Zap, gradient: "from-emerald-400 to-teal-500", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  { icon: Star, gradient: "from-amber-400 to-orange-500", bg: "bg-amber-500/10", text: "text-amber-400" },
  { icon: Crown, gradient: "from-violet-400 to-purple-500", bg: "bg-violet-500/10", text: "text-violet-400" },
  { icon: Sparkles, gradient: "from-rose-400 to-pink-500", bg: "bg-rose-500/10", text: "text-rose-400" },
];

const FEATURES = ["Unlimited streaming", "HD quality", "Download offline", "All content"];

export default function SubscribePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-16">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-8 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold mb-4">
            <Sparkles className="w-3 h-3" />
            Premium Plans
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-3 tracking-tight font-display leading-tight">
            Pick Your Perfect Plan
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Start streaming movies, series & more. Pay with MTN or Airtel Money.
          </p>
        </div>

        {/* Plans — stacked on mobile, row on desktop */}
        <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-5 md:gap-3 lg:gap-4 mb-12">
          {SUBSCRIPTION_PLANS.map((plan, i) => {
            const accent = PLAN_ACCENTS[i] || PLAN_ACCENTS[0];
            const Icon = accent.icon;
            const isPopular = plan.id === "1week";

            return (
              <div
                key={plan.id}
                className={`relative group transition-all duration-300 md:hover:-translate-y-1 ${
                  isPopular ? "md:scale-[1.03] md:z-10" : ""
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 hidden md:block">
                    <span className={`px-3 py-1 bg-gradient-to-r ${accent.gradient} text-white text-[10px] font-bold rounded-full shadow-lg`}>
                      ⭐ Best Value
                    </span>
                  </div>
                )}

                <div
                  className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                    isPopular
                      ? "border-primary/40 shadow-lg shadow-primary/10"
                      : "border-border/60 hover:border-primary/30 hover:shadow-md"
                  }`}
                  style={{ background: "hsl(var(--card) / 0.8)" }}
                >
                  {/* Mobile: horizontal layout | Desktop: vertical */}
                  <div className="flex items-center gap-4 p-4 md:flex-col md:items-stretch md:p-5">
                    {/* Icon + Plan name row (mobile) / stacked (desktop) */}
                    <div className="flex items-center gap-3 md:flex-col md:items-center md:text-center flex-1 md:flex-initial">
                      <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${accent.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div className="md:mt-2">
                        <div className="flex items-center gap-2 md:justify-center">
                          <h3 className="text-sm md:text-base font-bold text-foreground">{plan.name}</h3>
                          {isPopular && (
                            <span className={`px-1.5 py-0.5 bg-gradient-to-r ${accent.gradient} text-white text-[8px] font-bold rounded md:hidden`}>
                              BEST
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] md:text-xs text-muted-foreground">{plan.duration}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right md:text-center md:my-3 flex-shrink-0">
                      <div className="flex items-baseline gap-1 md:justify-center">
                        <span className="text-[9px] md:text-[10px] text-green-400 font-semibold">UGX</span>
                        <span className="text-xl md:text-2xl font-extrabold text-green-400 tracking-tight">
                          {plan.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Features — hidden on mobile, shown on desktop */}
                    <div className="hidden md:block space-y-1.5 mb-4">
                      {FEATURES.map((f) => (
                        <div key={f} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${accent.bg} flex items-center justify-center flex-shrink-0`}>
                            <Check className={`w-2.5 h-2.5 ${accent.text}`} />
                          </div>
                          <span className="text-[10px] text-muted-foreground">{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA — inline on mobile, full width on desktop */}
                    <button
                      className={`px-5 py-2 md:w-full md:py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex-shrink-0 ${
                        isPopular
                          ? `bg-gradient-to-r ${accent.gradient} text-white shadow-md hover:shadow-lg hover:opacity-90`
                          : `${accent.bg} ${accent.text} hover:opacity-80`
                      }`}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features summary — shown on mobile */}
        <div className="md:hidden mb-8">
          <div className="bg-card/60 border border-border/40 rounded-2xl p-4">
            <p className="text-xs font-bold text-foreground mb-3">All plans include:</p>
            <div className="grid grid-cols-2 gap-2">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-[11px] text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-3 h-3 text-green-500" />
            </div>
            Secure Payment
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary" />
            </div>
            Instant Access
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Star className="w-3 h-3 text-amber-500" />
            </div>
            MTN & Airtel Money
          </div>
        </div>
      </div>
    </div>
  );
}
