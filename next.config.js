/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_AIR_PARTNER_ID: process.env.NEXT_PUBLIC_AIR_PARTNER_ID,
    NEXT_PUBLIC_AIR_ENV: process.env.NEXT_PUBLIC_AIR_ENV || "SANDBOX",
  },
}

module.exports = nextConfig
