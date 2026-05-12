// Download limit tracking (legacy — no active plans use limits)

const STORAGE_KEY = "download_tracker";

interface DownloadTracker {
  planId: string;
  subscriptionStart: string;
  movieDownloads: string[];
  episodeDownloads: string[];
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
  if (!tracker) return { movies: 0, episodes: 0, maxMovies: 0, maxEpisodes: 0 };
  return {
    movies: tracker.movieDownloads.length,
    episodes: tracker.episodeDownloads.length,
    maxMovies: 0,
    maxEpisodes: 0,
  };
}

export function canDownload(_type: "movie" | "episode"): boolean {
  return true;
}

export function recordDownload(_type: "movie" | "episode", _contentId: string) {
  // No limits — all plans have unlimited downloads
}

export function isThirtyMinPlan(planId: string | undefined): boolean {
  return planId === "30min";
}
