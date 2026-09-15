import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Builds the embeddable chat widget as a single self-contained script
// (public/widget.js + public/widget.css) that any external site can drop in
// with one <script> tag — see src/pages/dashboard/WidgetsPage.jsx.
export default defineConfig({
  plugins: [react()],
  define: {
    // This is a standalone (non-app) build, so Vite's usual process.env.NODE_ENV
    // replacement for app builds doesn't apply here — some deps read it directly.
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'public',
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: `${__dirname}/src/widget-entry.jsx`,
      name: 'ZumoWidget',
      formats: ['iife'],
      fileName: () => 'widget.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: (info) =>
          info.name && info.name.endsWith('.css') ? 'widget.css' : 'assets/[name][extname]',
      },
    },
  },
})
