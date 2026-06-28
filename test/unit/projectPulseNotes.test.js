import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { loadProjectEntries } from '../../src/static-pages/data/projects.js';
import { PROJECT_PULSE_NOTES } from '../../src/static-pages/data/projectPulseNotes.js';
import { PROJECT_TRANSLATIONS } from '../../src/static-pages/data/projectTranslations.js';

const LOCALES = ['en', 'ru', 'es'];

test('project pulse notes cover each project in every locale', () => {
  const slugs = loadProjectEntries().map((project) => project.slug);

  for (const locale of LOCALES) {
    assert.deepEqual(
      Object.keys(PROJECT_PULSE_NOTES[locale]).sort(),
      [...slugs].sort(),
      `${locale} pulse notes must match project entries`
    );

    for (const slug of slugs) {
      assert.ok(PROJECT_PULSE_NOTES[locale][slug].summary?.trim(), `${locale}:${slug}:summary`);
      assert.ok(PROJECT_PULSE_NOTES[locale][slug].details?.trim(), `${locale}:${slug}:details`);
    }
  }
});

test('project pulse notes stay distinct from project case descriptions', () => {
  const projects = loadProjectEntries();

  for (const project of projects) {
    assert.notEqual(
      PROJECT_PULSE_NOTES.en[project.slug].details,
      project.details,
      `en:${project.slug} pulse note must not duplicate project details`
    );

    for (const locale of ['ru', 'es']) {
      assert.notEqual(
        PROJECT_PULSE_NOTES[locale][project.slug].details,
        PROJECT_TRANSLATIONS[locale][project.slug].details,
        `${locale}:${project.slug} pulse note must not duplicate project details`
      );
    }
  }
});

test('agent tooling pulse notes preserve article-derived R&D accents', () => {
  assert.match(PROJECT_PULSE_NOTES.en['agent-portal'].details, /resource groups route work/);
  assert.match(PROJECT_PULSE_NOTES.en['agent-portal'].details, /RAG-style retrieval/);
  assert.match(PROJECT_PULSE_NOTES.en['agent-portal'].details, /human-in-the-loop control/);
  assert.match(PROJECT_PULSE_NOTES.en['project-graph-mcp'].details, /10-50x reduction/);
  assert.match(PROJECT_PULSE_NOTES.en['project-graph-mcp'].details, /GraphRAG-style retrieval/);
  assert.match(PROJECT_PULSE_NOTES.en['project-graph-mcp'].details, /faster model can extract structure/);
  assert.match(PROJECT_PULSE_NOTES.en['agent-pool-mcp'].details, /cross-model consensus/);
  assert.match(PROJECT_PULSE_NOTES.en['agent-pool-mcp'].details, /eval-style checks/);
  assert.match(PROJECT_PULSE_NOTES.en['agent-pool-mcp'].details, /cheaper\/faster workers/);

  assert.match(PROJECT_PULSE_NOTES.ru['agent-portal'].details, /resource groups распределяют работу/);
  assert.match(PROJECT_PULSE_NOTES.ru['agent-portal'].details, /RAG-style retrieval/);
  assert.match(PROJECT_PULSE_NOTES.ru['agent-portal'].details, /human-in-the-loop контроль/);
  assert.match(PROJECT_PULSE_NOTES.ru['project-graph-mcp'].details, /10-50 раз/);
  assert.match(PROJECT_PULSE_NOTES.ru['project-graph-mcp'].details, /GraphRAG-style retrieval/);
  assert.match(PROJECT_PULSE_NOTES.ru['project-graph-mcp'].details, /быстрая модель извлекает структуру/);
  assert.match(PROJECT_PULSE_NOTES.ru['agent-pool-mcp'].details, /кросс-модельный консенсус/);
  assert.match(PROJECT_PULSE_NOTES.ru['agent-pool-mcp'].details, /eval-style проверки/);
  assert.match(PROJECT_PULSE_NOTES.ru['agent-pool-mcp'].details, /более дешёвым\/быстрым воркерам/);

  assert.match(PROJECT_PULSE_NOTES.es['agent-portal'].details, /resource groups enrutan trabajo/);
  assert.match(PROJECT_PULSE_NOTES.es['agent-portal'].details, /RAG-style retrieval/);
  assert.match(PROJECT_PULSE_NOTES.es['agent-portal'].details, /human-in-the-loop/);
  assert.match(PROJECT_PULSE_NOTES.es['project-graph-mcp'].details, /10-50x/);
  assert.match(PROJECT_PULSE_NOTES.es['project-graph-mcp'].details, /GraphRAG-style retrieval/);
  assert.match(PROJECT_PULSE_NOTES.es['project-graph-mcp'].details, /modelo rápido extrae estructura/);
  assert.match(PROJECT_PULSE_NOTES.es['agent-pool-mcp'].details, /consenso entre modelos/);
  assert.match(PROJECT_PULSE_NOTES.es['agent-pool-mcp'].details, /checks tipo eval/);
  assert.match(PROJECT_PULSE_NOTES.es['agent-pool-mcp'].details, /workers más baratos\/rápidos/);
});

test('portfolio runtime uses dedicated pulse notes for journal entries', async () => {
  const source = await readFile(new URL('../../src/static-pages/js/index.js', import.meta.url), 'utf8');

  assert.match(source, /import \{ PROJECT_PULSE_NOTES \} from '\.\.\/data\/projectPulseNotes\.js';/);
  assert.match(source, /function getProjectPulseSummary\(project\) \{/);
  assert.match(source, /function getProjectPulseDetails\(project\) \{/);
  assert.match(source, /summary: projectPulseSummary,/);
  assert.match(source, /details: projectPulseDetails,/);
});

test('portfolio runtime exposes cross-links between project cases and journal notes', async () => {
  const source = await readFile(new URL('../../src/static-pages/js/index.js', import.meta.url), 'utf8');

  assert.match(source, /const PROJECT_PULSE_RELATIONS = Object\.freeze\(\{/);
  assert.match(source, /'autobox-v1': \['photopizza', 'complexscan', 'megavisor'\]/);
  assert.match(source, /'symbiote-workspace': \['agent-portal', 'symbiote-ui', 'symbiote-engine'\]/);
  assert.match(source, /'symbiote-node': \['symbiote-ui', 'symbiote-engine', 'symbiote-workspace'\]/);
  assert.match(source, /'symbiote-engine': \['symbiote-ui', 'symbiote-workspace'\]/);
  assert.match(source, /'lifecycle-messaging-platform': \['agent-portal', 'symbiote-video-studio', 'symbiote-ui'\]/);
  assert.match(source, /label: `\$\{tPortfolio\('entry\.type\.project'\)\}: \$\{project\.title\}`/);
  assert.match(source, /label: `\$\{tPortfolio\('entry\.type\.note'\)\}: \$\{projectTitleBySlug\.get\(slug\)\}`/);
  assert.doesNotMatch(source, /related: \[project\.title\]/);
});
