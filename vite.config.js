import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { join } from 'path'

// Only set Windows esbuild path when running on Windows locally
if (process.platform === 'win32') {
  process.env.ESBUILD_BINARY_PATH = join(
    process.cwd(),
    'node_modules/@esbuild/win32-x64/esbuild.exe'
  )
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
