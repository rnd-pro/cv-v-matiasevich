import { getDataFn, getRouteFn } from './src/dynamic-pages/node/handlers.js';

/** @type { JSDA_CFG } */
export default {
  dynamic: {
    port: 3000,
    routes: './src/dynamic-pages/routes/routes.js',
    cache: {
      inMemory: true,
      exclude: [
        '/dashboard/',
      ],
    },
    baseDir: './src/dynamic-pages/',
    getRouteFn,
    getDataFn,
  },
  static: {
    outputDir: './dist',
    sourceDir: './src/static-pages',
  },
  ssr: {
    enabled: true,
    imports: [
      './src/ui-components/universal/login-widget/logic.js',
      './src/ui-components/universal/side-panel/logic.js',
    ],
  },
  minify: {
    js: true,
    css: true,
    html: true,
    svg: true,
    exclude: [],
  },
  bundle: {
    js: true,
    css: true,
    exclude: [],
  },
  log: true,
  importmap: {
    packageList: [
      '@symbiotejs/symbiote',
      'symbiote-ui/core',
      'symbiote-ui/layout',
      'symbiote-ui/themes/cascade-theme.js',
      'symbiote-ui/themes/default-provider.js',
      'symbiote-ui/themes/Theme.js',
      'symbiote-ui/canvas/NodeCanvas/NodeCanvas.js',
      'symbiote-ui/layout/CrossLayoutPortalBridge/CrossLayoutPortalBridge.js',
      'symbiote-ui/layout/Layout/Layout.js',
      'symbiote-ui/node/GraphFrame/GraphFrame.js',
      'symbiote-ui/node/GraphNode/GraphNode.js',
    ],
    srcSchema: 'https://cdn.jsdelivr.net/npm/{pkg-name}/+esm',
    polyfills: false,
    preload: false,
  },
  sitemap: {
    enabled: true,
    baseUrl: 'https://rnd-pro.github.io/cv-v-matiasevich/',
    exclude: [
      '/dashboard/',
      '/404/',
      '/login/',
    ],
  },
}
