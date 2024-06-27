/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.seadn.io",
        port: "",
        pathname: "/**/files/**",
      },
    ],
  },
};

export default nextConfig;
