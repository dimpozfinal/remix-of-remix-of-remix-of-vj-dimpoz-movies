import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { trackNavigation } from "@/lib/track-navigation";

const routeToSection: Record<string, string> = {
  "/": "home",
  "/search": "search",
  "/settings": "settings",
  "/subscribe": "subscribe",
  "/login": "login",
};

function getSection(pathname: string): string {
  if (routeToSection[pathname]) return routeToSection[pathname];
  if (pathname.startsWith("/play/")) return "play";
  if (pathname.startsWith("/admin")) return "admin";
  return pathname.replace("/", "") || "home";
}

export default function RouteTracker() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const section = getSection(location.pathname);
    // Skip tracking admin pages
    if (section === "admin") return;
    trackNavigation(user.uid, section, user.email || undefined);
  }, [location.pathname, user]);

  return null;
}
