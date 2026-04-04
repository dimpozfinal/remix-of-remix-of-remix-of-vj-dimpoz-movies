import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { database } from "@/lib/firebase";
import { ref as dbRef, get, onValue } from "firebase/database";
import { Card } from "@/components/ui/card";
import { Shield, Film, Tv, Music, Image, Users, BarChart3, Wallet, Activity, ArrowLeft, TrendingUp, Navigation, Globe, Home, Star, Search, Eye } from "lucide-react";
import AdminPasswordGate from "@/components/AdminPasswordGate";
import AdminChangePassword from "@/components/AdminChangePassword";

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ movies: 0, series: 0, users: 0 });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      const fetchStats = async () => {
        try {
          const [moviesSnap, seriesSnap, usersSnap] = await Promise.all([
            get(dbRef(database, "movies")),
            get(dbRef(database, "series")),
            get(dbRef(database, "users")),
          ]);
          setStats({
            movies: moviesSnap.exists() ? Object.keys(moviesSnap.val()).length : 0,
            series: seriesSnap.exists() ? Object.keys(seriesSnap.val()).length : 0,
            users: usersSnap.exists() ? Object.keys(usersSnap.val()).length : 0,
          });
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      };
      fetchStats();
    }
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const totalContent = stats.movies + stats.series;

  const statCards = [
    { label: "Total Movies", value: stats.movies, icon: Film, color: "from-blue-500/20 to-blue-600/10" },
    { label: "Total Series", value: stats.series, icon: Tv, color: "from-violet-500/20 to-violet-600/10" },
    { label: "Total Users", value: stats.users, icon: Users, color: "from-emerald-500/20 to-emerald-600/10" },
    { label: "All Content", value: totalContent, icon: TrendingUp, color: "from-amber-500/20 to-amber-600/10" },
  ];

  const adminLinks = [
    { label: "Movies", icon: Film, href: "/admin/movies", desc: "Add, edit, or delete movies" },
    { label: "Series", icon: Tv, href: "/admin/series", desc: "Add series with episodes" },
    { label: "Music", icon: Music, href: "/admin/music", desc: "Upload and manage music videos" },
    { label: "Animation", icon: Image, href: "/admin/animation", desc: "Manage animation content" },
    { label: "Carousel", icon: Image, href: "/admin/carousel", desc: "Update featured carousel" },
    { label: "Users", icon: Users, href: "/admin/users", desc: "View registered users" },
    { label: "Wallet", icon: Wallet, href: "/admin/wallet", desc: "View balance & withdraw" },
    { label: "Activity", icon: Activity, href: "/admin/activity", desc: "Real-time analytics & activity" },
  ];

  return (
    <AdminPasswordGate>
      <div className="min-h-screen bg-background">
        {/* Top Bar */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground text-xs">DIMPOZ MOVIES Control Panel</p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className={`p-5 bg-gradient-to-br ${stat.color} border-border/50 relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-background/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-foreground/70" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Management</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="group p-4 bg-card border border-border/50 rounded-xl hover:border-primary/50 hover:bg-card/80 transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <h3 className="text-foreground font-semibold text-sm">{link.label}</h3>
                    <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{link.desc}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Security Section */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Security</h2>
            <AdminChangePassword />
          </div>
        </div>
      </div>
    </AdminPasswordGate>
  );
}
