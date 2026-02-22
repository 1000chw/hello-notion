import { MousePointerClick, Link, Layers } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: MousePointerClick,
    title: "위젯 선택",
    description:
      "갤러리에서 마음에 드는 위젯을 고르세요. 시계, 달력, 날씨, 포모도로 타이머 등 다양한 위젯이 준비되어 있어요.",
    color: "bg-teal-50 text-teal-600",
    border: "border-teal-100",
  },
  {
    step: "02",
    icon: Link,
    title: "링크 복사",
    description:
      "위젯 카드의 '링크 복사' 버튼을 클릭하세요. 단 한 번의 클릭으로 임베딩 링크가 클립보드에 복사됩니다.",
    color: "bg-orange-50 text-orange-500",
    border: "border-orange-100",
  },
  {
    step: "03",
    icon: Layers,
    title: "노션에 붙여넣기",
    description:
      "노션 페이지에서 /embed 를 입력하거나 링크를 직접 붙여넣으면 위젯이 즉시 임베딩됩니다. 끝!",
    color: "bg-violet-50 text-violet-600",
    border: "border-violet-100",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full mb-4">
            3단계면 충분해요
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            사용 방법
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-base">
            복잡한 설정 없이 누구나 바로 사용할 수 있어요.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className={`relative p-7 rounded-2xl border ${item.border} bg-white hover:shadow-md transition-shadow duration-200 group`}
              >
                {/* Step number (top right) */}
                <span className="absolute top-5 right-6 text-4xl font-black text-gray-100 select-none group-hover:text-gray-150 transition-colors">
                  {item.step}
                </span>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${item.color} mb-5`}>
                  <Icon size={20} />
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>

                {/* Connector arrow (not for last) */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-300">
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Notion embed hint */}
        <div className="mt-10 p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">노션 임베딩 팁</p>
            <p className="text-sm text-gray-500 mt-0.5">
              노션 페이지에서{" "}
              <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs text-gray-700">/embed</code>
              {" "}를 입력하거나, 링크를 붙여넣고{" "}
              <strong className="text-gray-700">임베드 만들기</strong>를 선택하세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
