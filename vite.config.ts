import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from "path"

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// https://vite.dev/config/
export default defineConfig({
  root, 
  plugins: [react()],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        devtools: resolve(root, 'devtools', 'index.html'),
        popup: resolve(root, 'popup', 'index.html')
      }
    }
  }
})
