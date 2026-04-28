/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    domains: [
      "cdn-icons-png.flaticon.com",
      "i.pinimg.com",
      'images.unsplash.com', 
    ],
  },
};

export default nextConfig;
