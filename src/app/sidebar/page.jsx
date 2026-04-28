"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar({ posts = [] }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="w-full lg:w-[350px] space-y-10">
      
      {/* 🔹 LATEST POSTS */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
          Latest Posts
        </h3>

        <div className="flex flex-col space-y-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="text-sm text-gray-600 hover:text-teal-500 transition-colors"
              >
                {post.title}
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-400">
              No posts available
            </p>
          )}
        </div>
      </div>

      {/* 🔹 GALLERY */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
          Gallery
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {[
            "/img-1.png",
            "/img-2.jpeg",
            "/img-3.png",
            "/img-4.png",
            "/img-5.jpeg",
          ].map((src, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(src)}
              className="relative w-full h-[80px] cursor-pointer rounded-md overflow-hidden group"
            >
              <Image
                src={src}
                alt={`Gallery ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 33vw, 100px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 LIGHTBOX */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Enlarged view"
              width={1000}
              height={700}
              className="rounded-xl object-contain max-h-[80vh] w-full"
            />

            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
