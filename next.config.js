const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['playwright', 'lighthouse', 'better-sqlite3']
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = withNextIntl(nextConfig);
