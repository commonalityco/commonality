const packageJSON = require('./package.json');
const transpiledPackages = Object.keys(packageJSON.dependencies).filter((it) =>
  it.includes('@commonality/')
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [...transpiledPackages],
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
