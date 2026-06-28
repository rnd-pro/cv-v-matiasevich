import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import * as ts from 'typescript';

import { socialLinks } from '../../src/static-pages/data/socialLinks.js';
import { PORTFOLIO_LOCALE_MESSAGES } from '../../src/static-pages/data/portfolioTranslations.js';

const EXPECTED_LOCALES = ['en', 'es', 'ru'];
const PLACEHOLDER_PATTERN = /\{([a-zA-Z][a-zA-Z0-9_]*)\}/g;

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function placeholders(value) {
  return sorted([...String(value).matchAll(PLACEHOLDER_PATTERN)].map((match) => match[1]));
}

async function getPortfolioTranslationUsages() {
  const source = await readFile(new URL('../../src/static-pages/js/index.js', import.meta.url), 'utf8');
  const sourceFile = ts.createSourceFile('index.js', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const pdfSource = await readFile(new URL('../../scripts/generate-portfolio-pdfs.js', import.meta.url), 'utf8');
  const pdfSourceFile = ts.createSourceFile('generate-portfolio-pdfs.js', pdfSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const usedKeys = new Set();

  function visit(node) {
    if (ts.isCallExpression(node)
      && ts.isIdentifier(node.expression)
      && node.expression.text === 'tPortfolio') {
      const [keyNode] = node.arguments;
      if (keyNode && ts.isPropertyAccessExpression(keyNode) && keyNode.name.text === 'summaryKey') {
        ts.forEachChild(node, visit);
        return;
      }
      const position = keyNode
        ? sourceFile.getLineAndCharacterOfPosition(keyNode.getStart(sourceFile))
        : { line: 0, character: 0 };
      assert.ok(
        keyNode && (ts.isStringLiteral(keyNode) || ts.isNoSubstitutionTemplateLiteral(keyNode)),
        `tPortfolio keys must be static string literals so translation coverage can be tested (${position.line + 1}:${position.character + 1})`
      );
      usedKeys.add(`portfolio.${keyNode.text}`);
    }
    ts.forEachChild(node, visit);
  }

  function visitPdf(node) {
    if (ts.isCallExpression(node)
      && ts.isIdentifier(node.expression)
      && node.expression.text === 't') {
      const [, keyNode] = node.arguments;
      if (keyNode && ts.isPropertyAccessExpression(keyNode) && keyNode.name.text === 'summaryKey') {
        ts.forEachChild(node, visitPdf);
        return;
      }
      const position = keyNode
        ? pdfSourceFile.getLineAndCharacterOfPosition(keyNode.getStart(pdfSourceFile))
        : { line: 0, character: 0 };
      assert.ok(
        keyNode && (ts.isStringLiteral(keyNode) || ts.isNoSubstitutionTemplateLiteral(keyNode)),
        `PDF translation keys must be static string literals so translation coverage can be tested (${position.line + 1}:${position.character + 1})`
      );
      usedKeys.add(`portfolio.${keyNode.text}`);
    }
    ts.forEachChild(node, visitPdf);
  }

  visit(sourceFile);
  visitPdf(pdfSourceFile);
  for (const item of socialLinks) {
    usedKeys.add(`portfolio.${item.summaryKey}`);
  }
  return usedKeys;
}

test('portfolio translations keep the same keys for every locale', () => {
  const locales = sorted(Object.keys(PORTFOLIO_LOCALE_MESSAGES));
  assert.deepEqual(locales, EXPECTED_LOCALES);

  const baseKeys = sorted(Object.keys(PORTFOLIO_LOCALE_MESSAGES.en));
  for (const locale of locales) {
    const localeKeys = sorted(Object.keys(PORTFOLIO_LOCALE_MESSAGES[locale]));
    assert.deepEqual(localeKeys, baseKeys, `${locale} translations must match en keys`);
  }
});

test('portfolio translations cover every UI usage', async () => {
  const usedKeys = await getPortfolioTranslationUsages();
  const translatedKeys = new Set(Object.keys(PORTFOLIO_LOCALE_MESSAGES.en));

  assert.deepEqual(
    sorted([...usedKeys].filter((key) => !translatedKeys.has(key))),
    [],
    'used portfolio translation keys must exist'
  );
  assert.deepEqual(
    sorted([...translatedKeys].filter((key) => !usedKeys.has(key))),
    [],
    'portfolio translation keys should stay tied to active UI usage'
  );
});

test('portfolio translations have non-empty values and matching placeholders', () => {
  const baseMessages = PORTFOLIO_LOCALE_MESSAGES.en;
  const locales = Object.keys(PORTFOLIO_LOCALE_MESSAGES);

  for (const key of Object.keys(baseMessages)) {
    const basePlaceholders = placeholders(baseMessages[key]);
    for (const locale of locales) {
      const value = PORTFOLIO_LOCALE_MESSAGES[locale][key];
      assert.equal(typeof value, 'string', `${locale}.${key} must be a string`);
      assert.notEqual(value.trim(), '', `${locale}.${key} must not be empty`);
      assert.deepEqual(placeholders(value), basePlaceholders, `${locale}.${key} placeholders must match en`);
    }
  }
});
