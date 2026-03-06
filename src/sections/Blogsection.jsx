"use client";

import Link from "next/link";

const Blogsection = () => {
  const posts = [
    {
      title:
        "Grand Inauguration Of Jigyasa Hospital: A New Era Of Healthcare Begins",
      date: "Mar 2, 2025",
      category: "Uncategorized",
      slug: "grand-inauguration",
    },
    {
      title:
        "Jigyasa Hospital: Delivering Cutting-Edge Healthcare With Excellence",
      date: "Mar 2, 2025",
      category: "Health",
      slug: "cutting-edge-healthcare",
    },
  ];

  return (
    <section className="px-[5%] py-[60px] text-center bg-[#f9fafb]">
      <h2 className="inline-block text-base text-[#25b1a8] font-semibold mb-2.5 uppercase bg-[#cff0ef] px-2.5 py-1 rounded">
        FROM BLOG
      </h2>

      <h1 className="text-[4rem] md:text-[2.8rem] sm:text-[1.8rem] font-bold text-[#111827] mb-4">
        News & Articles
      </h1>

      <p className="max-w-[800px] mx-auto mb-10 text-base leading-relaxed text-black">
        Stay updated with the latest healthcare news, expert tips, and important
        articles to help you make informed health decisions.
      </p>

      <div className="flex flex-wrap justify-center gap-[30px]">
        {posts.map((post) => (
          <div
            className="flex-1 basis-[300px] bg-white border border-[#eee] rounded-xl p-6 text-left shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-transform duration-200 hover:-translate-y-1.5 w-full max-w-[500px] md:max-w-none"
            key={post.slug}
          >
            <span className="text-[0.85rem] text-[#5e5e5e] mb-2.5 block">
              {post.category}
            </span>

            <h3 className="text-[1.2rem] font-bold text-[#1a1a1a] mb-2.5">
              {post.title}
            </h3>

            <div className="text-[0.85rem] text-[#777] mb-3">
              <span>{post.date}</span>
              {post.comments && <span> · {post.comments} Comments</span>}
            </div>

            {post.excerpt && (
              <p className="text-base text-[#444] mb-5">{post.excerpt}</p>
            )}

            <Link
              href={`/blog/${post.slug}`}
              className="inline-block bg-[#0dbd9d] text-white no-underline px-5 py-2.5 font-medium rounded-[5px] transition-colors duration-300 hover:bg-[#099b82]"
            >
              Learn More
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blogsection;