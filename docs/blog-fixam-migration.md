# blog.fixam.co.uk Migration Guide

This project now includes a modern blog at:

- `/blog` (index)
- `/blog/[slug]` (article pages)
- `/blog/rss.xml` (feed)

The old legacy paths are redirected:

- `/projects` -> `/blog`
- `/index.html` -> `/blog`
- `/libs/index.html` -> `/blog`

When requests arrive on `blog.fixam.co.uk`, middleware also maps:

- `/` -> `/blog`
- `/rss.xml` -> `/blog/rss.xml`
- `/sitemap.xml` -> `/blog/sitemap.xml`
- `/{article-slug}` -> `/blog/{article-slug}` (for known article slugs)

## Recommended rollout

1. Deploy this app to production.
2. Add `blog.fixam.co.uk` as a custom domain on the same deployment.
3. Point DNS:
   - `blog` CNAME -> your Netlify target hostname.
4. Keep the old blog host online for 1-2 weeks with 301 redirects to the new URLs if possible.
5. Submit the updated sitemap in Search Console:
   - `https://fixam.co.uk/sitemap.xml`

## URL mapping plan

- Legacy home (`https://blog.fixam.co.uk/`) -> `https://fixam.co.uk/blog`
- Legacy projects (`https://blog.fixam.co.uk/projects`) -> `https://fixam.co.uk/blog`
- New articles:
  - `https://fixam.co.uk/blog/rebuilding-blog-fixam-modern-stack`
  - `https://fixam.co.uk/blog/cyber-essentials-readiness-checklist-2026`
  - `https://fixam.co.uk/blog/microsoft-365-security-baseline-for-growing-teams`
  - `https://fixam.co.uk/blog/incident-response-runbook-template-for-small-it-teams`

## Post-launch checks

1. Open Graph preview on at least one article.
2. Lighthouse mobile on `/blog` and one article.
3. Verify `200` for `/blog/rss.xml`.
4. Verify legacy paths return `301` to `/blog`.
