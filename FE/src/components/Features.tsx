import { Zap, Package, RefreshCw, Palette } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "설치 없음, 즉시 사용",
    description:
      "앱을 설치하거나 계정을 만들 필요가 없어요. 링크 복사 → 붙여넣기만으로 바로 사용 가능합니다.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Package,
    title: "다양한 무료 위젯",
    description:
      "시계, 달력, 날씨, 포모도로 등 20개 이상의 위젯을 무료로 사용할 수 있어요. 계속 추가됩니다.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    icon: RefreshCw,
    title: "항상 최신 상태",
    description:
      "위젯을 업데이트해도 노션에 다시 붙여넣을 필요가 없어요. 링크는 그대로, 기능만 업그레이드됩니다.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Palette,
    title: "커스터마이징 지원",
    description:
      "URL 파라미터로 색상, 폰트, 언어 등을 간단히 바꿀 수 있어요. 내 노션 스타일에 맞게 꾸미세요.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: Text */}
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full mb-5">
              왜 Hello Notion인가?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-5">
              노션을 위한 가장 쉬운 위젯 서비스
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              복잡한 설정 없이 원하는 위젯을 바로 노션에 추가하세요. 개발자가 아니어도, API를 몰라도 괜찮아요.
            </p>

            <a
              href="#gallery"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
            >
              위젯 갤러리 보기
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Right: Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-sm transition-shadow duration-200"
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${feature.bg} mb-4`}>
                    <Icon size={18} className={feature.color} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
