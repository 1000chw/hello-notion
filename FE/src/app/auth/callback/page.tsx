"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getSupabase } from "@/lib/supabase";

/** URL hash에서 Supabase auth 파라미터 파싱 (error 또는 token) */
function parseHash(hash: string): { error?: string; errorCode?: string; errorDescription?: string } {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const error = params.get("error") ?? undefined;
  const errorCode = params.get("error_code") ?? undefined;
  const errorDescription = params.get("error_description") ?? undefined;
  return { error, errorCode, errorDescription };
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const { error, errorCode, errorDescription } = parseHash(hash);

    if (error) {
      if (errorCode === "otp_expired" || errorDescription?.toLowerCase().includes("expired")) {
        setErrorMessage(
          "이메일 링크가 만료되었거나 이미 사용되었습니다. 메일 클라이언트가 링크를 미리 열어서 그럴 수 있습니다. 아래에서 인증 메일을 다시 받을 수 있습니다."
        );
      } else {
        setErrorMessage(
          errorDescription?.replace(/\+/g, " ") ?? "인증 중 문제가 발생했습니다."
        );
      }
      setStatus("error");
      return;
    }

    // 성공 시 Supabase가 hash에 token을 넣어 보냄 → 세션 갱신 후 홈으로
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/");
        router.refresh();
        return;
      }
      // hash에 token이 있으면 한 번 기다렸다가 다시 확인 (Supabase가 hash 처리하는 시간)
      const t = setTimeout(() => {
        supabase.auth.getSession().then(({ data: d }) => {
          if (d.session) {
            router.replace("/");
            router.refresh();
          } else {
            setStatus("error");
            setErrorMessage("세션을 복구하지 못했습니다. 로그인을 다시 시도해 주세요.");
          }
        });
      }, 500);
      return () => clearTimeout(t);
    });
  }, [router]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendError(null);
    if (!resendEmail.trim()) {
      setResendError("이메일을 입력해 주세요.");
      return;
    }
    setResendLoading(true);
    try {
      const { error } = await getSupabase().auth.resend({
        type: "signup",
        email: resendEmail.trim(),
      });
      if (error) throw error;
      setResendSent(true);
    } catch (err) {
      setResendError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "인증 메일 재전송에 실패했습니다."
      );
    } finally {
      setResendLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <p className="text-gray-500 text-sm" aria-live="polite">
            확인 중...
          </p>
        </main>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h1 className="text-xl font-semibold text-gray-900 mb-2">이메일 인증 실패</h1>
              <p className="text-sm text-gray-600 mb-6">{errorMessage}</p>

              {errorMessage?.includes("다시 받을 수 있습니다") && (
                <form onSubmit={handleResend} className="space-y-3 mb-6">
                  <label htmlFor="resend-email" className="block text-sm font-medium text-gray-700">
                    인증 메일을 받을 이메일
                  </label>
                  <input
                    id="resend-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    disabled={resendLoading || resendSent}
                  />
                  {resendError && (
                    <p className="text-sm text-red-600" role="alert">
                      {resendError}
                    </p>
                  )}
                  {resendSent && (
                    <p className="text-sm text-teal-600">
                      인증 메일을 다시 보냈습니다. 받은편지함을 확인해 주세요.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={resendLoading || resendSent}
                    className="w-full py-2.5 rounded-full text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendLoading ? "전송 중..." : resendSent ? "전송됨" : "인증 메일 다시 보내기"}
                  </button>
                </form>
              )}

              <p className="text-center text-sm text-gray-500">
                <Link href="/login" className="font-medium text-teal-600 hover:text-teal-700">
                  로그인
                </Link>
                {" · "}
                <Link href="/signup" className="font-medium text-teal-600 hover:text-teal-700">
                  회원가입
                </Link>
              </p>
            </div>
            <p className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-500 hover:text-teal-600">
                ← 홈으로
              </Link>
            </p>
          </div>
        </main>
      </>
    );
  }

  return null;
}
