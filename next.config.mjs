/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuilderError: true,
  },
  experimental: {
    //serverActions: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
        {
          protocol: "https",
          hostname: "65911266.propelauthtest.com",
        },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
