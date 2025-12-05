import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 3000번 포트(백엔드)로 API 요청을 전달하는 프록시 설정
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
