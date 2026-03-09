import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { database } from "@/lib/firebase";
import { ref as dbRef, get } from "firebase/database";
import { Card } from "@/components/ui/card";
import { Shield, Film, Tv, Music, Image, Users, BarChart3, Wallet, Activity } from "lucide-react";
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

  const adminLinks = [
    { label: "Manage Movies", icon: Film, href: "/admin/movies", desc: "Add, edit, or delete movies" },
    { label: "Manage Series", icon: Tv, href: "/admin/series", desc: "Add series with episodes" },
    { label: "Manage Music", icon: Music, href: "/admin/music", desc: "Upload and manage music videos" },
    { label: "Manage Animation", icon: Image, href: "/admin/animation", desc: "Manage animation content" },
    { label: "Manage Carousel", icon: Image, href: "/admin/carousel", desc: "Update featured carousel" },
    { label: "Manage Users", icon: Users, href: "/admin/users", desc: "View registered users" },
    { label: "Wallet", icon: Wallet, href: "/admin/wallet", desc: "View balance & withdraw" },
    { label: "User Activity", icon: Activity, href: "/admin/activity", desc: "Real-time analytics & activity" },
  ];

  return (
    <AdminPasswordGate>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground text-sm">Manage your DIMPOZ MOVIES platform</p>
              </div>
            </div>
            <Link to="/" className="text-primary hover:underline text-sm">← Back to Home</Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center gap-3">
                <Film className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.movies}</p>
                  <p className="text-xs text-muted-foreground">Movies</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center gap-3">
                <Tv className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.series}</p>
                  <p className="text-xs text-muted-foreground">Series</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.users}</p>
                  <p className="text-xs text-muted-foreground">Users</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Admin Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="p-5 bg-card border border-border rounded-xl hover:border-primary transition group"
                >
                  <Icon className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition" />
                  <h3 className="text-foreground font-bold text-sm mb-1">{link.label}</h3>
                  <p className="text-muted-foreground text-xs">{link.desc}</p>
                </Link>
              );
            })}
          </div>

          {/* Change Password Section */}
          <AdminChangePassword />
        </div>
      </div>
    </AdminPasswordGate>
  );
}
