import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from "path"
import manifestPlugin from "./manifest-copy-plugin"

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// https://vite.dev/config/
export default defineConfig({
  root, 
  plugins: [react(), manifestPlugin()],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(root, 'popup', 'index.html'),
        background: resolve(root, 'background', 'index.ts'),
        content: resolve(root, 'content', 'content.ts'),
        devtools: resolve(root, 'devtools', 'devtools.html'),
        devtools_panel: resolve(root, 'devtools', 'index.html')
      },
  
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
