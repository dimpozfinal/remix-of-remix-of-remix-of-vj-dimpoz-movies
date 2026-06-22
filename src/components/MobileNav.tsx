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
      <div className="flex items-center justify-around gap-1.5 px-2 py-2 mx-2 mb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeFilter === item.filter;
          return (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className="relative flex flex-col items-center gap-0.5 flex-1 py-2 px-1 rounded-2xl transition-all duration-200"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, hsl(var(--primary) / 0.22), hsl(var(--primary) / 0.08))"
                  : "hsl(var(--card) / 0.85)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: isActive
                  ? "1px solid hsl(var(--primary) / 0.55)"
                  : "1px solid hsl(var(--border) / 0.3)",
                boxShadow: isActive
                  ? "0 4px 16px hsl(var(--primary) / 0.3)"
                  : "0 2px 10px hsl(var(--background) / 0.5)",
              }}
            >
              <Icon
                className={`w-[18px] h-[18px] transition-all duration-200 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                strokeWidth={isActive ? 2.4 : 1.7}
              />
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
            className="relative flex flex-col items-center gap-0.5 flex-1 py-2 px-1 rounded-2xl"
            style={{
              background: "hsl(var(--card) / 0.85)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid hsl(var(--border) / 0.3)",
              boxShadow: "0 2px 10px hsl(var(--background) / 0.5)",
            }}
          >
            <Shield className="w-[18px] h-[18px] text-muted-foreground" strokeWidth={1.7} />
            <span className="text-[9px] font-semibold text-muted-foreground">Admin</span>
          </button>
        )}
      </div>
    </div>

  );
}
