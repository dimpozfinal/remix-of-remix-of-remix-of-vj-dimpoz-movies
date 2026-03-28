// Download limit tracking for 30 Min Pass subscribers
// Limits: max 3 series episodes + 1 movie per subscription session

const STORAGE_KEY = "download_tracker";

interface DownloadTracker {
  planId: string;
  subscriptionStart: string;
  movieDownloads: string[]; // content IDs
  episodeDownloads: string[]; // "contentId-S1E2" format
}

function getTracker(): DownloadTracker | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveTracker(tracker: DownloadTracker) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tracker));
}

export function resetTracker(planId: string, subscriptionStart: string) {
  saveTracker({ planId, subscriptionStart, movieDownloads: [], episodeDownloads: [] });
}

export function getDownloadCounts(): { movies: number; episodes: number; maxMovies: number; maxEpisodes: number } {
  const tracker = getTracker();
  if (!tracker) return { movies: 0, episodes: 0, maxMovies: 1, maxEpisodes: 3 };
  return {
    movies: tracker.movieDownloads.length,
    episodes: tracker.episodeDownloads.length,
    maxMovies: 1,
    maxEpisodes: 3,
  };
}

export function canDownload(type: "movie" | "episode"): boolean {
  const tracker = getTracker();
  if (!tracker || tracker.planId !== "30min") return true; // No limits for other plans
  if (type === "movie") return tracker.movieDownloads.length < 1;
  return tracker.episodeDownloads.length < 3;
}

export function recordDownload(type: "movie" | "episode", contentId: string) {
  const tracker = getTracker();
  if (!tracker || tracker.planId !== "30min") return;
  if (type === "movie") {
    if (!tracker.movieDownloads.includes(contentId)) {
      tracker.movieDownloads.push(contentId);
    }
  } else {
    if (!tracker.episodeDownloads.includes(contentId)) {
      tracker.episodeDownloads.push(contentId);
    }
  }
  saveTracker(tracker);
}

export function isThirtyMinPlan(planId: string | undefined): boolean {
  return planId === "30min";
}
