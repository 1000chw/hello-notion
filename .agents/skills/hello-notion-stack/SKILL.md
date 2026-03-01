---
name: hello-notion-stack
description: Scaffolds Hello Notion BE (Kotlin, Spring Boot 3.x) and FE (Next.js). Use when creating or scaffolding backend or frontend for Hello Notion.
---

# Hello Notion Stack

## Scope

- **Backend**: Kotlin, Spring Boot 3.x. Follow project kotlin-spring-boot skill and Spring Boot 3.x patterns.
- **Frontend**: Next.js (App Router). Follow vercel-react-best-practices and project frontend structure.

## Repository layout

Prefer a single repo with clear boundaries:

- `backend/` — Kotlin Spring Boot app (or `apps/backend/` in a monorepo)
- `frontend/` — Next.js app (or `apps/frontend/` in a monorepo)
- `packages/` (optional) — shared types or config

If the project already uses a different layout (e.g. `apps/api`, `apps/web`), follow that.

## Backend scaffolding

- Use Kotlin 2.x + Spring Boot 3.x.
- Gradle Kotlin DSL (`build.gradle.kts`).
- Packages: `controller`, `service`, `repository`, `model`/`entity`, `config`.
- See kotlin-spring-boot skill for Entity, Service, Controller patterns and dependency setup.

## Frontend scaffolding

- Next.js with App Router (`app/` directory).
- Use existing vercel-react-best-practices for data fetching, bundle size, and server/client boundaries.
- Typical structure: `app/(routes)`, `components/`, `lib/`, `styles/`.

## When to use

- Creating a new BE or FE from scratch for Hello Notion.
- Adding a new app (e.g. widget API) that must follow the same stack.
