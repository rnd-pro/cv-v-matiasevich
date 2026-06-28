import assert from 'node:assert/strict';
import test from 'node:test';

import { socialLinks } from '../../src/static-pages/data/socialLinks.js';

const expectedLinks = [
  ['GitHub', 'https://github.com/MakerDrive'],
  ['LinkedIn', 'https://www.linkedin.com/in/v-matiasevich/'],
  ['YouTube', 'https://www.youtube.com/@VladimirMatiasevich'],
  ['Facebook', 'https://www.facebook.com/v.matiasevich'],
];

test('social links expose the configured public profiles', () => {
  assert.equal(socialLinks.length, expectedLinks.length);
  assert.deepEqual(
    socialLinks.map(({ label, href }) => [label, href]),
    expectedLinks
  );
  assert.equal(new Set(socialLinks.map(({ id }) => id)).size, socialLinks.length);
  assert.ok(socialLinks.every(({ href }) => href.startsWith('https://')));
});
