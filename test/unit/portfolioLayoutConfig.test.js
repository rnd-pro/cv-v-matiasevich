import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  PORTFOLIO_DEFAULT_GRAPH_VIEW_MODE,
  PORTFOLIO_GRAPH_PANEL_IMPORTANCE,
  PORTFOLIO_GRAPH_PANEL_MIN_INLINE_SIZE,
  PORTFOLIO_LAYOUT_MIN_INLINE_SIZE,
  PORTFOLIO_LAYOUT_RESPONSIVE_BREAKPOINT,
  PORTFOLIO_TREE_PANEL_IMPORTANCE,
  PORTFOLIO_TREE_PANEL_MIN_INLINE_SIZE,
} from '../../src/static-pages/data/portfolioLayoutConfig.js';
import { versionAssetPath } from '../../src/static-pages/getPage.js';

test('portfolio layout keeps drawer mode below desktop auto-collapse widths', () => {
  assert.ok(PORTFOLIO_LAYOUT_RESPONSIVE_BREAKPOINT < PORTFOLIO_LAYOUT_MIN_INLINE_SIZE);
  assert.equal(PORTFOLIO_LAYOUT_RESPONSIVE_BREAKPOINT, 760);
});

test('portfolio auto-collapse prefers graph before file navigation', () => {
  assert.ok(PORTFOLIO_GRAPH_PANEL_IMPORTANCE < PORTFOLIO_TREE_PANEL_IMPORTANCE);
  assert.ok(PORTFOLIO_GRAPH_PANEL_MIN_INLINE_SIZE > PORTFOLIO_TREE_PANEL_MIN_INLINE_SIZE);
});

test('portfolio graph defaults to flat mode', async () => {
  let source = await readFile(new URL('../../src/static-pages/js/index.js', import.meta.url), 'utf8');

  assert.equal(PORTFOLIO_DEFAULT_GRAPH_VIEW_MODE, 'flat');
  assert.match(source, /if \(typeof location === 'undefined'\) return PORTFOLIO_DEFAULT_GRAPH_VIEW_MODE;/);
  assert.match(source, /if \(!modeParam\) return PORTFOLIO_DEFAULT_GRAPH_VIEW_MODE;/);
  assert.match(source, /if \(modeParam === 'structured'\) return 'structured';/);
  assert.match(source, /if \(this\.flatMode\) {\s*nextUrl\.searchParams\.delete\('mode'\);/);
  assert.match(source, /} else {\s*nextUrl\.searchParams\.set\('mode', 'structured'\);/);
});

test('portfolio initial graph load focuses the selected node', async () => {
  let source = await readFile(new URL('../../src/static-pages/js/index.js', import.meta.url), 'utf8');

  assert.match(source, /setCanvas\(canvas\) {\s*this\.canvas = canvas;\s*this\.syncCanvas\({ focus: true, focusScope: 'node' }\);/);
  assert.match(source, /setGraphController\(controller\) {\s*this\.graphController = controller;\s*this\.syncCanvas\({ focus: true, focusScope: 'node' }\);/);
  assert.match(source, /portfolioRuntime\.select\(id, { focus: true, focusScope: 'group' }\);/);
});

test('portfolio graph panel lazily creates only the active renderer', async () => {
  let source = await readFile(new URL('../../src/static-pages/js/index.js', import.meta.url), 'utf8');

  assert.doesNotMatch(source, new RegExp('<node-canvas class="portfolio-canvas"></node-canvas>\\s*<canvas-graph'));
  assert.match(source, /ensureActiveGraphRenderer\(\) {\s*return this\.ensureGraphRenderer\(this\.flatMode \? 'flat' : 'structured'\);/);
  assert.match(source, /ensureStructuredGraphRenderer\(\) {\s*if \(this\.canvas\) return this\.canvas;\s*let canvas = .*document\.createElement\('node-canvas'\)/);
  assert.match(source, /ensureFlatGraphRenderer\(\) {\s*if \(this\.flatGraph\) return this\.flatGraph;\s*let flatGraph = .*document\.createElement\('canvas-graph'\)/);
  assert.match(source, /this\.graphController\?\.connect\?\.\({\s*structuredCanvas: canvas,/);
  assert.match(source, /this\.graphController\?\.connect\?\.\({\s*flatGraph,/);
  assert.match(source, /this\.canvas\?\.suspendLayout\?\.\({ reason: 'panel-disconnected' }\);/);
  assert.match(source, /this\.flatGraph\?\.suspendLayout\?\.\({ reason: 'panel-disconnected' }\);/);
});

test('portfolio mobile graph refocuses after drawer content becomes visible', async () => {
  let source = await readFile(new URL('../../src/static-pages/js/index.js', import.meta.url), 'utf8');

  assert.match(source, /let useNodeFitFocus = focusScope === 'node-fit';/);
  assert.match(source, /useNodeFitFocus\s*\?\s*\[entry\.id\]\s*:\s*entry\.id;/);
  assert.match(source, /structuredNodeIds: structuredFocusTarget,/);
  assert.match(source, /maxZoom: useNodeFitFocus\s*\?\s*0\.8/);
  assert.match(source, /new ResizeObserverCtor\(\(\) => this\.scheduleVisibleGraphFocus\(\)\)/);
  assert.match(source, /new MutationObserverCtor\(\(\) => {\s*this\._graphWasVisible = false;\s*this\.scheduleVisibleGraphFocus\(\);/);
  assert.match(source, /attributeFilter: \['drawer-open', 'drawer-expanded', 'drawer-rail-collapsed', 'style'\]/);
  assert.match(source, /focusGraphAfterVisibleResize\(\) {/);
  assert.match(source, /rect\.width < 128 \|\| rect\.height < 128/);
  assert.match(source, /drawerNode\.hasAttribute\('drawer-rail-collapsed'\)/);
  assert.match(source, /this\._graphVisibleFocusUntil = now \+ 600;/);
  assert.match(source, /this\.scheduleDeferredVisibleGraphFocus\(\);/);
  assert.match(source, /this\.scheduleStructuredPathUpgrade\(\);/);
  assert.match(source, /focusVisibleGraphNow\(\) {\s*this\.canvas\?\.refreshConnections\?\.\(\);\s*portfolioRuntime\.syncCanvas\({ focus: true, focusScope: 'node-fit' }\);/);
});

test('portfolio structured graph toolbar routes content actions', async () => {
  let source = await readFile(new URL('../../src/static-pages/js/index.js', import.meta.url), 'utf8');

  assert.match(source, /canvas\.addEventListener\('toolbar-action', \(event\) => this\.onStructuredGraphToolbarAction\(event\)\);/);
  assert.match(source, /onStructuredGraphToolbarAction\(event\) {/);
  assert.match(source, /if \(action === 'explore'\) {\s*portfolioRuntime\.select\(id, { focus: true, focusScope: 'group' }\);/);
  assert.match(source, /if \(action === 'view-code'\) {\s*portfolioRuntime\.select\(id, { focus: false }\);/);
});

test('portfolio mobile header toggles the file navigation drawer through layout API', async () => {
  let source = await readFile(new URL('../../src/static-pages/js/index.js', import.meta.url), 'utf8');

  assert.match(source, /document\.dispatchEvent\(new CustomEvent\('portfolio-open-materials'/);
  assert.match(source, /layout\.toggleDrawer\('start'\);/);
  assert.doesNotMatch(source, /document\.querySelector\('\\.portfolio-layout \\.layout-drawer-handle-stack-start/);
});

test('portfolio theme reset stays scoped to theme controls', async () => {
  let source = await readFile(new URL('../../src/static-pages/js/index.js', import.meta.url), 'utf8');

  assert.match(source, /const TREE_STORAGE_KEY = `cv-portfolio-materials-tree-v4:\$\{portfolioLocalization\.locale\}`;/);
  assert.match(source, /const projectTreeGroupDirectoryIds = PROJECT_TREE_GROUPS\.map/);
  assert.match(source, /storageKey: TREE_STORAGE_KEY/);
  assert.doesNotMatch(source, /document\.addEventListener\('cascade-theme-change', this\._onThemeReset\);/);
  assert.doesNotMatch(source, /if \(event\.detail\?\.source !== 'reset'\) return;/);
  assert.doesNotMatch(source, /globalThis\.localStorage\?\.removeItem\?\.\(TREE_STORAGE_KEY\);/);
  assert.doesNotMatch(source, /portfolioRuntime\.resetVisualState/);
  assert.match(source, /this\.pathStyle = 'pcb';/);
  assert.match(source, /this\.graphController\?\.fitView\?\.\(\);/);
});

test('portfolio mobile workspace uses dynamic viewport height when available', async () => {
  let source = await readFile(new URL('../../src/static-pages/css/index.css.js', import.meta.url), 'utf8');

  assert.match(source, /--pulse-workspace-block-size: calc\(100vh - var\(--calc-top-pan-height\)\);/);
  assert.match(source, /@supports \(height: 100dvh\)/);
  assert.match(source, /--pulse-workspace-block-size: calc\(100dvh - var\(--calc-top-pan-height\)\);/);
  assert.match(source, /height: var\(--pulse-workspace-block-size\);/);
  assert.match(source, /min-height: var\(--pulse-workspace-block-size\);/);
});

test('portfolio static build publishes the graph force worker asset', async () => {
  let pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'));

  assert.match(pkg.scripts['copy-force-worker'], /symbiote-ui\/canvas\/ForceWorker\.js/);
  assert.match(pkg.scripts['copy-force-worker'], /dist\/js\/ForceWorker\.js/);
  assert.match(pkg.scripts.build, /copy-force-worker/);
});

test('portfolio static pages version local CSS and JS assets', () => {
  let previousVersion = process.env.CV_ASSET_VERSION;
  let previousGithubSha = process.env.GITHUB_SHA;

  try {
    delete process.env.GITHUB_SHA;
    process.env.CV_ASSET_VERSION = 'abcdef1234567890';

    assert.equal(versionAssetPath('js/index.js'), 'js/index.js?v=abcdef123456');
    assert.equal(versionAssetPath('css/index.css'), 'css/index.css?v=abcdef123456');
    assert.equal(versionAssetPath('js/index.js?v=current'), 'js/index.js?v=current');
    assert.equal(versionAssetPath('https://example.com/index.js'), 'https://example.com/index.js');

    delete process.env.CV_ASSET_VERSION;
    assert.equal(versionAssetPath('js/index.js'), 'js/index.js');
  } finally {
    if (previousVersion === undefined) {
      delete process.env.CV_ASSET_VERSION;
    } else {
      process.env.CV_ASSET_VERSION = previousVersion;
    }

    if (previousGithubSha === undefined) {
      delete process.env.GITHUB_SHA;
    } else {
      process.env.GITHUB_SHA = previousGithubSha;
    }
  }
});

test('portfolio import map resolves Symbiote package exports used by symbiote-ui', async () => {
  let source = await readFile(new URL('../../src/static-pages/getPage.js', import.meta.url), 'utf8');

  assert.match(
    source,
    /'@symbiotejs\/symbiote\/utils': `\$\{symbioteBaseUrl\}\/utils\/index\.js`/
  );
});
