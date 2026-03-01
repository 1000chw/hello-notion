---
name: hello-notion-widget
description: Creates and maintains Notion widgets for Hello Notion. Use when designing or implementing embeddable widgets (design, FE, widget-specific BE). Covers Notion embed constraints, widget config page structure, and input/URL UX rules.
---

# Hello Notion Widget

## Scope

- Embeddable widgets that run inside Notion (iframe/embed).
- Widget design, frontend (small bundle, responsive), and any widget-specific API or config.
- **Widget config page**: 세부 설정 페이지 구조, 배경/레이아웃, 입력·URL 동기화 규칙.

## Notion embed constraints

- Widget runs in iframe; same-origin and storage limits apply.
- Prefer small bundle size and fast load; avoid heavy deps.
- Communicate with parent only via `postMessage` if needed; do not assume top-level origin.

## Widget config page (세부 설정 페이지)

- **구조**: 메인·하위 페이지와 동일하게 유지.
  - 상단: `Navbar`
  - 본문: `PageBackground`로 감싼 `main` > `section` (공통 그라데이션 배경).
  - 좌측: LNB(설정 패널) — 목표 설명, 목표 개수, 배경 색상, 링크 복사 등. `md:w-64`, `md:sticky md:top-24`.
  - 우측: 위젯 미리보기만 (같은 위젯 컴포넌트 사용).
- **임베드 vs 설정 분리**: 같은 URL이라도
  - **일반 방문**: 설정 페이지 전체 (Navbar + LNB + 미리보기 + Footer).
  - **iframe(노션 embed)**: `window.self !== window.top`일 때 **위젯만** 렌더 (Navbar/LNB/Footer 없음). 복사한 링크를 노션에 넣으면 위젯만 보이게.
- **배경**: `PageBackground` 사용 (`bg-gradient-to-b from-teal-50 via-white to-white`). 갤러리 섹션 등도 동일 그라데이션으로 통일.

## URL과 입력 필드 (반드시 지킬 것)

- **URL 단일 소스**: 위젯 표시용 값(설명, 목표, 현재값, 배경 등)은 `useSearchParams()`로 렌더 시점에만 파생. effect 안에서 `setState`로 URL → state 동기화하지 말 것 (cascading render 경고).
- **설정 페이지 입력 UX**:
  - **커서가 맨 뒤로 가지 않게**: 입력값은 **로컬 state**로만 두고, **onBlur 시에만** `router.replace`로 URL 반영. `onChange`마다 URL을 바꾸면 리렌더로 커서가 끝으로 감.
  - **숫자 입력 빈 값 허용**: 목표 개수 등은 `value`를 `number | ""`로 두고, 빈 문자열이면 0으로 간주한 뒤 blur 시 `Math.max(1, ...)` 등으로 URL에 반영. 1일 때 백스페이스로 지울 수 있게.
  - **실시간 미리보기**: URL은 blur 시에만 바꾸되, 우측 위젯은 **입력할 때마다** 반영하려면 위젯에 **override props**(예: `overrideDesc`, `overrideGoal`)를 넘기고, 있으면 URL 대신 해당 값으로 표시·±1 시에도 이 값으로 URL 생성.

## Build and bundle

- Build as static or SPA that can be embedded (e.g. single HTML + JS, or hosted URL that returns embeddable page).
- Ensure CSP and CORS allow embedding from Notion; expose only necessary endpoints for widget config/data.

## Registration and sharing

- Widget registration flow: store widget metadata (name, URL, config schema) in DB; use hello-notion-be and hello-notion-supabase for API and storage.
- Share flow: public or unlisted embed URL; consider signed URLs or tokens if access control is required.

## Security

- Validate origin for any postMessage or API calls from widget.
- Do not expose secrets in widget bundle; use backend or signed tokens for sensitive operations.
