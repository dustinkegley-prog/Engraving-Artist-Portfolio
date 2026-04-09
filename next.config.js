/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // react-datocms v8 bundles a VideoPlayer that depends on @mux/mux-player-react.
    // We don't use VideoPlayer, so stub the import to avoid a build error.
    config.resolve.alias['@mux/mux-player-react/lazy'] = false;
    return config;
  },
};

module.exports = nextConfig;
