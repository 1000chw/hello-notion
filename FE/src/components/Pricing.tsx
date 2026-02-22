import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "무료",
    priceNote: "영원히",
    description: "노션 위젯을 처음 써보는 분들을 위한 플랜",
    cta: "지금 바로 시작",
    ctaHref: "#gallery",
    highlight: false,
    features: [
      "기본 위젯 20개 이상",
      "광고 없음",
      "링크 복사만으로 즉시 사용",
      "URL 파라미터 기본 커스터마이징",
      "커뮤니티 지원",
    ],
  },
  {
    name: "Pro",
    price: "2,900원",
    priceNote: "/ 월",
    description: "노션을 더 깊이 활용하고 싶은 분들을 위한 플랜",
    cta: "Pro 시작하기",
    ctaHref: "/signup?plan=pro",
    highlight: true,
    features: [
      "Free 플랜 모든 기능 포함",
      "프리미엄 위젯 전체 이용",
      "고급 커스터마이징 옵션",
      "노션 DB 연동 위젯",
      "우선 고객 지원",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full mb-4">
            요금제
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            심플한 가격, 강력한 기능
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-base">
            무료로 시작하고, 필요할 때 업그레이드하세요.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlight
                  ? "relative p-8 rounded-2xl bg-teal-600 shadow-lg shadow-teal-200 flex flex-col"
                  : "relative p-8 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col"
              }
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold text-teal-700 bg-teal-100 rounded-full whitespace-nowrap">
                  추천
                </span>
              )}

              {/* Plan name & price */}
              <div className="mb-6">
                <p
                  className={`text-sm font-semibold mb-3 ${
                    plan.highlight ? "text-teal-100" : "text-gray-500"
                  }`}
                >
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span
                    className={`text-4xl font-black tracking-tight ${
                      plan.highlight ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm mb-1.5 ${
                      plan.highlight ? "text-teal-200" : "text-gray-400"
                    }`}
                  >
                    {plan.priceNote}
                  </span>
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    plan.highlight ? "text-teal-100" : "text-gray-500"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              {/* Feature list */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                        plan.highlight
                          ? "bg-teal-500"
                          : "bg-teal-50 border border-teal-200"
                      }`}
                    >
                      <Check
                        size={10}
                        strokeWidth={3}
                        className={
                          plan.highlight ? "text-white" : "text-teal-600"
                        }
                      />
                    </span>
                    <span
                      className={`text-sm ${
                        plan.highlight ? "text-teal-50" : "text-gray-600"
                      }`}
                    >
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={plan.ctaHref}
                className={`block text-center text-sm font-semibold py-3 rounded-full transition-colors cursor-pointer ${
                  plan.highlight
                    ? "bg-white text-teal-700 hover:bg-teal-50 active:bg-teal-100"
                    : "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Pro 플랜은 언제든지 취소할 수 있습니다. 신용카드 없이 무료 플랜 시작 가능.
        </p>
      </div>
    </section>
  );
}
