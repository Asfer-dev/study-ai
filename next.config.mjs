/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "study-ai.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
