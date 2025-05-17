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
        popup: resolve(root, 'popup', 'index.html'),
        background: resolve(root, 'background', 'index.ts'),
        content: resolve(root, 'content', 'index.ts'),
        devtools: resolve(root, 'devtools', 'devtools.html'),
        devtools_panel: resolve(root, 'devtools', 'devtools_panel.html')
      },
    }
  }
})
