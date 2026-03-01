---
name: hello-notion-be
description: Backend development for Hello Notion: Kotlin, Spring Boot, Supabase. Use when implementing APIs, DB access, or Auth. References kotlin-spring-boot and hello-notion-supabase.
---

# Hello Notion Backend

## Scope

- REST API for the main site and widget operations.
- DB access via Supabase (PostgREST or JDBC); RLS for row-level security when using anon/service key.
- Auth: validate Supabase JWT in filters/interceptors; use user id from token for ownership checks.

## Structure

- Follow kotlin-spring-boot: `controller`, `service`, `repository`, `model`/`entity`, `config`.
- Controllers: return DTOs; use consistent error format (e.g. `{ "error": "code", "message": "..." }`).
- Services: business logic; use `@Transactional` with appropriate propagation (e.g. NEVER when only reading or when caller manages tx).

## API design

- RESTful resource names; HTTP status: 200/201, 400, 401, 403, 404, 5xx.
- Versioning: prefix like `/api/v1/` if needed.
- Document public endpoints (OpenAPI/Swagger optional).

## Security

- Validate JWT (Supabase) for protected routes; never trust client for user identity on mutations.
- Use hello-notion-supabase for Supabase URL, keys, and connection pattern.
