import { database } from "./firebase";
import { ref as dbRef, push, serverTimestamp } from "firebase/database";

export function trackNavigation(userId: string, section: string, userEmail?: string) {
  if (!userId || !section) return;
  const navRef = dbRef(database, "navigation_activity");
  push(navRef, {
    userId,
    userEmail: userEmail || "",
    section,
    timestamp: new Date().toISOString(),
  }).catch((err) => console.error("Track nav error:", err));
}
