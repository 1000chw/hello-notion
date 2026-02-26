# AGENTS.md

## Cursor Cloud specific instructions

This is a **Hello Notion** frontend-only codebase — a Korean-language SaaS landing page for embeddable Notion widgets.

### Project structure

- `FE/` — Next.js 16 app (React 19, Tailwind CSS v4, Framer Motion). This is the only service.

### Dev commands (run from `FE/`)

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (port 3000) |
| Lint | `npm run lint` (ESLint 9 + eslint-config-next) |
| Build | `npm run build` |
| Production preview | `npm run start` |

### Notes

- No backend, database, Docker, or `.env` files are required.
- The lockfile is `package-lock.json` — always use **npm** (not pnpm/yarn).
- ESLint has 2 pre-existing `@next/next/no-html-link-for-pages` errors in `Footer.tsx` and `Navbar.tsx`.
