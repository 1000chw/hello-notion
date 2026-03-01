"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase, hasValidSession } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NICKNAME_RE = /^[a-zA-Z0-9_\uac00-\ud7a3]{2,20}$/;

function randomNickname(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "user_";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function validateEmail(email: string): string | null {
  if (!email.trim()) return "이메일을 입력해 주세요.";
  if (!EMAIL_RE.test(email)) return "올바른 이메일 형식이 아닙니다.";
  return null;
}

function validateNickname(nickname: string): string | null {
  const t = nickname.trim();
  if (!t) return "닉네임을 입력해 주세요.";
  if (t.length < 2) return "닉네임은 2자 이상이어야 합니다.";
  if (t.length > 20) return "닉네임은 20자 이하여야 합니다.";
  if (!NICKNAME_RE.test(t)) return "닉네임은 영문, 숫자, 한글, _ 만 사용할 수 있습니다.";
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return "비밀번호를 입력해 주세요.";
  if (password.length < 6) return "비밀번호는 6자 이상이어야 합니다.";
  return null;
}

function validatePasswordMatch(password: string, confirm: string): string | null {
  if (!confirm) return "비밀번호 확인을 입력해 주세요.";
  if (password !== confirm) return "비밀번호가 일치하지 않습니다.";
  return null;
}

function getSignUpAuthErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const msg = String((error as { message: string }).message).toLowerCase();
    if (
      msg.includes("user already registered") ||
      msg.includes("already registered") ||
      msg.includes("already been registered")
    )
      return "이미 가입된 이메일입니다. 로그인해 주세요.";
    if (msg.includes("email not confirmed")) return "이메일 인증이 완료되지 않았습니다. 이메일을 확인해 주세요.";
    if (msg.includes("too many requests")) return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    if (msg.includes("password") && msg.includes("weak")) return "비밀번호가 너무 약합니다. 6자 이상 입력해 주세요.";
  }
  return "회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.";
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [nicknameCheckStatus, setNicknameCheckStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const nicknameCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCheckedNickRef = useRef("");

  // 마운트 시 랜덤 닉네임 한 번만 설정 (빈 문자열일 때만)
  useEffect(() => {
    if (nickname === "" && typeof window !== "undefined") {
      setNickname(randomNickname());
    }
  }, []);

  // 닉네임 입력 디바운스 후 사용 가능 여부 체크
  const checkNicknameAvailable = useCallback(async (nick: string) => {
    const trimmed = nick.trim();
    if (trimmed.length < 2) {
      setNicknameCheckStatus("idle");
      return;
    }
    setNicknameCheckStatus("checking");
    lastCheckedNickRef.current = trimmed;
    const { data, error: rpcError } = await getSupabase().rpc("nickname_available", { nick: trimmed });
    if (lastCheckedNickRef.current !== trimmed) return;
    if (rpcError) {
      setNicknameCheckStatus("idle");
      return;
    }
    setNicknameCheckStatus(data === true ? "available" : "taken");
  }, []);

  useEffect(() => {
    if (nicknameCheckTimeoutRef.current) clearTimeout(nicknameCheckTimeoutRef.current);
    const t = nickname.trim();
    if (t.length < 2) {
      setNicknameCheckStatus("idle");
      return;
    }
    nicknameCheckTimeoutRef.current = setTimeout(() => {
      nicknameCheckTimeoutRef.current = null;
      checkNicknameAvailable(nickname);
    }, 400);
    return () => {
      if (nicknameCheckTimeoutRef.current) clearTimeout(nicknameCheckTimeoutRef.current);
    };
  }, [nickname, checkNicknameAvailable]);

  useEffect(() => {
    const checkSession = async () => {
      const valid = await hasValidSession();
      if (valid) {
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
    const nicknameErr = validateNickname(nickname);
    const passwordErr = validatePassword(password);
    const confirmErr = validatePasswordMatch(password, passwordConfirm);
    if (emailErr || nicknameErr || passwordErr || confirmErr) {
      setError(emailErr ?? nicknameErr ?? passwordErr ?? confirmErr ?? null);
      return;
    }
    if (nicknameCheckStatus === "taken") {
      setError("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해 주세요.");
      return;
    }
    if (nicknameCheckStatus === "checking") {
      setError("닉네임 사용 가능 여부를 확인 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    if (nicknameCheckStatus === "idle" && nickname.trim().length >= 2) {
      setError("닉네임 사용 가능 여부를 확인해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await getSupabase().auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
          data: { nickname: nickname.trim() },
        },
      });
      if (signUpError) throw signUpError;
      // 이메일 확인이 필요한 경우에도 성공으로 처리하고 홈으로 이동
      if (data?.user && !data.session && data.user.identities?.length === 0) {
        setError("이미 가입된 이메일입니다. 로그인해 주세요.");
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(getSignUpAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    email.trim() &&
    EMAIL_RE.test(email.trim()) &&
    nickname.trim().length >= 2 &&
    NICKNAME_RE.test(nickname.trim()) &&
    nicknameCheckStatus === "available" &&
    password.length >= 6 &&
    password === passwordConfirm;
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
            <h1 className="text-xl font-semibold text-gray-900 mb-6">회원가입</h1>
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
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1.5">
                  닉네임
                </label>
                <input
                  id="nickname"
                  type="text"
                  autoComplete="username"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="2~20자, 영문/숫자/한글/_"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  disabled={loading}
                  aria-invalid={!!error || nicknameCheckStatus === "taken"}
                  aria-describedby={nicknameCheckStatus !== "idle" ? "nickname-status" : undefined}
                />
                {nickname.trim().length >= 2 && (
                  <p
                    id="nickname-status"
                    className="mt-1 text-sm"
                    aria-live="polite"
                    role="status"
                  >
                    {nicknameCheckStatus === "checking" && (
                      <span className="text-gray-500">확인 중...</span>
                    )}
                    {nicknameCheckStatus === "available" && (
                      <span className="text-teal-600">사용 가능한 닉네임입니다.</span>
                    )}
                    {nicknameCheckStatus === "taken" && (
                      <span className="text-red-600">이미 사용 중인 닉네임입니다.</span>
                    )}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  disabled={loading}
                  aria-invalid={!!error}
                />
              </div>
              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1.5">
                  비밀번호 확인
                </label>
                <input
                  id="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  disabled={loading}
                  aria-invalid={!!error}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isDisabled}
                className="w-full py-2.5 rounded-full text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-600 transition-colors"
              >
                {loading ? "가입 중..." : "회원가입"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-500">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="font-medium text-teal-600 hover:text-teal-700">
                로그인
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
