const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles'), path.join(__dirname, 'node_modules/uswds/src/stylesheets')],
  },
  env: {
    // Will be available on both server and client
    API_URL: process.env.REACT_APP_SERVICE_URL
  },
  webpack: (config, options) => {
    if (config.resolve.extensions) {
      config.resolve.extensions.push('.tsx');
    } else {
      config.resolve.extensions = ['.tsx'];
    }

    return config;
  }
}

module.exports = nextConfig
