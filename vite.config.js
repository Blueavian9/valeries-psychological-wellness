import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Fix for Windows esbuild binary path
import { join } from 'path'
process.env.ESBUILD_BINARY_PATH = join(
  process.cwd(),
  'node_modules/@esbuild/win32-x64/esbuild.exe'
)

export default defineConfig({
  plugins: [react(), tailwindcss()],
})