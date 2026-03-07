import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * 브라우저용 Supabase 클라이언트 (lazy singleton).
 * anon key는 공개용이라 프론트 요청 헤더에 노출돼도 괜찮고, RLS로 읽기 범위만 제한됩니다.
 */
export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다."
      );
    }
    _client = createClient(url, key);
  }
  return _client;
}

/**
 * 로컬이 아닌 서버로 세션 검증. true면 로그인된 상태.
 * 만료/잘못된 토큰이 있으면 refresh 실패 시 signOut 후 false 반환.
 */
export async function hasValidSession(): Promise<boolean> {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  if (!data.session) return false;
  const { data: refreshData, error } = await supabase.auth.refreshSession();
  if (error) {
    await supabase.auth.signOut();
    return false;
  }
  return !!refreshData.session;
}
