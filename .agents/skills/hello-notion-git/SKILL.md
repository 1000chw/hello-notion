---
name: hello-notion-git
description: GitHub workflow for Hello Notion: commit message format and PR template. Use when committing changes or creating/updating pull requests. Prefer GitHub MCP for create_branch, create_pull_request, list_pull_requests when applicable.
---

# Hello Notion Git

## Commit format

Use conventional commits with scope:

```
type(scope): short description
```

- **type**: `feat` | `fix` | `docs` | `chore` | `refactor` | `test`
- **scope**: `frontend` | `backend` | `widget` | `infra`
- **description**: imperative, lowercase, no period at end

Examples:

```
feat(frontend): add widget gallery page
fix(backend): validate widget id in GET /api/widgets/:id
docs(readme): add Supabase setup steps
chore(infra): update Vercel env in dashboard
```

## Branch naming

- `feat/short-name` — new feature
- `fix/short-name` — bugfix
- `docs/short-name` — documentation
- `chore/short-name` — tooling, deps, config

## Pull requests

- **Title**: Same as commit format when single logical change; otherwise descriptive summary.
- **Body**: Include:
  - Summary of changes
  - How to test (steps or checklist)
  - Any breaking changes or migration notes

When using GitHub MCP: use `create_branch`, `create_pull_request`, `list_pull_requests` as needed. Search for PR template in `.github/PULL_REQUEST_TEMPLATE` or `.github/PULL_REQUEST_TEMPLATE.md` and follow it if present.
