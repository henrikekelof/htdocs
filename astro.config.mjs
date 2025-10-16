// @ts-check
import { defineConfig } from 'astro/config';
import { redirects } from './redirects.mjs';
import { remarkLayoutPlugin } from './plugins/remark-layout-plugin.mjs';
import { remarkClassNames } from './plugins/remark-class-names.mjs';

const ASSETS_FOLDER = 'assets';

export default defineConfig({
  site: 'https://henrikekelof.github.io/htdocs/',
  base: '/',
  root: '.',
  outDir: './dist',
  publicDir: './static',
  trailingSlash: 'ignore',
  redirects: redirects,
  output: 'static',
  compressHTML: false,
  build: {
    inlineStylesheets: 'never',
    assets: ASSETS_FOLDER,
  },
  integrations: [
    (await import('astro-compress')).default({
      CSS: false,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: false,
      SVG: false,
    }),
  ],
  markdown: {
    syntaxHighlight: 'prism',
    remarkPlugins: [remarkLayoutPlugin, remarkClassNames],
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `${ASSETS_FOLDER}/docs.[hash].js`,
          chunkFileNames: `${ASSETS_FOLDER}/docs.chunk.[hash].js`,
          assetFileNames: `${ASSETS_FOLDER}/docs.[hash][extname]`,
        },
      },
    },
  },
  server: {
    port: 8082,
  },
  devToolbar: {
    enabled: false,
  },
});
