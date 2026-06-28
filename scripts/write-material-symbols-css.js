import fs from 'node:fs/promises';
import icons from '../src/icons/collection.js';

const iconNames = Object.keys(icons).sort().join(',');
const href = `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=${iconNames}`;
const outDir = new URL('../dist/js/', import.meta.url);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(new URL('material-symbols.css', outDir), `@import url('${href}');\n`, 'utf8');
