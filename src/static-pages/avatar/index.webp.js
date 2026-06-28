import fs from 'node:fs';

export default fs.readFileSync(new URL('./avatar.webp', import.meta.url));
