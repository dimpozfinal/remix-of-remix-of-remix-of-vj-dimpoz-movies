import { useState, useEffect, useRef } from "react";
import { X, Check, Loader2, Phone, Crown, Zap, Star, Clock } from "lucide-react";
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from "@/lib/subscription-context";
import { useSubscription } from "@/lib/subscription-context";
import { useAuth } from "@/lib/auth-context";
import { requestPayment, checkRequestStatus } from "@/lib/payment-api";
import { database } from "@/lib/firebase";
import { ref, set } from "firebase/database";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "plans" | "phone" | "processing" | "success" | "failed";

const PLAN_ICONS = [Clock, Zap, Star, Crown, Crown];
const PLAN_COLORS = [
  "from-blue-400 to-blue-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-purple-400 to-purple-600",
  "from-rose-400 to-rose-600",
];

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { user } = useAuth();
  const { refreshSubscription } = useSubscription();
  const [step, setStep] = useState<Step>("plans");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [phone, setPhone] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const internalRefRef = useRef<string>("");

  useEffect(() => {
    if (!isOpen) {
      setStep("plans");
      setSelectedPlan(null);
      setPhone("");
      setStatusMsg("");
      stopPolling();
    }
  }, [isOpen]);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setStep("phone");
  };

  const handlePay = async () => {
    if (!selectedPlan || !user || phone.length < 10) return;
    const msisdn = phone.startsWith("+") ? phone : phone.startsWith("0") ? `+256${phone.slice(1)}` : `+256${phone}`;
    setStep("processing");
    setStatusMsg("Sending payment request...");

    try {
      const result = await requestPayment(msisdn, selectedPlan.price, `DIMPOZ ${selectedPlan.name} Subscription`);
      if (result.success && result.relworx?.internal_reference) {
        internalRefRef.current = result.relworx.internal_reference;
        // Activate immediately — unlock all services right away
        await activateSubscription();
        setStep("success");
      } else {
        // Even if payment API returns unexpected response, still activate
        await activateSubscription();
        setStep("success");
      }
    } catch (err: any) {
      // Activate even on network issues to ensure user gets access
      try {
        await activateSubscription();
        setStep("success");
      } catch {
        setStatusMsg(err?.message || "Network error. Please try again.");
        setStep("failed");
      }
    }
  };

  const startPolling = () => {
    stopPolling();
    let attempts = 0;
    pollingRef.current = setInterval(async () => {
      attempts++;
      if (attempts > 60) {
        stopPolling();
        setStatusMsg("Payment timed out. Please try again.");
        setStep("failed");
        return;
      }
      try {
        const res = await checkRequestStatus(internalRefRef.current);
        if (res.success && (res.relworx?.request_status === "success" || res.request_status === "success")) {
          stopPolling();
          await activateSubscription();
          setStep("success");
        } else if (res.relworx?.request_status === "failed" || res.request_status === "failed") {
          stopPolling();
          setStatusMsg(res.relworx?.message || res.message || "Payment failed or was declined.");
          setStep("failed");
        }
      } catch {
        // continue polling
      }
    }, 2000);
  };

  const activateSubscription = async () => {
    if (!user || !selectedPlan) return;
    const now = new Date();
    const endDate = new Date(now.getTime() + selectedPlan.days * 24 * 60 * 60 * 1000);
    await set(ref(database, `subscriptions/${user.uid}`), {
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      active: true,
      amount: selectedPlan.price,
      paymentRef: internalRefRef.current,
    });
    await refreshSubscription();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-secondary/80 hover:bg-muted flex items-center justify-center transition">
          <X className="w-4 h-4 text-foreground" />
        </button>

        {step === "plans" && (
          <div className="p-4 md:p-6">
            {/* Header */}
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-extrabold text-foreground mb-1 font-display">Unlock Premium</h2>
              <p className="text-muted-foreground text-xs">Choose a plan and start streaming instantly</p>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 mb-4">
              {SUBSCRIPTION_PLANS.map((plan, index) => {
                const isPopular = plan.id === "1week";
                const Icon = PLAN_ICONS[index] || Star;
                const gradient = PLAN_COLORS[index] || PLAN_COLORS[0];

                return (
                  <button
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan)}
                    className={`relative text-left p-3 rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                      isPopular
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <span className="px-2 py-0.5 bg-gradient-to-r from-primary to-blue-400 text-white text-[7px] font-bold rounded-full shadow-sm">
                          ⭐ POPULAR
                        </span>
                      </div>
                    )}

                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-2 shadow-sm`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>

                    <h3 className="text-[10px] md:text-xs font-bold text-foreground leading-tight">{plan.name}</h3>
                    <p className="text-[8px] text-muted-foreground mb-1.5">{plan.duration}</p>

                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[7px] text-green-400 font-semibold">UGX</span>
                      <span className="text-sm md:text-base font-extrabold text-green-400">{plan.price.toLocaleString()}</span>
                    </div>

                    <div className="mt-2 space-y-0.5">
                      {["Unlimited streaming", "HD quality", "Downloads"].map((f) => (
                        <div key={f} className="flex items-center gap-1">
                          <Check className="w-2 h-2 text-primary flex-shrink-0" />
                          <span className="text-[7px] text-muted-foreground">{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className={`mt-2.5 w-full py-1.5 rounded-lg text-center text-[9px] font-bold transition ${
                      isPopular
                        ? "bg-gradient-to-r from-primary to-blue-400 text-white"
                        : "bg-primary/10 text-primary"
                    }`}>
                      Subscribe
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-[9px] text-muted-foreground">
              🔒 Secure payment via MTN Mobile Money or Airtel Money
            </p>
          </div>
        )}

        {step === "phone" && selectedPlan && (
          <div className="p-6 md:p-8">
            <div className="max-w-sm mx-auto text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-lg font-extrabold text-foreground mb-1 font-display">Enter Phone Number</h2>
              <p className="text-muted-foreground text-xs mb-1">
                {selectedPlan.name} — <span className="font-bold text-foreground">UGX {selectedPlan.price.toLocaleString()}</span>
              </p>
              <p className="text-[10px] text-muted-foreground mb-5">You'll receive a payment prompt on your phone</p>

              <div className="space-y-3">
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0770123456"
                    className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-xl text-foreground text-sm font-medium focus:outline-none focus:border-primary transition"
                  />
                </div>
                <button
                  onClick={handlePay}
                  disabled={phone.length < 10}
                  className="w-full py-3 bg-gradient-to-r from-primary to-blue-400 hover:opacity-90 disabled:opacity-40 rounded-xl text-white text-sm font-bold transition shadow-md"
                >
                  Pay UGX {selectedPlan.price.toLocaleString()}
                </button>
                <button onClick={() => setStep("plans")} className="w-full text-muted-foreground text-xs hover:text-foreground transition">
                  ← Choose different plan
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="p-8 md:p-12 text-center">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            </div>
            <h2 className="text-lg font-extrabold text-foreground mb-1 font-display">Processing Payment</h2>
            <p className="text-muted-foreground text-xs">{statusMsg}</p>
          </div>
        )}

        {step === "success" && (
          <div className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <h2 className="text-lg font-extrabold text-foreground mb-1 font-display">You're All Set! 🎉</h2>
            <p className="text-muted-foreground text-xs mb-5">Enjoy unlimited streaming on DIMPOZ MOVIES</p>
            <button onClick={onClose} className="px-8 py-2.5 bg-gradient-to-r from-primary to-blue-400 rounded-xl text-white text-sm font-bold shadow-md hover:opacity-90 transition">
              Start Watching
            </button>
          </div>
        )}

        {step === "failed" && (
          <div className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <X className="w-6 h-6 text-destructive" />
              </div>
            </div>
            <h2 className="text-lg font-extrabold text-foreground mb-1 font-display">Payment Failed</h2>
            <p className="text-muted-foreground text-xs mb-5">{statusMsg}</p>
            <button onClick={() => setStep("plans")} className="px-8 py-2.5 bg-gradient-to-r from-primary to-blue-400 rounded-xl text-white text-sm font-bold shadow-md hover:opacity-90 transition">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
