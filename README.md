# foundation-web-ai

Standalone **Robot Framework + AI** subpage. The foundation-web monorepo on the
`nuxt-studio` branch serves multiple sites (`cert`, `ambassador`, `robocon`,
`ai`) selected at build time by the `RF_PAGE` env variable. This repository
contains **only the `ai` build**, deployed to GitHub Pages at:

**https://manykarim.github.io/foundation-web-ai/**

## How it's built

- A Nuxt 3 + `@nuxt/content` app, pre-rendered to static HTML by `nuxt generate`
- Uses the same components and content collection as the upstream
  `nuxt-studio` branch of `robotframework/foundation-web`, minus the
  Contentful auth and other `RF_PAGE` builds
- `RF_PAGE=ai` is the only build that produces a non-empty page

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000/
```

## Production build (pre-render to static)

```bash
RF_PAGE=ai npm run generate
# output in .output/public
```

The output is a self-contained static site. Every asset path is root-relative
(`/_nuxt/...`, `favicon/...`, `fonts/...`), so the directory can be served from
the root of any host including GitHub Pages at
`https://manykarim.github.io/foundation-web-ai/`.

## Deploy to GitHub Pages

A workflow at `.github/workflows/pages.yml` builds and deploys on every push
to `main`:

1. Installs dependencies (`npm ci`)
2. Runs `npx nuxt generate` with `RF_PAGE=ai` and `BASE_URL=/foundation-web-ai/`
3. Uploads `.output/public` to Pages
4. The Pages environment `github-pages` publishes it

### One-time setup

In the GitHub repo settings (https://github.com/manykarim/foundation-web-ai/settings/pages):

- **Source:** GitHub Actions
- **Branch:** `main` / `gh-pages` (the action handles both)

## Notes for the workgroup

- The two outbound CTAs (`https://robotframework.org/ai/`,
  `https://github.com/robotframework/agent-skills`,
  `https://github.com/robotframework/mcp`) are best-guess placeholders.
  Confirm the real URLs with the workgroup before going live.
- The plausible domain in `app.vue` defaults to `ai.robotframework.io`; this
  repo is a preview, not the production deployment.
- The page intentionally does **not** promote self-healing — there is no
  confirmed implementation yet.
