"use client";

import { useState, useEffect } from "react";
import { Copy, Check, ArrowRight, Sparkles } from "lucide-react";

const demoLink = "https://hello-notion.com/w/clock-minimal";

export default function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(demoLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-teal-50 via-white to-white pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-teal-100/60 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-teal-50/80 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-teal-400 opacity-60" />
        <div className="absolute top-1/4 right-1/3 w-3 h-3 rounded-full bg-orange-300 opacity-50" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-teal-300 opacity-70" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold mb-6 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <Sparkles size={12} />
          <span>무료로 시작하세요 — 설치 없음</span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-5 transition-all duration-700 delay-100"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          노션을 더{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-teal-600">강력하게</span>
            <span className="absolute bottom-1 left-0 w-full h-3 bg-teal-100 -z-0 rounded" aria-hidden />
          </span>{" "}
          만드는 위젯
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed transition-all duration-700 delay-200"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          링크 하나로 노션에 바로 임베딩. 시계, 달력, 날씨, 포모도로까지 —{" "}
          <strong className="text-gray-700 font-semibold">복사 &amp; 붙여넣기만 하면 끝.</strong>
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 transition-all duration-700 delay-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <a
            href="#gallery"
            className="group flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full shadow-md hover:shadow-teal-200 transition-all duration-200 cursor-pointer text-sm"
          >
            위젯 둘러보기
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-full border border-gray-200 shadow-sm transition-all duration-200 cursor-pointer text-sm"
          >
            사용 방법 보기
          </a>
        </div>

        {/* Demo embed preview */}
        <div
          className="transition-all duration-700 delay-500"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
            이 링크를 노션에 붙여넣어 보세요
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 max-w-sm mx-auto">
            <div className="flex-1 text-xs font-mono text-teal-600 truncate text-left">
              {demoLink}
            </div>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-600 transition-colors duration-150 cursor-pointer text-xs font-medium border border-gray-100"
              aria-label="링크 복사"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-teal-500" />
                  <span className="text-teal-600">복사됨</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>복사</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            노션에서{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">/embed</code>
            {" "}입력 후 링크를 붙여넣으세요
          </p>
        </div>
      </div>
    </section>
  );
}
