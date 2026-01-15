import {defineConfig} from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({command}) => {
  return {
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
    alias: {
      alias: [{find: '@', replacement: './app/client/src'}],
    },
    // base: (command === 'build') ? '/_resources/app/client/dist/' : '/', // TODO: .env variable, only on build
    base: './',
    publicDir: 'app/client/public',
    build: {
      // cssCodeSplit: false,
      outDir: './client/dist',
      manifest: true,
      sourcemap: true,
      rollupOptions: {
        input: {
          'bundle.scss': './client/src/bundles/bundle.scss',
        },
        output: {
          entryFileNames: `[name]`,
          chunkFileNames: `styles/[name]`,
          assetFileNames: (assetInfo) => {
            // Keep images/svg in the same directory structure
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(assetInfo.name)) {
              return `styles/[name].[ext]`;
            }
            return `styles/[name].[ext]`;
          }
        }
      },
    },
    css: {
        devSourcemap: true,
    },
    plugins: []
  }
})
