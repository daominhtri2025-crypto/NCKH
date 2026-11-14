import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Cấu hình phát triển cục bộ. Có thể đổi trong web/.env (xem web/.env.example).
// API PHP mặc định chạy ở 127.0.0.1:8000. Dùng 127.0.0.1 (không dùng localhost) để tránh
// trường hợp localhost phân giải sang IPv6 trong khi máy chủ PHP chỉ lắng nghe IPv4.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const apiTarget = env.VITE_API_TARGET || 'http://127.0.0.1:8000';
  const port = Number(env.VITE_PORT || 5173);

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port,
      strictPort: true,
      proxy: {
        // changeOrigin để mặc định (false): header Host giữ nguyên để khớp kiểm tra Origin phía máy chủ.
        '/api': { target: apiTarget },
      },
    },
  };
});
