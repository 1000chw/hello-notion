# Supabase 마이그레이션

- **profiles + 닉네임**: `migrations/20250301000000_add_profiles_and_nickname.sql`
  - `public.profiles` 테이블 (id, nickname), `nickname_available(nick)` RPC, `auth.users` INSERT 시 프로필 자동 생성 트리거
- 적용: Supabase Dashboard > SQL Editor에서 해당 파일 내용 실행, 또는 Supabase CLI `supabase db push`
