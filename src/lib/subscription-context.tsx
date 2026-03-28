import React, { createContext, useContext, useEffect, useState } from "react";
import { database } from "./firebase";
import { ref, get, set } from "firebase/database";
import { useAuth } from "./auth-context";

export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: string;
  price: number;
  days: number;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { id: "30min", name: "30 Min Pass", duration: "30 Minutes", price: 3000, days: 0.02083 },
  { id: "3days", name: "3 Days Pass", duration: "3 Days", price: 5000, days: 3 },
  { id: "1week", name: "1 Week Pass", duration: "1 Week", price: 10000, days: 7 },
  { id: "2weeks", name: "2 Weeks Pass", duration: "2 Weeks", price: 15000, days: 14 },
  { id: "1month", name: "1 Month Pass", duration: "1 Month", price: 25000, days: 30 },
];

interface Subscription {
  planId: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  hasActiveSubscription: boolean;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  currentPlanId: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const subscriptionRef = ref(database, `subscriptions/${user.uid}`);
      const snapshot = await get(subscriptionRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const endDate = new Date(data.endDate);
        const now = new Date();

        if (endDate > now) {
          setSubscription({ ...data, active: true });
        } else {
          await set(subscriptionRef, { ...data, active: false });
          setSubscription({ ...data, active: false });
        }
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user?.uid]);

  const hasActiveSubscription = (() => {
    if (!subscription) return false;
    if (!subscription.active) return false;
    const endDate = new Date(subscription.endDate);
    return endDate > new Date();
  })();

  const currentPlanId = subscription?.planId || null;

  return (
    <SubscriptionContext.Provider
      value={{ subscription, hasActiveSubscription, loading, refreshSubscription: checkSubscription, currentPlanId }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
