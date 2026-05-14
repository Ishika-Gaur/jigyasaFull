"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";

const API = "http://localhost:4000/api";

export default function BlogDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxImg, setLightboxImg] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        let fetchedAll = [];
        try {
          const resAll = await fetch(`${API}/blogs`);
          if (resAll.ok) fetchedAll = await resAll.json();
          setAllPosts(fetchedAll);
        } catch (e) {
          console.warn("Failed to fetch all posts", e);
        }

        let targetUrl = `${API}/blogs/${slug}`;
        if (!slug && fetchedAll.length) {
          targetUrl = `${API}/blogs/${fetchedAll[0].slug || fetchedAll[0].id}`;
        }

        const resPost = await fetch(targetUrl);
        if (!resPost.ok) throw new Error(`Server returned HTTP ${resPost.status}`);
        const postData = await resPost.json();
        setPost(postData);
      } catch (err) {
        setError(err.message || "Failed to load blog post.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const slugify = (t) =>
    t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const readingTime = (content) => {
    if (!content) return "1 min read";
    const stripped = content.replace(/<[^>]*>/g, "");
    const words = stripped.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 200));
    return `${mins} min read`;
  };

  const renderArticleContent = () => {
    if (!post) return null;

    if (Array.isArray(post.sections) && post.sections.length > 0) {
      return post.sections.map((sec, idx) => {
        const id = sec.id || slugify(sec.heading || `section-${idx}`);
        return (
          <div key={idx} className="mb-6">
            {sec.heading && (
              <h2
                id={id}
                className={`font-serif text-2xl font-bold text-[#1a1a2e] mb-4 pl-4 border-l-4 border-[#00b5ad] leading-snug ${idx === 0 ? "mt-0" : "mt-10"}`}
              >
                {sec.heading}
              </h2>
            )}
            {sec.subheading && (
              <h3 className="font-serif text-lg font-bold text-[#1a1a2e] mt-7 mb-3">
                {sec.subheading}
              </h3>
            )}
            {sec.body && (
              <p className="text-[1.08rem] text-[#2d3748] mb-4 leading-[1.9]">
                {sec.body}
              </p>
            )}
            {Array.isArray(sec.items) && sec.items.length > 0 && (
              <ul className="pl-6 mb-4 list-disc">
                {sec.items.map((it, i) => (
                  <li key={i} className="text-[1.08rem] text-[#2d3748] mb-2.5 leading-[1.8]">
                    {it}
                  </li>
                ))}
              </ul>
            )}
            {sec.divider && (
              <hr className="border-none border-t-2 border-dashed border-[#e2e8f0] my-10" />
            )}
          </div>
        );
      });
    } else if (post.content) {
      return (
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      );
    } else if (post.excerpt) {
      return (
        <p className="text-[1.15rem] text-[#374151] leading-[1.85] border-l-4 border-[#00b5ad] px-5 py-4 mb-7 italic bg-[#f0fdfa] rounded-r-xl">
          {post.excerpt}
        </p>
      );
    } else {
      return (
        <p className="text-gray-400 italic">No content available for this post.</p>
      );
    }
  };

  const initials = post?.author ? post.author.charAt(0).toUpperCase() : "A";

  const AppointmentForm = () => (
    <form
      action="https://formsubmit.co/ishikalalitgaur521@gmail.com"
      method="POST"
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="_subject" value={`New Appointment Request from Blog: ${post?.title}`} />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      <input
        type="hidden"
        name="_next"
        value={`${typeof window !== "undefined" ? window.location.origin : ""}/thanku`}
      />
      <input type="text" name="_honey" className="hidden" />
      <input type="hidden" name="Source" value={`Blog: ${post?.title}`} />

      <div>
        <label className="block text-[0.9rem] font-semibold text-[#374151] mb-1.5">Full Name *</label>
        <input
          type="text"
          name="Full Name"
          required
          placeholder="Enter your full name"
          className="bd-input w-full px-3.5 py-2.5 rounded-[9px] border-[1.5px] border-[#e2e8f0] text-[0.97rem] outline-none transition-all duration-200 text-[#1a1a2e] bg-[#fafffe] placeholder-[#b0c4c2] box-border"
        />
      </div>

      <div>
        <label className="block text-[0.9rem] font-semibold text-[#374151] mb-1.5">Email *</label>
        <input
          type="email"
          name="Email"
          required
          placeholder="your.email@example.com"
          className="bd-input w-full px-3.5 py-2.5 rounded-[9px] border-[1.5px] border-[#e2e8f0] text-[0.97rem] outline-none transition-all duration-200 text-[#1a1a2e] bg-[#fafffe] placeholder-[#b0c4c2] box-border"
        />
      </div>

      <div>
        <label className="block text-[0.9rem] font-semibold text-[#374151] mb-1.5">Phone *</label>
        <input
          type="tel"
          name="Phone"
          required
          placeholder="+91 XXXXXXXXXX"
          pattern="[0-9]{10}"
          title="Please enter a valid 10-digit phone number"
          className="bd-input w-full px-3.5 py-2.5 rounded-[9px] border-[1.5px] border-[#e2e8f0] text-[0.97rem] outline-none transition-all duration-200 text-[#1a1a2e] bg-[#fafffe] placeholder-[#b0c4c2] box-border"
        />
      </div>

      <div>
        <label className="block text-[0.9rem] font-semibold text-[#374151] mb-1.5">Reason for Visit</label>
        <textarea
          name="Reason for Visit"
          placeholder="Brief description of your health concern..."
          className="bd-input w-full px-3.5 py-2.5 rounded-[9px] border-[1.5px] border-[#e2e8f0] text-[0.97rem] outline-none resize-y min-h-[88px] transition-all duration-200 text-[#1a1a2e] bg-[#fafffe] placeholder-[#b0c4c2] box-border"
        />
      </div>

      <button
        type="submit"
        className="w-full text-white py-3.5 rounded-[10px] font-bold text-[1rem] border-none cursor-pointer mt-1.5 tracking-[0.3px] transition-all duration-200 hover:opacity-90 hover:-translate-y-px"
        style={{
          background: "linear-gradient(135deg, #064e3b 0%, #0f766e 50%, #00b5ad 100%)",
          boxShadow: "0 4px 16px rgba(0,181,173,0.3)",
        }}
      >
        Book Appointment
      </button>
    </form>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Source+Sans+3:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Merriweather', serif !important; }
        .bd-root { font-family: 'Source Sans 3', sans-serif; }
        .bd-input:focus { border-color: #00b5ad; box-shadow: 0 0 0 3px rgba(0,181,173,0.1); }

        #article-body h2 { font-family: 'Merriweather', serif; font-size: 1.5rem; font-weight: 700; color: #1a1a2e; margin-top: 2.5rem; margin-bottom: 1rem; padding-left: 1rem; border-left: 4px solid #00b5ad; line-height: 1.4; }
        #article-body h2:first-of-type { margin-top: 0; }
        #article-body h3 { font-family: 'Merriweather', serif; font-size: 1.15rem; font-weight: 700; color: #1a1a2e; margin-top: 1.75rem; margin-bottom: 0.75rem; }
        #article-body p { font-size: 1.08rem; color: #2d3748; margin-bottom: 1rem; line-height: 1.9; }
        #article-body ul { padding-left: 1.5rem; margin-bottom: 1rem; list-style: disc; }
        #article-body li { font-size: 1.08rem; color: #2d3748; margin-bottom: 0.625rem; line-height: 1.8; }

        /* ── DESKTOP: sidebar visible, FAB hidden ── */
        .bd-sidebar-desktop { display: block; }
        .bd-fab { display: none; }
        .bd-modal-overlay { display: none; }

        /* ── TABLET (≤960px): single column, sidebar hidden, FAB shown ── */
        @media (max-width: 960px) {
          .bd-grid { grid-template-columns: 1fr !important; }
          .bd-sidebar-desktop { display: none !important; }
          .bd-fab { display: flex !important; }
          .bd-article { padding: 32px 28px !important; }
        }

        /* ── MOBILE (≤540px) ── */
        @media (max-width: 540px) {
          .bd-article { padding: 20px 16px !important; }
          .bd-hero-title { font-size: 1.5rem !important; }
          .bd-hero-meta { font-size: 0.82rem !important; flex-wrap: wrap; gap: 4px; }
          .bd-grid-wrap { padding: 24px 4% !important; }
        }

        /* ── MODAL ── */
        .bd-modal-overlay {
          position: fixed; inset: 0; z-index: 9998;
          background: rgba(13,27,42,0.55);
          backdrop-filter: blur(4px);
          align-items: flex-end;
          justify-content: center;
        }
        .bd-modal-overlay.open { display: flex !important; }
        .bd-modal-box {
          background: #fff;
          border-radius: 20px 20px 0 0;
          padding: 28px 24px 36px;
          width: 100%;
          max-width: 480px;
          max-height: 92vh;
          overflow-y: auto;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.34,1.2,0.64,1);
        }
        .bd-modal-overlay.open .bd-modal-box {
          transform: translateY(0);
        }

        /* FAB pulse ring */
        @keyframes fab-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(0,181,173,0.5); }
          70%  { box-shadow: 0 0 0 12px rgba(0,181,173,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,181,173,0); }
        }
        .bd-fab { animation: fab-pulse 2.2s infinite; }
      `}</style>

      <div className="bd-root min-h-screen bg-[#f7f8fa] text-[#1a1a2e] leading-7">

        {/* ── LOADING ── */}
        {loading && (
          <div className="flex justify-center py-32">
            <div className="w-11 h-11 border-4 border-gray-200 border-t-[#00b5ad] rounded-full animate-spin" />
          </div>
        )}

        {/* ── ERROR ── */}
        {!loading && error && (
          <div className="max-w-[1320px] mx-auto px-[5%] py-11">
            <div className="bg-red-50 border border-red-200 border-l-4 border-l-red-500 rounded-xl p-6 text-red-700 text-[1.05rem]">
              <strong>⚠ Error Loading Blog</strong>
              <p className="mt-2">{error}</p>
              <button
                onClick={() => router.push("/blog")}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white border-none px-5 py-2.5 rounded-md cursor-pointer text-[0.95rem] transition-colors"
              >
                ← Go Back to Blogs
              </button>
            </div>
          </div>
        )}

        {/* ── MAIN ── */}
        {!loading && !error && post && (
          <>
            {/* ── HERO ── */}
            <header
              className="relative overflow-hidden text-center min-h-[240px] flex flex-col items-center justify-center bg-[#0d1b2a] bg-cover bg-center"
              style={{
                padding: "70px 5% 56px",
                backgroundImage: post.coverImage ? `url(${API}/blogs/${post.id}/cover)` : "none",
              }}
            >
              <div
                className="absolute inset-0 z-0"
                style={{
                  background: "linear-gradient(135deg, rgba(13,27,42,0.88) 0%, rgba(26,58,74,0.72) 50%, rgba(13,43,53,0.88) 100%)",
                }}
              />
              <div className="relative z-10 flex flex-col items-center px-4">
                <span className="inline-block bg-[#00b5ad] text-white text-[0.78rem] font-bold tracking-widest uppercase px-[18px] py-1.5 rounded-full mb-5">
                  {post.category || "Blog"}
                </span>
                <h1
                  className="bd-hero-title font-serif font-bold text-white leading-snug max-w-3xl mx-auto mb-4"
                  style={{ fontSize: "clamp(1.45rem, 4vw, 2.8rem)" }}
                >
                  {post.title || "Untitled"}
                </h1>
                <p className="bd-hero-meta text-white/60 text-[0.92rem] flex items-center justify-center gap-1 flex-wrap">
                  <span>By <strong className="text-[#00b5ad]">{post.author || "Admin"}</strong></span>
                  <span className="mx-1.5 opacity-40">·</span>
                  {post.createdAt && <span>{formatDate(post.createdAt)}</span>}
                  <span className="mx-1.5 opacity-40">·</span>
                  <span>{readingTime(post.content || post.excerpt)}</span>
                </p>
              </div>
            </header>

            {/* ── LAYOUT ── */}
            <div
              className="bd-grid bd-grid-wrap max-w-[1320px] mx-auto gap-10 items-start"
              style={{
                padding: "40px 3% 40px 2%",
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 320px",
              }}
            >
              {/* ── LEFT ── */}
              <main className="min-w-0">
                {/* Category Bar */}
                <div className="flex gap-2 flex-wrap mb-6">
                  <button
                    className="px-5 py-1.5 rounded-full border-2 border-[#00b5ad] bg-[#00b5ad] text-white text-[0.87rem] font-bold cursor-pointer transition-all hover:opacity-90"
                    onClick={() => router.push("/blog")}
                  >
                    All
                  </button>
                  {post.category && (
                    <button className="px-5 py-1.5 rounded-full border-2 border-[#00b5ad] bg-transparent text-[#00b5ad] text-[0.87rem] font-bold cursor-pointer transition-all hover:bg-[#00b5ad] hover:text-white">
                      {post.category}
                    </button>
                  )}
                </div>

                {/* Article */}
                <article
                  className="bd-article bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.07)] min-h-[200px]"
                  style={{ padding: "44px 48px 44px 36px" }}
                  id="article-body"
                >
                  {renderArticleContent()}

                  {/* Author Box */}
                  <div className="flex items-center gap-4 bg-[#f7f8fa] rounded-xl px-5 py-5 mt-10">
                    <div className="w-[56px] h-[56px] rounded-full bg-[#00b5ad] text-white text-[1.3rem] font-bold font-serif flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {post.authorAvatar ? (
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : initials}
                    </div>
                    <div>
                      <div className="font-bold text-[1.05rem]">{post.author || "Admin"}</div>
                      <div className="text-[0.92rem] text-[#555] mt-0.5">{post.authorRole || post.category || "Author"}</div>
                    </div>
                  </div>
                </article>
              </main>

              {/* ── RIGHT: DESKTOP SIDEBAR ── */}
              <aside className="bd-sidebar-desktop self-start sticky top-[44px]">
                <div className="bg-white rounded-2xl p-7 shadow-[0_2px_18px_rgba(0,0,0,0.07)]" style={{ marginTop: "60px" }}>
                  <h2 className="font-serif text-[1.25rem] font-extrabold text-[#1a1a2e] mb-5 pb-3 border-b-2 border-[#e2f4f2]">
                    Book Appointment
                  </h2>
                  <AppointmentForm />
                </div>
              </aside>
            </div>

            {/* ── FAB (mobile/tablet only) ── */}
            <button
              className="bd-fab fixed bottom-6 right-5 z-[999] items-center gap-2 bg-[#00b5ad] text-white font-bold text-[0.95rem] px-5 py-3.5 rounded-full border-none cursor-pointer shadow-lg"
              style={{ boxShadow: "0 6px 24px rgba(0,181,173,0.45)" }}
              onClick={() => setFormOpen(true)}
            >
              📅 Book Appointment
            </button>

            {/* ── MODAL (mobile/tablet) ── */}
            <div
              className={`bd-modal-overlay ${formOpen ? "open" : ""}`}
              onClick={() => setFormOpen(false)}
            >
              <div
                className="bd-modal-box"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Handle bar */}
                <div className="w-10 h-1 bg-[#e2e8f0] rounded-full mx-auto mb-5" />

                <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-[#e2f4f2]">
                  <h2 className="font-serif text-[1.2rem] font-extrabold text-[#1a1a2e]">
                    Book Appointment
                  </h2>
                  <button
                    onClick={() => setFormOpen(false)}
                    className="text-[#888] hover:text-[#1a1a2e] text-[1.4rem] leading-none border-none bg-transparent cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <AppointmentForm />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-black/[0.88] z-[9999] flex items-center justify-center p-5 cursor-zoom-out"
          onClick={() => setLightboxImg(null)}
        >
          <img
            src={lightboxImg}
            alt="Enlarged"
            className="max-w-full max-h-[90vh] rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </>
  );
}