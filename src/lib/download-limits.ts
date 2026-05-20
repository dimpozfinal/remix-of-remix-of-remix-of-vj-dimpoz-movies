// Download limit tracking per plan
// 12hr plan: 5 downloads total for the period
// 2-day plan (3days id): 10 downloads per day

const STORAGE_KEY = "download_tracker_v2";

interface DownloadTracker {
  planId: string;
  subscriptionStart: string;
  // unique content ids downloaded during the subscription
  downloads: string[];
  // per-day counts: { "YYYY-MM-DD": [contentIds...] }
  daily: Record<string, string[]>;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getTracker(): DownloadTracker | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveTracker(t: DownloadTracker) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
}

export function resetTracker(planId: string, subscriptionStart: string) {
  saveTracker({ planId, subscriptionStart, downloads: [], daily: {} });
}

function ensureTracker(planId: string): DownloadTracker {
  let t = getTracker();
  if (!t || t.planId !== planId) {
    t = { planId, subscriptionStart: new Date().toISOString(), downloads: [], daily: {} };
    saveTracker(t);
  }
  if (!t.daily) t.daily = {};
  return t;
}

export interface LimitInfo {
  used: number;
  max: number;
  scope: "total" | "daily";
  remaining: number;
}

export function getLimitInfo(planId: string | undefined | null): LimitInfo | null {
  if (!planId) return null;
  if (planId === "12hr") {
    const t = ensureTracker(planId);
    const used = t.downloads.length;
    return { used, max: 5, scope: "total", remaining: Math.max(0, 5 - used) };
  }
  if (planId === "3days") {
    const t = ensureTracker(planId);
    const key = todayKey();
    const used = (t.daily[key] || []).length;
    return { used, max: 10, scope: "daily", remaining: Math.max(0, 10 - used) };
  }
  return null; // unlimited
}

export function canDownload(planId: string | undefined | null, contentId: string): { ok: boolean; reason?: string; info?: LimitInfo } {
  const info = getLimitInfo(planId);
  if (!info) return { ok: true };
  // allow re-download of already-counted items
  if (planId === "12hr") {
    const t = ensureTracker(planId!);
    if (t.downloads.includes(contentId)) return { ok: true, info };
  } else if (planId === "3days") {
    const t = ensureTracker(planId!);
    if ((t.daily[todayKey()] || []).includes(contentId)) return { ok: true, info };
  }
  if (info.remaining <= 0) {
    const reason = info.scope === "daily"
      ? `Daily download limit reached (${info.max}/day). Try again tomorrow or upgrade your plan.`
      : `Download limit reached (${info.max} for this plan). Upgrade to download more.`;
    return { ok: false, reason, info };
  }
  return { ok: true, info };
}

export function recordDownload(planId: string | undefined | null, contentId: string) {
  if (!planId) return;
  if (planId === "12hr") {
    const t = ensureTracker(planId);
    if (!t.downloads.includes(contentId)) {
      t.downloads.push(contentId);
      saveTracker(t);
    }
  } else if (planId === "3days") {
    const t = ensureTracker(planId);
    const key = todayKey();
    t.daily[key] = t.daily[key] || [];
    if (!t.daily[key].includes(contentId)) {
      t.daily[key].push(contentId);
      saveTracker(t);
    }
  }
}

export function isThirtyMinPlan(_planId: string | undefined): boolean {
  return false;
}
