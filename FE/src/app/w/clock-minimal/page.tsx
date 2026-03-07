"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ClockMinimalWidget, {
  BG_OPTIONS,
  DESIGN_OPTIONS,
  buildSearchParams,
} from "@/components/widget/ClockMinimalWidget";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground, { pageBackgroundClass } from "@/components/PageBackground";
import { Copy, Check, ArrowLeft, Clock, ImagePlus, Loader2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/api";

function useIsEmbedded() {
  const [isEmbedded, setIsEmbedded] = useState(false);
  useEffect(() => {
    setIsEmbedded(typeof window !== "undefined" && window.self !== window.top);
  }, []);
  return isEmbedded;
}

function useHasSession() {
  const [hasSession, setHasSession] = useState(false);
  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      getSupabase().auth.getSession().then(({ data }) => setHasSession(!!data.session));
    });
    return () => subscription.unsubscribe();
  }, []);
  return hasSession;
}

function ClockMinimalPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const isEmbedded = useIsEmbedded();
  const hasSession = useHasSession();

  const design = searchParams.get("design") ?? "digital-1";
  const bg = searchParams.get("bg") ?? "white";
  const bgImage = searchParams.get("bgImage") ?? "";

  const designValue = DESIGN_OPTIONS.some((o) => o.value === design) ? design : "digital-1";
  const bgValue = BG_OPTIONS.some((o) => o.value === bg) ? bg : "white";

  const updateUrl = (updates: { design?: string; bg?: string; bgImage?: string }) => {
    const newDesign = updates.design ?? designValue;
    const newBg = updates.bg ?? bgValue;
    const newBgImage = updates.bgImage !== undefined ? updates.bgImage : bgImage;
    const query = buildSearchParams(newDesign, newBg, newBgImage);
    router.replace(`/w/clock-minimal${query}`, { scroll: false });
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !hasSession) return;
    setUploadError(null);
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      updateUrl({ bgImage: url });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!copied) return;
    const timerId = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timerId);
  }, [copied]);

  if (isEmbedded) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 bg-transparent">
        <ClockMinimalWidget />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <PageBackground>
        <main>
          <section className="py-12 sm:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="mb-8">
                <Link
                  href="/#gallery"
                  className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium mb-3"
                >
                  <ArrowLeft size={16} />
                  위젯 갤러리로
                </Link>
                <div className="flex flex-wrap items-baseline justify-between gap-2 gap-y-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    미니멀 시계
                  </h1>
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full shrink-0">
                    시간 · 무료
                  </span>
                </div>
                <p className="mt-2 text-gray-500 text-sm max-w-md">
                  시계 디자인과 배경을 설정한 뒤 링크를 복사해 노션 /embed에 붙여넣으세요.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <aside className="w-full md:w-64 shrink-0 order-1 md:order-1">
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:sticky md:top-24">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                        <Clock size={18} className="text-teal-600" />
                      </div>
                      <h2 className="text-sm font-semibold text-gray-800">설정</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                          시계 디자인
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {DESIGN_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => updateUrl({ design: opt.value })}
                              className={`px-2 py-1.5 rounded-lg border text-left text-xs font-medium transition-colors ${
                                designValue === opt.value
                                  ? "border-teal-500 bg-teal-50 text-teal-800 ring-1 ring-teal-200"
                                  : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                          배경 색상
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {BG_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => updateUrl({ bg: opt.value })}
                              className={`w-8 h-8 rounded-lg border-2 transition-colors ${opt.class} ${
                                bgValue === opt.value
                                  ? "border-teal-500 ring-2 ring-teal-200"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              title={opt.label}
                              aria-label={`배경 ${opt.label}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          배경 이미지
                        </label>
                        {!hasSession ? (
                          <p className="text-xs text-gray-500 py-2">
                            로그인 후 배경 이미지를 업로드할 수 있어요.
                          </p>
                        ) : (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              disabled={uploading}
                              className="hidden"
                              id="clock-bg-upload"
                            />
                            <label
                              htmlFor="clock-bg-upload"
                              className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-600 hover:border-teal-400 hover:bg-teal-50/50 cursor-pointer transition-colors ${
                                uploading ? "opacity-60 pointer-events-none" : ""
                              }`}
                            >
                              {uploading ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <ImagePlus size={16} />
                              )}
                              {uploading ? "업로드 중…" : "이미지 선택"}
                            </label>
                            {bgImage && (
                              <button
                                type="button"
                                onClick={() => updateUrl({ bgImage: "" })}
                                className="mt-2 w-full py-1.5 text-xs text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg hover:border-red-200"
                              >
                                이미지 제거
                              </button>
                            )}
                            {uploadError && (
                              <p className="mt-1 text-xs text-red-600" role="alert">
                                {uploadError}
                              </p>
                            )}
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
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
                    </div>
                  </div>
                </aside>

                <div className="flex-1 min-w-0 w-full flex items-start justify-center md:justify-start order-2 md:order-2">
                  <Suspense
                    fallback={
                      <div className="w-full max-w-sm p-4 rounded-2xl border border-gray-200 bg-white animate-pulse h-64" />
                    }
                  >
                    <ClockMinimalWidget />
                  </Suspense>
                </div>
              </div>
            </div>
          </section>
        </main>
      </PageBackground>
      <Footer />
    </>
  );
}

export default function ClockMinimalPage() {
  return (
    <Suspense fallback={<div className={pageBackgroundClass} />}>
      <ClockMinimalPageContent />
    </Suspense>
  );
}
