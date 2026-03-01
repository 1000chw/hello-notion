# Hello Notion 배포 가이드

main 브랜치 기준으로 **FE → Vercel**, **Supabase(DB·인증) → Supabase Cloud** 에 배포하는 방법입니다.

---

## 1. Supabase (DB·인증)

이미 프로젝트가 있으면(예: `ktnibakykbggkkcutmot`) 아래만 진행하면 됩니다.

### 1.1 마이그레이션 적용

- **Supabase Dashboard** → **SQL Editor** 에서 다음 파일 내용을 복사해 실행:
  - `supabase/migrations/20250301000000_add_profiles_and_nickname.sql`
- 또는 로컬에서 Supabase CLI 사용:
  ```bash
  supabase link --project-ref <project-ref>
  supabase db push
  ```

### 1.2 Auth Redirect URL (프로덕션)

배포된 FE 도메인을 등록해야 로그인/회원가입 후 리다이렉트가 동작합니다.

- **Supabase Dashboard** → **Authentication** → **URL Configuration**
- **Redirect URLs** 에 추가:
  - `https://<your-vercel-domain>.vercel.app`
  - `https://<your-custom-domain.com>` (사용 시)
  - (개발용) `http://localhost:3000` 등은 이미 있으면 유지

### 1.3 API URL / 키 확인

- **Project Settings** → **API**
- **Project URL**, **anon public** 키를 복사해 두세요.  
  Vercel 환경 변수에 넣을 때 사용합니다.

---

## 2. Vercel (FE 배포)

### 2.1 프로젝트 연결

1. [Vercel](https://vercel.com) 로그인 후 **Add New** → **Project**
2. GitHub 저장소 `hello-notion` 선택
3. **Root Directory** 를 **`FE`** 로 설정 (루트가 아니라 `FE` 폴더가 Next.js 앱)
4. **Framework Preset**: Next.js 자동 감지
5. **Build Command**: `npm run build` (기본값)
6. **Output Directory**: 비워 두기 (Next.js 기본)
7. **Install Command**: `npm install` (기본값)

### 2.2 환경 변수 (env) 지정

**Vercel Dashboard** → 해당 프로젝트 → **Settings** → **Environment Variables** 에서 추가합니다.

| 이름 | 값 | 적용 환경 |
|------|-----|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL (예: `https://xxxx.supabase.co`) | Production, Preview, Development 원하는 것 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key | Production, Preview, Development 원하는 것 |

- **Production**: 메인 도메인(배포 브랜치)용
- **Preview**: PR/브랜치별 미리보기용 (같은 Supabase 프로젝트 써도 됨)
- **Development**: `vercel dev` 로 로컬 실행 시 사용

⚠️ **주의**: `.env` / `.env.local` 은 **Vercel에 올리지 마세요**. 값은 반드시 Vercel 대시보드(또는 Vercel CLI)에만 입력하고, 저장소에는 커밋하지 않습니다.

### 2.3 배포

- **Deploy** 클릭 후 배포 완료될 때까지 대기
- 배포 후 나오는 URL(예: `https://hello-notion-xxx.vercel.app`)을 Supabase Redirect URLs에 위처럼 추가

---

## 3. 요약 체크리스트

- [ ] Supabase 마이그레이션 적용 (`20250301000000_add_profiles_and_nickname.sql`)
- [ ] Supabase Auth Redirect URLs에 Vercel URL 추가
- [ ] Vercel 프로젝트 Root Directory = `FE`
- [ ] Vercel 환경 변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Vercel 배포 후 나온 URL을 Supabase Redirect URLs에 반영

---

## 4. 참고

- **env 지정 위치**
  - **로컬 개발**: `FE/.env` 또는 `FE/.env.local` (이미 `.gitignore`에 있음)
  - **Vercel**: 대시보드 **Settings → Environment Variables** (또는 Vercel CLI)
  - **Supabase** 자체의 DB/Auth 설정은 Supabase Dashboard에서만 하면 됩니다.
- Kotlin/Spring Boot 같은 별도 BE 서버는 현재 저장소에 없으며, 있다면 Railway·Fly·등에 별도 배포하고 그 URL을 FE에서 사용하는 방식으로 확장할 수 있습니다.
