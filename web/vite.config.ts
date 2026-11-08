import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Phát triển cục bộ: API PHP chạy ở 127.0.0.1:8000 (php -S 127.0.0.1:8000 -t api api/router.php).
// changeOrigin để mặc định (false) để header Host giữ nguyên, khớp với kiểm tra Origin phía máy chủ.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://127.0.0.1:8000' },
    },
  },
});
