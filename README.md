# Vladimir Matiasevich CV

Static CV, portfolio, and R&D project map built with JSDA-Kit and prepared for GitHub Pages deployment.

## Stack

- JSDA-Kit for static site generation and optional dynamic routes.
- Symbiote.js web components with SSR support.
- npm with `package-lock.json`.
- GitHub Actions deployment to GitHub Pages.

## Development

```bash
npm ci
npm test
npm run build
```

The production build is written to `dist/`.

For local static development with a watcher:

```bash
npx jsda ssg
```

For the dynamic JSDA server:

```bash
npx jsda serve
```

The default dynamic server port is `3000`.

## GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml` builds `dist/` and deploys it to GitHub Pages on pushes to `main`.

Public URL: https://rnd-pro.github.io/cv-v-matiasevich/

Static page import maps are generated from installed npm package versions, so browser CDN URLs stay aligned with `package-lock.json`.

Before publishing, create the GitHub repository and confirm that `homepage`, `repository.url`, and `project.cfg.js` sitemap `baseUrl` match the final GitHub Pages URL.

## Project Layout

- `src/static-pages/` - static pages used by the GitHub Pages build.
- `src/dynamic-pages/` - optional dynamic routes for the JSDA server.
- `src/ui-components/` - reusable web components.
- `src/common-styles/` - shared CSS modules and design tokens.
- `project.cfg.js` - JSDA build and routing configuration.
- `cit-config.json` - Cloud Images Toolkit configuration.

## Verification

```bash
npm test
npm run build
npm audit
```
