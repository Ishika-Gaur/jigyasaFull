"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import Footer from "@/components/Footer";

const API = "http://localhost:4000/api";

const Blog = ({ children }) => {
  const pathname = usePathname();
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [galleryImages, setGalleryImages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const isBlogIndex = pathname === "/blog";

  // ── Check if logged-in user is admin ──
  useEffect(() => {
    axios.get(`${API}/auth/me`, { withCredentials: true })
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false));
  }, []);

  // ── Fetch blog posts from backend ──
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API}/blogs`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // ── Fetch gallery images from backend ──
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${API}/gallery`);
        setGalleryImages(res.data.slice(0, 6));
      } catch {
        setGalleryImages([
          { id: "1", src: "/gallery1.png", alt: "Gallery 1", static: true },
          { id: "2", src: "/gallery2.png", alt: "Gallery 2", static: true },
          { id: "3", src: "/gallery3.png", alt: "Gallery 3", static: true },
          { id: "4", src: "/gallery4.png", alt: "Gallery 4", static: true },
          { id: "5", src: "/gallery6.png", alt: "Gallery 5", static: true },
        ]);
      }
    };
    fetchGallery();
  }, []);

  // ── Delete blog (admin only) ──
  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API}/blogs/${id}`, { withCredentials: true });
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete blog.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Derived categories from fetched posts ──
  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter(p => p.category === activeCategory);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .delete-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: rgba(239, 68, 68, 0.92);
          color: white;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          transition: all 0.2s;
          backdrop-filter: blur(4px);
        }
        .delete-btn:hover {
          background: #dc2626;
          transform: scale(1.1);
          box-shadow: 0 4px 14px rgba(220,38,38,0.45);
        }
        .delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .delete-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        .admin-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 10;
          background: rgba(0,0,0,0.55);
          color: #fbbf24;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 100px;
          backdrop-filter: blur(4px);
          font-family: system-ui, sans-serif;
        }
      `}</style>

      <div className="flex flex-row flex-wrap py-10 px-[5%] gap-8 bg-white max-md:flex-col">

        {/* ── Left: Blog List or Blog Detail ── */}
        <div className="flex-[2] flex flex-col gap-4">
          {isBlogIndex && (
            <>
              <h1 className="text-3xl font-bold mb-2 text-[#111827]">Latest Blog Posts</h1>

              {/* ── Category Filter Tabs ── */}
              {!loading && categories.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${activeCategory === cat
                          ? "bg-[#00b5ad] text-white border-[#00b5ad] shadow"
                          : "bg-white text-[#00b5ad] border-[#00b5ad] hover:bg-[#00b5ad] hover:text-white"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Loading State ── */}
              {loading && (
                <div className="grid grid-cols-2 gap-8 mb-8 max-md:grid-cols-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-5 border border-[#ddd] rounded-lg bg-[#fafafa] animate-pulse">
                      <div className="h-3 bg-gray-200 rounded w-1/4 mb-3" />
                      <div className="h-5 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                      <div className="h-[160px] bg-gray-200 rounded-lg mb-3" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                    </div>
                  ))}
                </div>
              )}

              {/* ── Empty State ── */}
              {!loading && filteredPosts.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-5xl mb-4">📝</p>
                  <p className="text-lg font-semibold">No blog posts yet</p>
                  <p className="text-sm mt-1">Check back soon for updates!</p>
                </div>
              )}

              {/* ── Blog List Grid ── */}
              {!loading && filteredPosts.length > 0 && (
                <div className="grid grid-cols-2 gap-8 mb-8 max-md:grid-cols-1">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="relative border border-[#ddd] rounded-lg bg-[#fafafa] transition-transform duration-200 ease-in-out hover:-translate-y-1 overflow-hidden shadow-sm hover:shadow-md"
                    >
                      {/* ── Admin Controls ── */}
                      {isAdmin && (
                        <>
                          <div className="admin-badge">⚙ Admin</div>
                          <button
                            className="delete-btn"
                            title="Delete this post"
                            disabled={deletingId === post.id}
                            onClick={(e) => handleDelete(e, post.id)}
                          >
                            {deletingId === post.id
                              ? <div className="delete-spinner" />
                              : "🗑"}
                          </button>
                        </>
                      )}

                      {/* Cover Image */}
                      {post.coverImage && (
                        <div className="h-[180px] overflow-hidden">
                          <img
                            src={`${API}/blogs/${post.id}/cover`}
                            alt={post.title}
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-5">
                        <p className="text-gray-500 text-[0.9rem] mb-[5px]">
                          {post.category || "Uncategorized"}
                        </p>

                        <Link
                          href={`/blog/${post.slug || post.id}`}
                          className="text-[1.15rem] font-bold text-[#00b5ad] no-underline hover:underline hover:text-black block mb-2 leading-snug"
                        >
                          {post.title}
                        </Link>

                        <div className="text-[0.8rem] text-[#666] flex flex-wrap gap-x-3 gap-y-1 my-2">
                          {post.createdAt && <span>📅 {formatDate(post.createdAt)}</span>}
                          {post.author && <span>✍️ {post.author}</span>}
                        </div>

                        <p className="text-sm text-[#444] line-clamp-2 mt-1">
                          {post.excerpt || post.content?.slice(0, 120) || "Discover the latest updates and insights from our healthcare facility..."}
                        </p>

                        <Link
                          href={`/blog/${post.slug || post.id}`}
                          className="inline-block mt-3 text-xs font-semibold text-[#00b5ad] hover:underline"
                        >
                          Read more →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Author Section ── */}
              <div className="mt-6 border-t border-[#ccc] pt-5">
                <h3 className="text-xl font-bold mb-4">About the Author</h3>
                <div className="flex items-center gap-2.5">
                  <img
                    src="/author-avatar.jpg"
                    alt="Author"
                    className="w-[50px] h-[50px] rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="w-[50px] h-[50px] rounded-full bg-[#00b5ad] text-white font-bold text-lg items-center justify-center hidden"
                    aria-hidden="true"
                  >
                    J
                  </div>
                  <div>
                    <p className="font-semibold">Dr. John Doe</p>
                    <p className="text-sm text-[#666]">Medical Specialist</p>
                  </div>
                </div>
              </div>

              {/* ── Comment Section ── */}
              <div className="mt-[30px]">
                <h3 className="text-xl font-bold mb-4">Leave a Comment</h3>
                <form className="flex flex-col gap-2.5" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="p-2.5 border border-[#ddd] rounded focus:outline-none focus:border-[#00b5ad]"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="p-2.5 border border-[#ddd] rounded focus:outline-none focus:border-[#00b5ad]"
                  />
                  <textarea
                    placeholder="Your Comment"
                    className="h-[100px] p-2.5 border border-[#ddd] rounded resize-none focus:outline-none focus:border-[#00b5ad]"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-[#00b5ad] text-white border-none cursor-pointer rounded hover:bg-[#0d9488] transition-colors font-semibold"
                  >
                    Submit Comment
                  </button>
                </form>
              </div>
            </>
          )}

          {/* ── Children for dynamic routes (blog detail pages) ── */}
          {children}
        </div>

        {/* ── Right: Sticky Sidebar ── */}
        <div className="flex-1 sticky top-[120px] self-start max-md:relative max-md:top-auto">

          {/* Latest Posts */}
          <div className="mb-[30px]">
            <h3 className="text-[1.2rem] font-bold mb-[15px] border-b border-[#ccc] pb-[5px]">
              LATEST POSTS
            </h3>
            <div className="flex flex-col gap-2">
              {loading
                ? [1, 2, 3].map(i => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                ))
                : posts.slice(0, 5).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug || post.id}`}
                    className="block text-[0.95rem] text-[#333] mb-2.5 no-underline hover:text-[#00b5ad] hover:underline leading-snug"
                  >
                    {post.title}
                  </Link>
                ))}
            </div>
          </div>

          {/* Gallery Section */}
          <div className="mb-[30px]">
            <h3 className="text-[1.2rem] font-bold mb-[15px] border-b border-[#ccc] pb-[5px]">
              GALLERY
            </h3>
            <div className="grid grid-cols-3 gap-2.5 max-md:grid-cols-2">
              {galleryImages.map((img, index) => (
                <img
                  key={img.id || index}
                  src={
                    img.static
                      ? img.src
                      : `${API}/gallery/${img.id}/featured`
                  }
                  alt={img.alt || `Gallery ${index + 1}`}
                  crossOrigin={img.static ? undefined : "anonymous"}
                  className="w-full h-[70px] object-cover rounded-[5px] cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                  onClick={() =>
                    setSelectedImage(
                      img.static ? img.src : `${API}/gallery/${img.id}/featured`
                    )
                  }
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-[30px]">
            <h3 className="text-[1.2rem] font-bold mb-[15px] border-b border-[#ccc] pb-[5px]">
              CATEGORIES
            </h3>
            <div className="flex flex-col gap-2">
              {loading
                ? [1, 2, 3].map(i => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))
                : categories
                  .filter(c => c !== "All")
                  .map(cat => {
                    const count = posts.filter(p => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-left text-[0.95rem] transition-colors hover:text-[#00b5ad] ${activeCategory === cat ? "text-[#00b5ad] font-semibold" : "text-[#333]"
                          }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
            </div>
          </div>
        </div>

        {/* ── Lightbox Overlay ── */}
        {selectedImage && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/85 flex justify-center items-center z-[1000] p-5"
            style={{ animation: "fadeIn 0.3s ease-in-out" }}
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Enlarged"
              className="max-w-full max-h-[90vh] rounded-lg shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            />
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Blog;