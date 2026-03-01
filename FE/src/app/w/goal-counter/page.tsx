"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import GoalCounterWidget, {
  BG_OPTIONS,
  buildSearchParams,
  parseNumber,
} from "@/components/widget/GoalCounterWidget";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground, { pageBackgroundClass } from "@/components/PageBackground";
import { Copy, Check, ArrowLeft, Target } from "lucide-react";

/** iframe(노션 임베드 등) 안에서는 위젯만 렌더링 */
function useIsEmbedded() {
  const [isEmbedded, setIsEmbedded] = useState(false);
  useEffect(() => {
    setIsEmbedded(typeof window !== "undefined" && window.self !== window.top);
  }, []);
  return isEmbedded;
}

function GoalCounterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const isEmbedded = useIsEmbedded();

  const desc = searchParams.get("desc") ?? "";
  const goal = Math.max(1, parseNumber(searchParams.get("goal"), 1));
  const current = parseNumber(searchParams.get("current"), 0);
  const bg = searchParams.get("bg") ?? "white";

  // 입력 중에는 로컬 state만 갱신하고, onBlur 시 URL 반영 → 커서가 맨 뒤로 가지 않음
  const [editingDesc, setEditingDesc] = useState(desc);
  const [editingGoal, setEditingGoal] = useState<number | "">(goal);
  useEffect(() => {
    queueMicrotask(() => {
      setEditingDesc(desc);
      setEditingGoal(goal);
    });
  }, [desc, goal]);

  const updateUrl = (updates: {
    desc?: string;
    goal?: number;
    current?: number;
    bg?: string;
  }) => {
    const newParams = { desc, goal, current, bg, ...updates };
    const query = buildSearchParams(
      newParams.desc,
      newParams.goal,
      newParams.current,
      newParams.bg
    );
    router.replace(`/w/goal-counter${query}`, { scroll: false });
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const timerId = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timerId);
  }, [copied]);

  // 임베드(iframe)일 때: 위젯만 표시. 복사한 링크를 노션 등에 넣으면 이 화면만 보임.
  if (isEmbedded) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 bg-transparent">
        <GoalCounterWidget />
      </div>
    );
  }

  // 설정 페이지: Navbar + 공통 배경 + 좌(LNB) 우(위젯) 레이아웃 + Footer
  return (
    <>
      <Navbar />
      <PageBackground>
        <main>
          <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* 헤더: 갤러리로 돌아가기 → 뱃지 + 제목 */}
            <div className="mb-8">
              <Link
                href="/#gallery"
                className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium mb-3"
              >
                <ArrowLeft size={16} />
                위젯 갤러리로
              </Link>
              <div className="flex flex-wrap items-baseline justify-between gap-2 gap-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  목표 달성 카운터
                </h1>
                <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full shrink-0">
                  생산성 · 무료
                </span>
              </div>
              <p className="mt-2 text-gray-500 text-sm max-w-md">
                목표 설명과 개수를 설정한 뒤 링크를 복사해 노션 /embed에 붙여넣으세요.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* 좌측: LNB 설정 패널 (고정폭) */}
              <aside className="w-full md:w-64 shrink-0 order-1 md:order-1">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:sticky md:top-24">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Target size={18} className="text-emerald-600" />
                    </div>
                    <h2 className="text-sm font-semibold text-gray-800">설정</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        목표 설명
                      </label>
                      <input
                        type="text"
                        value={editingDesc}
                        onChange={(e) => setEditingDesc(e.target.value)}
                        onBlur={() => updateUrl({ desc: editingDesc })}
                        placeholder="예: 운동하기, 책 읽기"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        aria-label="목표 설명"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        목표 개수
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={editingGoal === "" ? "" : editingGoal}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === "") {
                            setEditingGoal("");
                            return;
                          }
                          const v = parseNumber(raw, 0);
                          setEditingGoal(v < 0 ? 0 : v);
                        }}
                        onBlur={() => {
                          const g = editingGoal === "" ? 0 : editingGoal;
                          const goalForUrl = Math.max(1, g);
                          updateUrl({ goal: goalForUrl, current: Math.min(current, goalForUrl) });
                          if (editingGoal === "" || g < 1) {
                            setEditingGoal(goalForUrl);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        aria-label="목표 개수"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        배경 색상
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {BG_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateUrl({ bg: opt.value })}
                            className={`w-8 h-8 rounded-lg border-2 transition-colors ${opt.class} ${
                              bg === opt.value
                                ? "border-teal-500 ring-2 ring-teal-200"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            title={opt.label}
                            aria-label={`배경 ${opt.label}`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
                      aria-label="위젯 링크 복사"
                    >
                      {copied ? (
                        <>
                          <Check size={16} />
                          복사됨
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          링크 복사
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </aside>

              {/* 우측: 위젯 미리보기 (입력값 실시간 반영) */}
              <div className="flex-1 min-w-0 w-full flex items-start justify-center md:justify-start order-2 md:order-2">
                <Suspense
                  fallback={
                    <div className="w-full max-w-sm p-4 rounded-2xl border border-gray-200 bg-white animate-pulse h-64" />
                  }
                >
                  <GoalCounterWidget
                    overrideDesc={editingDesc}
                    overrideGoal={editingGoal === "" ? 1 : editingGoal}
                  />
                </Suspense>
              </div>
            </div>
            </div>
          </section>
        </main>
      </PageBackground>
      <Footer />
    </>
  );
}

export default function GoalCounterPage() {
  return (
    <Suspense fallback={<div className={pageBackgroundClass} />}>
      <GoalCounterPageContent />
    </Suspense>
  );
}
