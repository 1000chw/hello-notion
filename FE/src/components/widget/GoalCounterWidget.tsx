"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function parseNumber(value: string | null, fallback: number): number {
  if (value == null || value === "") return fallback;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : Math.max(0, n);
}

function buildSearchParams(desc: string, goal: number, current: number): string {
  const params = new URLSearchParams();
  if (desc.trim()) params.set("desc", desc.trim());
  params.set("goal", String(goal));
  params.set("current", String(current));
  const q = params.toString();
  return q ? `?${q}` : "";
}

export default function GoalCounterWidget() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [description, setDescription] = useState("");
  const [goalCount, setGoalCount] = useState(1);
  const [currentCount, setCurrentCount] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);

  // 1. URL 파라미터로 상태 초기화
  useEffect(() => {
    const desc = searchParams.get("desc") ?? "";
    const goal = parseNumber(searchParams.get("goal"), 1);
    const current = parseNumber(searchParams.get("current"), 0);
    setDescription(desc);
    setGoalCount(goal);
    setCurrentCount(Math.min(current, goal));
    setIsInitializing(false);
  }, [searchParams]);

  // 2. 상태 변경 시 URL 업데이트 (부수 효과)
  useEffect(() => {
    if (isInitializing) return;

    const query = buildSearchParams(description, goalCount, currentCount);
    const url = query ? `${pathname}${query}` : pathname;
    window.history.replaceState(null, "", url);
  }, [description, goalCount, currentCount, isInitializing, pathname]);

  // 3. 핸들러는 상태 업데이트만 담당
  const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseNumber(e.target.value || null, 1);
    const newGoal = Math.max(1, v);
    setGoalCount(newGoal);
    setCurrentCount((c) => Math.min(c, newGoal));
  };

  const handlePlus = () => {
    setCurrentCount((c) => Math.min(c + 1, goalCount));
  };

  const handleMinus = () => {
    setCurrentCount((c) => Math.max(0, c - 1));
  };

  return (
    <div className="goal-counter-widget w-full max-w-sm mx-auto p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        목표 달성
      </h2>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        목표 설명
      </label>
      <input
        type="text"
        value={description}
        onChange={handleDescChange}
        placeholder="예: 운동하기, 책 읽기"
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4"
        aria-label="목표 설명"
      />

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-sm text-gray-600">목표</span>
        <input
          type="number"
          min={1}
          value={goalCount}
          onChange={handleGoalChange}
          className="w-16 px-2 py-1 rounded border border-gray-200 text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="목표 개수"
        />
        <span className="text-sm text-gray-600">개 달성</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">
          현재 <strong className="text-teal-600">{currentCount}</strong>개 달성
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleMinus}
          disabled={currentCount <= 0}
          className="flex-1 py-2 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="1 감소"
        >
          −1
        </button>
        <button
          type="button"
          onClick={handlePlus}
          disabled={currentCount >= goalCount}
          className="flex-1 py-2 px-4 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 font-medium hover:bg-teal-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="1 증가"
        >
          +1
        </button>
      </div>

      {goalCount > 0 && (
        <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-300"
            style={{ width: `${(currentCount / goalCount) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
