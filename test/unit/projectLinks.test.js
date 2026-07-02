import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

import { loadProjectEntries } from '../../src/static-pages/data/projects.js';
import { PROJECT_TRANSLATIONS } from '../../src/static-pages/data/projectTranslations.js';

test('project entries expose project-specific YouTube channels', () => {
  const projects = loadProjectEntries();
  const bySlug = new Map(projects.map((project) => [project.slug, project]));

  assert.deepEqual(bySlug.get('complexscan')?.links, [
    {
      label: 'PHOTOGRAMMETRY',
      href: 'https://www.youtube.com/@PHOTOGRAMMETRY',
      summary: 'YouTube channel with photogrammetry and capture workflow demos',
    },
  ]);
  assert.deepEqual(bySlug.get('photopizza')?.links, [
    {
      label: 'PhotoPizza',
      href: 'https://www.youtube.com/@PhotoPizza',
      summary: 'YouTube channel with product updates and demos',
    },
  ]);
});

test('project entries include public author projects', () => {
  const projects = loadProjectEntries();
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const expected = [
    ['mcp-agent-portal', 'https://github.com/rnd-pro/mcp-agent-portal'],
    ['project-graph-mcp', 'https://github.com/rnd-pro/project-graph-mcp'],
    ['agent-pool-mcp', 'https://github.com/rnd-pro/agent-pool-mcp'],
    ['browser-x-mcp', 'https://github.com/rnd-pro/browser-x-mcp'],
    ['context-x-mcp', 'https://github.com/rnd-pro/context-x-mcp'],
    ['terminal-x-mcp', 'https://github.com/rnd-pro/terminal-x-mcp'],
    ['symbiote-workspace', 'https://github.com/rnd-pro/symbiote-workspace'],
    ['symbiote-ui', 'https://github.com/rnd-pro/symbiote-ui'],
    ['symbiote-node', 'https://github.com/rnd-pro/symbiote-node'],
    ['symbiote-engine', 'https://github.com/rnd-pro/symbiote-engine'],
    ['photopizza-remote', 'https://github.com/PhotoPizza/remote'],
    ['photosnail-public', 'https://github.com/PhotoSnail/public'],
  ];

  for (const [slug, href] of expected) {
    const project = bySlug.get(slug);
    assert.equal(project?.href, href);
    assert.equal(project?.kicker, 'Author project');
    assert.equal(project?.linkLabel, 'View repository');
  }

  assert.equal(bySlug.get('symbiote-node')?.title, 'Symbiote Node');
  assert.match(bySlug.get('symbiote-node')?.summary || '', /Early package workspace/);
  assert.doesNotMatch(bySlug.get('symbiote-node')?.summary || '', /archived|legacy/i);
});

test('project entries expose markdown details in portfolio data', () => {
  const projects = loadProjectEntries();
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const agentPortal = bySlug.get('agent-portal');
  const projectGraph = bySlug.get('project-graph-mcp');
  const agentPool = bySlug.get('agent-pool-mcp');
  const megavisor = bySlug.get('megavisor');
  const autobox = bySlug.get('autobox-v1');
  const complexscan = bySlug.get('complexscan');

  assert.match(agentPortal?.summary || '', /graph-based context/);
  assert.match(agentPortal?.summary || '', /RAG-style context retrieval/);
  assert.match(agentPortal?.summary || '', /model\/resource routing/);
  assert.match(agentPortal?.details || '', /resource-aware agent development/);
  assert.match(agentPortal?.details || '', /human-in-the-loop control/);
  assert.match(agentPortal?.details || '', /cheaper\/faster models/);
  assert.match(projectGraph?.summary || '', /RAG-style project retrieval/);
  assert.match(projectGraph?.summary || '', /compressed project skeletons/);
  assert.match(projectGraph?.details || '', /GraphRAG-style retrieval/);
  assert.match(projectGraph?.details || '', /10-50x context reduction/);
  assert.match(projectGraph?.details || '', /faster\/cheaper model/);
  assert.match(agentPool?.summary || '', /assigning model\/resource tiers/);
  assert.match(agentPool?.summary || '', /handoffs/);
  assert.match(agentPool?.details || '', /cross-model consensus/);
  assert.match(agentPool?.details || '', /eval-style checks/);
  assert.match(agentPool?.details || '', /cheaper\/faster workers/);
  assert.match(megavisor?.summary || '', /360-degree capture workflows/);
  assert.match(megavisor?.details || '', /co-founder and CTO/);
  assert.match(megavisor?.details || '', /customer warehouses/);
  assert.doesNotMatch(megavisor?.details || '', /^# MEGAVISOR/);
  assert.match(autobox?.details || '', /original capture technology line/);
  assert.match(autobox?.details || '', /upper competitive level of its time/);
  assert.match(autobox?.details || '', /Ten Japanese netsuke objects/);
  assert.match(autobox?.details || '', /Anna Savelyeva/);
  assert.match(autobox?.details || '', /Max Rutherston/);
  assert.match(autobox?.details || '', /himotoshi cord holes/);
  assert.match(complexscan?.details || '', /original product line/);
  assert.match(complexscan?.details || '', /higher-quality source textures/);
  assert.match(PROJECT_TRANSLATIONS.ru['autobox-v1'].details, /авторскую линию технологии съёмки/);
  assert.match(PROJECT_TRANSLATIONS.ru['autobox-v1'].details, /верхней конкурентной планки своего времени/);
  assert.match(PROJECT_TRANSLATIONS.ru['autobox-v1'].details, /Десять японских нэцкэ/);
  assert.match(PROJECT_TRANSLATIONS.ru['autobox-v1'].details, /Анны Савельевой/);
  assert.match(PROJECT_TRANSLATIONS.ru['autobox-v1'].details, /Макса Ратерстона/);
  assert.match(PROJECT_TRANSLATIONS.ru['autobox-v1'].details, /himotoshi/);
  assert.match(PROJECT_TRANSLATIONS.ru.complexscan.details, /авторской продуктовой линией/);
  assert.match(PROJECT_TRANSLATIONS.ru['agent-portal'].details, /ресурсная оптимизация агентной разработки/);
  assert.match(PROJECT_TRANSLATIONS.ru['agent-portal'].details, /RAG-style context retrieval/);
  assert.match(PROJECT_TRANSLATIONS.ru['project-graph-mcp'].details, /10-50 раз/);
  assert.match(PROJECT_TRANSLATIONS.ru['project-graph-mcp'].details, /GraphRAG-style retrieval/);
  assert.match(PROJECT_TRANSLATIONS.ru['agent-pool-mcp'].details, /кросс-модельный консенсус/);
  assert.match(PROJECT_TRANSLATIONS.ru['agent-pool-mcp'].details, /eval-style проверки/);
  assert.match(PROJECT_TRANSLATIONS.es['autobox-v1'].details, /línea original de tecnología de captura/);
  assert.match(PROJECT_TRANSLATIONS.es['autobox-v1'].details, /Diez netsuke japoneses/);
  assert.match(PROJECT_TRANSLATIONS.es['autobox-v1'].details, /Anna Savelyeva/);
  assert.match(PROJECT_TRANSLATIONS.es['autobox-v1'].details, /Max Rutherston/);
  assert.match(PROJECT_TRANSLATIONS.es['autobox-v1'].details, /himotoshi/);
  assert.match(PROJECT_TRANSLATIONS.es.complexscan.details, /línea de producto propia/);
  assert.match(PROJECT_TRANSLATIONS.es['agent-portal'].details, /optimización de recursos/);
  assert.match(PROJECT_TRANSLATIONS.es['agent-portal'].details, /RAG-style context retrieval/);
  assert.match(PROJECT_TRANSLATIONS.es['project-graph-mcp'].details, /10-50x/);
  assert.match(PROJECT_TRANSLATIONS.es['project-graph-mcp'].details, /GraphRAG-style retrieval/);
  assert.match(PROJECT_TRANSLATIONS.es['agent-pool-mcp'].details, /workers más baratos\/rápidos/);
  assert.match(PROJECT_TRANSLATIONS.es['agent-pool-mcp'].details, /checks tipo eval/);
});

test('older project entries expose visible work periods', () => {
  const projects = loadProjectEntries();
  const bySlug = new Map(projects.map((project) => [project.slug, project]));

  assert.equal(bySlug.get('megavisor')?.period, '2010-2014');
  assert.equal(bySlug.get('photopizza')?.period, '2010-2018');
  assert.equal(bySlug.get('photosnail-public')?.period, '2016');
  assert.equal(bySlug.get('complexscan')?.period, '2017-2019');
  assert.equal(bySlug.get('boothbot')?.period, '2018');
  assert.equal(bySlug.get('photopizza-remote')?.period, '2018-2019');
  assert.equal(bySlug.get('autobox-v1')?.period, '2019-2021');
});

test('lifecycle messaging platform describes a public-safe technology profile', () => {
  const projects = loadProjectEntries();
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const project = bySlug.get('lifecycle-messaging-platform');

  assert.equal(project?.title, 'Lifecycle Messaging Platform');
  assert.match(project?.details || '', /Technology profile:/);
  assert.match(project?.details || '', /Backend\/runtime: JavaScript\/Node\.js/);
  assert.match(project?.details || '', /opt-in SMS/);
  assert.match(project?.details || '', /GSM modem pools/);
  assert.match(project?.details || '', /AT commands/);
  assert.match(project?.details || '', /server infrastructure/);
  assert.match(
    PROJECT_TRANSLATIONS.ru['lifecycle-messaging-platform'].details,
    /Технологический профиль:/
  );
  assert.match(
    PROJECT_TRANSLATIONS.ru['lifecycle-messaging-platform'].details,
    /Backend\/runtime: JavaScript\/Node\.js/
  );
  assert.match(
    PROJECT_TRANSLATIONS.ru['lifecycle-messaging-platform'].details,
    /GSM-модемные пулы/
  );
  assert.match(
    PROJECT_TRANSLATIONS.ru['lifecycle-messaging-platform'].details,
    /AT-команды/
  );
  assert.match(
    PROJECT_TRANSLATIONS.es['lifecycle-messaging-platform'].details,
    /Perfil tecnológico:/
  );
  assert.match(
    PROJECT_TRANSLATIONS.es['lifecycle-messaging-platform'].details,
    /Backend\/runtime: JavaScript\/Node\.js/
  );
  assert.match(
    PROJECT_TRANSLATIONS.es['lifecycle-messaging-platform'].details,
    /pools de módems GSM/
  );
  assert.match(
    PROJECT_TRANSLATIONS.es['lifecycle-messaging-platform'].details,
    /comandos AT/
  );
  assert.doesNotMatch(project?.details || '', /1SIM/i);
  assert.doesNotMatch(project?.title || '', /Private Lifecycle Marketing Platform/i);
  assert.doesNotMatch(PROJECT_TRANSLATIONS.ru['lifecycle-messaging-platform'].details, /1SIM/i);
});

test('project translations cover every project entry', () => {
  const projects = loadProjectEntries();
  const slugs = projects.map((project) => project.slug);

  for (const locale of ['ru', 'es']) {
    assert.deepEqual(
      Object.keys(PROJECT_TRANSLATIONS[locale]).sort(),
      [...slugs].sort()
    );

    for (const slug of slugs) {
      assert.ok(PROJECT_TRANSLATIONS[locale][slug].summary?.trim(), `${locale}:${slug}:summary`);
      assert.ok(PROJECT_TRANSLATIONS[locale][slug].details?.trim(), `${locale}:${slug}:details`);
    }
  }
});

test('portfolio runtime localizes project entry fields', async () => {
  const source = await readFile(new URL('../../src/static-pages/js/index.js', import.meta.url), 'utf8');

  assert.match(source, /import \{ PROJECT_TRANSLATIONS \} from '\.\.\/data\/projectTranslations\.js';/);
  assert.match(source, /function getProjectSummary\(project\) {\s*return getProjectTranslation\(project\)\.summary \|\| project\.summary \|\| '';/);
  assert.match(source, /function getProjectDetails\(project\) {\s*return getProjectTranslation\(project\)\.details \|\| project\.details \|\| '';/);
  assert.match(source, /if \(kicker === 'Selected project'\) return tPortfolio\('project\.kicker\.selected'\);/);
  assert.match(source, /if \(label === 'View repository'\) return tPortfolio\('link\.viewRepository'\);/);
  assert.match(source, /summary: projectSummary,/);
  assert.match(source, /details: projectDetails,/);
});
