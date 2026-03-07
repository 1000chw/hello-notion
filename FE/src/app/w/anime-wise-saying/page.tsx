"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AnimeWiseSayingWidget, {
	LANG_OPTIONS,
	buildSearchParams,
	type Lang,
} from "@/components/widget/AnimeWiseSayingWidget";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground, { pageBackgroundClass } from "@/components/PageBackground";
import { Copy, Check, ArrowLeft, Quote } from "lucide-react";

function useIsEmbedded() {
	const [isEmbedded, setIsEmbedded] = useState(false);
	useEffect(() => {
		setIsEmbedded(typeof window !== "undefined" && window.self !== window.top);
	}, []);
	return isEmbedded;
}

function AnimeWiseSayingPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [copied, setCopied] = useState(false);
	const isEmbedded = useIsEmbedded();

	const langParam = searchParams.get("lang");
	const urlLang: Lang =
		langParam === "ja" || langParam === "ko" ? langParam : "en";

	// 로컬 state for 실시간 미리보기 (onBlur 시 URL 반영). 초기값은 URL에서.
	const [editingLang, setEditingLang] = useState<Lang>(urlLang);
	useEffect(() => {
		queueMicrotask(() => setEditingLang(urlLang));
	}, [urlLang]);

	const updateUrl = (lang: Lang) => {
		router.replace(
			`/w/anime-wise-saying${buildSearchParams(lang)}`,
			{ scroll: false }
		);
	};

	const handleLangBlur = () => {
		setEditingLang(urlLang);
	};

	const handleCopyLink = () => {
		if (typeof window === "undefined") return;
		navigator.clipboard.writeText(window.location.href);
		setCopied(true);
	};

	useEffect(() => {
		if (!copied) return;
		const timerId = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(timerId);
	}, [copied]);

	if (isEmbedded) {
		return (
			<div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 bg-transparent">
				<AnimeWiseSayingWidget />
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
										애니 명언
									</h1>
									<span className="inline-block px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full shrink-0">
										명언 · 무료
									</span>
								</div>
								<p className="mt-2 text-gray-500 text-sm max-w-md">
									일본 애니 명언을 일·영·한으로 읽어보세요. 링크를 복사해 노션 /embed에 붙여넣으면 됩니다.
								</p>
							</div>

							<div className="flex flex-col md:flex-row gap-8 items-start">
								<aside className="w-full md:w-64 shrink-0 order-1 md:order-1">
									<div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:sticky md:top-24">
										<div className="flex items-center gap-2 mb-4">
											<div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
												<Quote size={18} className="text-violet-600" />
											</div>
											<h2 className="text-sm font-semibold text-gray-800">설정</h2>
										</div>

										<div className="space-y-4">
											<div>
												<label className="block text-xs font-medium text-gray-500 mb-2">
													표시 언어
												</label>
												<select
													value={editingLang}
													onChange={(e) => {
														const val = e.target.value as Lang;
														setEditingLang(val);
														updateUrl(val);
													}}
													onBlur={handleLangBlur}
													className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
													aria-label="표시 언어 선택"
												>
													{LANG_OPTIONS.map((opt) => (
														<option key={opt.value} value={opt.value}>
															{opt.label}
														</option>
													))}
												</select>
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
										<AnimeWiseSayingWidget overrideLang={editingLang} />
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

export default function AnimeWiseSayingPage() {
	return (
		<Suspense fallback={<div className={pageBackgroundClass} />}>
			<AnimeWiseSayingPageContent />
		</Suspense>
	);
}
