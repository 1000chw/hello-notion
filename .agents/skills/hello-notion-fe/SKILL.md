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

## 공통 배경 및 페이지 일관성

- **PageBackground**: 메인·하위 페이지 공통 배경으로 `PageBackground` 컴포넌트 사용. 클래스: `min-h-screen bg-gradient-to-b from-teal-50 via-white to-white`.
- **적용 위치**: 메인 페이지(`page.tsx`)의 `main` 전체, 위젯 세부 설정 페이지(예: `/w/goal-counter`), 갤러리 섹션 등 동일 그라데이션 유지.
- **갤러리 섹션**: `WidgetGallery`의 section은 `bg-gray-50/50` 대신 `bg-gradient-to-b from-teal-50 via-white to-white` 사용해 메인과 통일.

## 위젯 세부 설정 페이지 레이아웃

- **프레임**: `Navbar` + `PageBackground` > `main` > `section` + `Footer`. (iframe일 때는 위젯만 렌더 — hello-notion-widget 참고.)
- **본문**: `max-w-6xl mx-auto px-4 sm:px-6`, 상단에 갤러리로 돌아가기 링크·뱃지·제목·설명 문구.
- **좌측 LNB**: 설정 카드(`rounded-2xl border bg-white shadow-sm`), `md:w-64`, `md:sticky md:top-24`. 목표 설명·목표 개수·배경 색상·링크 복사 등.
- **우측**: 위젯 미리보기만 배치. 설정 입력과 실시간 연동이 필요하면 위젯에 override props 전달(hello-notion-widget 참고).

## Conventions

- Prefer Server Components by default; add `"use client"` only when needed (state, effects, browser APIs).
- Keep RSC payload small: pass minimal props across server/client boundary.
- Accessibility and responsive layout: follow web-design-guidelines / ui-ux-pro-max when designing.
- **URL 기반 설정 페이지**: 입력 필드는 로컬 state + onBlur URL 반영으로 커서 점프 방지; 숫자 입력은 빈 값 허용 후 blur 시 clamp. 자세한 규칙은 hello-notion-widget의 "URL과 입력 필드" 참고.
