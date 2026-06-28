import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('portfolio header exposes a persisted language toggle', async () => {
  let pageSource = await readFile(
    new URL('../../src/static-pages/portfolioPage.js', import.meta.url),
    'utf8'
  );
  let scriptSource = await readFile(
    new URL('../../src/static-pages/js/index.js', import.meta.url),
    'utf8'
  );
  let cssSource = await readFile(
    new URL('../../src/static-pages/css/index.css.js', import.meta.url),
    'utf8'
  );

  assert.match(pageSource, /<sn-segmented-control\s+class="pulse-locale-toggle"/);
  assert.match(pageSource, /<button type="button" value="en">EN<\/button>/);
  assert.match(pageSource, /<button type="button" value="ru">RU<\/button>/);
  assert.match(pageSource, /<button type="button" value="es">ES<\/button>/);

  assert.match(scriptSource, /const PORTFOLIO_LOCALE_STORAGE_KEY = 'cv-v-matiasevich-portfolio-locale';/);
  assert.match(scriptSource, /function getInitialPortfolioLocale\(\)/);
  assert.match(scriptSource, /configureBrowserLocalization\({\s*force: true,\s*messages: PORTFOLIO_LOCALE_MESSAGES,\s*\.\.\.\(initialPortfolioLocale/);
  assert.match(scriptSource, /localeToggle\?\.addEventListener\('sn-segmented-change'/);
  assert.match(scriptSource, /nextUrl\.searchParams\.set\('lang', locale\);/);
  assert.match(scriptSource, /globalThis\.location\.assign\(nextUrl\.href\);/);

  assert.match(cssSource, /\.pulse-locale-toggle/);
  assert.match(cssSource, /--sn-segmented-item-min-height/);
  assert.match(cssSource, /\.pulse-locale-toggle > slot\s*\{\s*display: none;/);
});
