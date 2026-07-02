import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import test from 'node:test';

const execFileAsync = promisify(execFile);

test('portfolio build generates llms.txt and llms-full.txt', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'));
  const scriptSource = await readFile(new URL('../../scripts/generate-llms-txt.js', import.meta.url), 'utf8');

  assert.equal(packageJson.scripts['generate-llms'], 'node ./scripts/generate-llms-txt.js');
  assert.match(packageJson.scripts.build, /npm run generate-llms/);
  assert.match(scriptSource, /PROJECT_PULSE_NOTES/);
  assert.match(scriptSource, /llms\.txt/);
  assert.match(scriptSource, /llms-full\.txt/);

  await execFileAsync('node', ['./scripts/generate-llms-txt.js'], {
    cwd: new URL('../..', import.meta.url),
  });

  const llmsTxt = await readFile(new URL('../../dist/llms.txt', import.meta.url), 'utf8');
  const llmsFullTxt = await readFile(new URL('../../dist/llms-full.txt', import.meta.url), 'utf8');

  assert.match(llmsTxt, /^# Vladimir Matiasevich Portfolio/m);
  assert.match(llmsTxt, /llms-full\.txt/);
  assert.match(llmsTxt, /projects\/agent-portal\/\?lang=en/);
  assert.match(llmsTxt, /pulse\/photopizza\/\?lang=en/);
  assert.match(llmsTxt, /downloads\/vladimir-matiasevich-cv-en\.pdf/);
  assert.match(llmsTxt, /Languages: Russian — native · English — reading & writing \(not spoken\) · Spanish — basic \(A1\)/);
  assert.match(llmsTxt, /15\+ years in R&D, product engineering, and full-stack development/);
  assert.doesNotMatch(llmsTxt, /Quick facts/);
  assert.doesNotMatch(llmsTxt, /Profile data/);
  assert.match(llmsTxt, /### Archived projects/);
  assert.match(llmsTxt, /Symbiote Node/);
  assert.match(llmsTxt, /AUTOBOX v1.*2019-2021\./);
  assert.match(llmsTxt, /Lifecycle Messaging Platform/);
  assert.doesNotMatch(llmsTxt, /Symbiote Workflow|symbiote-workflow/);
  assert.doesNotMatch(llmsTxt, /llms-full\.txt\//);
  assert.doesNotMatch(llmsTxt, /sitemap\.xml\//);
  assert.doesNotMatch(llmsTxt, /vladimir-matiasevich-cv-en\.pdf\//);

  assert.match(llmsFullTxt, /^# Vladimir Matiasevich Portfolio - Full LLM Context/m);
  assert.match(llmsFullTxt, /## Locale: English/);
  assert.match(llmsFullTxt, /## Locale: Russian/);
  assert.match(llmsFullTxt, /## Locale: Spanish/);
  assert.match(llmsFullTxt, /Языки: Русский — родной · Английский — чтение и письмо \(не разговорный\) · Испанский — базовый \(A1\)/);
  assert.match(llmsFullTxt, /15\+ лет в R&D, продуктовой инженерии и full-stack разработке/);
  const previousBirthYearMarker = String(2000 - 16);
  assert.doesNotMatch(`${llmsTxt}\n${llmsFullTxt}`, new RegExp(previousBirthYearMarker));
  assert.doesNotMatch(`${llmsTxt}\n${llmsFullTxt}`, /Born:|Дата рождения|Fecha de nacimiento/);
  assert.match(llmsFullTxt, /R&D-инженерный опыт/);
  assert.match(llmsFullTxt, /Программистский \/ full-stack опыт/);
  assert.match(llmsFullTxt, /#### AUTOBOX v1\n\nURL: .*\/projects\/autobox-v1\/\?lang=en\n\nPeriod: 2019/);
  assert.match(llmsFullTxt, /Десять японских нэцкэ/);
  assert.match(llmsFullTxt, /R&D-заметка о PhotoPizza/);
  const internalProjectMarker = String.fromCharCode(49, 83, 73, 77);
  assert.doesNotMatch(`${llmsTxt}\n${llmsFullTxt}`, new RegExp(internalProjectMarker));
});
