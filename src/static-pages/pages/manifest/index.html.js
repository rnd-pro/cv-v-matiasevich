import { getPage } from '../../getPage.js';

export default await getPage({
  BASE_PATH: '../../',
  TITLE: 'Vladimir Matiasevich CV',
  HEADER_CONTENT: 'JSDA Stack Reference: Manifest',
  MD_URL: 'https://raw.githubusercontent.com/rnd-pro/jsda/refs/heads/main/README.md',
});
