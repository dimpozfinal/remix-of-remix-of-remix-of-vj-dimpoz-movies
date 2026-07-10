import { useEffect, useState } from "react";
import { X, Sparkles, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/subscription-context";

// Plans that qualify as "Agent of the Week" (1 week or longer)
const AGENT_PLANS = new Set(["1week", "2weeks", "1month", "6month"]);
// Short plan that gets the upgrade nudge
const MEMBER_PLAN = "3days";

const SHOWN_KEY_PREFIX = "agent_banner_shown_";

export default function AgentBanner({ onUpgrade }: { onUpgrade?: () => void }) {
  const { user } = useAuth();
  const { subscription, hasActiveSubscription, currentPlanId } = useSubscription();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"agent" | "member" | null>(null);

  useEffect(() => {
    if (!user || !hasActiveSubscription || !currentPlanId) return;

    let nextMode: "agent" | "member" | null = null;
    if (AGENT_PLANS.has(currentPlanId)) nextMode = "agent";
    else if (currentPlanId === MEMBER_PLAN) nextMode = "member";
    if (!nextMode) return;

    // Show once per subscription period (keyed by plan + endDate)
    const key = `${SHOWN_KEY_PREFIX}${user.uid}_${currentPlanId}_${subscription?.endDate || ""}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    const showTimer = setTimeout(() => {
      setMode(nextMode);
      setVisible(true);
    }, 1200);

    return () => clearTimeout(showTimer);
  }, [user, hasActiveSubscription, currentPlanId, subscription?.endDate]);

  useEffect(() => {
    if (visible && mode === "agent") {
      const t = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(t);
    }
  }, [visible, mode]);

  if (!visible || !mode) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-md px-2 pointer-events-none">
      <div
        className="pointer-events-auto relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-background via-card to-background p-4 shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6),0_0_60px_-10px_hsl(var(--primary)/0.4)] animate-scale-in"
        style={{ animation: "scale-in 0.35s ease-out, wa-bounce 0.9s ease-in-out 0.35s" }}
      >
        {/* Glowing accent orb */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />

        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/60 hover:bg-background flex items-center justify-center transition z-10"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5 text-foreground" />
        </button>

        <div className="relative flex items-start gap-3">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.6)]">
            {mode === "agent" ? (
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            ) : (
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0 pr-6">
            {mode === "agent" ? (
              <>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary mb-0.5">
                  ⭐ Agent of the Week
                </p>
                <h3 className="text-sm font-bold text-foreground leading-tight">
                  Congratulations!
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  You've qualified as an Agent of the Week. Enjoy premium access on LUO CINEMA.
                </p>
              </>
            ) : (
              <>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary mb-0.5">
                  💚 Thanks for being a member
                </p>
                <h3 className="text-sm font-bold text-foreground leading-tight">
                  Upgrade to qualify as an Agent
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  Move up to a 1 Week plan or higher and become an Agent of the Week.
                </p>
                <button
                  onClick={() => {
                    setVisible(false);
                    onUpgrade?.();
                  }}
                  className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold hover:opacity-90 transition shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                >
                  Upgrade Now
                </button>
              </>
            )}
          </div>
        </div>

        {/* Progress bar for auto-dismiss (agent mode) */}
        {mode === "agent" && (
          <div className="relative mt-3 h-0.5 rounded-full bg-primary/10 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/40"
              style={{ animation: "agent-progress 5s linear forwards" }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes agent-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
