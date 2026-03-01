import Link from "next/link";

const footerLinks = [
  {
    heading: "위젯",
    links: [
      { label: "위젯 갤러리", href: "#gallery" },
      { label: "인기 위젯", href: "#gallery" },
      { label: "새 위젯", href: "#gallery" },
    ],
  },
  {
    heading: "서비스",
    links: [
      { label: "사용 방법", href: "#how-it-works" },
      { label: "요금제", href: "#pricing" },
      { label: "블로그", href: "/blog" },
    ],
  },
  {
    heading: "법적 고지",
    links: [
      { label: "이용약관", href: "/terms" },
      { label: "개인정보처리방침", href: "/privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Hello<span className="text-teal-400">Notion</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              링크 하나로 노션에 바로 임베딩. 설치 없이, 무료로 시작하세요.
            </p>
          </div>

          {/* Link groups */}
          {footerLinks.map((group) => (
            <div key={group.heading}>
              <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">
                {group.heading}
              </p>
              <ul className="space-y-3">
                {group.links
                  .filter((link) => link.href !== "#pricing")
                  .map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider + copyright */}
        <div className="mt-12 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-600 text-center sm:text-left">
            © 2025 Hello Notion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
