/* eslint-disable @typescript-eslint/no-explicit-any */
// simple-manifest-plugin.js
import fs from 'fs'
import path from 'path'

/**
 * A simpler version of the manifest plugin that avoids Rollup-specific APIs
 */
export default function manifestPlugin() {
  return {
    name: 'simple-manifest-copy',
    
    // Hook that runs after the build is complete
    closeBundle() {
      const manifestPath = path.resolve('manifest.json')
      const outDir = path.resolve('dist')
      
      if (fs.existsSync(manifestPath)) {
        console.log('Copying manifest.json to output directory')
        
        // Read the manifest
        const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
        
        // Ensure output directory exists
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true })
        }
        
        // Write to output
        fs.writeFileSync(
          path.join(outDir, 'manifest.json'),
          manifestContent
        )
      }
    },
    
    // For development server
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url === '/manifest.json') {
          const manifestPath = path.resolve('manifest.json')
          if (fs.existsSync(manifestPath)) {
            const manifest = fs.readFileSync(manifestPath, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(manifest)
          } else {
            next()
          }
        } else {
          next()
        }
      })
    }
  }
}