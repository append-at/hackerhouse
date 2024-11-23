import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    turbo: {
      rules: {
        '*.module.svg': {
          loaders: [
            {
              loader: '@svgr/webpack',
              options: {
                svgo: false,
              },
            },
          ],
          as: '*.js',
        },
      },
    },
  },
  webpack(config) {
    // @ts-expect-error - We know this rule exists
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      // Default SVG handling with file-loader
      {
        test: /\.module\.svg$/i,
        loader: '@svgr/webpack',
        options: {
          svgo: false,
        },
      },
      // Handle all other SVG files as normal
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        exclude: /\.module\.svg$/i,
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
