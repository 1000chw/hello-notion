---
name: hello-notion-widget
description: Creates and maintains Notion widgets for Hello Notion. Use when designing or implementing embeddable widgets (design, FE, widget-specific BE). Covers Notion embed constraints and widget API.
---

# Hello Notion Widget

## Scope

- Embeddable widgets that run inside Notion (iframe/embed).
- Widget design, frontend (small bundle, responsive), and any widget-specific API or config.

## Notion embed constraints

- Widget runs in iframe; same-origin and storage limits apply.
- Prefer small bundle size and fast load; avoid heavy deps.
- Communicate with parent only via `postMessage` if needed; do not assume top-level origin.

## Build and bundle

- Build as static or SPA that can be embedded (e.g. single HTML + JS, or hosted URL that returns embeddable page).
- Ensure CSP and CORS allow embedding from Notion; expose only necessary endpoints for widget config/data.

## Registration and sharing

- Widget registration flow: store widget metadata (name, URL, config schema) in DB; use hello-notion-be and hello-notion-supabase for API and storage.
- Share flow: public or unlisted embed URL; consider signed URLs or tokens if access control is required.

## Security

- Validate origin for any postMessage or API calls from widget.
- Do not expose secrets in widget bundle; use backend or signed tokens for sensitive operations.
