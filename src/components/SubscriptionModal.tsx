import { useState, useEffect, useRef } from "react";
import { X, Check, Loader2, Phone, Crown, Zap, Star, Clock, Sparkles, Shield } from "lucide-react";
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
  "from-red-500 to-red-700",
  "from-red-600 to-red-800",
  "from-red-500 to-red-700",
  "from-red-600 to-red-800",
  "from-red-500 to-red-700",
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
      const result = await requestPayment(msisdn, selectedPlan.price, `LUO CINEMA ${selectedPlan.name} Subscription`);
      const internalRef = result?.internal_reference || result?.relworx?.internal_reference;
      if (result?.success && internalRef) {
        internalRefRef.current = internalRef;
        // Log pending transaction for admin
        try {
          await set(ref(database, `transactions/${internalRef}`), {
            userId: user.uid,
            userEmail: user.email || "",
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            amount: selectedPlan.price,
            msisdn,
            referenceId: internalRef,
            status: "pending",
            timestamp: new Date().toISOString(),
          });
        } catch (e) { console.error("log tx error", e); }
        setStatusMsg("Payment prompt sent! Waiting for confirmation...");
        startPolling();
      } else {
        setStatusMsg(result?.message || result?.relworx?.message || "Failed to initiate payment. Please try again.");
        setStep("failed");
      }
    } catch (err: any) {
      setStatusMsg(err?.message || "Network error. Please try again.");
      setStep("failed");
    }
  };

  const startPolling = () => {
    stopPolling();
    let attempts = 0;
    pollingRef.current = setInterval(async () => {
      attempts++;
      if (attempts > 90) {
        stopPolling();
        setStatusMsg("Payment timed out. Please try again.");
        setStep("failed");
        return;
      }
      try {
        const res = await checkRequestStatus(internalRefRef.current);
        console.log("Payment status poll:", res);
        const status = res.request_status || res.status || res.relworx?.request_status || res.relworx?.status;
        const finalize = async (finalStatus: string, message?: string) => {
          try {
            await set(ref(database, `transactions/${internalRefRef.current}/status`), finalStatus);
            if (message) await set(ref(database, `transactions/${internalRefRef.current}/message`), message);
          } catch {}
        };
        if (status === "success") {
          stopPolling();
          await finalize("successful");
          setStatusMsg("Payment confirmed! Activating subscription...");
          await activateSubscription();
          setStep("success");
        } else if (status === "failed" || status === "cancelled") {
          stopPolling();
          await finalize("failed", res.message);
          setStatusMsg(res.message || res.relworx?.message || "Payment failed or was declined.");
          setStep("failed");
        } else {
          setStatusMsg(`Waiting for payment confirmation... (${attempts})`);
        }
      } catch {
        // continue polling on network errors
      }
    }, 1000);
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
        className="relative w-full max-w-[560px] max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "plans" && (
          <div className="relative">
            {/* Subtle background glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative rounded-3xl border border-border/40 bg-card/90 backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-foreground tracking-tight font-display">
                    Subscribe to Download
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Unlimited HD downloads · Powered by Relworx
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Plans grid */}
              <div className="px-6 pb-2 grid grid-cols-2 gap-3">
                {SUBSCRIPTION_PLANS.map((plan, i) => {
                  const isPopular = plan.id === "1week";

                  return (
                    <button
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan)}
                      className="relative text-left group"
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
                            ? "border-primary/40 bg-gradient-to-b from-primary/10 to-card/60"
                            : "border-border/30 bg-card/40 group-hover:border-border/60 group-hover:bg-card/70"
                        }`}
                      >
                        <div className="p-4 flex flex-col h-full">
                          <h3 className="text-foreground font-bold text-sm mb-0.5">
                            {plan.name.replace(" Pass", "")}
                          </h3>
                          <p className="text-[10px] text-muted-foreground mb-3">{plan.duration}</p>

                          <div className="mb-3">
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-black text-foreground">
                                {plan.price.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-primary font-semibold">UGX</span>
                            </div>
                          </div>

                          <p className="text-[10px] text-primary font-medium mb-4">
                            {plan.id === "12hr" ? "10 Limited Downloads" : "Unlimited Downloads"}
                          </p>

                          <div
                            className={`w-full py-2.5 rounded-xl text-[11px] font-bold text-center transition-all duration-300 mt-auto ${
                              isPopular
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                : "bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                            }`}
                          >
                            Subscribe to Download
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 text-center border-t border-border/20 mt-2">
                <p className="text-[10px] text-muted-foreground">
                  Secure payment via Relworx · MTN / Airtel / Visa
                </p>
              </div>
            </div>

            {/* Trust bar */}
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
        )}

        {step !== "plans" && (
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl">
            <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-secondary/80 hover:bg-muted flex items-center justify-center transition">
              <X className="w-4 h-4 text-foreground" />
            </button>



        {step === "phone" && selectedPlan && (
          <div className="p-6 md:p-8">
            <div className="max-w-sm mx-auto text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Phone className="w-7 h-7 text-primary-foreground" />
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
                  className="w-full py-3 bg-primary hover:opacity-90 disabled:opacity-40 rounded-xl text-primary-foreground text-sm font-bold transition shadow-md"
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
            <p className="text-muted-foreground text-xs mb-5">Enjoy unlimited streaming on LUO CINEMA</p>
            <button onClick={onClose} className="px-8 py-2.5 bg-primary rounded-xl text-primary-foreground text-sm font-bold shadow-md hover:opacity-90 transition">
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
            <button onClick={() => setStep("plans")} className="px-8 py-2.5 bg-primary rounded-xl text-primary-foreground text-sm font-bold shadow-md hover:opacity-90 transition">
              Try Again
            </button>
          </div>
        )}
          </div>
        )}
      </div>

    </div>
  );
}
