"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GoalCounterWidget, {
  BG_OPTIONS,
  buildSearchParams,
  parseNumber,
} from "@/components/widget/GoalCounterWidget";
import { Copy, Check } from "lucide-react";

function GoalCounterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const desc = searchParams.get("desc") ?? "";
  const goal = parseNumber(searchParams.get("goal"), 1);
  const current = parseNumber(searchParams.get("current"), 0);
  const bg = searchParams.get("bg") ?? "white";

  const updateUrl = (updates: {
    desc?: string;
    goal?: number;
    current?: number;
    bg?: string;
  }) => {
    const newDesc = updates.desc !== undefined ? updates.desc : desc;
    const newGoal = updates.goal !== undefined ? updates.goal : goal;
    const newCurrent = updates.current !== undefined ? updates.current : current;
    const newBg = updates.bg !== undefined ? updates.bg : bg;
    const query = buildSearchParams(newDesc, newGoal, newCurrent, newBg);
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

  return (
    <div className="min-h-screen bg-gray-50/80 py-6 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-6">
        {/* LNB 설정 패널 */}
        <aside className="w-full sm:w-56 shrink-0 flex flex-col gap-4 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800">설정</h2>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              목표 설명
            </label>
            <input
              type="text"
              value={desc}
              onChange={(e) => updateUrl({ desc: e.target.value })}
              placeholder="예: 운동하기, 책 읽기"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              aria-label="목표 설명"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              목표 개수
            </label>
            <input
              type="number"
              min={1}
              value={goal}
              onChange={(e) => {
                const v = parseNumber(e.target.value || null, 1);
                updateUrl({ goal: Math.max(1, v), current: Math.min(current, Math.max(1, v)) });
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="목표 개수"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              배경 색상
            </label>
            <div className="flex flex-wrap gap-1.5">
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
            className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
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
        </aside>

        {/* 위젯 미리보기 */}
        <main className="flex-1 min-w-0 flex items-start justify-center sm:justify-start">
          <Suspense
            fallback={
              <div className="w-full max-w-sm p-4 rounded-2xl border border-gray-200 bg-white animate-pulse h-64" />
            }
          >
            <GoalCounterWidget />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function GoalCounterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50/80" />}>
      <GoalCounterPageContent />
    </Suspense>
  );
}
