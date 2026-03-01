"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Outfit } from "next/font/google";

const outfit = Outfit({
	subsets: ["latin"],
	weight: ["600", "700"],
	display: "swap",
});

const BG_OPTIONS = [
	{ value: "white", label: "흰색", class: "bg-white" },
	{ value: "gray", label: "회색", class: "bg-gray-50" },
	{ value: "teal", label: "청록", class: "bg-teal-50" },
	{ value: "blue", label: "파랑", class: "bg-blue-50" },
	{ value: "green", label: "초록", class: "bg-green-50" },
	{ value: "orange", label: "주황", class: "bg-orange-50" },
	{ value: "violet", label: "보라", class: "bg-violet-50" },
] as const;

function parseNumber(value: string | null, fallback: number): number {
	if (value == null || value === "") return fallback;
	const n = parseInt(value, 10);
	return Number.isNaN(n) ? fallback : Math.max(0, n);
}

function getBgClass(value: string | null): string {
	const found = BG_OPTIONS.find((o) => o.value === value);
	return found ? found.class : "bg-white";
}

function buildSearchParams(desc: string, goal: number, current: number, bg: string): string {
	const params = new URLSearchParams();
	if (desc.trim()) params.set("desc", desc.trim());
	params.set("goal", String(goal));
	params.set("current", String(current));
	if (bg && bg !== "white") params.set("bg", bg);
	const q = params.toString();
	return q ? `?${q}` : "";
}

export default function GoalCounterWidget() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [description, setDescription] = useState("");
	const [goalCount, setGoalCount] = useState(1);
	const [currentCount, setCurrentCount] = useState(0);
	const [bgValue, setBgValue] = useState("white");
	const [isInitializing, setIsInitializing] = useState(true);

	useEffect(() => {
		const desc = searchParams.get("desc") ?? "";
		const goal = parseNumber(searchParams.get("goal"), 1);
		const current = parseNumber(searchParams.get("current"), 0);
		const bg = searchParams.get("bg") ?? "white";
		setDescription(desc);
		setGoalCount(goal);
		setCurrentCount(Math.min(current, goal));
		setBgValue(BG_OPTIONS.some((o) => o.value === bg) ? bg : "white");
		setIsInitializing(false);
	}, [searchParams]);

	useEffect(() => {
		if (isInitializing) return;
		const query = buildSearchParams(description, goalCount, currentCount, bgValue);
		const url = query ? `${pathname}${query}` : pathname;
		window.history.replaceState(null, "", url);
	}, [description, goalCount, currentCount, bgValue, isInitializing, pathname]);

	const handlePlus = () => {
		setCurrentCount((c) => Math.min(c + 1, goalCount));
	};

	const handleMinus = () => {
		setCurrentCount((c) => Math.max(0, c - 1));
	};

	const bgClass = getBgClass(bgValue);

	return (
		<div
			className={`goal-counter-widget w-full max-w-sm mx-auto rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden ${bgClass}`}
		>
			<div className="p-6 sm:p-8 flex flex-col items-center text-center">
				{/* 라벨: bold + Outfit 폰트 */}
				<p className={`text-lg font-bold text-gray-700 tracking-wide mb-4 w-full ${outfit.className}`}>
					{description || "목표"}
				</p>

				{/* 현재 / 목표: 숫자만 강조, 색 구분 */}
				<p
					className="text-5xl sm:text-6xl font-light tabular-nums tracking-tight mb-6"
					aria-live="polite"
					aria-label={`현재 ${currentCount}, 목표 ${goalCount}`}
				>
					<span className="text-gray-900">{currentCount}</span>
					<span className="text-gray-300 font-normal mx-1.5">/</span>
					<span className="text-gray-500">{goalCount}</span>
				</p>

				{/* 프로그레스 바: 얇고 단순 */}
				{goalCount > 0 && (
					<div className="w-full max-w-[160px] h-1 rounded-full bg-gray-200 overflow-hidden mb-6">
						<div
							className="h-full rounded-full bg-gray-700 transition-all duration-300"
							style={{ width: `${Math.min(100, (currentCount / goalCount) * 100)}%` }}
						/>
					</div>
				)}

				{/* 컨트롤: 미니멀 −1 / +1 */}
				<div className="flex items-center gap-3 w-full max-w-[200px]">
					<button
						type="button"
						onClick={handleMinus}
						disabled={currentCount <= 0}
						className="flex-1 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-gray-200 rounded-lg hover:bg-gray-50 disabled:hover:bg-transparent"
						aria-label="1 감소"
					>
						−1
					</button>
					<button
						type="button"
						onClick={handlePlus}
						disabled={currentCount >= goalCount}
						className="flex-1 py-2 text-sm font-medium text-gray-900 border border-gray-800 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:border-gray-400 transition-colors"
						aria-label="1 증가"
					>
						+1
					</button>
				</div>
			</div>
		</div>
	);
}

export { BG_OPTIONS, buildSearchParams, getBgClass, parseNumber };
