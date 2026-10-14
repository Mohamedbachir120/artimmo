import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { rmSync } from 'node:fs'
import { resolve } from 'node:path'

// The construction demo film is for local preview only: keep it out of builds
const stripConstructionDemo = {
  name: 'strip-construction-demo',
  apply: 'build',
  writeBundle(options) {
    rmSync(resolve(options.dir, 'construction/_demo'), { recursive: true, force: true })
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(), stripConstructionDemo   ],
  build: {
    outDir: 'docs',
    assetsInlineLimit: 4096,
  }
})
