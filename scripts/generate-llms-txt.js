import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadProjectEntries } from '../src/static-pages/data/projects.js';
import { PROJECT_TRANSLATIONS } from '../src/static-pages/data/projectTranslations.js';
import { PROJECT_PULSE_NOTES } from '../src/static-pages/data/projectPulseNotes.js';
import { PORTFOLIO_LOCALE_MESSAGES } from '../src/static-pages/data/portfolioTranslations.js';
import { socialLinks } from '../src/static-pages/data/socialLinks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const siteUrl = new URL(packageJson.homepage || 'https://rnd-pro.github.io/cv-v-matiasevich/');
if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname = `${siteUrl.pathname}/`;

const locales = Object.freeze(['en', 'ru', 'es']);
const localeNames = Object.freeze({
  en: 'English',
  ru: 'Russian',
  es: 'Spanish',
});

const projectGroups = Object.freeze([
  {
    title: 'AI tooling and agent systems',
    slugs: [
      'agent-portal',
      'symbiote-workspace',
      'symbiote-engine',
      'project-graph-mcp',
      'agent-pool-mcp',
      'mcp-agent-portal',
      'browser-x-mcp',
      'context-x-mcp',
      'terminal-x-mcp',
    ],
  },
  {
    title: 'Product platforms and interfaces',
    slugs: [
      'symbiote-video-studio',
      'megavisor',
      'lifecycle-messaging-platform',
      'symbiote-ui',
      'photopizza-remote',
      'photosnail-public',
    ],
  },
  {
    title: 'Archived projects',
    slugs: [
      'symbiote-node',
    ],
  },
  {
    title: 'Hardware and process automation',
    slugs: [
      'autobox-v1',
      'complexscan',
      'boothbot',
      'photopizza',
    ],
  },
]);

const skillKeys = Object.freeze([
  'rnd',
  'agenticAi',
  'productUi',
  'hardwareCapture',
]);

const pdfDownloads = Object.freeze({
  en: 'downloads/vladimir-matiasevich-cv-en.pdf',
  ru: 'downloads/vladimir-matiasevich-cv-ru.pdf',
  es: 'downloads/vladimir-matiasevich-cv-es.pdf',
});


function formatMessage(value, params = {}) {
  return String(value || '').replace(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g, (match, key) => {
    return Object.hasOwn(params, key) ? String(params[key]) : match;
  });
}

function t(locale, key, params = {}) {
  return formatMessage(PORTFOLIO_LOCALE_MESSAGES[locale]?.[`portfolio.${key}`]
    || PORTFOLIO_LOCALE_MESSAGES.en[`portfolio.${key}`]
    || key, params);
}

function oneLine(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function urlFor(route = '', locale = '') {
  const cleanRoute = String(route || '').replace(/^\/+/, '');
  const isFile = /\.[a-z0-9]+$/i.test(cleanRoute);
  const withSlash = cleanRoute && !isFile && !cleanRoute.endsWith('/') ? `${cleanRoute}/` : cleanRoute;
  const url = new URL(withSlash, siteUrl);
  if (locale) url.searchParams.set('lang', locale);
  return url.href;
}

function repositoryUrl() {
  const raw = String(packageJson.repository?.url || '');
  const sshMatch = raw.match(/^git\+ssh:\/\/git@github\.com[:/](.+?)(?:\.git)?$/);
  if (sshMatch) return `https://github.com/${sshMatch[1]}`;
  const httpsMatch = raw.match(/^git\+(https:\/\/.+?)(?:\.git)?$/);
  if (httpsMatch) return httpsMatch[1];
  return 'https://github.com/rnd-pro/cv-v-matiasevich';
}

function projectTranslation(project, locale) {
  return PROJECT_TRANSLATIONS[locale]?.[project.slug] || {};
}

function projectSummary(project, locale) {
  return projectTranslation(project, locale).summary || project.summary || '';
}

function projectDetails(project, locale) {
  return projectTranslation(project, locale).details || project.details || '';
}

function pulseNote(project, locale) {
  return PROJECT_PULSE_NOTES[locale]?.[project.slug]
    || PROJECT_PULSE_NOTES.en[project.slug]
    || {};
}

function shiftHeadings(markdown, depth = 2) {
  return String(markdown || '').replace(/^(#{1,6})\s+/gm, (match, hashes) => {
    return `${'#'.repeat(Math.min(6, hashes.length + depth))} `;
  });
}

function appendListItem(lines, label, href, description = '') {
  const suffix = description ? `: ${oneLine(description)}` : '';
  lines.push(`- [${label}](${href})${suffix}`);
}

function writeLlmsTxt(projects) {
  const projectBySlug = new Map(projects.map((project) => [project.slug, project]));
  const lines = [
    '# Vladimir Matiasevich Portfolio',
    '',
    `> ${oneLine(t('en', 'profile.summary'))}`,
    '',
    'Curated R&D portfolio covering AI tooling, agent systems, product platforms, media systems, process automation, and selected hardware-backed/open-source case studies. The site supports English, Russian, and Spanish through the `lang` query parameter.',
    '',
    'Use `llms-full.txt` for a fuller markdown export of profile text, project case studies, and R&D journal notes across all supported locales.',
    '',
    '## Core',
  ];

  appendListItem(
    lines,
    'Portfolio home',
    urlFor('', 'en'),
    `${t('en', 'profile.locationLabel')}: ${t('en', 'profile.locationValue')}. ${t('en', 'profile.availability')} ${t('en', 'profile.languagesLabel')}: ${t('en', 'profile.languagesValue')}. ${t('en', 'profile.experienceSummary')}. ${t('en', 'profile.details')}`
  );
  appendListItem(lines, 'Full LLM context', urlFor('llms-full.txt'), 'Complete generated markdown export for the portfolio.');
  appendListItem(lines, 'Sitemap', urlFor('sitemap.xml'), 'Machine-readable list of generated site routes.');
  appendListItem(lines, 'English CV PDF', urlFor(pdfDownloads.en), 'Downloadable PDF CV in English.');
  appendListItem(lines, 'Russian CV PDF', urlFor(pdfDownloads.ru), 'Downloadable PDF CV in Russian.');
  appendListItem(lines, 'Spanish CV PDF', urlFor(pdfDownloads.es), 'Downloadable PDF CV in Spanish.');

  lines.push('', '## Project case studies');
  for (const group of projectGroups) {
    lines.push('', `### ${group.title}`);
    for (const slug of group.slugs) {
      const project = projectBySlug.get(slug);
      if (!project) continue;
      const periodPrefix = project.period ? `${project.period}. ` : '';
      appendListItem(lines, project.title, urlFor(`projects/${project.slug}`, 'en'), `${periodPrefix}${projectSummary(project, 'en')}`);
    }
  }

  lines.push('', '## R&D journal notes');
  for (const project of projects) {
    appendListItem(lines, `${project.title} R&D note`, urlFor(`pulse/${project.slug}`, 'en'), pulseNote(project, 'en').summary);
  }

  lines.push('', '## Skills');
  appendListItem(lines, t('en', 'skill.rnd.label'), urlFor('skills/rnd-engineering', 'en'), t('en', 'skill.rnd.summary'));
  appendListItem(lines, t('en', 'skill.agenticAi.label'), urlFor('skills/agentic-ai', 'en'), t('en', 'skill.agenticAi.summary'));
  appendListItem(lines, t('en', 'skill.productUi.label'), urlFor('skills/product-ui', 'en'), t('en', 'skill.productUi.summary'));
  appendListItem(lines, t('en', 'skill.hardwareCapture.label'), urlFor('skills/hardware-capture', 'en'), t('en', 'skill.hardwareCapture.summary'));

  lines.push('', '## Public profiles');
  for (const item of socialLinks) {
    appendListItem(lines, item.label, item.href, t('en', item.summaryKey));
  }

  lines.push('', '## Optional');
  appendListItem(lines, 'Russian portfolio home', urlFor('', 'ru'), 'Localized Russian portfolio view.');
  appendListItem(lines, 'Spanish portfolio home', urlFor('', 'es'), 'Localized Spanish portfolio view.');

  return `${lines.join('\n')}\n`;
}

function writeFullLocale(lines, projects, locale) {
  lines.push(`## Locale: ${localeNames[locale]}`, '');
  lines.push('### Profile', '');
  lines.push(oneLine(t(locale, 'profile.summary')), '');
  lines.push(`${t(locale, 'profile.locationLabel')}: ${t(locale, 'profile.locationValue')}`, '');
  lines.push(t(locale, 'profile.availability'), '');
  lines.push(`${t(locale, 'profile.languagesLabel')}: ${t(locale, 'profile.languagesValue')}`, '');
  lines.push(t(locale, 'profile.experienceSummary'), '');
  lines.push(`${t(locale, 'profile.onlineCv')}: ${urlFor('', locale)}`, '');
  lines.push(t(locale, 'profile.details'), '');
  lines.push(`#### ${t(locale, 'experience.title')}`, '');
  lines.push(`**${t(locale, 'experience.rnd.label')}**`, '');
  lines.push(t(locale, 'experience.rnd.details'), '');
  lines.push(`**${t(locale, 'experience.programming.label')}**`, '');
  lines.push(t(locale, 'experience.programming.details'), '');
  lines.push(t(locale, 'bio.details'), '');

  lines.push('### Skills', '');
  for (const key of skillKeys) {
    lines.push(`#### ${t(locale, `skill.${key}.label`)}`, '');
    lines.push(t(locale, `skill.${key}.summary`), '');
  }

  lines.push('### Project case studies', '');
  for (const project of projects) {
    lines.push(`#### ${project.title}`, '');
    lines.push(`URL: ${urlFor(`projects/${project.slug}`, locale)}`, '');
    if (project.period) lines.push(`Period: ${project.period}`, '');
    lines.push(projectSummary(project, locale), '');
    lines.push(shiftHeadings(projectDetails(project, locale)), '');
    if (project.links?.length) {
      lines.push('##### External links', '');
      for (const item of project.links) {
        appendListItem(lines, item.label, item.href, item.summary);
      }
      lines.push('');
    }
    if (project.href) {
      appendListItem(lines, 'Project source', project.href, project.linkLabel || 'Project URL');
      lines.push('');
    }
  }

  lines.push('### R&D journal notes', '');
  for (const project of projects) {
    const note = pulseNote(project, locale);
    lines.push(`#### ${project.title}`, '');
    lines.push(`URL: ${urlFor(`pulse/${project.slug}`, locale)}`, '');
    if (project.period) lines.push(`Period: ${project.period}`, '');
    lines.push(note.summary || projectSummary(project, locale), '');
    lines.push(shiftHeadings(note.details || projectDetails(project, locale)), '');
  }
}

function writeLlmsFullTxt(projects) {
  const lines = [
    '# Vladimir Matiasevich Portfolio - Full LLM Context',
    '',
    `> ${oneLine(t('en', 'profile.summary'))}`,
    '',
    `Generated from structured portfolio data in the \`${packageJson.name}\` site build. This file expands profile copy, project case studies, and R&D journal notes for English, Russian, and Spanish.`,
    '',
    '## Site metadata',
    '',
  ];

  appendListItem(lines, 'Portfolio home', urlFor('', 'en'), 'Primary interactive portfolio.');
  appendListItem(lines, 'llms.txt', urlFor('llms.txt'), 'Compact LLM index.');
  appendListItem(lines, 'GitHub source', repositoryUrl(), 'Source repository.');
  lines.push('');

  for (const locale of locales) {
    writeFullLocale(lines, projects, locale);
  }

  return `${lines.join('\n')}\n`;
}

fs.mkdirSync(distDir, { recursive: true });
const projects = loadProjectEntries();
const outputs = [
  ['llms.txt', writeLlmsTxt(projects)],
  ['llms-full.txt', writeLlmsFullTxt(projects)],
];

for (const [fileName, content] of outputs) {
  fs.writeFileSync(path.join(distDir, fileName), content);
  process.stdout.write(`LLM context generated: ${path.relative(rootDir, path.join(distDir, fileName))}\n`);
}
