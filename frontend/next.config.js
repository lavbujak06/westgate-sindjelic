/** @type {import('next').NextConfig} */
const nextConfig = {
  // This tells Next.js 16 to keep going even if it sees old webpack plugins
  turbopack: {}, 
  // If you have images from external domains, add them here
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;