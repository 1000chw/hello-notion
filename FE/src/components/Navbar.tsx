"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, ChevronDown, User, LogOut, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { getSupabase } from "@/lib/supabase";

const navLinks = [
  { label: "위젯 갤러리", href: "/gallery" },
  { label: "사용 방법", href: "#how-it-works" },
  { label: "요금제", href: "#pricing" },
];

// Nickname validation (same rules as signup: 2–20 chars, alphanumeric, 한글, _)
const NICKNAME_RE = /^[a-zA-Z0-9_\uac00-\ud7a3]{2,20}$/;
function validateNickname(nickname: string): string | null {
  const t = nickname.trim();
  if (!t) return "닉네임을 입력해 주세요.";
  if (t.length < 2) return "닉네임은 2자 이상이어야 합니다.";
  if (t.length > 20) return "닉네임은 20자 이하여야 합니다.";
  if (!NICKNAME_RE.test(t)) return "닉네임은 영문, 숫자, 한글, _ 만 사용할 수 있습니다.";
  return null;
}

type AuthState = "loading" | "guest" | "user";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [nickname, setNickname] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalNicknameOpen, setModalNicknameOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  // Auth + profile
  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (!session?.user) {
        setAuthState("guest");
        return;
      }
      const userId = session.user.id;
      supabase
        .from("profiles")
        .select("nickname")
        .eq("id", userId)
        .single()
        .then(({ data, error }) => {
          if (cancelled) return;
          setNickname(error ? null : (data?.nickname ?? null));
          setAuthState("user");
        });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (!session?.user) {
        setAuthState("guest");
        setNickname(null);
        return;
      }
      const userId = session.user.id;
      supabase
        .from("profiles")
        .select("nickname")
        .eq("id", userId)
        .single()
        .then(({ data, error }) => {
          if (cancelled) return;
          setNickname(error ? null : (data?.nickname ?? null));
          setAuthState("user");
        });
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    if (!menuOpen) return;
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [menuOpen]);

  // When dropdown opens, focus first menu item for keyboard
  useEffect(() => {
    if (menuOpen) {
      firstMenuItemRef.current?.focus();
    }
  }, [menuOpen]);

  // Escape to close dropdown and modals
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (modalDeleteOpen) setModalDeleteOpen(false);
      else if (modalNicknameOpen) setModalNicknameOpen(false);
      else if (menuOpen) setMenuOpen(false);
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [menuOpen, modalNicknameOpen, modalDeleteOpen]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, []);

  const handleLogout = useCallback(async () => {
    setMenuOpen(false);
    setMobileOpen(false);
    await getSupabase().auth.signOut();
    router.push("/");
    router.refresh();
  }, [router]);

  const displayName = nickname?.trim() || "사용자";

  return (
    <>
      <nav
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              aria-label="Hello Notion 홈"
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-xl"
            >
              <span className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-emerald-600 shadow-sm ring-1 ring-black/5 overflow-hidden transition-shadow duration-200 group-hover:shadow-[0_10px_26px_rgba(20,184,166,0.28)] motion-reduce:transition-none">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.55),transparent_45%)] opacity-90"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_55%)]"
                />
                <span className="relative w-full h-full flex items-center justify-center text-white/95">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-[18px] h-[18px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.22)]"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 17V7l10 10V7"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
              <span className="flex items-baseline gap-0.5">
                <span className="font-semibold text-[15px] text-gray-900 tracking-[-0.02em]">
                  Hello
                </span>
                <span className="font-semibold text-[15px] tracking-[-0.02em] bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Notion
                </span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.filter((link) => link.href !== "#pricing").map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors duration-150 cursor-pointer"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors duration-150 cursor-pointer"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>

            {/* Right: loading / guest / user */}
            <div className="hidden md:flex items-center gap-3">
              <div className="relative flex items-center">
                <div
                  className={clsx(
                    "flex items-center overflow-hidden transition-all duration-300 rounded-full border",
                    searchOpen
                      ? "w-48 border-teal-300 bg-white shadow-sm"
                      : "w-8 border-transparent bg-transparent"
                  )}
                >
                  <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-teal-600 transition-colors cursor-pointer"
                    aria-label="검색"
                  >
                    <Search size={16} />
                  </button>
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="위젯 검색..."
                    className={clsx(
                      "flex-1 text-sm text-gray-700 outline-none bg-transparent pr-3 placeholder-gray-400 transition-all duration-300",
                      searchOpen ? "opacity-100 w-full" : "opacity-0 w-0"
                    )}
                    onBlur={() => setSearchOpen(false)}
                  />
                </div>
              </div>

              {authState === "loading" && (
                <div className="w-24 h-8 rounded-full bg-gray-100 animate-pulse" aria-hidden />
              )}
              {authState === "guest" && (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors cursor-pointer px-3 py-1.5"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 transition-colors cursor-pointer px-4 py-2 rounded-full shadow-sm"
                  >
                    시작하기
                  </Link>
                </>
              )}
              {authState === "user" && (
                <div className="relative flex items-center gap-2" ref={menuRef}>
                  <span className="text-sm text-gray-600 max-w-[120px] truncate" title={displayName}>
                    안녕하세요, <span className="font-medium text-gray-800">{displayName}</span>님
                  </span>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 focus-visible:ring-offset-2"
                    aria-label="설정 메뉴"
                    aria-expanded={menuOpen}
                    aria-haspopup="true"
                  >
                    <ChevronDown
                      size={18}
                      className={clsx("transition-transform duration-200", menuOpen && "rotate-180")}
                    />
                  </button>
                  {menuOpen && (
                    <div
                      className="absolute right-0 top-full mt-1.5 py-1.5 min-w-[180px] rounded-xl border border-gray-200 bg-white shadow-lg z-50"
                      role="menu"
                    >
                      <button
                        ref={firstMenuItemRef}
                        type="button"
                        role="menuitem"
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors cursor-pointer"
                        onClick={() => {
                          setMenuOpen(false);
                          setModalNicknameOpen(true);
                        }}
                      >
                        <User size={16} className="text-gray-500" />
                        닉네임 수정
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} className="text-gray-500" />
                        로그아웃
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                        onClick={() => {
                          setMenuOpen(false);
                          setModalDeleteOpen(true);
                        }}
                      >
                        <Trash2 size={16} className="text-gray-500" />
                        회원 탈퇴
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center text-gray-600 hover:text-teal-600 transition-colors cursor-pointer"
              aria-label="메뉴"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={clsx(
            "md:hidden overflow-hidden transition-all duration-300 bg-white border-b border-gray-100",
            mobileOpen ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-4 py-3 space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 mb-3">
              <Search size={15} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="위젯 검색..."
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
              />
            </div>

            {navLinks.filter((link) => link.href !== "#pricing").map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              )
            )}

            <div className="pt-3 pb-1 flex flex-col gap-2 border-t border-gray-100 mt-2">
              {authState === "loading" && (
                <div className="h-10 rounded-lg bg-gray-100 animate-pulse" aria-hidden />
              )}
              {authState === "guest" && (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-center text-sm font-medium text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="text-center text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    시작하기
                  </Link>
                </>
              )}
              {authState === "user" && (
                <>
                  <div className="px-3 py-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-800">{displayName}</span>님
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setModalNicknameOpen(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors cursor-pointer text-left w-full"
                  >
                    <User size={16} />
                    닉네임 수정
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors cursor-pointer text-left w-full"
                  >
                    <LogOut size={16} />
                    로그아웃
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setModalDeleteOpen(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors cursor-pointer text-left w-full"
                  >
                    <Trash2 size={16} />
                    회원 탈퇴
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium shadow-lg transition-opacity duration-200 opacity-100"
        >
          {toast}
        </div>
      )}

      {/* Nickname edit modal */}
      {modalNicknameOpen && (
        <NicknameEditModal
          currentNickname={nickname ?? ""}
          onClose={() => setModalNicknameOpen(false)}
          onSaved={(newNickname) => {
            setNickname(newNickname);
            setModalNicknameOpen(false);
            showToast("닉네임이 변경되었습니다.");
          }}
        />
      )}

      {/* Delete account modal (contact support) */}
      {modalDeleteOpen && (
        <DeleteAccountModal onClose={() => setModalDeleteOpen(false)} />
      )}
    </>
  );
}

// --- Nickname edit modal ---
function NicknameEditModal({
  currentNickname,
  onClose,
  onSaved,
}: {
  currentNickname: string;
  onClose: () => void;
  onSaved: (nickname: string) => void;
}) {
  const [value, setValue] = useState(currentNickname);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(currentNickname);
    inputRef.current?.focus();
  }, [currentNickname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateNickname(value);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) {
        setError("로그인이 필요합니다.");
        setSaving(false);
        return;
      }
      const trimmed = value.trim();
      const { error: updateError } = await getSupabase()
        .from("profiles")
        .update({ nickname: trimmed })
        .eq("id", user.id);
      if (updateError) {
        setError(updateError.message || "저장에 실패했습니다.");
        setSaving(false);
        return;
      }
      onSaved(trimmed);
    } catch {
      setError("저장 중 오류가 발생했습니다.");
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nickname-modal-title"
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <h2 id="nickname-modal-title" className="text-lg font-semibold text-gray-900 mb-4">
          닉네임 수정
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nickname-edit" className="block text-sm font-medium text-gray-700 mb-1.5">
              닉네임
            </label>
            <input
              ref={inputRef}
              id="nickname-edit"
              type="text"
              autoComplete="username"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              placeholder="2~20자, 영문/숫자/한글/_"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              disabled={saving}
              aria-invalid={!!error}
              aria-describedby={error ? "nickname-edit-error" : undefined}
            />
            {error && (
              <p id="nickname-edit-error" className="mt-1.5 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Delete account modal (contact support; no client deleteUser) ---
function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <h2 id="delete-modal-title" className="text-lg font-semibold text-gray-900 mb-2">
          회원 탈퇴
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          탈퇴를 원하시면 고객센터로 문의해 주세요. 담당자가 확인 후 처리해 드립니다.
        </p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
