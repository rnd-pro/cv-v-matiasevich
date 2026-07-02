import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import PDFDocument from 'pdfkit';

import { loadProjectEntries } from '../src/static-pages/data/projects.js';
import { PORTFOLIO_LOCALE_MESSAGES } from '../src/static-pages/data/portfolioTranslations.js';
import { PROJECT_TRANSLATIONS } from '../src/static-pages/data/projectTranslations.js';
import { socialLinks } from '../src/static-pages/data/socialLinks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDownloadsDir = path.join(rootDir, 'dist', 'downloads');
const avatarPath = path.join(rootDir, 'src', 'static-pages', 'avatar', 'avatar.png');
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const siteUrl = new URL(packageJson.homepage || 'https://rnd-pro.github.io/cv-v-matiasevich/');
if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname = `${siteUrl.pathname}/`;

const PDF_DOWNLOADS = Object.freeze({
  en: 'vladimir-matiasevich-cv-en.pdf',
  ru: 'vladimir-matiasevich-cv-ru.pdf',
  es: 'vladimir-matiasevich-cv-es.pdf',
});

const PDF_PROJECT_SLUGS = Object.freeze([
  'agent-portal',
  'project-graph-mcp',
  'lifecycle-messaging-platform',
  'autobox-v1',
  'complexscan',
  'megavisor',
]);

const FONT_CANDIDATES = Object.freeze({
  regular: [
    process.env.PORTFOLIO_PDF_FONT_REGULAR,
    process.env.PORTFOLIO_PDF_FONT,
    path.join(rootDir, 'src', 'static-pages', 'fonts', 'NotoSans-Regular.ttf'),
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
    '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',
    '/System/Library/Fonts/Supplemental/Arial.ttf',
    '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',
  ],
  bold: [
    process.env.PORTFOLIO_PDF_FONT_BOLD,
    path.join(rootDir, 'src', 'static-pages', 'fonts', 'NotoSans-Bold.ttf'),
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf',
    '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc',
    '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
    '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',
  ],
});

const COLORS = Object.freeze({
  ink: '#111827',
  muted: '#4b5563',
  faint: '#e5e7eb',
  accent: '#2563eb',
  chip: '#eff6ff',
});

function findFont(candidates) {
  return candidates.find((item) => item && fs.existsSync(item));
}

function getFonts() {
  const regular = findFont(FONT_CANDIDATES.regular);
  const bold = findFont(FONT_CANDIDATES.bold) || regular;
  if (!regular) {
    throw new Error([
      'No Unicode font found for portfolio PDF generation.',
      'Set PORTFOLIO_PDF_FONT_REGULAR to a .ttf/.otf font with Cyrillic support.',
    ].join(' '));
  }
  return { regular, bold };
}

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

function makeOnlineCvUrl(locale) {
  const url = new URL(siteUrl.href);
  url.searchParams.set('lang', locale);
  return url.href;
}

function getProjectSummary(project, locale) {
  return PROJECT_TRANSLATIONS[locale]?.[project.slug]?.summary || project.summary || '';
}

function plainTextMarkdown(value) {
  return String(value || '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*]\s+/gm, '');
}

function splitParagraphs(value) {
  return plainTextMarkdown(value)
    .split(/\n{2,}/)
    .map((item) => item.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function extractMarkdownBullets(value) {
  return String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => /^[-*]\s+/.test(item))
    .map((item) => plainTextMarkdown(item).trim())
    .filter(Boolean);
}

function makePdfPath(locale) {
  return path.join(distDownloadsDir, PDF_DOWNLOADS[locale]);
}

function createWriter(doc) {
  const page = {
    margin: 42,
    width: doc.page.width,
    height: doc.page.height,
  };
  const contentWidth = page.width - page.margin * 2;

  function ensureSpace(height) {
    if (doc.y + height <= page.height - page.margin - 28) return;
    doc.addPage();
  }

  function section(title, options = {}) {
    ensureSpace(options.space || 58);
    doc.moveDown(0.55);
    doc.font('bold').fontSize(15).fillColor(COLORS.ink).text(title, page.margin, doc.y);
    doc.moveTo(page.margin, doc.y + 4)
      .lineTo(page.width - page.margin, doc.y + 4)
      .strokeColor(COLORS.faint)
      .lineWidth(1)
      .stroke();
    doc.moveDown(0.8);
  }

  function paragraph(text, options = {}) {
    if (!text) return;
    ensureSpace(options.space || 46);
    doc.font(options.bold ? 'bold' : 'regular')
      .fontSize(options.size || 9.5)
      .fillColor(options.color || COLORS.ink)
      .text(plainTextMarkdown(text), page.margin, doc.y, {
        width: contentWidth,
        lineGap: options.lineGap ?? 2.2,
      });
    doc.moveDown(options.after ?? 0.55);
  }

  function paragraphs(text, options = {}) {
    for (const item of splitParagraphs(text)) paragraph(item, options);
  }

  function chip(text) {
    const width = contentWidth;
    const height = 20;
    ensureSpace(height + 4);
    const x = page.margin;
    const y = doc.y;
    doc.roundedRect(x, y, width, height, 5).fill(COLORS.chip);
    doc.font('bold').fontSize(8.5).fillColor(COLORS.accent).text(text, x + 9, y + 5, {
      width: width - 18,
      lineBreak: false,
    });
    doc.y = y + height + 4;
  }

  function link(label, href, summary = '') {
    ensureSpace(34);
    const y = doc.y;
    doc.font('bold').fontSize(9).fillColor(COLORS.accent).text(label, page.margin, y, {
      link: href,
      underline: true,
      width: 120,
      lineBreak: false,
    });
    const text = summary ? `${href} - ${summary}` : href;
    doc.font('regular').fontSize(8.2).fillColor(COLORS.muted).text(text, page.margin + 126, y + 0.8, {
      width: contentWidth - 126,
      lineGap: 1,
    });
    doc.moveDown(0.45);
  }

  function bullet(text, options = {}) {
    if (!text) return;
    ensureSpace(options.space || 28);
    const y = doc.y;
    doc.font('bold').fontSize(options.size || 8.6).fillColor(COLORS.accent).text('-', page.margin, y, {
      width: 10,
      lineBreak: false,
    });
    doc.font('regular').fontSize(options.size || 8.6).fillColor(options.color || COLORS.ink).text(text, page.margin + 14, y, {
      width: contentWidth - 14,
      lineGap: options.lineGap ?? 1.2,
    });
    doc.moveDown(options.after ?? 0.24);
  }

  function bullets(items, options = {}) {
    for (const item of items) bullet(item, options);
  }

  function projectBrief(project, locale) {
    const summary = getProjectSummary(project, locale);
    ensureSpace(52);
    const title = project.period ? `${project.title} · ${project.period}` : project.title;
    doc.font('bold').fontSize(10.4).fillColor(COLORS.ink).text(title, page.margin, doc.y, {
      width: contentWidth,
      ...(project.href ? { link: project.href, underline: true } : {}),
    });
    doc.moveDown(0.18);
    paragraph(summary, { size: 8.35, color: COLORS.muted, after: 0.2, space: 24, lineGap: 1.2 });
  }

  return {
    page,
    contentWidth,
    ensureSpace,
    section,
    paragraph,
    paragraphs,
    chip,
    link,
    bullet,
    bullets,
    projectBrief,
  };
}

function addHeader(doc, writer, locale) {
  const imageSize = 76;
  const imageX = writer.page.margin;
  const imageY = writer.page.margin;
  const textX = imageX + imageSize + 22;
  const textWidth = writer.page.width - textX - writer.page.margin;

  if (fs.existsSync(avatarPath)) {
    doc.save();
    doc.circle(imageX + imageSize / 2, imageY + imageSize / 2, imageSize / 2).clip();
    doc.image(avatarPath, imageX, imageY, { width: imageSize, height: imageSize });
    doc.restore();
    doc.circle(imageX + imageSize / 2, imageY + imageSize / 2, imageSize / 2)
      .strokeColor(COLORS.faint)
      .lineWidth(1)
      .stroke();
  }

  doc.font('bold').fontSize(24).fillColor(COLORS.ink).text('Vladimir Matiasevich', textX, imageY + 2, {
    width: textWidth,
  });
  doc.moveDown(0.15);
  doc.font('regular').fontSize(10.2).fillColor(COLORS.accent).text(t(locale, 'page.title'), textX, doc.y, {
    width: textWidth,
  });
  doc.moveDown(0.45);
  doc.font('regular').fontSize(10).fillColor(COLORS.ink).text(t(locale, 'profile.summary'), textX, doc.y, {
    width: textWidth,
    lineGap: 2,
  });
  doc.moveDown(0.25);
  doc.font('regular').fontSize(9.2).fillColor(COLORS.muted).text(`${t(locale, 'profile.locationLabel')}: ${t(locale, 'profile.locationValue')}`, textX, doc.y, {
    width: textWidth,
  });
  doc.font('regular').fontSize(9.2).fillColor(COLORS.muted).text(t(locale, 'profile.availability'), textX, doc.y, {
    width: textWidth,
  });
  doc.font('regular').fontSize(9.2).fillColor(COLORS.muted).text(`${t(locale, 'profile.languagesLabel')}: ${t(locale, 'profile.languagesValue')}`, textX, doc.y, {
    width: textWidth,
  });
  doc.font('regular').fontSize(9.2).fillColor(COLORS.muted).text(t(locale, 'profile.experienceSummary'), textX, doc.y, {
    width: textWidth,
  });
  const onlineCvUrl = makeOnlineCvUrl(locale);
  doc.font('regular').fontSize(9.2).fillColor(COLORS.accent).text(`${t(locale, 'profile.onlineCv')}: ${onlineCvUrl}`, textX, doc.y, {
    link: onlineCvUrl,
    underline: true,
    width: textWidth,
  });
  doc.y = Math.max(doc.y, imageY + imageSize + 26);
}

function addFooter(doc) {
  const range = doc.bufferedPageRange();
  for (let index = range.start; index < range.start + range.count; index += 1) {
    doc.switchToPage(index);
    const pageNumber = `${index + 1 - range.start} / ${range.count}`;
    doc.font('regular').fontSize(8).fillColor(COLORS.muted).text(
      pageNumber,
      42,
      doc.page.height - doc.page.margins.bottom - 22,
      { align: 'center', lineBreak: false, width: doc.page.width - 84 }
    );
  }
}

function writeLocalePdf(locale, projects, fonts) {
  fs.mkdirSync(distDownloadsDir, { recursive: true });
  const outputPath = makePdfPath(locale);
  const doc = new PDFDocument({
    size: 'A4',
    margin: 42,
    bufferPages: true,
    info: {
      Title: t(locale, 'page.title'),
      Author: 'Vladimir Matiasevich',
      Subject: 'CV and R&D portfolio',
      Keywords: 'CV, R&D, AI tooling, product platforms, hardware automation',
    },
  });
  doc.registerFont('regular', fonts.regular);
  doc.registerFont('bold', fonts.bold);

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);
  const writer = createWriter(doc);

  addHeader(doc, writer, locale);
  writer.section(t(locale, 'pdf.summaryTitle'));
  writer.paragraph(t(locale, 'pdf.summaryDetails'), { size: 9.2, color: COLORS.ink, after: 0.45 });
  writer.paragraph(t(locale, 'profile.statusDetails'), { size: 8.8, color: COLORS.muted, after: 0.25 });
  writer.paragraph(t(locale, 'profile.focusDetails'), { size: 8.8, color: COLORS.muted, after: 0.35 });

  writer.section(t(locale, 'skills.label'));
  writer.bullets(extractMarkdownBullets(t(locale, 'skills.details')), {
    size: 8.25,
    color: COLORS.ink,
    lineGap: 1,
    after: 0.18,
    space: 24,
  });

  writer.section(t(locale, 'experience.title'));
  writer.chip(t(locale, 'experience.rnd.label'));
  writer.paragraph(t(locale, 'experience.rnd.details'), { size: 8.45, color: COLORS.muted, after: 0.32 });
  writer.chip(t(locale, 'experience.programming.label'));
  writer.paragraph(t(locale, 'experience.programming.details'), { size: 8.45, color: COLORS.muted, after: 0.32 });
  writer.chip(t(locale, 'experience.leadership.label'));
  writer.paragraph(t(locale, 'experience.leadership.details'), { size: 8.45, color: COLORS.muted, after: 0.35 });

  writer.section(t(locale, 'pdf.projectsTitle'), { space: 128 });
  const projectBySlug = new Map(projects.map((project) => [project.slug, project]));
  for (const slug of PDF_PROJECT_SLUGS) {
    const item = projectBySlug.get(slug);
    if (item) writer.projectBrief(item, locale);
  }

  writer.section(t(locale, 'profile.links'));
  for (const item of socialLinks) {
    writer.link(item.label, item.href, t(locale, item.summaryKey));
  }

  addFooter(doc);
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

const fonts = getFonts();
const projects = loadProjectEntries();
const outputs = [];
for (const locale of ['en', 'ru', 'es']) {
  outputs.push(await writeLocalePdf(locale, projects, fonts));
}

for (const output of outputs) {
  process.stdout.write(`PDF generated: ${path.relative(rootDir, output)}\n`);
}
