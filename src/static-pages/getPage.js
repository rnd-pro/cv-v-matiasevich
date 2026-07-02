import fs from 'fs';
import { applyData } from 'jsda-kit/iso/applyData.js';
import { md } from 'jsda-kit/node/md.js';
import ICONS_LINK from '../icons/link.html.js';

const template = fs.readFileSync('./src/static-pages/page.tpl.html', 'utf8');
const importmap = getImportMap();

const SITE_BASE_URL = 'https://MakerDrive.github.io/cv-v-matiasevich/';
const SITE_OG_IMAGE = `${SITE_BASE_URL}avatar/index.webp`;
const SITE_DEFAULT_DESCRIPTION =
  'Vladimir Matiasevich — lead AI & full-stack R&D engineer. Custom agent tooling and product platforms, with process automation as a supporting line, individually or with the RND-PRO engineering team.';

function escapeAttr(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildHeadMeta(pageData) {
  if (typeof pageData.HEAD_META === 'string') return pageData.HEAD_META;
  let description = pageData.DESCRIPTION || SITE_DEFAULT_DESCRIPTION;
  let title = pageData.OG_TITLE || pageData.TITLE;
  let image = pageData.OG_IMAGE || SITE_OG_IMAGE;
  let tags = [
    `<meta name="description" content="${escapeAttr(description)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${escapeAttr(title)}">`,
    `<meta property="og:description" content="${escapeAttr(description)}">`,
    `<meta property="og:image" content="${escapeAttr(image)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttr(title)}">`,
    `<meta name="twitter:description" content="${escapeAttr(description)}">`,
    `<meta name="twitter:image" content="${escapeAttr(image)}">`,
  ];
  if (pageData.CANONICAL_URL) {
    tags.push(`<link rel="canonical" href="${escapeAttr(pageData.CANONICAL_URL)}">`);
    tags.push(`<meta property="og:url" content="${escapeAttr(pageData.CANONICAL_URL)}">`);
  }
  return tags.join('\n  ');
}

function getAssetVersion() {
  return String(process.env.CV_ASSET_VERSION || process.env.GITHUB_SHA || '').trim();
}

function versionAssetPath(path) {
  let version = getAssetVersion();
  if (!version || path.includes('?') || path.startsWith('http')) return path;
  return `${path}?v=${encodeURIComponent(version.slice(0, 12))}`;
}

function getPackageVersion(packageName) {
  try {
    let packageJson = JSON.parse(
      fs.readFileSync(`./node_modules/${packageName}/package.json`, 'utf8')
    );
    return packageJson.version;
  } catch {
    return '';
  }
}

function getImportMap() {
  let symbioteVersion = getPackageVersion('@symbiotejs/symbiote');
  let symbioteUiVersion = getPackageVersion('symbiote-ui');
  let symbioteBaseUrl = `https://cdn.jsdelivr.net/npm/@symbiotejs/symbiote${symbioteVersion ? `@${symbioteVersion}` : ''}`;
  let symbioteUiBaseUrl = `https://cdn.jsdelivr.net/npm/symbiote-ui${symbioteUiVersion ? `@${symbioteUiVersion}` : ''}`;
  let imports = {
    '@symbiotejs/symbiote': `${symbioteBaseUrl}/core/index.js`,
    '@symbiotejs/symbiote/core': `${symbioteBaseUrl}/core/index.js`,
    '@symbiotejs/symbiote/utils': `${symbioteBaseUrl}/utils/index.js`,
    '@symbiotejs/symbiote/': `${symbioteBaseUrl}/`,
    'symbiote-ui': `${symbioteUiBaseUrl}/index.js`,
    'symbiote-ui/core': `${symbioteUiBaseUrl}/core/index.js`,
    'symbiote-ui/layout': `${symbioteUiBaseUrl}/layout/index.js`,
    'symbiote-ui/manifest': `${symbioteUiBaseUrl}/manifest/index.js`,
    'symbiote-ui/ui': `${symbioteUiBaseUrl}/ui/index.js`,
    'symbiote-ui/webmcp': `${symbioteUiBaseUrl}/webmcp.js`,
    'symbiote-ui/': `${symbioteUiBaseUrl}/`,
  };

  return /*html*/ `
    <script type="importmap">${JSON.stringify({ imports }, undefined, 2)}</script>
  `.trim();
}

/**
 * @typedef {Object} PageData
 * @property {String} [IMPORTMAP]
 * @property {String} TITLE
 * @property {String} [BASE_PATH]
 * @property {String} [BODY_ATTRS]
 * @property {String} [CSS_PATH]
 * @property {String} [JS_PATH]
 * @property {String} HEADER_CONTENT
 * @property {String} [MD_URL]
 * @property {String} [CONTENT]
 * @property {String} [FOOTER_CONTENT]
 * @property {String} [SIDE_PANEL_ATTRS]
 * @property {String} [SIDE_PANEL_HTML]
 * @property {Object<string, string>} [SIDE_PANEL_DATA]
 */

/**
 *
 * @param {PageData} pageData
 * @returns
 */
export async function getPage(pageData) {

  return applyData(template, {
    IMPORTMAP: pageData.IMPORTMAP || importmap,
    ICONS_LINK,
    TITLE: pageData.TITLE,
    HEAD_META: buildHeadMeta(pageData),
    BODY_ATTRS: pageData.BODY_ATTRS || '',
    BASE_PATH: pageData.BASE_PATH || './',
    CSS_PATH: versionAssetPath(pageData.CSS_PATH || 'css/index.css'),
    JS_PATH: versionAssetPath(pageData.JS_PATH || 'js/index.js'),
    HEADER_CONTENT: pageData.HEADER_CONTENT,
    CONTENT: pageData.CONTENT || await md(pageData.MD_URL),
    FOOTER_CONTENT: pageData.FOOTER_CONTENT || `JSDA Template &copy; ${new Date().getFullYear()}`,
    SIDE_PANEL_ATTRS: pageData.SIDE_PANEL_ATTRS || '',
  });
};

export { versionAssetPath };
