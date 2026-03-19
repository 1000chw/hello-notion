"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, Copy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground, { pageBackgroundClass } from "@/components/PageBackground";
import CalendarWidget, {
	CALENDAR_DESIGN_OPTIONS,
	buildCalendarSearchParams,
} from "@/components/widget/CalendarWidget";
import { DEFAULT_CALENDAR_PRESET, type CalendarPresetId } from "@/components/widget/calendarPresets";

function useIsEmbedded() {
	const [isEmbedded, setIsEmbedded] = useState(false);
	useEffect(() => {
		setIsEmbedded(typeof window !== "undefined" && window.self !== window.top);
	}, []);
	return isEmbedded;
}

function CalendarPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const isEmbedded = useIsEmbedded();
	const [copied, setCopied] = useState(false);

	const designRaw = searchParams.get("design") ?? DEFAULT_CALENDAR_PRESET;
	const startWeekRaw = searchParams.get("startWeek") === "sun" ? "sun" : "mon";
	const compactRaw = searchParams.get("compact") === "1";
	const showListRaw = searchParams.get("showList") !== "0";
	const showDetailsRaw = (() => {
		const v = searchParams.get("showDetails");
		if (v !== null) return v !== "0";
		// legacy fallback (기존 공유 링크 호환)
		const showMarkersLegacy = searchParams.get("showMarkers") !== "0";
		const showSelectedCardLegacy = searchParams.get("showSelectedCard") !== "0";
		return showMarkersLegacy && showSelectedCardLegacy;
	})();

	const designValue = (CALENDAR_DESIGN_OPTIONS.some((o) => o.value === designRaw) ? designRaw : DEFAULT_CALENDAR_PRESET) as CalendarPresetId;

	const updateUrl = (
		updates: Partial<{
			design: CalendarPresetId;
			startWeek: "mon" | "sun";
			compact: boolean;
			showList: boolean;
			showDetails: boolean;
		}>
	) => {
		const next = {
			design: updates.design ?? designValue,
			startWeek: updates.startWeek ?? startWeekRaw,
			compact: updates.compact ?? compactRaw,
			showList: updates.showList ?? showListRaw,
			showDetails: updates.showDetails ?? showDetailsRaw,
		};
		const q = buildCalendarSearchParams(next);
		router.replace(`/w/calendar${q}`, { scroll: false });
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
				<CalendarWidget />
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
									<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">달력</h1>
									<span className="inline-block px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full shrink-0">
										달력 · 무료
									</span>
								</div>
								<p className="mt-2 text-gray-500 text-sm max-w-md">
									디자인과 옵션을 설정한 뒤 링크를 복사해 노션 /embed에 붙여넣으세요.
								</p>
							</div>

							<div className="flex flex-col md:flex-row gap-8 items-start">
								<aside className="w-full md:w-72 shrink-0 order-1 md:order-1">
									<div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:sticky md:top-24">
										<div className="flex items-center gap-2 mb-4">
											<div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
												<CalendarDays size={18} className="text-teal-600" />
											</div>
											<h2 className="text-sm font-semibold text-gray-800">설정</h2>
										</div>

										<div className="space-y-5">
											<div>
												<label className="block text-xs font-medium text-gray-500 mb-2">디자인</label>
												<div className="grid grid-cols-2 gap-2">
													{CALENDAR_DESIGN_OPTIONS.map((opt) => (
														<button
															key={opt.value}
															type="button"
															onClick={() => updateUrl({ design: opt.value as CalendarPresetId })}
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
												<label className="block text-xs font-medium text-gray-500 mb-2">주 시작</label>
												<div className="grid grid-cols-2 gap-2">
													<button
														type="button"
														onClick={() => updateUrl({ startWeek: "mon" })}
														className={`px-2 py-2 rounded-lg border text-xs font-semibold transition-colors ${
															startWeekRaw === "mon"
																? "border-teal-500 bg-teal-50 text-teal-800 ring-1 ring-teal-200"
																: "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
														}`}
													>
														월요일
													</button>
													<button
														type="button"
														onClick={() => updateUrl({ startWeek: "sun" })}
														className={`px-2 py-2 rounded-lg border text-xs font-semibold transition-colors ${
															startWeekRaw === "sun"
																? "border-teal-500 bg-teal-50 text-teal-800 ring-1 ring-teal-200"
																: "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
														}`}
													>
														일요일
													</button>
												</div>
											</div>

											<div className="space-y-2">
												<label className="block text-xs font-medium text-gray-500">표시 옵션</label>
												<button
													type="button"
													onClick={() => updateUrl({ compact: !compactRaw })}
													className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
														compactRaw
															? "border-teal-500 bg-teal-50 text-teal-800 ring-1 ring-teal-200"
															: "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
													}`}
												>
													{compactRaw ? "컴팩트: 켬" : "컴팩트: 끔"}
												</button>
												<button
													type="button"
													onClick={() => updateUrl({ showDetails: !showDetailsRaw })}
													className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
														showDetailsRaw
															? "border-teal-500 bg-teal-50 text-teal-800 ring-1 ring-teal-200"
															: "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
													}`}
												>
													{showDetailsRaw ? "상세 표시: 켬" : "상세 표시: 끔"}
												</button>
												<button
													type="button"
													onClick={() => updateUrl({ showList: !showListRaw })}
													className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
														showListRaw
															? "border-teal-500 bg-teal-50 text-teal-800 ring-1 ring-teal-200"
															: "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
													}`}
												>
													{showListRaw ? "이번 달 주요 일정: 켬" : "이번 달 주요 일정: 끔"}
												</button>
											</div>

											<button
												type="button"
												onClick={handleCopyLink}
												className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
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
											<div className="w-full max-w-sm p-4 rounded-2xl border border-gray-200 bg-white animate-pulse h-72" />
										}
									>
										<CalendarWidget
											overrideDesign={designValue}
											overrideStartWeek={startWeekRaw}
											overrideCompact={compactRaw}
											overrideShowList={showListRaw}
											overrideShowDetails={showDetailsRaw}
										/>
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

export default function CalendarPage() {
	return (
		<Suspense fallback={<div className={pageBackgroundClass} />}>
			<CalendarPageContent />
		</Suspense>
	);
}

