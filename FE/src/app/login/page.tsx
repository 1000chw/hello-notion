"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): string | null {
  if (!email.trim()) return "이메일을 입력해 주세요.";
  if (!EMAIL_RE.test(email)) return "올바른 이메일 형식이 아닙니다.";
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return "비밀번호를 입력해 주세요.";
  return null;
}

function getAuthErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message: string }).message;
    if (msg.includes("Invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
    if (msg.includes("Email not confirmed")) return "이메일 인증이 완료되지 않았습니다. 이메일을 확인해 주세요.";
    if (msg.includes("too many requests")) return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
  }
  return "로그인 중 문제가 발생했습니다. 다시 시도해 주세요.";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // 이미 로그인된 세션이면 / 로 리다이렉트
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await getSupabase().auth.getSession();
      if (data.session) {
        router.replace("/");
        return;
      }
      setCheckingSession(false);
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    if (emailErr || passwordErr) {
      setError(emailErr ?? passwordErr ?? null);
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await getSupabase().auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) throw signInError;
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const isValid = email.trim() && EMAIL_RE.test(email.trim()) && password.length > 0;
  const isDisabled = loading || checkingSession || !isValid;

  if (checkingSession) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-gray-500 text-sm" aria-live="polite">
            로딩 중...
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-900 mb-6">로그인</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  disabled={loading}
                  aria-invalid={!!error}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  disabled={loading}
                  aria-invalid={!!error}
                />
              </div>
              {error && (
                <p
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isDisabled}
                className="w-full py-2.5 rounded-full text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-600 transition-colors"
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-500">
              계정이 없으신가요?{" "}
              <Link
                href="/signup"
                className="font-medium text-teal-600 hover:text-teal-700"
              >
                회원가입
              </Link>
            </p>
          </div>
          <p className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-teal-600">
              ← 홈으로 돌아가기
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
