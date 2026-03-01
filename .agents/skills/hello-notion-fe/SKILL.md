---
name: hello-notion-fe
description: Frontend development for Hello Notion: Next.js pages, components, and design. Use when building or modifying the main site UI. References vercel-react-best-practices and project frontend structure.
---

# Hello Notion Frontend

## Scope

- Next.js App Router: pages, layouts, loading, error boundaries.
- Components: shared UI, forms, widget gallery, auth flows.
- Styling: Tailwind (or project choice); keep design consistent with design system if defined.
- Auth UI: sign-in/sign-up, session handling; integrate with Supabase Auth (see hello-notion-supabase).

## Structure

- `app/` — routes, layouts, global styles.
- `components/` — reusable components; consider `components/ui/` for primitives.
- `lib/` — API client, auth helpers, utils.
- Use vercel-react-best-practices for data fetching (parallel, Suspense), bundle size, and server/client boundaries.

## Conventions

- Prefer Server Components by default; add `"use client"` only when needed (state, effects, browser APIs).
- Keep RSC payload small: pass minimal props across server/client boundary.
- Accessibility and responsive layout: follow web-design-guidelines / ui-ux-pro-max when designing.
