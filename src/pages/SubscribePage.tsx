import { Crown, Zap, Star, ArrowLeft, Sparkles, Shield, Check, Clock, X } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-context";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PLAN_META = [
  { icon: Clock, label: "Mini" },
  { icon: Zap, label: "Quick" },
  { icon: Star, label: "Popular", popular: true },
  { icon: Sparkles, label: "Value" },
  { icon: Crown, label: "Best" },
];

export default function SubscribePage() {
  const navigate = useNavigate();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-[560px]">
        {/* Main card container */}
        <div className="rounded-3xl border border-border/40 bg-card/80 backdrop-blur-2xl shadow-2xl shadow-background/40 overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight">
                Subscribe to Download
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Unlimited HD downloads &middot; Powered by Relworx
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Plans grid */}
          <div className="px-6 pb-2 grid grid-cols-2 gap-3">
            {SUBSCRIPTION_PLANS.map((plan, i) => {
              const meta = PLAN_META[i] || PLAN_META[0];
              const isPopular = meta.popular;
              const isHovered = hoveredIdx === i;

              return (
                <div
                  key={plan.id}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="relative"
                >
                  {isPopular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                      <span className="px-2.5 py-0.5 bg-primary text-primary-foreground text-[9px] font-black rounded-full uppercase tracking-wider">
                        Popular
                      </span>
                    </div>
                  )}

                  <div
                    className={`relative h-full rounded-2xl border overflow-hidden transition-all duration-300 ${
                      isPopular
                        ? "border-primary/40 bg-gradient-to-b from-primary/8 to-card/60"
                        : isHovered
                        ? "border-border/60 bg-card/70"
                        : "border-border/30 bg-card/40"
                    }`}
                  >
                    <div className="p-4 flex flex-col h-full">
                      {/* Plan name */}
                      <h3 className="text-foreground font-bold text-sm mb-0.5">
                        {plan.name.replace(" Pass", "").replace("12 Hours", "12 Hours")}
                      </h3>
                      <p className="text-[10px] text-muted-foreground mb-3">{plan.duration}</p>

                      {/* Price */}
                      <div className="mb-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-foreground">
                            {plan.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-primary font-semibold">UGX</span>
                        </div>
                      </div>

                      {/* Download info */}
                      <p className="text-[10px] text-primary font-medium mb-4">
                        {plan.id === "12hr"
                          ? "10 Limited Downloads"
                          : "Unlimited Downloads"}
                      </p>

                      {/* CTA */}
                      <button
                        className={`w-full py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 mt-auto ${
                          isPopular || isHovered
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        Subscribe to Download
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 text-center border-t border-border/20 mt-2">
            <p className="text-[10px] text-muted-foreground">
              Secure payment via Relworx &middot; MTN / Airtel / Visa
            </p>
          </div>
        </div>

        {/* Trust bar below */}
        <div className="flex flex-wrap items-center justify-center gap-5 mt-5">
          {[
            { icon: Shield, label: "Secure Payment" },
            { icon: Zap, label: "Instant Access" },
            { icon: Star, label: "MTN & Airtel" },
          ].map(({ icon: TIcon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
              <TIcon className="w-3 h-3 text-primary" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
