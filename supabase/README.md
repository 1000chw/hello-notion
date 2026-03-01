# Supabase 마이그레이션

- **profiles + 닉네임**: `migrations/20250301000000_add_profiles_and_nickname.sql`
  - `public.profiles` 테이블 (id, nickname), `nickname_available(nick)` RPC, `auth.users` INSERT 시 프로필 자동 생성 트리거
- 적용: Supabase Dashboard > SQL Editor에서 해당 파일 내용 실행, 또는 Supabase CLI `supabase db push`

## Storage 버킷 (수동 설정)

- **widget-images**: 시계 위젯 배경 이미지 저장용.
  - Supabase Dashboard > Storage > New bucket > 이름 `widget-images`, **Public bucket** 체크 (위젯에서 URL로 직접 접근).
  - 업로드는 백엔드(service role)만 수행하므로 RLS는 기본 설정으로 두거나, 필요 시 정책 추가.
