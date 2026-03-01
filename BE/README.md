# Hello Notion Backend

최소 백엔드 골격. Supabase JWT 검증 및 `GET /api/v1/auth/me` protected endpoint 제공.

---

## 1. 백엔드 필요성 판단

| 구분 | 설명 |
|------|------|
| **로그인 UI만** | Supabase Auth SDK로 FE에서 처리 가능 → BE **불필요** |
| **BE API에서 사용자 인증** | JWT 검증, ownership 체크 필요 → BE **필요** |
| **세션 검증용 `/me`** | FE가 로그인 여부/사용자 정보 조회 시 → BE **선택적** |

**결론**: Supabase 로그인 자체는 FE만으로 가능. 다만 다음 이유로 최소 BE 골격을 둠.

- 추후 protected API(widget 생성, 설정 저장 등) 확장 시 JWT 검증 패턴 재사용
- FE에서 `Authorization: Bearer <token>` 기반 연동 연습
- 한 번에 확장 가능한 구조 확보

---

## 2. 반영된 파일 목록

```
backend/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
├── .env.example
├── .gitignore
├── README.md (본 문서)
└── src/main/
    ├── kotlin/dev/hellonotion/
    │   ├── HelloNotionApplication.kt
    │   ├── config/JwtProperties.kt
    │   ├── config/WebConfig.kt       # CORS (localhost:3000)
    │   ├── controller/AuthController.kt
    │   ├── dto/MeResponse.kt
    │   └── security/
    │       ├── JwtAuthFilter.kt
    │       ├── JwtPrincipal.kt
    │       └── SecurityConfig.kt
    └── resources/
        └── application.yml
```

---

## 3. 환경 변수

| 키 | 필수 | 설명 |
|----|------|------|
| `SUPABASE_JWT_SECRET` | ✅ | Supabase 대시보드 > Project Settings > API > JWT Secret |
| `SUPABASE_JWT_ISSUER` | ❌ | issuer 검증 (예: `https://<project-id>.supabase.co/auth/v1`) |

`.env.example`을 복사해 `.env`를 만들고 위 값을 설정하세요.

---

## 4. FE 연동 가이드

### 4.1 로그인 후 토큰 획득 (FE)

```ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 로그인
const { data, error } = await supabase.auth.signInWithPassword({ email, password })

// Access Token 획득
const token = data.session?.access_token
```

### 4.2 `/api/v1/auth/me` 호출

```ts
const res = await fetch('http://localhost:8080/api/v1/auth/me', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

if (res.ok) {
  const me = await res.json()  // { id, email, role }
} else {
  // 401 Unauthorized
}
```

### 4.3 계약

- **인증**: `Authorization: Bearer <access_token>`
- **성공 (200)**: `{ "id": "uuid", "email": "user@example.com", "role": "authenticated" }`
- **실패 (401)**: `Invalid or expired token` (body) 또는 빈 body

---

## 5. 실행 방법

```bash
cd backend
cp .env.example .env
# .env에 SUPABASE_JWT_SECRET 설정

gradle bootRun
# Gradle Wrapper 사용 시: ./gradlew bootRun
```

서버 기본 포트: `8080`  
CORS: `http://localhost:3000`, `http://127.0.0.1:3000` 허용 (FE 개발용)

---

## 6. 추후 확장 TODO

- [ ] Gradle Wrapper 추가 (`gradle wrapper` 실행)
- [ ] JWKS 기반 검증 지원 (RS256, Supabase 신규 프로젝트용)
- [ ] CORS 설정 (FE origin 허용)
- [ ] OpenAPI/Swagger 문서화
- [ ] 추가 protected endpoint (widget, 설정 등)
