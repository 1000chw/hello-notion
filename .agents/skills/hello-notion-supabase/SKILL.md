---
name: hello-notion-supabase
description: Manages Hello Notion data and auth with Supabase. Use when defining DB schema, migrations, RLS, Auth (sign-in/sign-up), or connecting BE to Supabase. Prefer Supabase MCP for list_tables, apply_migration, execute_sql, get_project_url, get_publishable_keys.
---

# Hello Notion Supabase

## When to use

- Defining or changing DB schema, RLS, migrations.
- Configuring Auth (sign-in, sign-up, JWT).
- Connecting the backend (Kotlin/Spring Boot) to Supabase.

## Supabase MCP

Use Supabase MCP when available:

- `list_projects` / `get_project` — resolve project ID.
- `list_tables`, `apply_migration`, `execute_sql` — schema and data.
- `get_project_url`, `get_publishable_keys` — URLs and keys for FE/BE.
- `get_logs`, `get_advisors` — debugging and security/performance checks.

## Migrations

- Name migrations in snake_case: `add_widgets_table`, `add_rls_policies_for_widgets`.
- Use `apply_migration` for DDL; use `execute_sql` only for read-only or one-off data.

## Auth

- Use anon key for client-side (FE) where RLS protects data.
- Use service role or JWT from Auth for backend; never expose service role to the client.
- Store Supabase URL and anon key in env (e.g. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` for FE).

## Backend (Kotlin) connection

- **Option A**: Supabase REST/PostgREST via HTTP client (e.g. Kotlin `HttpClient`) using project URL + anon or service key.
- **Option B**: Direct Postgres JDBC to Supabase DB connection string (from project settings) for server-side only; keep connection string in env and out of client.
- Prefer RLS and PostgREST when possible so one schema serves FE and BE.
