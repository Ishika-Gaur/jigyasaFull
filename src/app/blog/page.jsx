"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

const posts = [
  {
    title: "Grand Inauguration Of Jigyasa Hospital: A New Era Of Healthcare Begins",
    date: "Mar 2, 2025",
    category: "Uncategorized",
    slug: "grand-inauguration",
  },
  {
    title: "Jigyasa Hospital: Delivering Cutting-Edge Healthcare With Excellence",
    date: "Mar 2, 2025",
    category: "Health",
    slug: "cutting-edge-healthcare",
  },
];

const Blog = ({ children }) => {
  const pathname = usePathname();
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { src: "/img-1.png", alt: "Gallery 1" },
    { src: "/img-2.jpeg", alt: "Gallery 2" },
    { src: "/img-3.png", alt: "Gallery 3" },
    { src: "/img-4.png", alt: "Gallery 4" },
    { src: "/img-5.jpeg", alt: "Gallery 5" },
  ];

  const isBlogIndex = pathname === "/blog";

  return (
    <>
      <div className="flex flex-row flex-wrap py-10 px-[5%] gap-8 bg-white max-md:flex-col">
        {/* Left side (Blog List or Blog Detail) */}
        <div className="flex-[2] flex flex-col gap-4">
          {isBlogIndex && (
            <>
              <h1 className="text-3xl font-bold mb-6 text-[#111827]">Latest Blog Posts</h1>
              
              {/* Blog List Grid - 2 columns */}
              <div className="grid grid-cols-2 gap-8 mb-8 max-md:grid-cols-1">
                {posts.map((post, index) => (
                  <div
                    key={index}
                    className="p-5 border border-[#ddd] rounded-lg bg-[#fafafa] transition-transform duration-200 ease-in-out hover:-translate-y-1 border-b border-[#ccc] pb-5 mb-[30px]"
                  >
                    <p className="text-gray-500 text-[0.9rem] mb-[5px]">
                      {post.category}
                    </p>
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[1.3rem] font-bold text-[#00b5ad] no-underline hover:underline hover:text-black block mb-2"
                    >
                      {post.title}
                    </Link>
                    
                    <div className="text-[0.85rem] text-[#666] flex gap-[15px] my-2.5">
                      <span>📅 {post.date}</span>
                      <span>📧 jigyasahospitalmbd@gmail.com</span>
                      <span>💬 Comment</span>
                    </div>
                    
                    <p className="text-base text-[#444]">
                      {post.title.split(":")[1] || "Discover the latest updates and insights from our healthcare facility..."}
                    </p>
                  </div>
                ))}
              </div>

              {/* Author Section */}
              <div className="mt-10 border-t border-[#ccc] pt-5">
                <h3 className="text-xl font-bold mb-4">About the Author</h3>
                <div className="flex items-center gap-2.5">
                  <img
                    src="/author-avatar.jpg"
                    alt="Author"
                    className="w-[50px] h-[50px] rounded-full"
                  />
                  <div>
                    <p className="font-semibold">Dr. John Doe</p>
                    <p className="text-sm text-[#666]">Medical Specialist</p>
                  </div>
                </div>
              </div>

              {/* Comment Section */}
              <div className="mt-[30px]">
                <h3 className="text-xl font-bold mb-4">Leave a Comment</h3>
                <form className="flex flex-col gap-2.5">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="p-2.5 border border-[#ddd] rounded"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="p-2.5 border border-[#ddd] rounded"
                  />
                  <textarea
                    placeholder="Your Comment"
                    className="h-[100px] p-2.5 border border-[#ddd] rounded"
                  ></textarea>
                  <button
                    type="submit"
                    className="p-2.5 bg-[#1e40af] text-white border-none cursor-pointer rounded hover:bg-[#2563eb] transition-colors"
                  >
                    Submit Comment
                  </button>
                </form>
              </div>
            </>
          )}

          {/* Render children for dynamic routes */}
          {children}
        </div>

        {/* Right side (Sticky Sidebar) */}
        <div className="flex-1 sticky top-[120px] self-start max-md:relative max-md:top-auto">
          {/* Latest Posts */}
          <div className="mb-[30px]">
            <h3 className="text-[1.2rem] font-bold mb-[15px] border-b border-[#ccc] pb-[5px]">
              LATEST POSTS
            </h3>
            <div className="flex flex-col gap-2">
              {posts.map((post, idx) => (
                <Link
                  key={idx}
                  href={`/blog/${post.slug}`}
                  className="block text-[0.95rem] text-[#333] mb-2.5 no-underline hover:text-[#2563eb] hover:underline"
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
                  key={index}
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-auto rounded-[5px] cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                  onClick={() => setSelectedImage(img.src)}
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
              <Link href="#" className="text-[#333] hover:text-[#2563eb]">
                Health (12)
              </Link>
              <Link href="#" className="text-[#333] hover:text-[#2563eb]">
                Medical Services (8)
              </Link>
              <Link href="#" className="text-[#333] hover:text-[#2563eb]">
                Uncategorized (15)
              </Link>
            </div>
          </div>
        </div>

        {/* Lightbox Overlay */}
        {selectedImage && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/85 flex justify-center items-center z-[1000] p-5 animate-[fadeIn_0.3s_ease-in-out]"
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default Blog;