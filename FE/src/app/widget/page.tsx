"use client";

import { useState, Suspense } from "react";
import GoalCounterWidget from "@/components/widget/GoalCounterWidget";
import { Copy, Check } from "lucide-react";

export default function WidgetPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50/80 py-6 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <Suspense fallback={<div className="p-4 rounded-2xl border border-gray-200 bg-white animate-pulse h-48" />}>
          <GoalCounterWidget />
        </Suspense>

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            노션에 이 위젯을 넣으려면 아래 링크를 복사한 뒤 노션에서 /embed 입력 후
            붙여넣으세요.
          </p>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="위젯 링크 복사"
          >
            {copied ? (
              <>
                <Check size={14} className="text-teal-600" />
                복사됨
              </>
            ) : (
              <>
                <Copy size={14} />
                링크 복사
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
