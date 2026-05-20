import { Crown, Zap, Star, ArrowLeft, Sparkles, Shield, Check, Clock } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-context";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PLAN_META = [
  { icon: Clock, label: "Mini", tone: "from-red-500 to-rose-600" },
  { icon: Zap, label: "Quick", tone: "from-red-600 to-amber-500" },
  { icon: Star, label: "Popular", tone: "from-amber-400 to-red-600", popular: true },
  { icon: Sparkles, label: "Value", tone: "from-red-500 to-yellow-500" },
  { icon: Crown, label: "Best", tone: "from-yellow-400 to-red-600" },
];

const PERKS = [
  "Unlimited streaming",
  "HD & 4K quality",
  "All movies & series",
  "Premium access",
];

export default function SubscribePage() {
  const navigate = useNavigate();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-accent/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[300px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-12">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 md:mb-10 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Premium Access</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground mb-3 tracking-tight">
            Choose Your <span className="gradient-text">Plan</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Stream unlimited movies. Pay with MTN or Airtel Money.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 mb-10">
          {SUBSCRIPTION_PLANS.map((plan, i) => {
            const meta = PLAN_META[i] || PLAN_META[0];
            const Icon = meta.icon;
            const isHovered = hoveredIdx === i;
            const isPopular = meta.popular;

            return (
              <div
                key={plan.id}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`relative group transition-all duration-500 ${
                  isHovered ? "-translate-y-2" : ""
                } ${isPopular ? "lg:-translate-y-1" : ""}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-[9px] font-black rounded-full shadow-lg shadow-primary/40 uppercase tracking-wider whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                <div
                  className={`relative h-full rounded-2xl border backdrop-blur-xl overflow-hidden transition-all duration-500 ${
                    isPopular
                      ? "border-primary/50 bg-gradient-to-b from-primary/10 to-card/60"
                      : isHovered
                      ? "border-primary/30 bg-card/70"
                      : "border-border/50 bg-card/40"
                  }`}
                  style={{
                    boxShadow: isPopular || isHovered
                      ? "0 20px 50px -10px hsl(var(--primary) / 0.35), 0 0 30px hsl(var(--primary) / 0.15)"
                      : "0 4px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  {/* Top gradient accent */}
                  <div className={`h-[3px] w-full bg-gradient-to-r ${meta.tone}`} />

                  <div className="p-4 md:p-5 flex flex-col h-full">
                    {/* Icon + label */}
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.tone} flex items-center justify-center shadow-lg shadow-primary/30`}
                      >
                        <Icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        {meta.label}
                      </span>
                    </div>

                    {/* Plan name */}
                    <h3 className="text-foreground font-bold text-base md:text-lg mb-1">{plan.name}</h3>
                    <p className="text-muted-foreground text-xs mb-4">{plan.duration} access</p>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl md:text-3xl font-black text-foreground">
                          {plan.price.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-xs font-medium">UGX</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {plan.days >= 1
                          ? `${Math.round(plan.price / plan.days).toLocaleString()} UGX / day`
                          : `${plan.duration} access`}
                      </p>
                    </div>

                    {/* Perks */}
                    <ul className="space-y-1.5 mb-5 flex-1">
                      {(() => {
                        const downloadPerk =
                          plan.id === "12hr"
                            ? "5 downloads total"
                            : plan.id === "3days"
                            ? "10 downloads / day"
                            : "Unlimited downloads";
                        const perks = [PERKS[0], PERKS[1], downloadPerk];
                        return perks.map((perk) => (
                          <li key={perk} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Check className="w-3 h-3 text-primary flex-shrink-0" />
                            {perk}
                          </li>
                        ));
                      })()}
                    </ul>

                    {/* CTA */}
                    <button
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                        isPopular || isHovered
                          ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/40"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 py-4 border-t border-border/30">
          {[
            { icon: Shield, label: "Secure Payment" },
            { icon: Zap, label: "Instant Access" },
            { icon: Star, label: "MTN & Airtel" },
            { icon: Sparkles, label: "Cancel Anytime" },
          ].map(({ icon: TIcon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-muted-foreground text-[11px] sm:text-xs">
              <TIcon className="w-3.5 h-3.5 text-primary" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
