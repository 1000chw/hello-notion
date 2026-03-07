"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { RefreshCw } from "lucide-react";

type Lang = "ja" | "en" | "ko";

const CACHE_KEY_PREFIX = "hello-notion:anime-wise-saying";
const CACHE_TTL_MS = 60 * 1000; // 1분

/** 표시용 한 건 (선택한 언어 컬럼만 요청하므로 text 하나) */
interface AnimeSayingDisplay {
	id: string;
	text: string;
	character_name: string | null;
	anime_title: string | null;
	image_url: string | null;
}

function getLangColumn(lang: Lang): "japanese" | "english" | "korean" {
	return lang === "ja" ? "japanese" : lang === "ko" ? "korean" : "english";
}

function readCache(lang: Lang): AnimeSayingDisplay | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(`${CACHE_KEY_PREFIX}:${lang}`);
		if (!raw) return null;
		const { saying, fetchedAt } = JSON.parse(raw) as {
			saying: AnimeSayingDisplay;
			fetchedAt: number;
		};
		if (!saying?.text || typeof fetchedAt !== "number") return null;
		if (Date.now() - fetchedAt >= CACHE_TTL_MS) return null;
		return { ...saying, image_url: saying.image_url ?? null };
	} catch {
		return null;
	}
}

function writeCache(saying: AnimeSayingDisplay, lang: Lang): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(`${CACHE_KEY_PREFIX}:${lang}`, JSON.stringify({ saying, fetchedAt: Date.now() }));
	} catch {
		// ignore
	}
}

const LANG_OPTIONS: { value: Lang; label: string }[] = [
	{ value: "ja", label: "日本語" },
	{ value: "en", label: "English" },
	{ value: "ko", label: "한국어" },
];

function buildSearchParams(lang: Lang): string {
	const params = new URLSearchParams();
	if (lang !== "en") params.set("lang", lang);
	const q = params.toString();
	return q ? `?${q}` : "";
}

export default function AnimeWiseSayingWidget(props: { overrideLang?: Lang } = {}) {
	const searchParams = useSearchParams();
	const { overrideLang } = props;

	const langParam = searchParams.get("lang");
	const urlLang: Lang = langParam === "ja" || langParam === "ko" ? langParam : "en";
	const lang = overrideLang !== undefined ? overrideLang : urlLang;

	const [saying, setSaying] = useState<AnimeSayingDisplay | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// 선택한 언어 컬럼만 Supabase에 요청 (표시 언어만 가져오기)
	const fetchRandom = useCallback(async (currentLang: Lang, silent = false) => {
		if (!silent) {
			setLoading(true);
			setError(null);
		}
		try {
			const supabase = getSupabase();
			const column = getLangColumn(currentLang);
			const { data: list, error: fetchErr } = await supabase
				.from("anime_wise_sayings")
				.select(`id, ${column}, character_name, anime_title, image_url`)
				.limit(500);
			if (fetchErr) {
				if (!silent) {
					setError(`명언을 불러올 수 없습니다. ${fetchErr.message || fetchErr.code || ""}`.trim());
					setSaying(null);
				}
				return;
			}
			if (!list?.length) {
				if (!silent) {
					setError("명언을 불러올 수 없습니다. (데이터 없음)");
					setSaying(null);
				}
				return;
			}
			const raw = list[Math.floor(Math.random() * list.length)] as Record<string, unknown>;
			const display: AnimeSayingDisplay = {
				id: raw.id as string,
				text: (raw[column] as string) ?? "",
				character_name: (raw.character_name as string | null) ?? null,
				anime_title: (raw.anime_title as string | null) ?? null,
				image_url: (raw.image_url as string | null) ?? null,
			};
			setSaying(display);
			writeCache(display, currentLang);
		} catch (err) {
			if (!silent) {
				const msg = err instanceof Error ? err.message : "명언을 불러올 수 없습니다.";
				setError(`명언을 불러올 수 없습니다. ${msg}`.trim());
				setSaying(null);
			}
		} finally {
			if (!silent) setLoading(false);
		}
	}, []);

	// 로드·언어 변경: 캐시 유효하면 사용, 아니면 선택한 언어 컬럼만 요청
	useEffect(() => {
		const cached = readCache(lang);
		if (cached) {
			setSaying(cached);
			setLoading(false);
			return;
		}
		fetchRandom(lang);
	}, [lang, fetchRandom]);

	// 1분마다 새 명언으로 자동 갱신 (백그라운드, 로딩 없음)
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	useEffect(() => {
		intervalRef.current = setInterval(() => {
			fetchRandom(lang, true);
		}, CACHE_TTL_MS);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [lang, fetchRandom]);

	const handleRefresh = () => {
		fetchRandom(lang);
	};

	if (loading && !saying) {
		return (
			<div
				className="anime-wise-saying-widget w-full max-w-sm mx-auto rounded-2xl border border-gray-200/80 shadow-sm bg-white p-6 sm:p-8 flex flex-col items-center justify-center h-[260px]"
				aria-busy="true"
				aria-label="명언 불러오는 중"
			>
				<div className="animate-pulse flex flex-col items-center gap-3 w-full">
					<div className="h-4 w-3/4 bg-gray-200 rounded" />
					<div className="h-4 w-full bg-gray-100 rounded" />
					<div className="h-4 w-1/2 bg-gray-100 rounded" />
				</div>
			</div>
		);
	}

	if (error && !saying) {
		return (
			<div
				className="anime-wise-saying-widget w-full max-w-sm mx-auto rounded-2xl border border-gray-200/80 shadow-sm bg-white p-6 sm:p-8 flex flex-col items-center justify-center h-[260px] text-center"
				role="alert"
			>
				<p className="text-gray-500 text-sm mb-4">{error}</p>
				<button
					type="button"
					onClick={() => fetchRandom(lang)}
					className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
				>
					<RefreshCw size={14} />
					다시 시도
				</button>
			</div>
		);
	}

	const quoteText = saying?.text ?? "";
	const subtitle =
		saying?.character_name || saying?.anime_title
			? [saying.character_name, saying.anime_title].filter(Boolean).join(" · ")
			: null;

	const bgStyle = saying?.image_url
		? {
				backgroundImage: `url(${saying.image_url})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}
		: undefined;

	return (
		<div className="anime-wise-saying-widget w-full max-w-sm mx-auto rounded-2xl border border-gray-200/80 shadow-sm bg-white overflow-hidden">
			<div className="p-6 sm:p-8 flex flex-col relative h-[260px]" style={bgStyle}>
				{saying?.image_url && (
					<div
						className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/25 to-white/40 rounded-b-2xl"
						aria-hidden
					/>
				)}
				<div className="relative z-10 flex flex-col min-h-0 flex-1 bg-white/40 rounded-xl px-4 py-3 border border-white/50 overflow-hidden">
					<blockquote className="text-gray-800 text-base sm:text-lg font-bold leading-relaxed mb-3 flex-1 min-h-0 overflow-y-auto [text-shadow:0_0_4px_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.08)]">
						&quot;{quoteText}&quot;
					</blockquote>
					{subtitle && (
						<footer className="text-gray-700 text-xs sm:text-sm mb-2 shrink-0 font-medium [text-shadow:0_0_4px_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.08)]">
							— {subtitle}
						</footer>
					)}
					<div className="pt-2 border-t border-gray-100 flex justify-end shrink-0">
						<button
							type="button"
							onClick={handleRefresh}
							className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
							aria-label="다른 명언 보기"
						>
							<RefreshCw size={16} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export { LANG_OPTIONS, buildSearchParams, type Lang };
