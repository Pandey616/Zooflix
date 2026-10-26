# Zooflix 2.0

Zooflix is being rebuilt as a focused, accessible animal encyclopedia using Next.js App Router, React and TypeScript.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For production metadata, set `NEXT_PUBLIC_SITE_URL` to the canonical public origin before building. Do not use a preview URL for this value.

```bash
NEXT_PUBLIC_SITE_URL=https://your-public-origin.example npm run build
```

## Foundation architecture

- `app/` contains App Router pages, layouts and SEO route handlers.
- `components/` contains accessible, reusable UI components.
- `lib/animals/` contains typed animal records and the testable data-access layer.
- `public/animals/` contains reusable image assets carried forward from Zooflix 1.0.

Animal records are validated with Zod at the repository boundary. References, image attribution, conservation assessments and field-level provenance are stored with the records where available. Unknown scientific information remains absent rather than being replaced with placeholders.

## Routes and discovery

- `/species` provides URL-driven search, filters, sorting and pagination.
- `/species/[slug]` provides server-rendered species detail pages.
- `/categories` and `/categories/[category]` provide category exploration from the validated dataset.
- `/habitats` and `/habitats/[habitat]` provide habitat collections derived from recorded habitat values.
- `/sitemap.xml` and `/robots.txt` expose public URLs only when `NEXT_PUBLIC_SITE_URL` is configured.

## Verification commands

```bash
npm run lint
npm run typecheck
npm test -- --reporter=verbose
npm run test:e2e
npm run build
git diff --check
```

The browser suite uses Playwright with Chromium desktop and Pixel 5 mobile projects. It is a focused smoke suite, not a complete WCAG audit or device matrix.

## Deployment notes

For a later, explicitly approved manual preview, use an existing isolated Netlify site and its site ID. Set `NEXT_PUBLIC_SITE_URL` in the `deploy-preview` build context to the canonical production origin; it is a public URL, not a secret, and must not be set to a temporary preview URL. From this branch, the safe draft command is:

```bash
npx netlify deploy --build --context deploy-preview --site <SITE_ID> --alias zooflix-2-foundation-preview
```

The command intentionally omits `--prod`. After deployment, check the returned draft URL at `/`, `/species`, a species URL, a category URL, a habitat URL, `/sitemap.xml` and `/robots.txt`. Confirm the preview response has `X-Robots-Tag: noindex` and does not use the preview host as its canonical origin. If that header is absent, stop and enable Netlify preview protection/no-index settings before sharing the URL. Delete the draft deploy after review when appropriate. Do not run this command until the target site and environment scope are explicitly approved.

The project has `build`, `start` and `dev` scripts required for a standard Next.js Node deployment. Netlify configuration is not present in this branch and the existing production site is not connected to GitHub by this work. A later preview should be created manually after confirming the site’s build settings, Node version, lockfile usage and `NEXT_PUBLIC_SITE_URL` environment variable.

Netlify’s current Next.js integration supports App Router, static generation, server rendering and `next/image`, but a real preview deployment is still required to verify the account-specific site configuration and public-origin value.

## Known limitations

- The dataset is intentionally small and remains limited to the currently curated records.
- Scientific claims, conservation assessments and image licences require ongoing manual review; structural validation does not prove biological accuracy.
- No production dependency vulnerabilities were found in the latest production-only audit. Five high-severity development-tool findings remain in the ESLint dependency chain; npm’s proposed remediation is a breaking downgrade, so it was not applied blindly.
- No Lighthouse score is claimed. Performance findings are based on Next.js build output, browser smoke runs and source inspection.

This branch contains the release-candidate preparation work. Netlify and production deployment are intentionally not connected.
