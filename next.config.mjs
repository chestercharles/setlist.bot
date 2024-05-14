/** @type {import('next').NextConfig} */
const nextConfig = {
  functions: {
    "src/app/**/*": {
      maxDuration: 300,
    },
  },
};

export default nextConfig;
