if (!document.querySelector('side-panel[disabled]')) {
  await import('../../ui-components/universal/side-panel/logic.js');
}

import { socialLinks } from '../data/socialLinks.js';
import { PORTFOLIO_LOCALE_MESSAGES } from '../data/portfolioTranslations.js';
import { PROJECT_TRANSLATIONS } from '../data/projectTranslations.js';
import { PROJECT_PULSE_NOTES } from '../data/projectPulseNotes.js';
import {
  PORTFOLIO_DEFAULT_GRAPH_VIEW_MODE,
  PORTFOLIO_GRAPH_PANEL_IMPORTANCE,
  PORTFOLIO_GRAPH_PANEL_MIN_INLINE_SIZE,
  PORTFOLIO_LAYOUT_MIN_INLINE_SIZE,
  PORTFOLIO_LAYOUT_RESPONSIVE_BREAKPOINT,
  PORTFOLIO_TREE_PANEL_IMPORTANCE,
  PORTFOLIO_TREE_PANEL_MIN_INLINE_SIZE,
} from '../data/portfolioLayoutConfig.js';
import {
  CASCADE_THEME_DEFAULTS,
  Connection,
  Input,
  LayoutTree,
  Node,
  NodeEditor,
  Output,
  Socket,
  applyCascadeTheme,
  buildResourceTreeFromEntries,
  configureMaterialSymbols,
  createGraphViewModeController,
  configureBrowserLocalization,
  ensureMaterialSymbols,
  highlightTreePath,
  resolveInitialGraphViewMode,
  setTreeItems,
  setupTreePanel,
  showTree,
  translate,
} from 'symbiote-ui/ui';

const PORTFOLIO_LOCALE_STORAGE_KEY = 'cv-v-matiasevich-portfolio-locale';
const PORTFOLIO_SUPPORTED_LOCALES = ['en', 'ru', 'es'];
const PORTFOLIO_LINKEDIN_URL = 'https://www.linkedin.com/in/v-matiasevich/';
const PORTFOLIO_TELEGRAM_URL = 'https://t.me/text2code';
const PORTFOLIO_ONLINE_CV_URL = 'https://rnd-pro.github.io/cv-v-matiasevich/';
const PORTFOLIO_PDF_DOWNLOADS = Object.freeze([
  { locale: 'en', href: 'downloads/vladimir-matiasevich-cv-en.pdf' },
  { locale: 'ru', href: 'downloads/vladimir-matiasevich-cv-ru.pdf' },
  { locale: 'es', href: 'downloads/vladimir-matiasevich-cv-es.pdf' },
]);

function normalizePortfolioLocale(value) {
  let locale = String(value || '').trim().toLowerCase();
  return PORTFOLIO_SUPPORTED_LOCALES.includes(locale) ? locale : '';
}

function getStoredPortfolioLocale() {
  try {
    let storage = globalThis.localStorage;
    return normalizePortfolioLocale(storage?.getItem?.(PORTFOLIO_LOCALE_STORAGE_KEY));
  } catch {
    return '';
  }
}

function setStoredPortfolioLocale(locale) {
  try {
    globalThis.localStorage?.setItem?.(PORTFOLIO_LOCALE_STORAGE_KEY, locale);
    return true;
  } catch {
    return false;
  }
}

function getQueryPortfolioLocale() {
  if (typeof location === 'undefined') return '';
  let urlParams = new URLSearchParams(location.search);
  return normalizePortfolioLocale(urlParams.get('lang'));
}

function getInitialPortfolioLocale() {
  return getQueryPortfolioLocale() || getStoredPortfolioLocale();
}

function applyPortfolioDocumentLocale(locale) {
  let html = document.documentElement;
  html.lang = locale;
  html.dataset.locale = locale;
}

let initialPortfolioLocale = getInitialPortfolioLocale();
let portfolioLocalization = configureBrowserLocalization({
  force: true,
  messages: PORTFOLIO_LOCALE_MESSAGES,
  ...(initialPortfolioLocale ? { locale: initialPortfolioLocale, explicit: true } : {}),
});
applyPortfolioDocumentLocale(portfolioLocalization.locale);

function tPortfolio(key, params = {}) {
  return translate(`portfolio.${key}`, params);
}

function getProfileOnlineCvUrl(locale = portfolioLocalization.locale) {
  let url = new URL(PORTFOLIO_ONLINE_CV_URL);
  url.searchParams.set('lang', normalizePortfolioLocale(locale) || 'en');
  return url.href;
}

function getProfileContactText() {
  let links = [];
  if (PORTFOLIO_TELEGRAM_URL) links.push(`[Telegram](${PORTFOLIO_TELEGRAM_URL})`);
  links.push(`[LinkedIn](${PORTFOLIO_LINKEDIN_URL})`);
  return links.join(' · ');
}

function getProfileMetaText() {
  return [
    '|  |  |',
    '| --- | --- |',
    `| **${tPortfolio('profile.locationLabel')}** | ${tPortfolio('profile.locationValue')} |`,
    `| **${tPortfolio('profile.availabilityLabel')}** | ${tPortfolio('profile.availability')} |`,
    `| **${tPortfolio('profile.languagesLabel')}** | ${tPortfolio('profile.languagesValue')} |`,
    `| **${tPortfolio('profile.experienceLabel')}** | ${tPortfolio('profile.experienceSummary')} |`,
    `| **${tPortfolio('profile.contactLabel')}** | ${getProfileContactText()} |`,
    `| **CV** | [${tPortfolio('profile.onlineCv')}](${getProfileOnlineCvUrl()}) |`,
  ].join('\n');
}

function getProfileSections() {
  return [
    {
      title: tPortfolio('profile.statusTitle'),
      body: tPortfolio('profile.statusDetails'),
    },
    {
      title: tPortfolio('profile.focusTitle'),
      body: tPortfolio('profile.focusDetails'),
    },
    {
      title: tPortfolio('profile.workFormatTitle'),
      body: tPortfolio('profile.workFormatDetails'),
    },
    {
      title: tPortfolio('profile.achievementsTitle'),
      items: [
        {
          label: tPortfolio('profile.achievement.rndProducts.label'),
          details: tPortfolio('profile.achievement.rndProducts.details'),
        },
        {
          label: tPortfolio('profile.achievement.hardware.label'),
          details: tPortfolio('profile.achievement.hardware.details'),
        },
        {
          label: tPortfolio('profile.achievement.museumScanning.label'),
          details: tPortfolio('profile.achievement.museumScanning.details'),
        },
        {
          label: tPortfolio('profile.achievement.aiTooling.label'),
          details: tPortfolio('profile.achievement.aiTooling.details'),
        },
      ],
    },
    {
      title: tPortfolio('profile.careerTitle'),
      items: [
        {
          label: tPortfolio('profile.career.ai.label'),
          details: tPortfolio('profile.career.ai.details'),
        },
        {
          label: tPortfolio('profile.career.messaging.label'),
          details: tPortfolio('profile.career.messaging.details'),
        },
        {
          label: tPortfolio('profile.career.hardware.label'),
          details: tPortfolio('profile.career.hardware.details'),
        },
        {
          label: tPortfolio('profile.career.f360.label'),
          details: tPortfolio('profile.career.f360.details'),
        },
        {
          label: tPortfolio('profile.career.photopizza.label'),
          details: tPortfolio('profile.career.photopizza.details'),
        },
        {
          label: tPortfolio('profile.career.megavisor.label'),
          details: tPortfolio('profile.career.megavisor.details'),
        },
      ],
    },
    {
      title: tPortfolio('experience.title'),
      items: [
        {
          label: tPortfolio('experience.rnd.label'),
          details: tPortfolio('experience.rnd.details'),
        },
        {
          label: tPortfolio('experience.programming.label'),
          details: tPortfolio('experience.programming.details'),
        },
        {
          label: tPortfolio('experience.leadership.label'),
          details: tPortfolio('experience.leadership.details'),
        },
      ],
    },
  ];
}

const THEME_CONTROL_LABEL_GETTERS = Object.freeze({
  brightness: () => tPortfolio('theme.control.brightness'),
  contrast: () => tPortfolio('theme.control.contrast'),
  chroma: () => tPortfolio('theme.control.chroma'),
  hue: () => tPortfolio('theme.control.hue'),
  pattern: () => tPortfolio('theme.control.pattern'),
});
const CANVAS_GRAPH_TYPE_LABEL_GETTERS = Object.freeze({
  data: () => tPortfolio('graph.type.data'),
  action: () => tPortfolio('graph.type.action'),
  output: () => tPortfolio('graph.type.output'),
  config: () => tPortfolio('graph.type.config'),
  external: () => tPortfolio('graph.type.external'),
  style: () => tPortfolio('graph.type.style'),
  docs: () => tPortfolio('graph.type.docs'),
  asset: () => tPortfolio('graph.type.asset'),
  group: () => tPortfolio('graph.type.group'),
});
const PANEL_MENU_GROUP_LABEL_GETTERS = Object.freeze({
  layout: () => tPortfolio('layout.menu.layout'),
  path: () => tPortfolio('layout.menu.connections'),
  graph: () => tPortfolio('layout.menu.graph'),
  panel: () => tPortfolio('layout.menu.panel'),
});
const PANEL_MENU_ACTION_LABEL_GETTERS = Object.freeze({
  'layout:split-horizontal': () => [tPortfolio('layout.action.splitHorizontal'), tPortfolio('layout.action.splitHorizontalTitle')],
  'layout:split-vertical': () => [tPortfolio('layout.action.splitVertical'), tPortfolio('layout.action.splitVerticalTitle')],
  'layout:duplicate': () => [tPortfolio('layout.action.duplicate'), tPortfolio('layout.action.duplicateTitle')],
  'layout:collapse-toggle': () => [tPortfolio('layout.action.collapse'), tPortfolio('layout.action.collapseTitle')],
  'layout:remove': () => [tPortfolio('layout.action.remove'), tPortfolio('layout.action.removeTitle')],
  'layout:close-ui-panel': () => [tPortfolio('layout.action.close'), tPortfolio('layout.action.closeTitle')],
  'layout:remove-ui-panel': () => [tPortfolio('layout.action.removeTemporary'), tPortfolio('layout.action.removeTemporaryTitle')],
});
let portfolioChromeLocalizationFrame = 0;
let portfolioChromeObserver = null;

function setLocalizedText(element, value) {
  if (element && element.textContent !== value) element.textContent = value;
}

function setLocalizedAttribute(element, name, value) {
  if (element && element.getAttribute(name) !== value) element.setAttribute(name, value);
}

function setLocalizedButtonChrome(element, label) {
  setLocalizedAttribute(element, 'title', label);
  setLocalizedAttribute(element, 'aria-label', label);
}

function localizePortfolioThemeWidget() {
  for (let widget of document.querySelectorAll('cascade-theme-widget')) {
    let triggerLabel = widget.querySelector('.ctw-trigger-label');
    let trigger = widget.querySelector('.ctw-trigger');
    setLocalizedText(triggerLabel, tPortfolio('panel.theme'));
    setLocalizedButtonChrome(trigger, tPortfolio('theme.quickControls'));
  }

  for (let popover of document.querySelectorAll('.ctw-popover')) {
    setLocalizedAttribute(popover, 'aria-label', tPortfolio('theme.quickControls'));
    setLocalizedText(popover.querySelector('.ctw-header strong'), tPortfolio('panel.theme'));
    setLocalizedButtonChrome(popover.querySelector('[data-action="copy"]'), tPortfolio('theme.copy'));
    setLocalizedButtonChrome(popover.querySelector('[data-action="reset"]'), tPortfolio('theme.reset'));
    setLocalizedButtonChrome(popover.querySelector('[data-action="open-full"]'), tPortfolio('theme.openFull'));
    setLocalizedAttribute(popover.querySelector('.ctw-mode'), 'aria-label', tPortfolio('theme.mode'));
    setLocalizedText(popover.querySelector('[data-theme-mode="dark"]'), tPortfolio('theme.dark'));
    setLocalizedText(popover.querySelector('[data-theme-mode="light"]'), tPortfolio('theme.light'));

    for (let [controlName, getLabel] of Object.entries(THEME_CONTROL_LABEL_GETTERS)) {
      setLocalizedText(popover.querySelector(`label[for="ctw-${controlName}"]`), getLabel());
    }
  }
}

function localizePortfolioLayoutChrome() {
  for (let button of document.querySelectorAll('.panel-menu-toggle')) {
    setLocalizedButtonChrome(button, tPortfolio('layout.panelActions'));
  }
  for (let panel of document.querySelectorAll('sn-tree-panel.portfolio-tree')) {
    setLocalizedAttribute(panel, 'aria-label', tPortfolio('tree.navigation'));
    setLocalizedAttribute(panel, 'title', tPortfolio('tree.navigation'));
  }
  for (let [groupId, getLabel] of Object.entries(PANEL_MENU_GROUP_LABEL_GETTERS)) {
    for (let row of document.querySelectorAll(`[data-menu-group="${groupId}"]`)) {
      setLocalizedText(row.querySelector('.panel-menu-row-label'), getLabel());
    }
  }
  for (let [actionId, getLabels] of Object.entries(PANEL_MENU_ACTION_LABEL_GETTERS)) {
    let [label, title] = getLabels();
    for (let button of document.querySelectorAll(`[data-menu-action-id="${actionId}"]`)) {
      setLocalizedText(button.querySelector('.panel-menu-action-label'), label);
      setLocalizedButtonChrome(button, title);
    }
  }
}

function localizePortfolioChrome() {
  localizePortfolioThemeWidget();
  localizePortfolioLayoutChrome();
}

function schedulePortfolioChromeLocalization() {
  if (portfolioChromeLocalizationFrame) return;
  let scheduleFrame = globalThis.requestAnimationFrame || globalThis.setTimeout;
  portfolioChromeLocalizationFrame = scheduleFrame(() => {
    portfolioChromeLocalizationFrame = 0;
    localizePortfolioChrome();
  });
}

function startPortfolioChromeLocalization() {
  localizePortfolioChrome();
  for (let tagName of ['cascade-theme-widget', 'panel-layout', 'sn-tree-panel']) {
    customElements.whenDefined(tagName).then(schedulePortfolioChromeLocalization).catch(() => {});
  }
  document.addEventListener('cascade-theme-change', schedulePortfolioChromeLocalization);
  document.addEventListener('cascade-theme-open-full', schedulePortfolioChromeLocalization);
  if (typeof MutationObserver !== 'function' || portfolioChromeObserver || !document.body) return;
  portfolioChromeObserver = new MutationObserver(schedulePortfolioChromeLocalization);
  portfolioChromeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['aria-label', 'class', 'hidden', 'title'],
    childList: true,
    subtree: true,
  });
}

function getPortfolioCanvasGraphTypeLabel(type) {
  return CANVAS_GRAPH_TYPE_LABEL_GETTERS[type]?.() || type;
}

function buildPortfolioFlatGraphInfoLines(graph, node) {
  let lines = [];
  lines.push(node.label);
  if (node.id !== node.label) lines.push(node.id);
  lines.push('');
  lines.push(`${tPortfolio('graph.info.type')}: ${getPortfolioCanvasGraphTypeLabel(node.type)}`);

  let connections = graph.adjMap?.get?.(node.id)?.size || 0;
  if (connections > 0) lines.push(`${tPortfolio('graph.info.connections')}: ${connections}`);
  if (node.children?.length > 0) lines.push(`${tPortfolio('graph.info.children')}: ${node.children.length}`);
  if (Array.isArray(node.exports) && node.exports.length > 0) {
    lines.push('');
    lines.push(`${tPortfolio('graph.info.exports')}:`);
    for (let item of node.exports.slice(0, 8)) lines.push(`  ${item}`);
    if (node.exports.length > 8) lines.push(`  ... +${node.exports.length - 8}`);
  }
  if (node.lines) lines.push(`${tPortfolio('graph.info.lines')}: ${node.lines}`);
  return lines;
}

function getSocialLinkSummary(summaryKey) {
  switch (summaryKey) {
    case 'social.facebook.summary':
      return tPortfolio('social.facebook.summary');
    case 'social.github.summary':
      return tPortfolio('social.github.summary');
    case 'social.linkedin.summary':
      return tPortfolio('social.linkedin.summary');
    case 'social.youtube.summary':
      return tPortfolio('social.youtube.summary');
    default:
      return '';
  }
}

function getPortfolioPdfDownloadLabel(locale) {
  switch (locale) {
    case 'en':
      return tPortfolio('pdf.en');
    case 'ru':
      return tPortfolio('pdf.ru');
    case 'es':
      return tPortfolio('pdf.es');
    default:
      return tPortfolio('pdf.downloads');
  }
}

document.title = tPortfolio('page.title');
document.querySelector('.pulse-header-title')?.replaceChildren(tPortfolio('page.title'));
let localeToggle = document.querySelector('.pulse-locale-toggle');
let headerMenuButton = document.querySelector('.pulse-header-menu-button');
headerMenuButton?.setAttribute('aria-label', tPortfolio('header.openMaterials'));
headerMenuButton?.setAttribute('title', tPortfolio('header.openMaterials'));
localeToggle?.setAttribute('aria-label', tPortfolio('header.language'));
localeToggle?.setAttribute('title', tPortfolio('header.language'));
localeToggle?.setAttribute('value', portfolioLocalization.locale);
function openMaterialsDrawerFromHeader() {
  document.dispatchEvent(new CustomEvent('portfolio-open-materials', {
    detail: { source: 'portfolio-header' },
  }));
}
function setPortfolioLocale(locale) {
  locale = normalizePortfolioLocale(locale);
  if (!locale || locale === portfolioLocalization.locale) return;
  setStoredPortfolioLocale(locale);
  if (typeof location === 'undefined') return;

  let nextUrl = new URL(location.href);
  nextUrl.searchParams.set('lang', locale);
  globalThis.location.assign(nextUrl.href);
}
headerMenuButton?.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  openMaterialsDrawerFromHeader();
});
localeToggle?.addEventListener('sn-segmented-change', (event) => {
  setPortfolioLocale(event.detail?.value);
});
document.addEventListener('click', (event) => {
  let target = event.target;
  if (!(target instanceof Element) || !target.closest('.pulse-header-menu-button')) return;
  event.preventDefault();
  openMaterialsDrawerFromHeader();
});
document.querySelector('.pulse-screen')?.setAttribute('aria-label', tPortfolio('page.aria'));

configureMaterialSymbols({
  hrefBuilder: (iconNames) => {
    let names = [...iconNames].sort().join(',');
    return `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=${names}`;
  },
});

applyCascadeTheme(document.documentElement, CASCADE_THEME_DEFAULTS);
startPortfolioChromeLocalization();

const THEME_STORAGE_KEY = 'symbiote-ui:cascade-theme-editor';
const THEME_TARGET_SELECTOR = ':root';
const TREE_STORAGE_KEY = `cv-portfolio-materials-tree-v4:${portfolioLocalization.locale}`;
const projectsElement = document.getElementById('pulse-projects-data');
const projects = projectsElement ? JSON.parse(projectsElement.textContent || '[]') : [];
const INITIAL_FOCUS_IDS = [
  'profile/photo',
  'bio/about',
  'projects/index',
  'skills/index',
];

const relationSocket = new Socket('portfolio', {
  color: 'var(--sn-conn-color, var(--sn-node-selected))',
});

const skillEntries = [
  {
    id: 'skills/agentic-ai',
    label: tPortfolio('skill.agenticAi.label'),
    icon: 'account_tree',
    category: 'server',
    summary: tPortfolio('skill.agenticAi.summary'),
    details: tPortfolio('skill.agenticAi.details'),
  },
  {
    id: 'skills/rnd-engineering',
    label: tPortfolio('skill.rnd.label'),
    icon: 'science',
    category: 'server',
    summary: tPortfolio('skill.rnd.summary'),
    details: tPortfolio('skill.rnd.details'),
  },
  {
    id: 'skills/product-ui',
    label: tPortfolio('skill.productUi.label'),
    icon: 'web_asset',
    category: 'module',
    summary: tPortfolio('skill.productUi.summary'),
    details: tPortfolio('skill.productUi.details'),
  },
  {
    id: 'skills/hardware-capture',
    label: tPortfolio('skill.hardwareCapture.label'),
    icon: 'precision_manufacturing',
    category: 'instance',
    summary: tPortfolio('skill.hardwareCapture.summary'),
    details: tPortfolio('skill.hardwareCapture.details'),
  },
];

const PROJECT_TREE_GROUPS = [
  {
    id: 'agentic-ai',
    label: tPortfolio('skill.agenticAi.label'),
    treeLabel: tPortfolio('projectGroup.agenticAi.label'),
    icon: 'account_tree',
    skillId: 'skills/agentic-ai',
    slugs: new Set([
      'agent-portal',
      'mcp-agent-portal',
      'project-graph-mcp',
      'agent-pool-mcp',
      'browser-x-mcp',
      'context-x-mcp',
      'terminal-x-mcp',
      'symbiote-workspace',
      'symbiote-engine',
    ]),
  },
  {
    id: 'product-ui',
    label: tPortfolio('skill.productUi.label'),
    treeLabel: tPortfolio('projectGroup.productUi.label'),
    icon: 'web_asset',
    skillId: 'skills/product-ui',
    slugs: new Set([
      'symbiote-video-studio',
      'megavisor',
      'lifecycle-messaging-platform',
      'symbiote-ui',
      'photopizza-remote',
      'photosnail-public',
    ]),
  },
  {
    id: 'archive',
    label: tPortfolio('projectGroup.archive.label'),
    treeLabel: tPortfolio('projectGroup.archive.label'),
    icon: 'history',
    skillId: 'skills/rnd-engineering',
    slugs: new Set([
      'symbiote-node',
    ]),
  },
  {
    id: 'hardware-capture',
    label: tPortfolio('skill.hardwareCapture.label'),
    treeLabel: tPortfolio('projectGroup.hardware.label'),
    icon: 'precision_manufacturing',
    skillId: 'skills/hardware-capture',
    slugs: new Set([
      'autobox-v1',
      'complexscan',
      'boothbot',
      'photopizza',
    ]),
  },
];

const PROJECT_TREE_GROUP_PRIORITIES = Object.freeze({
  'agentic-ai': [
    'agent-portal',
    'symbiote-workspace',
    'symbiote-engine',
    'project-graph-mcp',
    'agent-pool-mcp',
  ],
});

function getProjectTreeGroup(project) {
  return PROJECT_TREE_GROUPS.find((group) => group.slugs.has(project.slug)) || PROJECT_TREE_GROUPS[0];
}

function getProjectTreeGroupLabel(group) {
  return group.treeLabel || group.label;
}

function orderProjectsForTree(projectItems) {
  let originalIndex = new Map(projectItems.map((project, index) => [project.slug, index]));
  return [...projectItems].sort((a, b) => {
    let groupA = getProjectTreeGroup(a);
    let groupB = getProjectTreeGroup(b);
    if (groupA.id !== groupB.id) {
      return (originalIndex.get(a.slug) ?? 0) - (originalIndex.get(b.slug) ?? 0);
    }

    let priority = PROJECT_TREE_GROUP_PRIORITIES[groupA.id];
    if (!priority) {
      return (originalIndex.get(a.slug) ?? 0) - (originalIndex.get(b.slug) ?? 0);
    }

    let orderA = priority.indexOf(a.slug);
    let orderB = priority.indexOf(b.slug);
    let rankA = orderA === -1 ? Number.MAX_SAFE_INTEGER : orderA;
    let rankB = orderB === -1 ? Number.MAX_SAFE_INTEGER : orderB;
    return rankA - rankB || (originalIndex.get(a.slug) ?? 0) - (originalIndex.get(b.slug) ?? 0);
  });
}

function getSkillIdsForProject(project) {
  let text = `${project.title} ${project.summary}`.toLowerCase();
  let result = ['skills/rnd-engineering'];
  if (/agent|agentic|mcp|model routing|ai-assisted|code-intelligence|developer/.test(text)) {
    result.push('skills/agentic-ai');
  }
  if (/video|editor|ui|media|studio|interface|publishing|workspace|web component|platform|marketing|campaign|customer|crm/.test(text)) {
    result.push('skills/product-ui');
  }
  if (/robot|scan|360|photo|capture|turntable|hardware|photogrammetry|booth|equipment|3d/.test(text)) {
    result.push('skills/hardware-capture');
  }
  return result;
}

const PROJECT_LINK_SUMMARY_GETTERS = Object.freeze({
  'Public source repository': () => tPortfolio('project.linkSummary.publicSourceRepository'),
  'Published npm package': () => tPortfolio('project.linkSummary.publishedNpmPackage'),
  'YouTube channel with photogrammetry and capture workflow demos': () => tPortfolio('project.linkSummary.youtubePhotogrammetry'),
  'YouTube channel with product updates and demos': () => tPortfolio('project.linkSummary.youtubeProductUpdates'),
  'Cultural-heritage 3D visualizations': () => tPortfolio('project.linkSummary.culturalHeritageVisualizations'),
  'Hermitage netsuke scanning story': () => tPortfolio('project.linkSummary.hermitageNetsukeStory'),
  'Benin bronze digitization record': () => tPortfolio('project.linkSummary.beninDigitization'),
});

const PROJECT_PULSE_RELATIONS = Object.freeze({
  'agent-portal': ['mcp-agent-portal', 'project-graph-mcp', 'agent-pool-mcp', 'browser-x-mcp', 'context-x-mcp', 'terminal-x-mcp', 'symbiote-workspace', 'symbiote-ui'],
  'symbiote-video-studio': ['symbiote-ui', 'symbiote-workspace', 'lifecycle-messaging-platform'],
  'autobox-v1': ['photopizza', 'complexscan', 'megavisor'],
  complexscan: ['photopizza', 'autobox-v1'],
  boothbot: ['megavisor', 'photopizza', 'complexscan'],
  photopizza: ['megavisor', 'complexscan', 'autobox-v1', 'photopizza-remote', 'photosnail-public'],
  megavisor: ['photopizza', 'boothbot', 'complexscan'],
  'mcp-agent-portal': ['agent-portal', 'browser-x-mcp', 'context-x-mcp', 'terminal-x-mcp'],
  'project-graph-mcp': ['agent-portal', 'context-x-mcp', 'agent-pool-mcp'],
  'agent-pool-mcp': ['agent-portal', 'project-graph-mcp', 'terminal-x-mcp'],
  'browser-x-mcp': ['agent-portal', 'mcp-agent-portal', 'context-x-mcp'],
  'context-x-mcp': ['agent-portal', 'project-graph-mcp', 'browser-x-mcp'],
  'terminal-x-mcp': ['agent-portal', 'agent-pool-mcp', 'mcp-agent-portal'],
  'symbiote-workspace': ['agent-portal', 'symbiote-ui', 'symbiote-engine'],
  'symbiote-ui': ['agent-portal', 'symbiote-workspace', 'symbiote-engine', 'symbiote-video-studio'],
  'symbiote-node': ['symbiote-ui', 'symbiote-engine', 'symbiote-workspace'],
  'symbiote-engine': ['symbiote-ui', 'symbiote-workspace'],
  'photopizza-remote': ['photopizza', 'complexscan'],
  'photosnail-public': ['photopizza', 'megavisor'],
  'lifecycle-messaging-platform': ['agent-portal', 'symbiote-video-studio', 'symbiote-ui'],
});

function getProjectTranslation(project) {
  return PROJECT_TRANSLATIONS[portfolioLocalization.locale]?.[project.slug] || {};
}

function getProjectKicker(project) {
  let translation = getProjectTranslation(project);
  if (translation.kicker) return translation.kicker;

  let kicker = String(project?.kicker || '').trim();
  if (kicker === 'Selected project') return tPortfolio('project.kicker.selected');
  if (kicker === 'Author project') return tPortfolio('project.kicker.author');
  return kicker || project?.date || '';
}

function getProjectSummary(project) {
  return getProjectTranslation(project).summary || project.summary || '';
}

function getProjectDetails(project) {
  return getProjectTranslation(project).details || project.details || '';
}

function getProjectPulseNote(project) {
  return PROJECT_PULSE_NOTES[portfolioLocalization.locale]?.[project.slug]
    || PROJECT_PULSE_NOTES.en[project.slug]
    || {};
}

function getProjectPulseSummary(project) {
  return getProjectPulseNote(project).summary || getProjectSummary(project);
}

function getProjectPulseDetails(project) {
  return getProjectPulseNote(project).details || getProjectDetails(project);
}

function getProjectLinkLabel(project) {
  let label = String(project?.linkLabel || '').trim();
  if (!label || label === 'View project') return tPortfolio('link.learnMore');
  if (label === 'View repository') return tPortfolio('link.viewRepository');
  return label;
}

function getProjectLinkSummary(summary) {
  return PROJECT_LINK_SUMMARY_GETTERS[summary]?.() || summary;
}

function getProjectLinks(project) {
  return (project.links || []).map((item) => ({
    ...item,
    summary: getProjectLinkSummary(item.summary),
  }));
}

function getPortfolioRouteFromId(id) {
  return String(id || '').endsWith('/index') ? String(id).slice(0, -'/index'.length) : String(id || '');
}

function getPortfolioSearchSuffix() {
  return `?lang=${portfolioLocalization.locale}`;
}

function getPortfolioEntryHref(id) {
  let route = getPortfolioRouteFromId(id);
  return route ? `${route}/${getPortfolioSearchSuffix()}` : `.${getPortfolioSearchSuffix()}`;
}

function createMarkdown(entry) {
  let lines = [`# ${entry.label}`, ''];
  if (entry.period) {
    lines.push(entry.period, '');
  }
  if (entry.kicker) {
    lines.push(`**${entry.kicker}**`, '');
  }
  lines.push(entry.summary || tPortfolio('node.fallback'), '');
  if (entry.meta) {
    lines.push(entry.meta, '');
  }
  if (entry.details) {
    lines.push(entry.details, '');
  }
  if (entry.sections?.length) {
    for (let section of entry.sections) {
      lines.push(`## ${section.title}`, '');
      if (section.body) lines.push(section.body, '');
      for (let item of section.items || []) {
        lines.push(`**${item.label}**`, '', item.details, '');
      }
    }
  }
  if (entry.downloads?.length) {
    lines.push(`## ${entry.downloadsTitle || tPortfolio('pdf.downloads')}`, '');
    for (let item of entry.downloads) {
      lines.push(`[${item.label}](${item.href})`, '');
    }
  }
  if (entry.links?.length) {
    lines.push(`## ${entry.linksTitle || tPortfolio('profile.links')}`, '');
    for (let item of entry.links) {
      lines.push(`[${item.label}](${item.href}) - ${item.summary}`, '');
    }
  }
  if (entry.href) {
    lines.push(`[${entry.linkLabel || tPortfolio('link.learnMore')}](${entry.href})`, '');
  }
  if (entry.related?.length) {
    lines.push(`## ${tPortfolio('markdown.related')}`, '');
    for (let item of entry.relatedLinks || []) {
      lines.push(`- [${item.label}](${item.href})`);
    }
    for (let item of entry.related) lines.push(`- ${item}`);
  } else if (entry.relatedLinks?.length) {
    lines.push(`## ${tPortfolio('markdown.related')}`, '');
    for (let item of entry.relatedLinks) {
      lines.push(`- [${item.label}](${item.href})`);
    }
  }
  return lines.join('\n').trim();
}

function makeEntry(entry) {
  return {
    type: 'note',
    category: 'data',
    shape: 'rect',
    icon: 'article',
    focusIds: [entry.id],
    params: {},
    ...entry,
  };
}

function createPortfolioEntries() {
  let projectTitleBySlug = new Map(projects.map((project) => [project.slug, project.title]));
  let entries = [
    makeEntry({
      id: 'profile/photo',
      label: 'Vladimir Matiasevich',
      type: 'profile-photo',
      displayType: tPortfolio('entry.type.profile'),
      category: 'server',
      shape: 'disc',
      icon: 'person',
      meta: getProfileMetaText(),
      summary: tPortfolio('profile.summary'),
      details: tPortfolio('profile.details'),
      sections: getProfileSections(),
      downloadsTitle: tPortfolio('pdf.downloads'),
      downloads: PORTFOLIO_PDF_DOWNLOADS.map((item) => ({
        href: item.href,
        label: getPortfolioPdfDownloadLabel(item.locale),
      })),
      linksTitle: tPortfolio('profile.links'),
      links: socialLinks.map((item) => ({
        ...item,
        summary: getSocialLinkSummary(item.summaryKey),
      })),
      focusIds: INITIAL_FOCUS_IDS,
      params: {
        avatar: 'https://rnd-pro.com/idn/93c81af5-aaae-4b92-f288-1f0499726500/public',
        avatarAlt: tPortfolio('profile.avatarAlt'),
        size: 220,
        summary: tPortfolio('profile.summary'),
      },
    }),
    makeEntry({
      id: 'bio/about',
      label: tPortfolio('bio.label'),
      type: 'bio',
      displayType: tPortfolio('entry.type.summary'),
      category: 'data',
      icon: 'person',
      summary: tPortfolio('bio.summary'),
      details: tPortfolio('bio.details'),
      focusIds: ['profile/photo', 'bio/about', 'skills/index'],
    }),
    makeEntry({
      id: 'projects/index',
      label: tPortfolio('projects.label'),
      type: 'directory',
      displayType: tPortfolio('entry.type.projects'),
      category: 'directory',
      shape: 'circle',
      icon: 'folder',
      summary: tPortfolio('projects.summary'),
      details: tPortfolio('projects.details'),
      focusIds: ['profile/photo', 'projects/index', ...projects.slice(0, 2).map((item) => `projects/${item.slug}`)],
      params: { hideContent: true, tone: 'inverse' },
    }),
    makeEntry({
      id: 'pulse/index',
      label: tPortfolio('pulse.label'),
      type: 'directory',
      displayType: tPortfolio('entry.type.notes'),
      category: 'control',
      shape: 'circle',
      icon: 'article',
      summary: tPortfolio('pulse.summary'),
      details: tPortfolio('pulse.details'),
      focusIds: ['profile/photo', 'pulse/index', ...projects.slice(0, 2).map((item) => `pulse/${item.slug}`)],
      params: { hideContent: true, tone: 'inverse' },
    }),
    makeEntry({
      id: 'skills/index',
      label: tPortfolio('skills.label'),
      type: 'directory',
      displayType: tPortfolio('entry.type.skills'),
      category: 'module',
      shape: 'circle',
      icon: 'hub',
      summary: tPortfolio('skills.summary'),
      details: tPortfolio('skills.details'),
      focusIds: ['profile/photo', 'skills/index', ...skillEntries.map((item) => item.id)],
      params: { hideContent: true, tone: 'inverse' },
    }),
  ];

  for (let skill of skillEntries) {
    entries.push(makeEntry({
      ...skill,
      type: 'skill',
      displayType: tPortfolio('entry.type.skill'),
      details: skill.details,
      focusIds: ['skills/index', skill.id],
    }));
  }

  for (let project of projects) {
    let relatedSkillIds = getSkillIdsForProject(project);
    let projectKicker = getProjectKicker(project);
    let projectSummary = getProjectSummary(project);
    let projectDetails = getProjectDetails(project);
    let projectPulseSummary = getProjectPulseSummary(project);
    let projectPulseDetails = getProjectPulseDetails(project);
    let projectLinkLabel = getProjectLinkLabel(project);
    let projectLinks = getProjectLinks(project);
    entries.push(makeEntry({
      id: `projects/${project.slug}`,
      label: project.title,
      type: 'project',
      displayType: tPortfolio('entry.type.project'),
      category: 'data',
      icon: 'work',
      kicker: projectKicker,
      period: project.period,
      summary: projectSummary,
      details: projectDetails,
      href: project.href,
      linkLabel: projectLinkLabel,
      linksTitle: tPortfolio('project.links'),
      links: projectLinks,
      relatedLinks: [
        {
          label: `${tPortfolio('entry.type.note')}: ${project.title}`,
          href: getPortfolioEntryHref(`pulse/${project.slug}`),
        },
        ...relatedSkillIds
          .map((id) => skillEntries.find((skill) => skill.id === id))
          .filter(Boolean)
          .map((skill) => ({
            label: skill.label,
            href: getPortfolioEntryHref(skill.id),
          })),
      ],
      focusIds: ['projects/index', `projects/${project.slug}`, ...relatedSkillIds],
      params: {
        kicker: projectKicker,
        summary: projectSummary,
        image: project.image,
        imageAlt: project.alt,
        href: project.href,
        linkLabel: projectLinkLabel,
      },
    }));
    entries.push(makeEntry({
      id: `pulse/${project.slug}`,
      label: project.title,
      type: 'pulse',
      displayType: tPortfolio('entry.type.note'),
      category: 'module',
      icon: 'article',
      kicker: tPortfolio('pulse.label'),
      period: project.period,
      summary: projectPulseSummary,
      details: projectPulseDetails,
      href: project.href,
      linkLabel: projectLinkLabel,
      relatedLinks: [
        {
          label: `${tPortfolio('entry.type.project')}: ${project.title}`,
          href: getPortfolioEntryHref(`projects/${project.slug}`),
        },
        ...(PROJECT_PULSE_RELATIONS[project.slug] || [])
          .filter((slug) => projectTitleBySlug.has(slug))
          .map((slug) => ({
            label: `${tPortfolio('entry.type.note')}: ${projectTitleBySlug.get(slug)}`,
            href: getPortfolioEntryHref(`pulse/${slug}`),
          })),
      ],
      focusIds: ['pulse/index', `pulse/${project.slug}`, `projects/${project.slug}`],
    }));
  }

  return entries.map((entry) => ({
    ...entry,
    markdown: entry.markdown || createMarkdown(entry),
  }));
}

function addPorts(node) {
  node.addInput('in', new Input(relationSocket, 'in'));
  node.addOutput('out', new Output(relationSocket, 'out'));
}

function connect(editor, nodes, fromId, toId) {
  let from = nodes.get(fromId);
  let to = nodes.get(toId);
  if (!from || !to) return;
  editor.addConnection(new Connection(from, 'out', to, 'in'));
}

function resourcePathSegment(value) {
  return String(value || 'Untitled')
    .replace(/[\\/]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function createTreeItems(projectItems, pulseItems) {
  return buildResourceTreeFromEntries([
    {
      id: 'profile/photo',
      path: `${tPortfolio('bio.label')}/Vladimir Matiasevich.md`,
      label: 'Vladimir Matiasevich',
      icon: 'person',
      kind: 'profile',
      draggable: false,
    },
    {
      id: 'bio/about',
      path: `${tPortfolio('bio.label')}/${tPortfolio('bio.about')}.md`,
      label: tPortfolio('bio.about'),
      icon: 'article',
      kind: 'bio',
      draggable: false,
    },
    {
      id: 'projects/index',
      path: `${tPortfolio('projects.label')}/${tPortfolio('projects.overview')}.md`,
      label: tPortfolio('projects.overview'),
      icon: 'folder',
      kind: String(projectItems.length),
      draggable: false,
    },
    ...projectItems.map((project) => ({
      id: `projects/${project.slug}`,
      path: `${tPortfolio('projects.label')}/${resourcePathSegment(getProjectTreeGroupLabel(getProjectTreeGroup(project)))}/${resourcePathSegment(project.title)}.md`,
      label: project.title,
      icon: 'work',
      kind: 'project',
      draggable: false,
    })),
    {
      id: 'pulse/index',
      path: `${tPortfolio('pulse.label')}/${tPortfolio('pulse.overview')}.md`,
      label: tPortfolio('pulse.overview'),
      icon: 'article',
      kind: String(pulseItems.length),
      draggable: false,
    },
    ...pulseItems.map((project) => ({
      id: `pulse/${project.slug}`,
      path: `${tPortfolio('pulse.label')}/${resourcePathSegment(project.title)}.md`,
      label: project.title,
      icon: 'description',
      kind: 'note',
      draggable: false,
    })),
    {
      id: 'skills/index',
      path: `${tPortfolio('skills.label')}/${tPortfolio('skills.overview')}.md`,
      label: tPortfolio('skills.overview'),
      icon: 'hub',
      kind: String(skillEntries.length),
      draggable: false,
    },
    ...skillEntries.map((skill) => ({
      id: skill.id,
      path: `${tPortfolio('skills.label')}/${resourcePathSegment(skill.label)}.md`,
      label: skill.label,
      icon: skill.icon,
      kind: 'skill',
      draggable: false,
    })),
  ], {
    directoryIcon: 'folder',
    fileIcon: 'article',
    draggable: false,
    sort: false,
  });
}

function createStructuredGraphGroups(projectItems) {
  return {
    biography: ['profile/photo', 'bio/about'],
    skills: ['skills/index', ...skillEntries.map((skill) => skill.id)],
    projects: ['projects/index', ...projectItems.map((project) => `projects/${project.slug}`)],
    pulse: ['pulse/index', ...projectItems.map((project) => `pulse/${project.slug}`)],
  };
}

function setNodePositions(canvas, projectItems) {
  canvas.autoLayout({
    groups: createStructuredGraphGroups(projectItems),
    direction: 'LR',
    startX: 0,
    startY: 0,
    gapX: 120,
    gapY: 56,
    maxLayerRows: 4,
    fit: true,
    overlap: {
      paddingX: 40,
      paddingY: 32,
      passes: 16,
    },
  });
}

const portfolioEntries = new Map(createPortfolioEntries().map((entry) => [entry.id, entry]));
const orderedPortfolioProjects = orderProjectsForTree(projects);
const portfolioTreeItems = createTreeItems(orderedPortfolioProjects, orderedPortfolioProjects);
const projectTreeGroupDirectoryIds = PROJECT_TREE_GROUPS.map((group) => (
  `${tPortfolio('projects.label')}/${resourcePathSegment(getProjectTreeGroupLabel(group))}`
));
const defaultExpandedTreeIds = [
  tPortfolio('bio.label'),
  tPortfolio('projects.label'),
  ...projectTreeGroupDirectoryIds,
  tPortfolio('pulse.label'),
  tPortfolio('skills.label'),
];
const treeDirectorySelection = new Map([
  [tPortfolio('bio.label'), 'profile/photo'],
  [tPortfolio('projects.label'), 'projects/index'],
  [tPortfolio('pulse.label'), 'pulse/index'],
  [tPortfolio('skills.label'), 'skills/index'],
]);
for (let group of PROJECT_TREE_GROUPS) {
  treeDirectorySelection.set(
    `${tPortfolio('projects.label')}/${resourcePathSegment(getProjectTreeGroupLabel(group))}`,
    group.skillId
  );
}
const flatGroupSelection = new Map([
  ['group/biography', 'profile/photo'],
  ['group/projects', 'projects/index'],
  ['group/pulse', 'pulse/index'],
  ['group/skills', 'skills/index'],
]);
const portfolioRouteById = new Map(
  [...portfolioEntries.keys()].map((id) => [
    id,
    id.endsWith('/index') ? id.slice(0, -'/index'.length) : id,
  ])
);
const portfolioIdByRoute = new Map(
  [...portfolioRouteById.entries()].map(([id, route]) => [route, id])
);
portfolioIdByRoute.set('', 'profile/photo');
const directoryEntryIds = new Set([
  'projects/index',
  'pulse/index',
  'skills/index',
]);
const flatGraphGroups = [
  { id: 'group/biography', label: tPortfolio('bio.label'), type: 'data', children: ['profile/photo', 'bio/about'] },
  { id: 'group/projects', label: tPortfolio('projects.label'), type: 'asset', children: orderedPortfolioProjects.map((project) => `projects/${project.slug}`) },
  { id: 'group/pulse', label: tPortfolio('pulse.label'), type: 'docs', children: orderedPortfolioProjects.map((project) => `pulse/${project.slug}`) },
  { id: 'group/skills', label: tPortfolio('skills.label'), type: 'action', children: skillEntries.map((skill) => skill.id) },
];

const GRAPH_PATH_STYLES = [
  { style: 'pcb', label: tPortfolio('graph.path.pcb'), icon: 'route' },
  { style: 'orthogonal', label: tPortfolio('graph.path.orthogonal'), icon: 'account_tree' },
  { style: 'bezier', label: tPortfolio('graph.path.bezier'), icon: 'gesture' },
  { style: 'straight', label: tPortfolio('graph.path.straight'), icon: 'trending_flat' },
];

const GRAPH_ACTION_PATHS = Object.freeze({
  article: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM13 9V3.5L18.5 9H13zM8 13h8v2H8v-2zm0 4h8v2H8v-2z',
  branch: 'M12 2l2 4h-4l2-4zm0 20l-2-4h4l-2 4zm10-10l-4 2v-4l4 2zM2 12l4-2v4l-4-2zm10-4a4 4 0 100 8 4 4 0 000-8z',
  open: 'M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zM5 5h5V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5h-2v5H5V5z',
});

function collectTreeIconNames(items, result = new Set()) {
  for (let item of items || []) {
    if (item?.icon) result.add(item.icon);
    collectTreeIconNames(item?.children, result);
  }
  return result;
}

function preloadPortfolioIcons() {
  let iconNames = collectTreeIconNames(portfolioTreeItems, new Set([
    'account_tree',
    'article',
    'center_focus_strong',
    'chevron_left',
    'chevron_right',
    'close',
    'code',
    'content_copy',
    'dashboard',
    'delete',
    'edit',
    'folder',
    'fullscreen',
    'fullscreen_exit',
    'hub',
    'keyboard_arrow_down',
    'more_horiz',
    'palette',
    'person',
    'visibility_off',
    'web_asset',
    'work',
  ]));
  for (let entry of portfolioEntries.values()) {
    if (entry.icon) iconNames.add(entry.icon);
  }
  for (let item of GRAPH_PATH_STYLES) {
    iconNames.add(item.icon);
  }
  ensureMaterialSymbols([...iconNames]);
}

preloadPortfolioIcons();

function createPortfolioNodeActionItems() {
  return [
    { action: 'content', label: tPortfolio('graph.action.content'), path: GRAPH_ACTION_PATHS.article },
    { action: 'branch', label: tPortfolio('graph.action.branch'), path: GRAPH_ACTION_PATHS.branch },
    { action: 'open', label: tPortfolio('graph.action.open'), path: GRAPH_ACTION_PATHS.open },
  ];
}

function getCurrentGraphViewMode() {
  if (typeof location === 'undefined') return PORTFOLIO_DEFAULT_GRAPH_VIEW_MODE;
  let urlParams = new URLSearchParams(location.search);
  let modeParam = urlParams.get('mode');
  if (!modeParam) return PORTFOLIO_DEFAULT_GRAPH_VIEW_MODE;
  if (modeParam === 'structured') return 'structured';
  return resolveInitialGraphViewMode(urlParams);
}

function normalizeRoutePath(path) {
  return String(path || '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/index$/, '');
}

function _resolveBasePath() {
  if (typeof document === 'undefined' || typeof location === 'undefined') return '/';
  let base = document.querySelector('base')?.getAttribute('href') || './';
  let pathname = new URL(base, location.href).pathname;
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

const _cachedBasePath = _resolveBasePath();

function getPortfolioBasePath() {
  return _cachedBasePath;
}

function getInitialPortfolioSelection() {
  if (typeof location === 'undefined') return 'profile/photo';
  let basePath = getPortfolioBasePath();
  let pathname = location.pathname;
  let relativePath = pathname.startsWith(basePath)
    ? pathname.slice(basePath.length)
    : pathname.replace(/^\/+/, '');
  let route = normalizeRoutePath(decodeURIComponent(relativePath));
  return portfolioIdByRoute.get(route) || 'profile/photo';
}

function getPortfolioPath(id) {
  let route = portfolioRouteById.get(id) || '';
  let basePath = getPortfolioBasePath();
  return route ? `${basePath}${route}/`.replace(/\/{2,}/g, '/') : basePath;
}

function createGraphPanelMenuActions({
  editable = true,
  flatMode = getCurrentGraphViewMode() === 'flat',
  pathStyle = 'pcb',
} = {}) {
  return [
    {
      id: 'graph:fit',
      label: tPortfolio('graph.fit'),
      icon: 'center_focus_strong',
      title: tPortfolio('graph.fitTitle'),
      group: 'graph',
    },
    {
      id: 'graph:edit-toggle',
      label: tPortfolio('graph.edit'),
      icon: 'edit',
      title: tPortfolio('graph.editTitle'),
      group: 'graph',
      active: editable,
    },
    {
      id: 'graph:flat-toggle',
      label: tPortfolio('graph.flat'),
      icon: 'account_tree',
      title: tPortfolio('graph.flatTitle'),
      group: 'graph',
      active: flatMode,
    },
    ...GRAPH_PATH_STYLES.map((item) => ({
      id: `path:${item.style}`,
      label: item.label,
      icon: item.icon,
      title: tPortfolio('graph.pathTitle', { label: item.label }),
      group: 'path',
      active: pathStyle === item.style,
    })),
  ];
}

function resolveTreeSelection(item) {
  if (!item) return '';
  if (portfolioEntries.has(item.id)) return item.id;
  if (portfolioEntries.has(item.path)) return item.path;
  return treeDirectorySelection.get(item.id) || treeDirectorySelection.get(item.path) || '';
}

function resolveFlatGraphSelection(path) {
  if (portfolioEntries.has(path)) return path;
  return flatGroupSelection.get(path) || '';
}

function getFlatGraphFocusId(entry) {
  if (!entry?.id) return '';
  if (entry.id === 'projects/index') return 'group/projects';
  if (entry.id === 'pulse/index') return 'group/pulse';
  if (entry.id === 'skills/index') return 'group/skills';
  return entry.id;
}

function getFlatGraphFocusIds(entry) {
  let focusId = getFlatGraphFocusId(entry);
  if (!focusId) return [];
  if (entry.id === 'profile/photo') {
    return ['profile/photo', 'bio/about', 'group/projects', 'group/pulse', 'group/skills'];
  }
  if (entry.id === 'projects/index') {
    return ['group/projects', ...projects.slice(0, 3).map((project) => `projects/${project.slug}`)];
  }
  if (entry.id === 'pulse/index') {
    return ['group/pulse', ...projects.slice(0, 3).map((project) => `pulse/${project.slug}`)];
  }
  if (entry.id === 'skills/index') {
    return ['group/skills', ...skillEntries.slice(0, 5).map((skill) => skill.id)];
  }
  if (entry.id.startsWith('projects/')) {
    let project = projects.find((item) => `projects/${item.slug}` === entry.id);
    let ids = ['group/projects', entry.id];
    if (project) {
      ids.push(`pulse/${project.slug}`);
      ids.push(...getSkillIdsForProject(project).slice(0, 3));
    }
    return ids;
  }
  if (entry.id.startsWith('pulse/')) {
    let slug = entry.id.slice('pulse/'.length);
    return ['group/pulse', `projects/${slug}`, entry.id].filter((id) => id === 'group/pulse' || portfolioEntries.has(id));
  }
  if (entry.id.startsWith('skills/')) {
    let linkedProjects = projects
      .filter((project) => getSkillIdsForProject(project).includes(entry.id))
      .slice(0, 3)
      .map((project) => `projects/${project.slug}`);
    return ['group/skills', entry.id, ...linkedProjects];
  }
  return [focusId];
}

function getCanvasGraphNodeType(entry) {
  if (entry.type === 'project') return 'asset';
  if (entry.type === 'pulse') return 'docs';
  if (entry.type === 'skill') return 'action';
  return 'data';
}

function createPortfolioFlatGraphModel() {
  let nodes = [];
  let edges = [];
  for (let group of flatGraphGroups) {
    nodes.push({
      id: group.id,
      label: group.label,
      type: group.type,
      summary: tPortfolio('graph.groupSummary', { label: group.label }),
      isGroup: true,
      children: group.children,
    });
  }

  for (let entry of portfolioEntries.values()) {
    if (directoryEntryIds.has(entry.id)) continue;
    nodes.push({
      id: entry.id,
      label: entry.label,
      type: getCanvasGraphNodeType(entry),
      summary: entry.summary,
    });
  }

  let flatNodeIds = new Set(nodes.map((node) => node.id));
  let edgeKeys = new Set();
  let addEdge = (from, to, type = 'link') => {
    if (!flatNodeIds.has(from) || !flatNodeIds.has(to)) return;
    let key = `${from}->${to}`;
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({ from, to, type });
  };

  addEdge('group/biography', 'profile/photo', 'branch');
  addEdge('group/biography', 'bio/about', 'branch');
  addEdge('profile/photo', 'bio/about', 'bio');
  addEdge('profile/photo', 'group/projects', 'branch');
  addEdge('profile/photo', 'group/pulse', 'branch');
  addEdge('profile/photo', 'group/skills', 'branch');
  for (let skill of skillEntries) {
    addEdge('group/skills', skill.id, 'skill');
    addEdge('profile/photo', skill.id, 'skill');
  }
  for (let project of projects) {
    let projectId = `projects/${project.slug}`;
    let pulseId = `pulse/${project.slug}`;
    addEdge('group/projects', projectId, 'project');
    addEdge('group/pulse', pulseId, 'pulse');
    addEdge(projectId, pulseId, 'pulse');
    for (let skillId of getSkillIdsForProject(project)) addEdge(skillId, projectId, 'uses');
  }

  return {
    nodes,
    edges,
    groups: flatGraphGroups.map((group) => ({
      id: group.id,
      label: group.label,
      nodeIds: group.children,
    })),
    rootNodes: nodes.map((node) => node.id),
  };
}

const portfolioRuntime = {
  entries: portfolioEntries,
  treeItems: portfolioTreeItems,
  selectedId: getInitialPortfolioSelection(),
  graphMode: getCurrentGraphViewMode(),
  /** @type {any} */
  tree: null,
  /** @type {any} */
  canvas: null,
  /** @type {any} */
  graphController: null,
  /** @type {any} */
  viewer: null,

  setTree(panel) {
    this.tree = panel;
    this.syncTree();
  },

  setCanvas(canvas) {
    this.canvas = canvas;
    this.syncCanvas({ focus: true, focusScope: 'node' });
  },

  setGraphController(controller) {
    this.graphController = controller;
    this.syncCanvas({ focus: true, focusScope: 'node' });
  },

  setGraphMode(mode) {
    this.graphMode = mode === 'flat' ? 'flat' : 'structured';
  },

  setViewer(viewer) {
    this.viewer = viewer;
    this.syncViewer();
  },

  select(id, { focus = false, updateUrl = true, focusScope = 'node' } = {}) {
    if (!this.entries.has(id)) return;
    this.selectedId = id;
    if (updateUrl) this.syncUrl();
    this.syncTree();
    this.syncViewer();
    this.syncCanvas({ focus, focusScope });
  },

  getSelectedEntry() {
    return this.entries.get(this.selectedId) || this.entries.get('profile/photo');
  },

  syncTree() {
    if (!this.tree?.setItems) return;
    this.tree.defaultExpandedIds = defaultExpandedTreeIds;
    setTreeItems({ ref: { panel: this.tree } }, this.treeItems);
    showTree({ ref: { panel: this.tree } });
    highlightTreePath({ ref: { panel: this.tree } }, this.selectedId, { scroll: true });
  },

  syncViewer() {
    let entry = this.getSelectedEntry();
    if (!entry || !this.viewer?.showFile) return;
    this.viewer.showFile({
      path: `${resourcePathSegment(entry.label)}.md`,
      lang: 'md',
      raw: entry.markdown,
      statsText: entry.displayType || entry.type,
    });
    if (this.viewer.$) this.viewer.$.showGraphAction = false;
  },

  syncCanvas({ focus = false, focusScope = 'node' } = {}) {
    let entry = this.getSelectedEntry();
    if (!entry) return;
    if (!focus) return;
    let useGroupFocus = focusScope === 'group';
    let useNodeFitFocus = focusScope === 'node-fit';
    let structuredFocusTarget = useGroupFocus
      ? entry.focusIds || [entry.id]
      : useNodeFitFocus
        ? [entry.id]
        : entry.id;
    let flatFocusId = getFlatGraphFocusId(entry);
    let flatNodeIds = useGroupFocus ? getFlatGraphFocusIds(entry) : flatFocusId ? [flatFocusId] : [];
    if (this.graphController) {
      this.graphController.focusNode({
        nodeId: entry.id,
        structuredNodeIds: structuredFocusTarget,
        flatNodeId: flatFocusId,
        flatNodeIds,
        structuredOptions: {
          padding: 56,
          maxZoom: useNodeFitFocus
            ? 0.8
            : Array.isArray(structuredFocusTarget) && structuredFocusTarget.length > 1 ? 1 : 0.92,
          select: entry.id,
        },
        flatOptions: {
          padding: 96,
          maxZoom: 1.05,
          select: getFlatGraphFocusId(entry),
        },
      });
      return;
    }
    if (!this.canvas) return;
    this.canvas.focusNodes?.(structuredFocusTarget, {
      padding: 56,
      maxZoom: useNodeFitFocus
        ? 0.8
        : Array.isArray(structuredFocusTarget) && structuredFocusTarget.length > 1 ? 1 : 0.92,
      select: entry.id,
    });
  },

  syncUrl() {
    if (typeof location === 'undefined' || typeof history === 'undefined') return;
    let nextUrl = new URL(location.href);
    nextUrl.pathname = getPortfolioPath(this.selectedId);
    if (nextUrl.href !== location.href) {
      history.pushState({ selectedId: this.selectedId }, '', nextUrl);
    }
  },
};

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    let id = getInitialPortfolioSelection();
    if (id && id !== portfolioRuntime.selectedId) {
      portfolioRuntime.select(id, { focus: true, updateUrl: false });
    }
  });
}

function createPortfolioLayoutTree() {
  let treePanel = LayoutTree.createPanel('portfolio-tree', {}, {
    importance: PORTFOLIO_TREE_PANEL_IMPORTANCE,
    minInlineSize: PORTFOLIO_TREE_PANEL_MIN_INLINE_SIZE,
    minBlockSize: 180,
    collapse: 'auto',
    mobileDock: 'start',
    swipeControl: 'rail',
  });
  let graphPanel = LayoutTree.createPanel('portfolio-graph', {}, {
    importance: PORTFOLIO_GRAPH_PANEL_IMPORTANCE,
    minInlineSize: PORTFOLIO_GRAPH_PANEL_MIN_INLINE_SIZE,
    minBlockSize: 320,
    collapse: 'auto',
    mobileDock: 'end',
    swipeControl: 'rail',
  });
  let viewerPanel = LayoutTree.createPanel('portfolio-viewer', {}, {
    importance: 100,
    minInlineSize: 320,
    minBlockSize: 240,
    collapse: 'never',
    mobileDock: 'primary',
  });
  let contentSplit = LayoutTree.createSplit('horizontal', viewerPanel, graphPanel, 0.32, {
    importance: 90,
    minInlineSize: 740,
    minBlockSize: 320,
    collapse: 'never',
    responsiveMode: 'swipe',
  });
  return LayoutTree.createSplit('horizontal', treePanel, contentSplit, 0.22, {
    importance: 90,
    minInlineSize: PORTFOLIO_LAYOUT_MIN_INLINE_SIZE,
    minBlockSize: 420,
    collapse: 'never',
    responsiveMode: 'swipe',
  });
}

function createPortfolioEditor() {
  let editor = new NodeEditor();
  let nodes = new Map();
  for (let entry of portfolioRuntime.entries.values()) {
    let node = new Node(entry.label, {
      id: entry.id,
      type: entry.type,
      category: entry.category,
      shape: entry.shape,
      icon: entry.icon,
    });
    node.params = {
      summary: entry.summary,
      href: entry.href,
      linkLabel: entry.linkLabel,
      ...(entry.params || {}),
    };
    addPorts(node);
    editor.addNode(node);
    nodes.set(entry.id, node);
  }

  connect(editor, nodes, 'profile/photo', 'bio/about');
  connect(editor, nodes, 'profile/photo', 'projects/index');
  connect(editor, nodes, 'profile/photo', 'pulse/index');
  connect(editor, nodes, 'profile/photo', 'skills/index');
  for (let skill of skillEntries) connect(editor, nodes, 'skills/index', skill.id);
  for (let project of projects) {
    let projectId = `projects/${project.slug}`;
    connect(editor, nodes, 'projects/index', projectId);
    connect(editor, nodes, projectId, `pulse/${project.slug}`);
    connect(editor, nodes, 'pulse/index', `pulse/${project.slug}`);
    for (let skillId of getSkillIdsForProject(project)) {
      connect(editor, nodes, skillId, projectId);
    }
  }

  return editor;
}

class PortfolioTreePanel extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    this.innerHTML = /*html*/ `
      <sn-tree-panel
        class="portfolio-tree"
        title="${tPortfolio('tree.navigation')}"
        aria-label="${tPortfolio('tree.navigation')}"
        filter-placeholder="${tPortfolio('tree.filter')}"
        collapse-title="${tPortfolio('tree.collapse')}"></sn-tree-panel>
    `;
    let panel = /** @type {any} */ (this.querySelector('sn-tree-panel'));
    this.ref = { panel };
    Promise.all([
      customElements.whenDefined('sn-tree-panel'),
      customElements.whenDefined('sn-tree-view'),
    ]).then(() => {
      setupTreePanel(this, {
        storageKey: TREE_STORAGE_KEY,
        defaultExpandedIds: defaultExpandedTreeIds,
        onSelect: (item) => {
          let id = resolveTreeSelection(item);
          if (id) {
            portfolioRuntime.select(id, { focus: true });
            let layout = /** @type {any} */ (this.closest('panel-layout'));
            layout?.closeDrawer?.('start');
          }
        },
      });
      portfolioRuntime.setTree(panel);
    });
  }
}

class PortfolioGraphPanel extends HTMLElement {
  editable = true;
  flatMode = getCurrentGraphViewMode() === 'flat';
  pathStyle = 'pcb';
  /** @type {any} */
  canvas = null;
  /** @type {any} */
  flatGraph = null;
  /** @type {any} */
  graphController = null;

  connectedCallback() {
    if (this._ready) {
      this.observeGraphPanelVisibility();
      return;
    }
    this._ready = true;
    this.observeGraphPanelVisibility();
    Promise.all([
      customElements.whenDefined('node-canvas'),
      customElements.whenDefined('canvas-graph'),
    ]).then(() => this.initializeGraphCanvases());
  }

  disconnectedCallback() {
    this._graphResizeObserver?.disconnect?.();
    this._graphResizeObserver = null;
    this._graphDrawerObserver?.disconnect?.();
    this._graphDrawerObserver = null;
    this.cancelVisibleGraphFocus();
    this.cancelDeferredVisibleGraphFocus();
    this._graphWasVisible = false;
    this._graphVisibleFocusUntil = 0;
    this.cancelStructuredGraphBinding();
    this.cancelStructuredPathUpgrade({ clear: true });
    this.canvas?.suspendLayout?.({ reason: 'panel-disconnected' });
    this.flatGraph?.suspendLayout?.({ reason: 'panel-disconnected' });
  }

  observeGraphPanelVisibility() {
    if (!this.isConnected || this._graphResizeObserver) return;
    this.observeGraphDrawerState();
    let ResizeObserverCtor = globalThis.ResizeObserver;
    if (typeof ResizeObserverCtor !== 'function') {
      this.scheduleVisibleGraphFocus();
      return;
    }
    this._graphResizeObserver = new ResizeObserverCtor(() => this.scheduleVisibleGraphFocus());
    this._graphResizeObserver.observe(this);
    this.scheduleVisibleGraphFocus();
  }

  observeGraphDrawerState() {
    if (this._graphDrawerObserver) return;
    let MutationObserverCtor = globalThis.MutationObserver;
    let drawerNode = this.closest?.('layout-node');
    if (typeof MutationObserverCtor !== 'function' || !drawerNode) return;
    this._graphDrawerObserver = new MutationObserverCtor(() => {
      this._graphWasVisible = false;
      this.scheduleVisibleGraphFocus();
    });
    this._graphDrawerObserver.observe(drawerNode, {
      attributes: true,
      attributeFilter: ['drawer-open', 'drawer-expanded', 'drawer-rail-collapsed', 'style'],
    });
  }

  scheduleVisibleGraphFocus() {
    if (this._visibleGraphFocusFrame) return;
    let scheduleFrame = globalThis.requestAnimationFrame || globalThis.setTimeout;
    this._visibleGraphFocusFrame = scheduleFrame(() => {
      this._visibleGraphFocusFrame = 0;
      this.focusGraphAfterVisibleResize();
    });
  }

  cancelVisibleGraphFocus() {
    if (!this._visibleGraphFocusFrame) return;
    let cancelFrame = globalThis.cancelAnimationFrame || globalThis.clearTimeout;
    cancelFrame?.(this._visibleGraphFocusFrame);
    this._visibleGraphFocusFrame = 0;
  }

  scheduleDeferredVisibleGraphFocus() {
    let setTimer = globalThis.setTimeout;
    if (typeof setTimer !== 'function') return;
    this.cancelDeferredVisibleGraphFocus();
    this._deferredGraphFocusTimer = setTimer(() => {
      this._deferredGraphFocusTimer = 0;
      this._graphVisibleFocusUntil = 0;
      if (this.isGraphPanelVisible()) {
        this.focusVisibleGraphNow();
        this.scheduleStructuredPathUpgrade();
      }
    }, 360);
  }

  cancelDeferredVisibleGraphFocus() {
    if (!this._deferredGraphFocusTimer) return;
    globalThis.clearTimeout?.(this._deferredGraphFocusTimer);
    this._deferredGraphFocusTimer = 0;
  }

  isGraphPanelVisible() {
    let rect = this.getBoundingClientRect?.();
    if (!rect || rect.width < 128 || rect.height < 128) return false;

    let drawerNode = this.closest?.('layout-node');
    if (!drawerNode) return true;
    if (drawerNode.hasAttribute('drawer-rail-collapsed')) return false;
    if (
      drawerNode.hasAttribute('drawer-rail')
      && !drawerNode.hasAttribute('drawer-open')
      && !drawerNode.hasAttribute('drawer-expanded')
    ) {
      return false;
    }
    return true;
  }

  focusGraphAfterVisibleResize() {
    if (!this.isGraphPanelVisible()) {
      this._graphWasVisible = false;
      this._graphVisibleFocusUntil = 0;
      this.cancelDeferredVisibleGraphFocus();
      return;
    }
    if (!this._graphReady) return;
    if (!this.flatMode && !this._structuredBound) {
      this.scheduleStructuredGraphBinding();
    }

    let now = globalThis.performance?.now?.() || Date.now();
    if (!this._graphWasVisible) {
      this._graphWasVisible = true;
      this._graphVisibleFocusUntil = now + 600;
      this.focusVisibleGraphNow();
      this.scheduleDeferredVisibleGraphFocus();
      this.scheduleStructuredPathUpgrade();
      return;
    }

    if (this._graphVisibleFocusUntil && now <= this._graphVisibleFocusUntil) {
      this.focusVisibleGraphNow();
      this.scheduleDeferredVisibleGraphFocus();
      this.scheduleStructuredPathUpgrade();
    }
  }

  focusVisibleGraphNow() {
    this.canvas?.refreshConnections?.();
    portfolioRuntime.syncCanvas({ focus: true, focusScope: 'node-fit' });
  }

  initializeGraphCanvases() {
    if (this._graphReady) return;
    this._graphReady = true;
    this.graphController = createGraphViewModeController({
      mode: this.flatMode ? 'flat' : 'structured',
      pathStyle: this.pathStyle,
      flatPath: null,
    });
    this.ensureActiveGraphRenderer();
    this.applyGraphMode();
    this.applyGraphViewMode();
    this.applyPathStyle();
    this.addEventListener('panel-menu-action', (event) => this.onPanelMenuAction(event));

    requestAnimationFrame(() => {
      portfolioRuntime.setGraphMode(this.flatMode ? 'flat' : 'structured');
      portfolioRuntime.setCanvas(this.canvas);
      portfolioRuntime.setGraphController(this.graphController);
      this.scheduleVisibleGraphFocus();
      this.syncPanelMenuActions();
    });
  }

  ensureActiveGraphRenderer() {
    return this.ensureGraphRenderer(this.flatMode ? 'flat' : 'structured');
  }

  ensureGraphRenderer(mode) {
    if (mode === 'flat') {
      this.ensureFlatGraphRenderer();
      return this.flatGraph;
    }
    this.ensureStructuredGraphRenderer();
    return this.canvas;
  }

  ensureStructuredGraphRenderer() {
    if (this.canvas) return this.canvas;
    let canvas = /** @type {any} */ (document.createElement('node-canvas'));
    canvas.className = 'portfolio-canvas';
    if (this.firstChild) {
      this.insertBefore(canvas, this.firstChild);
    } else {
      this.append(canvas);
    }
    this.canvas = canvas;
    canvas.setPanels(false);
    canvas.setViewportLocked(false);
    this.setStructuredGraphLoading(!this._structuredBound && !this.flatMode);
    this.applyGraphMode();
    this.graphController?.connect?.({
      structuredCanvas: canvas,
      mode: this.flatMode ? 'flat' : 'structured',
    });
    canvas.addEventListener('selection-changed', (event) => {
      let [id] = event.detail?.nodes || [];
      if (id && id !== portfolioRuntime.selectedId) {
        portfolioRuntime.select(id, { focus: false });
      }
    });
    canvas.addEventListener('toolbar-action', (event) => this.onStructuredGraphToolbarAction(event));
    this.scheduleStructuredGraphBinding();
    return canvas;
  }

  scheduleStructuredGraphBinding() {
    if (
      this._structuredBound
      || this._structuredBindingTimer
      || this._structuredBindingFrame
      || this._structuredBindingIdleFrame
      || !this.canvas
    ) return;
    if (!this.isGraphPanelVisible()) {
      this.setStructuredGraphLoading(false);
      return;
    }
    this._structuredBindingTimer = globalThis.setTimeout(() => {
      this._structuredBindingTimer = 0;
      if (this.flatMode || !this.canvas || this._structuredBound) return;
      this.queueStructuredGraphBinding();
    }, 450);
  }

  queueStructuredGraphBinding() {
    if (this._structuredBindingFrame || this._structuredBindingIdleFrame) return;
    this.setStructuredGraphLoading(true);
    let callback = () => {
      this._structuredBindingFrame = 0;
      this._structuredBindingIdleFrame = 0;
      this.bindStructuredGraphRenderer();
    };
    if (typeof globalThis.requestIdleCallback === 'function') {
      this._structuredBindingIdleFrame = globalThis.requestIdleCallback(callback, { timeout: 600 });
      return;
    }
    this._structuredBindingFrame = globalThis.setTimeout(callback, 0);
  }

  cancelStructuredGraphBinding() {
    if (this._structuredBindingTimer) {
      globalThis.clearTimeout?.(this._structuredBindingTimer);
      this._structuredBindingTimer = 0;
    }
    if (this._structuredBindingFrame) {
      globalThis.clearTimeout?.(this._structuredBindingFrame);
      this._structuredBindingFrame = 0;
    }
    if (this._structuredBindingIdleFrame) {
      globalThis.cancelIdleCallback?.(this._structuredBindingIdleFrame);
      this._structuredBindingIdleFrame = 0;
    }
  }

  bindStructuredGraphRenderer() {
    if (this._structuredBound || this.flatMode || !this.canvas) return;
    if (!this.isGraphPanelVisible()) {
      this.setStructuredGraphLoading(false);
      return;
    }
    this.setStructuredGraphLoading(true);
    this.setStructuredStartupPath(true);
    try {
      let editor = this._structuredEditor || createPortfolioEditor();
      this._structuredEditor = editor;
      this.graphController?.setStructuredEditor?.(editor);
      setNodePositions(this.canvas, orderedPortfolioProjects);
      this.canvas.refreshConnections?.();
      this.canvas._layoutReleasedDom = false;
      this._structuredBound = true;
      portfolioRuntime.syncCanvas({ focus: true, focusScope: 'group' });
      this.scheduleStructuredPathUpgrade();
    } finally {
      this.setStructuredGraphLoading(false);
    }
  }

  setStructuredGraphLoading(active) {
    this.toggleAttribute('data-loading', Boolean(active));
    this.setAttribute('aria-busy', active ? 'true' : 'false');
  }

  setStructuredStartupPath(active) {
    if (!this.canvas) return;
    let useStraight = Boolean(active && this.pathStyle !== 'straight' && !this.flatMode);
    let connectionIds = useStraight ? this.getStructuredConnectionIds() : null;
    this.canvas.setTransientPathStyle?.(
      useStraight ? 'straight' : '',
      'portfolio-startup',
      connectionIds?.length ? { connectionIds } : {}
    );
  }

  getStructuredConnectionIds() {
    let connections = this._structuredEditor?.getConnections?.() || [];
    return connections.map((conn) => conn.id).filter(Boolean);
  }

  scheduleStructuredPathUpgrade() {
    this.cancelStructuredPathUpgrade();
    if (!this.canvas || this.flatMode || this.pathStyle === 'straight') {
      this.setStructuredStartupPath(false);
      return;
    }
    if (!this.isGraphPanelVisible()) return;
    this.setStructuredStartupPath(true);
    let requestFrame = globalThis.requestAnimationFrame || ((callback) => globalThis.setTimeout(callback, 16));
    this._structuredPathUpgradeFrame = requestFrame(() => {
      this._structuredPathUpgradeFrame = requestFrame(() => {
        this._structuredPathUpgradeFrame = 0;
        this._structuredPathUpgradeTimer = globalThis.setTimeout?.(() => {
          this._structuredPathUpgradeTimer = 0;
          if (!this.canvas || this.flatMode || this.pathStyle === 'straight' || !this.isGraphPanelVisible()) {
            this.setStructuredStartupPath(false);
            return;
          }
          this.upgradeStructuredPathsInChunks();
        }, 160);
      });
    });
  }

  upgradeStructuredPathsInChunks() {
    if (!this.canvas || this.flatMode || this.pathStyle === 'straight') {
      this.setStructuredStartupPath(false);
      return;
    }
    let remaining = new Set(this.getStructuredConnectionIds());
    if (!remaining.size) {
      this.setStructuredStartupPath(false);
      return;
    }
    let requestFrame = globalThis.requestAnimationFrame || ((callback) => globalThis.setTimeout(callback, 16));
    let chunkSize = 8;
    let step = () => {
      if (!this.canvas || this.flatMode || this.pathStyle === 'straight' || !this.isGraphPanelVisible()) {
        this.setStructuredStartupPath(false);
        return;
      }
      let chunk = [...remaining].slice(0, chunkSize);
      for (let connId of chunk) remaining.delete(connId);
      if (remaining.size) {
        this.canvas.setTransientPathStyle?.('straight', 'portfolio-startup', {
          connectionIds: remaining,
        });
        this._structuredPathUpgradeFrame = requestFrame(step);
        return;
      }
      this.setStructuredStartupPath(false);
      this._structuredPathUpgradeFrame = 0;
    };
    this._structuredPathUpgradeFrame = requestFrame(step);
  }

  cancelStructuredPathUpgrade({ clear = false } = {}) {
    if (this._structuredPathUpgradeFrame) {
      let cancelFrame = globalThis.cancelAnimationFrame || globalThis.clearTimeout;
      cancelFrame?.(this._structuredPathUpgradeFrame);
      this._structuredPathUpgradeFrame = 0;
    }
    if (this._structuredPathUpgradeTimer) {
      globalThis.clearTimeout?.(this._structuredPathUpgradeTimer);
      this._structuredPathUpgradeTimer = 0;
    }
    if (clear) {
      this.setStructuredStartupPath(false);
    }
  }

  ensureFlatGraphRenderer() {
    if (this.flatGraph) return this.flatGraph;
    let flatGraph = /** @type {any} */ (document.createElement('canvas-graph'));
    flatGraph.className = 'portfolio-flat-graph';
    flatGraph.setAttribute('device-orientation-parallax', '');
    flatGraph.setAttribute('device-orientation-parallax-strength', '28');
    flatGraph.setAttribute('device-orientation-parallax-max-tilt', '32');
    this.append(flatGraph);
    this.flatGraph = flatGraph;
    flatGraph._buildInfoLines = (node) => buildPortfolioFlatGraphInfoLines(flatGraph, node);
    let flatModel = this._flatModel || createPortfolioFlatGraphModel();
    this._flatModel = flatModel;
    this.graphController?.connect?.({
      flatGraph,
      flatModel,
      flatPath: null,
      mode: this.flatMode ? 'flat' : 'structured',
    });
    flatGraph.setActionItems?.(createPortfolioNodeActionItems());
    flatGraph?.addEventListener('file-selected', (event) => {
      let id = resolveFlatGraphSelection(event.detail?.path || '');
      if (id && id !== portfolioRuntime.selectedId) {
        portfolioRuntime.select(id, { focus: false });
      }
    });
    flatGraph?.addEventListener('group-selected', (event) => {
      let id = resolveFlatGraphSelection(event.detail?.path || '');
      if (id && id !== portfolioRuntime.selectedId) {
        portfolioRuntime.select(id, { focus: false });
      }
    });
    flatGraph?.addEventListener('toolbar-action', (event) => this.onFlatGraphToolbarAction(event));
    flatGraph?.addEventListener('orientation-parallax-status', (event) => this.onFlatGraphOrientationParallaxStatus(event));
    return flatGraph;
  }

  onStructuredGraphToolbarAction(event) {
    let action = event.detail?.action || '';
    let id = event.detail?.nodeId || '';
    if (!portfolioRuntime.entries.has(id)) return;

    if (action === 'explore') {
      portfolioRuntime.select(id, { focus: true, focusScope: 'group' });
      return;
    }

    if (action === 'view-code') {
      portfolioRuntime.select(id, { focus: false });
    }
  }

  onFlatGraphToolbarAction(event) {
    let action = event.detail?.action || '';
    let id = resolveFlatGraphSelection(event.detail?.nodeId || '');
    if (!id) return;
    let entry = portfolioRuntime.entries.get(id);
    if (!entry) return;

    if (action === 'open') {
      if (entry.href && typeof globalThis.open === 'function') {
        globalThis.open(entry.href, '_blank', 'noopener');
        return;
      }
      portfolioRuntime.select(id, { focus: false });
      return;
    }

    if (action === 'branch') {
      portfolioRuntime.select(id, { focus: true, focusScope: 'group' });
      return;
    }

    if (action === 'content') {
      portfolioRuntime.select(id, { focus: false });
    }
  }

  onFlatGraphOrientationParallaxStatus(event) {
    let detail = event.detail || {};
    this.flatGraph?.setAttribute?.(
      'data-orientation-parallax',
      detail.enabled ? 'enabled' : detail.reason || detail.permission || 'disabled'
    );
  }

  applyGraphMode() {
    if (!this.canvas) return;
    this.canvas.setReadonly(!this.editable);
    this.canvas.setReadonlyNodeDragging(false);
  }

  applyGraphViewMode() {
    let mode = this.flatMode ? 'flat' : 'structured';
    this.ensureGraphRenderer(mode);
    portfolioRuntime.setGraphMode(mode);
    this.setAttribute('data-mode', mode);
    this.graphController?.setMode(mode, { notify: false });
    if (mode === 'structured') {
      this.scheduleStructuredGraphBinding();
      if (this._structuredBound) this.scheduleStructuredPathUpgrade();
    } else {
      this.cancelStructuredGraphBinding();
      this.cancelStructuredPathUpgrade({ clear: true });
      this.setStructuredGraphLoading(false);
      if (this.canvas?._layoutReleasedDom) {
        this._structuredBound = false;
      }
    }
    portfolioRuntime.syncCanvas({ focus: true, focusScope: 'group' });
  }

  setGraphViewMode(flatMode) {
    this.flatMode = Boolean(flatMode);
    this.applyGraphViewMode();
    if (typeof location !== 'undefined' && typeof history !== 'undefined') {
      let nextUrl = new URL(location.href);
      if (this.flatMode) {
        nextUrl.searchParams.delete('mode');
      } else {
        nextUrl.searchParams.set('mode', 'structured');
      }
      if (nextUrl.href !== location.href) {
        history.replaceState(history.state, '', nextUrl);
      }
    }
    this.dispatchEvent(new CustomEvent('graph-shell-mode-change', {
      bubbles: true,
      composed: true,
      detail: { mode: this.flatMode ? 'flat' : 'structured' },
    }));
  }

  applyPathStyle() {
    if (this.graphController) {
      this.graphController.setPathStyle(this.pathStyle);
      if (this.pathStyle === 'straight') {
        this.cancelStructuredPathUpgrade({ clear: true });
      } else if (this._structuredBound && !this.flatMode) {
        this.scheduleStructuredPathUpgrade();
      }
      return;
    }
    this.canvas?.setPathStyle?.(this.pathStyle);
    this.canvas?.refreshConnections?.();
  }

  resetVisualState() {
    this.editable = true;
    this.pathStyle = 'pcb';
    this.applyGraphMode();
    this.applyPathStyle();
    this._graphWasVisible = false;
    this._graphVisibleFocusUntil = 0;
    this.canvas?.refreshConnections?.();
    this.graphController?.fitView?.();
    this.scheduleVisibleGraphFocus();
    this.syncPanelMenuActions();
  }

  syncPanelMenuActions() {
    this.dispatchEvent(new CustomEvent('panel-menu-actions', {
      bubbles: true,
      composed: true,
      detail: {
        actions: createGraphPanelMenuActions(this),
      },
    }));
  }

  onPanelMenuAction(event) {
    let actionId = event.detail?.actionId || '';
    if (actionId === 'graph:fit') {
      this.graphController?.fitView();
    } else if (actionId === 'graph:edit-toggle') {
      this.editable = !this.editable;
      this.applyGraphMode();
    } else if (actionId === 'graph:flat-toggle') {
      this.setGraphViewMode(!this.flatMode);
    } else if (actionId.startsWith('path:')) {
      let style = actionId.slice('path:'.length);
      if (GRAPH_PATH_STYLES.some((item) => item.style === style)) {
        this.pathStyle = style;
        this.applyPathStyle();
      }
    } else {
      return;
    }
    this.syncPanelMenuActions();
  }
}

class PortfolioViewerPanel extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    this.innerHTML = '<source-viewer class="portfolio-viewer"></source-viewer>';
    let viewer = /** @type {any} */ (this.querySelector('source-viewer'));
    if (!viewer) return;
    portfolioRuntime.setViewer(viewer);
  }
}

class PortfolioThemePanel extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    this.innerHTML = /*html*/ `
      <cascade-theme-editor
        class="portfolio-theme-editor"
        storage-key="${THEME_STORAGE_KEY}"
        target-selector="${THEME_TARGET_SELECTOR}"></cascade-theme-editor>
    `;
  }
}

class PortfolioWorkspace extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    this.innerHTML = /*html*/ `
      <panel-layout
        class="portfolio-layout"
        min-panel-size="150"
        min-panel-inline-size="220"
        min-panel-block-size="180"
        responsive-mode="swipe"
        responsive-breakpoint="${PORTFOLIO_LAYOUT_RESPONSIVE_BREAKPOINT}"
        swipe-control="rail"
        overflow-mode="collapse"></panel-layout>
    `;
    let layout = /** @type {any} */ (this.querySelector('panel-layout'));
    if (!layout) return;
    layout.registerPanelType('portfolio-tree', {
      title: tPortfolio('panel.materials'),
      icon: 'folder',
      component: 'portfolio-tree-panel',
      behavior: {
        importance: PORTFOLIO_TREE_PANEL_IMPORTANCE,
        minInlineSize: PORTFOLIO_TREE_PANEL_MIN_INLINE_SIZE,
        collapse: 'auto',
        mobileDock: 'start',
        swipeControl: 'rail',
      },
    });
    layout.registerPanelType('portfolio-graph', {
      title: tPortfolio('panel.graph'),
      icon: 'hub',
      component: 'portfolio-graph-panel',
      behavior: {
        importance: PORTFOLIO_GRAPH_PANEL_IMPORTANCE,
        minInlineSize: PORTFOLIO_GRAPH_PANEL_MIN_INLINE_SIZE,
        collapse: 'auto',
        mobileDock: 'end',
        swipeControl: 'rail',
      },
      menuActions: createGraphPanelMenuActions(),
    });
    layout.registerPanelType('portfolio-viewer', {
      title: tPortfolio('panel.content'),
      icon: 'article',
      component: 'portfolio-viewer-panel',
      behavior: { importance: 100, minInlineSize: 320, collapse: 'never', mobileDock: 'primary' },
    });
    layout.registerPanelType('portfolio-theme', {
      title: tPortfolio('panel.theme'),
      icon: 'palette',
      component: 'portfolio-theme-panel',
      behavior: { importance: 88, minInlineSize: 320, minBlockSize: 280, collapse: 'manual', mobileDock: 'end', swipeControl: 'rail' },
    });
    this._onThemeOpenFull = () => {
      layout.openPanel('portfolio-theme', {
        direction: 'horizontal',
        ratio: 0.72,
        behavior: { importance: 88, minInlineSize: 320, minBlockSize: 280, collapse: 'manual', mobileDock: 'end', swipeControl: 'rail' },
        source: 'cascade-theme-widget',
        uiInvoked: true,
      });
    };
    this._onOpenMaterials = () => {
      if (typeof layout.toggleDrawer === 'function' && layout.hasAttribute('drawer-mode-active')) {
        layout.toggleDrawer('start');
        return;
      }
      let handle = layout.querySelector('.layout-drawer-handle-stack-start [data-drawer-panel-id]');
      if (handle) {
        handle.click();
      }
    };
    document.addEventListener('cascade-theme-open-full', this._onThemeOpenFull);
    document.addEventListener('portfolio-open-materials', this._onOpenMaterials);
    layout.setLayout(createPortfolioLayoutTree());
  }

  disconnectedCallback() {
    if (this._onThemeOpenFull) {
      document.removeEventListener('cascade-theme-open-full', this._onThemeOpenFull);
    }
    if (this._onOpenMaterials) {
      document.removeEventListener('portfolio-open-materials', this._onOpenMaterials);
    }
  }
}

customElements.define('portfolio-tree-panel', PortfolioTreePanel);
customElements.define('portfolio-graph-panel', PortfolioGraphPanel);
customElements.define('portfolio-viewer-panel', PortfolioViewerPanel);
customElements.define('portfolio-theme-panel', PortfolioThemePanel);
customElements.define('portfolio-workspace', PortfolioWorkspace);
