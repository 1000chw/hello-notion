"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Supabase가 redirect_to로 루트(/)를 쓰는 경우, 인증 실패 시 /#error=... 로 옵니다.
 * 이 컴포넌트가 hash에 error가 있으면 /auth/callback으로 보내서 에러 UI를 보여줍니다.
 */
export default function AuthHashRedirect() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || pathname !== "/") return;
    const hash = window.location.hash;
    if (hash && hash.includes("error=")) {
      window.location.replace(`${window.location.origin}/auth/callback${hash}`);
    }
  }, [pathname]);

  return null;
}
