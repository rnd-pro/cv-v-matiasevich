import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('portfolio build generates localized CV PDFs', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'));
  const portfolioSource = await readFile(new URL('../../src/static-pages/js/index.js', import.meta.url), 'utf8');
  const pdfSource = await readFile(new URL('../../scripts/generate-portfolio-pdfs.js', import.meta.url), 'utf8');

  assert.equal(packageJson.scripts['generate-pdfs'], 'node ./scripts/generate-portfolio-pdfs.js');
  assert.match(packageJson.scripts.build, /npm run generate-pdfs/);

  for (const locale of ['en', 'ru', 'es']) {
    assert.ok(portfolioSource.includes(`downloads/vladimir-matiasevich-cv-${locale}.pdf`));
    assert.ok(portfolioSource.includes(`tPortfolio('pdf.${locale}')`));
  }

  assert.match(portfolioSource, /downloadsTitle: tPortfolio\('pdf\.downloads'\)/);
  assert.match(portfolioSource, /## \$\{entry\.downloadsTitle \|\| tPortfolio\('pdf\.downloads'\)\}/);
  assert.doesNotMatch(pdfSource, /PROFILE_AGE/);
  assert.match(pdfSource, /function plainTextMarkdown\(value\)/);
  assert.match(pdfSource, /\.replace\(\/\\\[/);
  assert.match(pdfSource, /const PDF_PROJECT_SLUGS = Object\.freeze\(\[/);
  assert.match(pdfSource, /function extractMarkdownBullets\(value\)/);
  assert.match(pdfSource, /function projectBrief\(project, locale\)/);
  assert.doesNotMatch(pdfSource, /const PROJECT_GROUPS/);
  assert.doesNotMatch(pdfSource, /function getProjectDetails/);
  assert.doesNotMatch(pdfSource, /writer\.project\(item, locale\)/);
  assert.doesNotMatch(pdfSource, /profile\.factsTitle/);
  assert.match(pdfSource, /writer\.section\(t\(locale, 'pdf\.summaryTitle'\)\)/);
  assert.match(pdfSource, /t\(locale, 'pdf\.summaryDetails'\)/);
  assert.match(pdfSource, /t\(locale, 'profile\.statusDetails'\)/);
  assert.match(pdfSource, /t\(locale, 'profile\.focusDetails'\)/);
  assert.match(pdfSource, /writer\.bullets\(extractMarkdownBullets\(t\(locale, 'skills\.details'\)\)/);
  assert.match(pdfSource, /writer\.section\(t\(locale, 'experience\.title'\)\)/);
  assert.match(pdfSource, /writer\.section\(t\(locale, 'pdf\.projectsTitle'\), \{ space: 128 \}\)/);
  assert.match(pdfSource, /function makeOnlineCvUrl\(locale\)/);
  assert.match(pdfSource, /t\(locale, 'profile\.locationLabel'\)/);
  assert.match(pdfSource, /t\(locale, 'profile\.locationValue'\)/);
  assert.match(pdfSource, /t\(locale, 'profile\.availability'\)/);
  assert.match(pdfSource, /\$\{t\(locale, 'profile\.languagesLabel'\)\}: \$\{t\(locale, 'profile\.languagesValue'\)\}/);
  assert.match(pdfSource, /t\(locale, 'profile\.experienceSummary'\)/);
  assert.match(pdfSource, /t\(locale, 'profile\.onlineCv'\)/);
  assert.match(pdfSource, /t\(locale, 'experience\.rnd\.label'\)/);
  assert.match(pdfSource, /t\(locale, 'experience\.programming\.label'\)/);
  assert.match(pdfSource, /'agent-portal'/);
  assert.match(pdfSource, /'project-graph-mcp'/);
  assert.match(pdfSource, /'lifecycle-messaging-platform'/);
  assert.match(pdfSource, /'autobox-v1'/);
  assert.match(pdfSource, /'complexscan'/);
  assert.match(pdfSource, /'megavisor'/);
  assert.doesNotMatch(pdfSource, /private-lifecycle-marketing-platform/);
});
