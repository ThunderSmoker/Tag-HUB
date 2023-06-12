/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'stickerly.pstatic.net'],
  },
  webpack(config, { webpack }) {
    // Add a rule for handling binary files
    config.module.rules.push({
      test: /\.node$/,
      loader: "raw-loader",
    });

    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    return config;
  },
  productionBrowserSourceMaps: false,
  devtool: process.env.DEPLOY_ENV === "development" ? "eval-source-map" : false,
  onError: () => {},
};

module.exports = {
  ...nextConfig,
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};
