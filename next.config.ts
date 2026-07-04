import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Supabase Storage (imagens das matérias)
      {
        protocol: "https",
        hostname: "fewyfqcldelamknckmcx.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Placeholders de desenvolvimento (seed)
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
