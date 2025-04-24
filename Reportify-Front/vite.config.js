import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test:{
    globals : true,
    environment : "jsdom",
    setupFiles : "./src/setupTests.js",
    coverage: {
      provider : "v8",
      reporter :["text" , "html"],
      statements : 80,
      branches : 80,
      functions : 80,
      lines : 80,
    },
    checkCoverage : true,
  },
  resolve: {
    alias : {
      src: "/src",
    },
    extensions: [".js" , ".jsx" , ".ts" , ".tsx"],
  },
});