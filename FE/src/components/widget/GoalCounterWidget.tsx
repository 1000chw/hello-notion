"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
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
	const router = useRouter();

	// Derive from URL (single source of truth). No effect → no cascading setState.
	const description = searchParams.get("desc") ?? "";
	const goalCount = Math.max(1, parseNumber(searchParams.get("goal"), 1));
	const currentCount = Math.min(
		parseNumber(searchParams.get("current"), 0),
		goalCount
	);
	const bgParam = searchParams.get("bg") ?? "white";
	const bgValue = BG_OPTIONS.some((o) => o.value === bgParam) ? bgParam : "white";

	const handlePlus = () => {
		const next = Math.min(currentCount + 1, goalCount);
		router.replace(
			`${pathname}${buildSearchParams(description, goalCount, next, bgValue)}`,
			{ scroll: false }
		);
	};

	const handleMinus = () => {
		const next = Math.max(0, currentCount - 1);
		router.replace(
			`${pathname}${buildSearchParams(description, goalCount, next, bgValue)}`,
			{ scroll: false }
		);
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
