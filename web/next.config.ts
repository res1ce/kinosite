import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Увеличиваем лимит для загрузки больших видео файлов (до 1GB)
  experimental: {
    serverActions: {
      bodySizeLimit: '1000mb', // Лимит для Server Actions
    },
  },
  // Дополнительные настройки
  serverExternalPackages: [],
};

export default nextConfig;
