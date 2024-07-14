/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["esbuild"],
  },
  webpack: (config, _) => {
    config.module.rules.push({
      test: /\.ts?$/,
      loader: "esbuild-loader",
      options: {
        loader: "tsx",
        target: "es2015",
      },
    });
    return config;
  },
};

export default nextConfig;
