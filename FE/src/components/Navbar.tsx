"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Menu, X } from "lucide-react";
import { clsx } from "clsx";

const navLinks = [
  { label: "위젯 갤러리", href: "#gallery" },
  { label: "사용 방법", href: "#how-it-works" },
  { label: "요금제", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md group-hover:shadow-teal-200 transition-shadow duration-200">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">
              Hello<span className="text-teal-600">Notion</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors duration-150 cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <div className="relative flex items-center">
              <div
                className={clsx(
                  "flex items-center overflow-hidden transition-all duration-300 rounded-full border",
                  searchOpen
                    ? "w-48 border-teal-300 bg-white shadow-sm"
                    : "w-8 border-transparent bg-transparent"
                )}
              >
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-teal-600 transition-colors cursor-pointer"
                  aria-label="검색"
                >
                  <Search size={16} />
                </button>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="위젯 검색..."
                  className={clsx(
                    "flex-1 text-sm text-gray-700 outline-none bg-transparent pr-3 placeholder-gray-400 transition-all duration-300",
                    searchOpen ? "opacity-100 w-full" : "opacity-0 w-0"
                  )}
                  onBlur={() => setSearchOpen(false)}
                />
              </div>
            </div>

            <a
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors cursor-pointer px-3 py-1.5"
            >
              로그인
            </a>
            <a
              href="/signup"
              className="text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 transition-colors cursor-pointer px-4 py-2 rounded-full shadow-sm"
            >
              시작하기
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-gray-600 hover:text-teal-600 transition-colors cursor-pointer"
            aria-label="메뉴"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          "md:hidden overflow-hidden transition-all duration-300 bg-white border-b border-gray-100",
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-3 space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 mb-3">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="위젯 검색..."
              className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
            />
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-3 pb-1 flex flex-col gap-2 border-t border-gray-100 mt-2">
            <a
              href="/login"
              className="text-center text-sm font-medium text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              로그인
            </a>
            <a
              href="/signup"
              className="text-center text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 py-2.5 rounded-full transition-colors cursor-pointer"
            >
              시작하기
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
