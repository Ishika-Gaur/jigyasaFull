"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Footer from "@/components/Footer";
import {
  Images, Video, LogOut, Loader2, Stethoscope, Activity,
  TrendingUp, Users, Film, ImageIcon,
  LayoutDashboard, ChevronRight,
  Trash2, Menu, X, BookOpen, PenSquare,
} from "lucide-react";

const API = "http://localhost:4000/api";

// ── FIX: Single source of truth for all route paths ──
const ROUTES = {
  gallery:   "/admin/auth/gallery",
  video:     "/admin/auth/video",
  doctors:   "/admin/auth/doctors",
  blog:      "/admin/auth/blog",       // folder name: admin/auth/blog
  dashboard: "/admin/auth/dashboard",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);
  const [stats, setStats] = useState({ videos: 0, photos: 0, doctors: 0, blogs: 0 });

  const [allVideos, setAllVideos] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);

  const [activityFilter, setActivityFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/auth/me`, { withCredentials: true });
        setAdmin(res.data.admin);
      } catch {
        router.push("/admin");
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosRes, photosRes, doctorsRes, blogsRes] = await Promise.allSettled([
          axios.get(`${API}/videos`),
          axios.get(`${API}/gallery`),
          axios.get(`${API}/doctors`),
          axios.get(`${API}/blogs`),   // ── FIX: plural /blogs ──
        ]);
        const videos  = videosRes.status  === "fulfilled" ? videosRes.value.data  : [];
        const photos  = photosRes.status  === "fulfilled" ? photosRes.value.data  : [];
        const doctors = doctorsRes.status === "fulfilled" ? doctorsRes.value.data : [];
        const blogs   = blogsRes.status   === "fulfilled" ? blogsRes.value.data   : [];
        setAllVideos(videos);
        setAllPhotos(photos);
        setAllDoctors(doctors);
        setAllBlogs(blogs);
        setStats({ videos: videos.length, photos: photos.length, doctors: doctors.length, blogs: blogs.length });
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    };
    if (!checking) fetchData();
  }, [checking]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch {}
    router.push("/admin");
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { id, type } = confirmDelete;
    setDeletingId(id);
    try {
      const endpointMap = {
        video:  `${API}/videos/${id}`,
        photo:  `${API}/gallery/${id}`,
        doctor: `${API}/doctors/${id}`,
        blog:   `${API}/blogs/${id}`,   // ── FIX: plural /blogs ──
      };
      await axios.delete(endpointMap[type], { withCredentials: true });
      if (type === "video")  { setAllVideos(prev  => prev.filter(v => v._id !== id)); setStats(prev => ({ ...prev, videos:  prev.videos  - 1 })); }
      if (type === "photo")  { setAllPhotos(prev  => prev.filter(p => p._id !== id)); setStats(prev => ({ ...prev, photos:  prev.photos  - 1 })); }
      if (type === "doctor") { setAllDoctors(prev => prev.filter(d => d._id !== id)); setStats(prev => ({ ...prev, doctors: prev.doctors - 1 })); }
      if (type === "blog")   { setAllBlogs(prev   => prev.filter(b => b._id !== id)); setStats(prev => ({ ...prev, blogs:   prev.blogs   - 1 })); }
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const activityItems = [
    ...allVideos.map(v  => ({ ...v,  type: "video"  })),
    ...allPhotos.map(p  => ({ ...p,  type: "photo"  })),
    ...allDoctors.map(d => ({ ...d,  type: "doctor" })),
    ...allBlogs.map(b   => ({ ...b,  type: "blog"   })),
  ];

  const filteredActivities =
    activityFilter === "all"
      ? activityItems
      : activityItems.filter(item => item.type === activityFilter);

  const typeConfig = {
    video:  { label: "Video",  color: "#7c3aed", light: "#f5f3ff" },
    photo:  { label: "Photo",  color: "#0d9488", light: "#f0fdfa" },
    doctor: { label: "Doctor", color: "#0369a1", light: "#f0f9ff" },
    blog:   { label: "Blog",   color: "#d97706", light: "#fffbeb" },
  };

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <Loader2 style={{ color: "#14b8a6" }} size={28} className="animate-spin" />
      </div>
    );
  }

  // ── FIX: All hrefs now use ROUTES constant — one place to change ──
  const quickActions = [
    { label: "Upload Photo", desc: "Add new photos to gallery",  icon: ImageIcon,  href: ROUTES.gallery,   color: "#0d9488", bg: "linear-gradient(135deg, #f0fdfa, #ccfbf1)", border: "rgba(13,148,136,0.2)"  },
    { label: "Upload Video", desc: "Add new videos to gallery",  icon: Film,       href: ROUTES.video,     color: "#7c3aed", bg: "linear-gradient(135deg, #f5f3ff, #ede9fe)", border: "rgba(124,58,237,0.2)" },
    { label: "Add Doctor",   desc: "Register a new doctor",      icon: Users,      href: ROUTES.doctors,   color: "#0369a1", bg: "linear-gradient(135deg, #f0f9ff, #e0f2fe)", border: "rgba(3,105,161,0.2)"  },
    { label: "Write Blog",   desc: "Publish a new blog post",    icon: PenSquare,  href: ROUTES.blog,      color: "#d97706", bg: "linear-gradient(135deg, #fffbeb, #fef3c7)", border: "rgba(217,119,6,0.2)"  },
  ];

  const navItems = [
    { label: "Dashboard",    icon: LayoutDashboard, href: ROUTES.dashboard, active: true  },
    { label: "Photo Gallery",icon: Images,          href: ROUTES.gallery,   active: false },
    { label: "Video Gallery",icon: Video,           href: ROUTES.video,     active: false },
    { label: "Doctors",      icon: Stethoscope,     href: ROUTES.doctors,   active: false },
    { label: "Blogs",        icon: BookOpen,        href: ROUTES.blog,      active: false }, // ── FIX: was /admin/auth/blogs (plural mismatch) ──
  ];

  const SidebarContent = () => (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36, padding: "0 8px" }}>
        <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #0d9488, #14b8a6)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(13,148,136,0.35)", flexShrink: 0 }}>
          <Activity color="white" size={20} />
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", lineHeight: 1.2 }}>Jigyasa</p>
          <p style={{ fontSize: 11, color: "#14b8a6", fontWeight: 600, letterSpacing: 0.3 }}>Super Speciality</p>
        </div>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map(({ label, icon: Icon, href, active }) => (
          <Link key={label} href={href} onClick={() => setSidebarOpen(false)} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 12, textDecoration: "none",
            fontSize: 13, fontWeight: active ? 600 : 500,
            color: active ? "#0d9488" : "#64748b",
            background: active ? "linear-gradient(135deg, #f0fdfa, #ccfbf1)" : "transparent",
            border: active ? "1px solid rgba(13,148,136,0.15)" : "1px solid transparent",
            transition: "all 0.2s",
          }}>
            <Icon size={16} />{label}
          </Link>
        ))}
      </nav>

      {admin && (
        <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 14px", border: "1px solid #f1f5f9", marginTop: 16 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #0d9488, #14b8a6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
            {admin.name?.charAt(0).toUpperCase()}
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{admin.name}</p>
          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{admin.email}</p>
        </div>
      )}
    </>
  );

  return (
    <>
      <style>{`
        .admin-layout {
          min-height: 100vh;
          display: flex;
          background: #f8fafc;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
        }

        .sidebar {
          width: 240px;
          background: white;
          border-right: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          padding: 28px 16px;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          z-index: 40;
          transition: transform 0.3s ease;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            transform: translateX(-100%);
            box-shadow: 4px 0 24px rgba(0,0,0,0.12);
          }
          .sidebar.open { transform: translateX(0); }
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 39;
          backdrop-filter: blur(2px);
        }
        @media (max-width: 768px) {
          .sidebar-overlay.visible { display: block; }
        }

        .main-col { flex: 1; display: flex; flex-direction: column; min-width: 0; }

        .dashboard-header {
          background: white;
          border-bottom: 1px solid #f1f5f9;
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
          flex-shrink: 0;
        }
        @media (max-width: 768px) { .dashboard-header { padding: 14px 16px; } }

        .hamburger-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          cursor: pointer;
          margin-right: 10px;
          flex-shrink: 0;
        }
        @media (max-width: 768px) { .hamburger-btn { display: flex; } }

        .main-content { flex: 1; padding: 32px; }
        @media (max-width: 768px) { .main-content { padding: 20px 16px; } }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }
        @media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; } }
        @media (max-width: 480px)  { .stats-grid { grid-template-columns: 1fr; gap: 10px; margin-bottom: 20px; } }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        @media (max-width: 1100px) { .actions-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; } }
        @media (max-width: 480px)  { .actions-grid { grid-template-columns: 1fr; gap: 10px; margin-bottom: 20px; } }

        .filter-tabs {
          display: flex; gap: 6px;
          padding: 12px 16px;
          border-bottom: 1px solid #f8fafc;
          background: #fafffe;
          flex-wrap: wrap;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 480px) { .filter-tabs { flex-wrap: nowrap; padding: 10px 12px; } }

        .activity-item-name { font-size: 13px; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        @media (max-width: 480px) { .activity-item-name { font-size: 12px; } }

        .delete-modal {
          background: white; border-radius: 20px; padding: 32px 28px;
          width: 360px; max-width: calc(100vw - 32px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        @media (max-width: 480px) { .delete-modal { padding: 24px 20px; border-radius: 16px; } }

        .section-heading { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px; letter-spacing: -0.2px; }
        @media (max-width: 480px) { .section-heading { font-size: 14px; margin-bottom: 10px; } }

        .stat-card { background: white; border-radius: 16px; padding: 24px 28px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        @media (max-width: 480px) { .stat-card { padding: 16px 18px; border-radius: 12px; } }

        .action-desc { font-size: 12px; color: #94a3b8; margin-top: 2px; }
        @media (max-width: 360px) { .action-desc { display: none; } }

        .logout-text { display: inline; }
        @media (max-width: 400px) { .logout-text { display: none; } }
      `}</style>

      <div className="admin-layout">

        {/* Mobile overlay */}
        <div className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`} onClick={() => setSidebarOpen(false)} />

        {/* ── Sidebar ── */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <SidebarContent />
        </aside>

        {/* ── Main ── */}
        <div className="main-col">

          {/* Header */}
          <header className="dashboard-header">
            <div style={{ display: "flex", alignItems: "center" }}>
              <button className="hamburger-btn" onClick={() => setSidebarOpen(prev => !prev)} aria-label="Toggle menu">
                {sidebarOpen ? <X size={18} color="#64748b" /> : <Menu size={18} color="#64748b" />}
              </button>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", letterSpacing: -0.3 }}>Dashboard</h1>
                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Welcome back, {admin?.name} 👋</p>
              </div>
            </div>
            <button onClick={handleLogout} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 18px", background: "#fff1f2", color: "#ef4444",
              border: "1px solid #fecaca", borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0,
            }}>
              <LogOut size={15} />
              <span className="logout-text">Logout</span>
            </button>
          </header>

          <main className="main-content">

            {/* Stats */}
            <div className="stats-grid">
              {[
                { label: "Total Videos",  value: stats.videos,  icon: Film,      color: "#7c3aed", light: "#f5f3ff", border: "#ede9fe" },
                { label: "Total Photos",  value: stats.photos,  icon: ImageIcon, color: "#0d9488", light: "#f0fdfa", border: "#ccfbf1" },
                { label: "Total Doctors", value: stats.doctors, icon: Users,     color: "#0369a1", light: "#f0f9ff", border: "#e0f2fe" },
                { label: "Total Blogs",   value: stats.blogs,   icon: BookOpen,  color: "#d97706", light: "#fffbeb", border: "#fef3c7" },
              ].map(({ label, value, icon: Icon, color, light, border }) => (
                <div key={label} className="stat-card" style={{ border: `1px solid ${border}` }}>
                  <div style={{ width: 52, height: 52, background: light, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={24} color={color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{value}</p>
                    <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4, fontWeight: 500 }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <h2 className="section-heading">Quick Actions</h2>
            <div className="actions-grid">
              {quickActions.map(({ label, desc, icon: Icon, href, color, bg, border }) => (
                <Link key={label} href={href} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: "22px 24px", textDecoration: "none", display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ width: 46, height: 46, background: "white", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${color}22`, flexShrink: 0 }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{label}</p>
                    <p className="action-desc">{desc}</p>
                  </div>
                  <ChevronRight size={16} color="#cbd5e1" style={{ flexShrink: 0 }} />
                </Link>
              ))}
            </div>

            {/* All Activities */}
            <div style={{ paddingBottom: 32 }}>
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", display: "flex", flexDirection: "column" }}>

                <div style={{ padding: "18px 24px", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", gap: 10 }}>
                  <TrendingUp size={18} color="#0d9488" />
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", flex: 1 }}>All Activities</p>
                  <span style={{ fontSize: 11, background: "#f0fdfa", color: "#0d9488", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>
                    {filteredActivities.length} items
                  </span>
                </div>

                <div className="filter-tabs">
                  {[
                    { id: "all",    label: "All"     },
                    { id: "video",  label: "Videos"  },
                    { id: "photo",  label: "Photos"  },
                    { id: "doctor", label: "Doctors" },
                    { id: "blog",   label: "Blogs"   },
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setActivityFilter(tab.id)} style={{
                      fontSize: 11, fontWeight: 600, padding: "5px 14px", borderRadius: 20,
                      cursor: "pointer", border: "1.5px solid", transition: "all 0.18s",
                      background:   activityFilter === tab.id ? "#0d9488" : "white",
                      color:        activityFilter === tab.id ? "white"   : "#64748b",
                      borderColor:  activityFilter === tab.id ? "#0d9488" : "#e2e8f0",
                      flexShrink: 0, whiteSpace: "nowrap",
                    }}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div>
                  {filteredActivities.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, padding: "28px 0" }}>Nothing here yet</p>
                  ) : (
                    filteredActivities.map((item) => {
                      const cfg  = typeConfig[item.type];
                      const name = item.title || item.name || "Untitled";
                      const sub  = item.category || item.specialization || item.author || "";
                      const isDeleting = deletingId === item.id;

                      return (
                        <div
                          key={`${item.type}-${item.id}`}
                          style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", borderBottom: "1px solid #f8fafc", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          {/* Thumbnail */}
                          <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", background: cfg.light, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {item.type === "video" && (
                              <img src={`${API}/videos/${item.id}/thumbnail`} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} alt="" />
                            )}
                            {item.type === "photo" && (
                              <img src={`${API}/gallery/${item.id}/featured`} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} alt="" />
                            )}
                            {item.type === "doctor" && (
                              <span style={{ fontSize: 16, fontWeight: 700, color: cfg.color }}>
                                {name.charAt(0).toUpperCase()}
                              </span>
                            )}
                            {item.type === "blog" && (
                              item.coverImage
                                // ── FIX: was /api/blog/ (singular) — now /api/blogs/ (plural) ──
                                ? <img src={`${API}/blogs/${item.id}/cover`} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} alt="" />
                                : <BookOpen size={18} color={cfg.color} />
                            )}
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p className="activity-item-name">{name}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 10, fontWeight: 700, background: cfg.light, color: cfg.color, padding: "2px 7px", borderRadius: 10 }}>
                                {cfg.label}
                              </span>
                              {sub && <span style={{ fontSize: 11, color: "#94a3b8", textTransform: "capitalize" }}>{sub}</span>}
                            </div>
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() => setConfirmDelete({ id: item.id, type: item.type, name })}
                            disabled={isDeleting}
                            title="Delete"
                            style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #fecaca", background: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.18s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.querySelector("svg").style.color = "white"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#fff1f2"; e.currentTarget.style.borderColor = "#fecaca"; e.currentTarget.querySelector("svg").style.color = "#ef4444"; }}
                          >
                            {isDeleting
                              ? <Loader2 size={14} color="#ef4444" className="animate-spin" />
                              : <Trash2   size={14} color="#ef4444" />
                            }
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Confirm Delete Modal */}
        {confirmDelete && (
          <div
            onClick={() => setConfirmDelete(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)", padding: "16px" }}
          >
            <div onClick={e => e.stopPropagation()} className="delete-modal">
              <div style={{ width: 54, height: 54, background: "#fff1f2", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Trash2 size={26} color="#ef4444" />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Delete this item?</p>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                  <strong style={{ color: "#0f172a" }}>"{confirmDelete.name}"</strong> will be permanently deleted. This cannot be undone.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, width: "100%" }}>
                <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "white", fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer" }}>
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!!deletingId}
                  style={{ flex: 1, padding: "11px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #ef4444, #dc2626)", fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: deletingId ? 0.7 : 1 }}
                >
                  {deletingId ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}