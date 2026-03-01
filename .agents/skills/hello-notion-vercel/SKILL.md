---
name: hello-notion-vercel
description: Deploys and manages Hello Notion frontend on Vercel. Use when configuring deployment, env vars, or project settings for the Next.js app.
---

# Hello Notion Vercel

## When to use

- Setting up or changing frontend deployment.
- Configuring environment variables (e.g. API URL, Supabase URL/keys).
- Adjusting project or build settings for the Next.js app.

## Setup

- Connect the Next.js app (e.g. `frontend/` or repo root) to Vercel via dashboard or Vercel MCP/CLI.
- Set env vars in Vercel: `NEXT_PUBLIC_*` for client; non-public for server-only (API routes, Server Actions).
- Use preview vs production: separate envs for preview branches and production.

## Configuration

- `vercel.json` (optional): rewrites, headers, build config.
- `next.config.js` / `next.config.mjs`: ensure output and env are correct for Vercel (default Next.js deployment usually needs no extra config).

## MCP

Use Vercel MCP when available for project linking, env, and deployment status.
