"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, Check, Clock, Calendar, Cloud, Timer, CheckSquare, Quote, Users, Music, Target, Settings } from "lucide-react";
import { clsx } from "clsx";

const widgets = [
  {
    id: "goal-counter",
    name: "목표 달성 카운터",
    description: "목표 설명·개수·현재 달성 개수를 URL에 담아 노션에 임베드. 링크 복사 후 노션 /embed에 붙여넣으면 됩니다.",
    icon: Target,
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    tags: ["생산성", "무료"],
    link: "/w/goal-counter",
    configPage: true,
  },
  {
    id: "clock",
    name: "미니멀 시계",
    description: "깔끔한 디지털/아날로그 시계",
    icon: Clock,
    color: "bg-teal-50",
    iconColor: "text-teal-600",
    tags: ["시간", "무료"],
    link: "https://hello-notion.com/w/clock-minimal",
  },
  {
    id: "calendar",
    name: "미니 달력",
    description: "이번 달 날짜를 한눈에 확인",
    icon: Calendar,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
    tags: ["날짜", "무료"],
    link: "https://hello-notion.com/w/calendar-mini",
  },
  {
    id: "weather",
    name: "날씨 위젯",
    description: "실시간 날씨와 7일 예보",
    icon: Cloud,
    color: "bg-sky-50",
    iconColor: "text-sky-500",
    tags: ["날씨", "무료"],
    link: "https://hello-notion.com/w/weather",
  },
  {
    id: "pomodoro",
    name: "포모도로 타이머",
    description: "집중 & 휴식 사이클 관리",
    icon: Timer,
    color: "bg-orange-50",
    iconColor: "text-orange-500",
    tags: ["생산성", "무료"],
    link: "https://hello-notion.com/w/pomodoro",
  },
  {
    id: "todo",
    name: "할일 목록",
    description: "노션 DB와 연동되는 투두리스트",
    icon: CheckSquare,
    color: "bg-green-50",
    iconColor: "text-green-600",
    tags: ["생산성", "Pro"],
    link: "https://hello-notion.com/w/todo",
  },
  {
    id: "quote",
    name: "오늘의 명언",
    description: "매일 새로운 영감을 주는 명언",
    icon: Quote,
    color: "bg-violet-50",
    iconColor: "text-violet-600",
    tags: ["영감", "무료"],
    link: "https://hello-notion.com/w/quote",
  },
  {
    id: "visitor",
    name: "방문자 카운터",
    description: "페이지 방문 횟수 실시간 표시",
    icon: Users,
    color: "bg-pink-50",
    iconColor: "text-pink-500",
    tags: ["분석", "무료"],
    link: "https://hello-notion.com/w/visitor",
  },
  {
    id: "music",
    name: "음악 플레이어",
    description: "집중할 때 듣기 좋은 lo-fi 라디오",
    icon: Music,
    color: "bg-amber-50",
    iconColor: "text-amber-600",
    tags: ["음악", "무료"],
    link: "https://hello-notion.com/w/music",
  },
];

function WidgetCard({ widget }: { widget: (typeof widgets)[0] }) {
  const [copied, setCopied] = useState(false);
  const Icon = widget.icon;
  const isConfigPage = "configPage" in widget && (widget as { configPage?: boolean }).configPage;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = widget.link.startsWith("http")
      ? widget.link
      : `${typeof window !== "undefined" ? window.location.origin : ""}${widget.link}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const timerId = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timerId);
  }, [copied]);

  const cardContent = (
    <>
      {/* Icon + Tags */}
      <div className="flex items-start justify-between">
        <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center", widget.color)}>
          <Icon size={20} className={widget.iconColor} />
        </div>
        <div className="flex gap-1.5">
          {widget.tags.map((tag) => (
            <span
              key={tag}
              className={clsx(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                tag === "Pro"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Name + Description */}
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{widget.name}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{widget.description}</p>
      </div>

      {/* Copy / Config button */}
      {isConfigPage ? (
        <span
          className={clsx(
            "mt-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer border",
            "bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-600 border-gray-100 hover:border-teal-200"
          )}
        >
          <Settings size={13} />
          설정하러 가기
        </span>
      ) : (
        <button
          onClick={handleCopy}
          className={clsx(
            "mt-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer border",
            copied
              ? "bg-teal-50 text-teal-600 border-teal-200"
              : "bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-600 border-gray-100 hover:border-teal-200"
          )}
          aria-label={`${widget.name} 링크 복사`}
        >
          {copied ? (
            <>
              <Check size={13} />
              복사됨!
            </>
          ) : (
            <>
              <Copy size={13} />
              링크 복사
            </>
          )}
        </button>
      )}
    </>
  );

  if (isConfigPage) {
    return (
      <Link
        href={widget.link}
        className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer flex flex-col gap-4 block"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer flex flex-col gap-4">
      {cardContent}
    </div>
  );
}

export default function WidgetGallery() {
  return (
    <section id="gallery" className="py-20 sm:py-28 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full mb-4">
            인기 위젯
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            위젯 갤러리
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-base">
            지금 바로 사용 가능한 위젯들이에요. 링크를 복사해서 노션에 붙여넣으면 끝!
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {widgets.map((widget) => (
            <WidgetCard key={widget.id} widget={widget} />
          ))}
        </div>
      </div>
    </section>
  );
}
