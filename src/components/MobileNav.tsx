import { Home, Film, Tv, Music, Star, CreditCard, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useNavigate, useLocation } from "react-router-dom";

interface MobileNavProps {
  onFilterChange?: (filter: string) => void;
  activeFilter?: string;
  onShowSubscription?: () => void;
}

export default function MobileNav({ onFilterChange, activeFilter = "home", onShowSubscription }: MobileNavProps) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", filter: "home", path: "/" },
    { icon: Film, label: "Movies", filter: "movies", path: "/" },
    { icon: Tv, label: "Series", filter: "series", path: "/" },
    { icon: Music, label: "Music", filter: "music", path: "/" },
    { icon: Star, label: "Top", filter: "top-rated", path: "/" },
    { icon: CreditCard, label: "Plans", filter: "subscription", path: "modal" },
  ];

  const handleClick = (item: typeof navItems[0]) => {
    if (item.path === "modal") { onShowSubscription?.(); return; }
    if (item.path === "/" && location.pathname === "/") {
      onFilterChange?.(item.filter);
    } else if (item.path !== "/") {
      navigate(item.path);
    } else {
      navigate("/");
      setTimeout(() => onFilterChange?.(item.filter), 100);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 pb-[env(safe-area-inset-bottom)]">
      <div
        className="flex items-center justify-around px-1 py-2 mx-3 mb-2 rounded-2xl"
        style={{
          background: "hsl(var(--card) / 0.9)",
          backdropFilter: "blur(24px) saturate(200%)",
          WebkitBackdropFilter: "blur(24px) saturate(200%)",
          border: "1px solid hsl(var(--border) / 0.3)",
          boxShadow: "0 -4px 30px hsl(var(--background) / 0.5)",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeFilter === item.filter;
          return (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className="relative flex flex-col items-center gap-0.5 flex-1 py-1 transition-all duration-200"
            >
              {isActive && (
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full"
                  style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(217 91% 70%))" }}
                />
              )}
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${
                  isActive ? "scale-105" : ""
                }`}
                style={isActive ? { background: "hsl(var(--primary) / 0.12)" } : {}}
              >
                <Icon
                  className={`w-[18px] h-[18px] transition-all duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.6}
                />
              </div>
              <span
                className={`text-[9px] font-semibold transition-all duration-200 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="relative flex flex-col items-center gap-0.5 flex-1 py-1"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl">
              <Shield className="w-[18px] h-[18px] text-muted-foreground" strokeWidth={1.6} />
            </div>
            <span className="text-[9px] font-semibold text-muted-foreground">Admin</span>
          </button>
        )}
      </div>
    </div>
  );
}
