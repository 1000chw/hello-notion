"use client";

import { useState, useEffect, useRef } from "react";
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

export default function GoalCounterWidget(props: {
	overrideDesc?: string;
	overrideGoal?: number;
} = {}) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const { overrideDesc, overrideGoal } = props;

	// 임베드(iframe) 여부: 노션 등에 붙여넣었을 때만 true
	const [isEmbedded, setIsEmbedded] = useState(false);
	useEffect(() => {
		queueMicrotask(() => {
			setIsEmbedded(typeof window !== "undefined" && window.self !== window.top);
		});
	}, []);

	// 임베드에서 목표 수정용 로컬 state (커서 점프 방지). URL goal 변경 시 동기화. 빈 값 허용 → blur 시 1로 적용
	const [editingGoal, setEditingGoal] = useState<number | "">(1);
	const [isEditingGoal, setIsEditingGoal] = useState(false);
	const goalInputRef = useRef<HTMLInputElement>(null);
	const urlGoal = Math.max(1, parseNumber(searchParams.get("goal"), 1));
	useEffect(() => {
		queueMicrotask(() => setEditingGoal(urlGoal));
	}, [urlGoal]);
	useEffect(() => {
		if (isEditingGoal) goalInputRef.current?.focus();
	}, [isEditingGoal]);

	// Derive from URL (single source of truth). Override props = 설정 페이지에서 실시간 미리보기용.
	const urlDesc = searchParams.get("desc") ?? "";
	const urlCurrent = Math.min(
		parseNumber(searchParams.get("current"), 0),
		urlGoal
	);
	const description = overrideDesc !== undefined ? overrideDesc : urlDesc;
	const goalCount = overrideGoal !== undefined ? Math.max(1, overrideGoal) : urlGoal;
	const currentCount = Math.min(urlCurrent, goalCount);
	// 임베드에서 수정 중인 목표 반영 (blur 전에도 프로그레스·버튼에 반영). 빈 값이면 1로 간주
	const effectiveGoal = isEmbedded
		? (editingGoal === "" ? 1 : Math.max(1, editingGoal))
		: goalCount;
	const effectiveCurrent = Math.min(currentCount, effectiveGoal);
	const bgParam = searchParams.get("bg") ?? "white";
	const bgValue = BG_OPTIONS.some((o) => o.value === bgParam) ? bgParam : "white";

	const handlePlus = () => {
		const next = Math.min(currentCount + 1, effectiveGoal);
		router.replace(
			`${pathname}${buildSearchParams(description, effectiveGoal, next, bgValue)}`,
			{ scroll: false }
		);
	};

	const handleMinus = () => {
		const next = Math.max(0, currentCount - 1);
		router.replace(
			`${pathname}${buildSearchParams(description, effectiveGoal, next, bgValue)}`,
			{ scroll: false }
		);
	};

	// 임베드에서 목표 변경 시 URL 반영. 비어 있거나 1 미만이면 1로 적용
	const handleGoalBlur = () => {
		setIsEditingGoal(false);
		const g =
			editingGoal === "" || typeof editingGoal !== "number" || editingGoal < 1
				? 1
				: editingGoal;
		setEditingGoal(g);
		const nextCurrent = Math.min(currentCount, g);
		router.replace(
			`${pathname}${buildSearchParams(description, g, nextCurrent, bgValue)}`,
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

				{/* 현재 / 목표: 숫자만 강조. 임베드 시 목표는 수정 가능 */}
				<p
					className="text-5xl sm:text-6xl font-light tabular-nums tracking-tight mb-6 flex items-baseline justify-center gap-1"
					aria-live="polite"
					aria-label={`현재 ${currentCount}, 목표 ${goalCount}`}
				>
					<span className="text-gray-900">{currentCount}</span>
					<span className="text-gray-300 font-normal mx-1.5">/</span>
					{isEmbedded ? (
						isEditingGoal ? (
							<input
								ref={goalInputRef}
								type="number"
								min={1}
								value={editingGoal === "" ? "" : editingGoal}
								onChange={(e) => {
									const raw = e.target.value;
									if (raw === "") {
										setEditingGoal("");
										return;
									}
									const n = parseInt(raw, 10);
									if (!Number.isNaN(n)) setEditingGoal(n);
								}}
								onBlur={handleGoalBlur}
								onKeyDown={(e) => {
									if (e.key === "Enter") (e.target as HTMLInputElement).blur();
								}}
								className="w-14 sm:w-20 text-5xl sm:text-6xl font-light tabular-nums tracking-tight bg-transparent border-b-2 border-teal-500 text-gray-500 text-center focus:outline-none focus:ring-0 rounded-none"
								aria-label="목표 개수"
							/>
						) : (
							<button
								type="button"
								onClick={() => setIsEditingGoal(true)}
								className="text-gray-500 text-5xl sm:text-6xl font-light tabular-nums tracking-tight bg-transparent border-none cursor-text p-0 min-w-[1.5em] h-[1.2em] align-baseline hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset rounded"
								aria-label="목표 개수 수정 (클릭)"
							>
								{editingGoal === "" ? 1 : editingGoal}
							</button>
						)
					) : (
						<span className="text-gray-500">{goalCount}</span>
					)}
				</p>

				{/* 프로그레스 바: 얇고 단순 */}
				{effectiveGoal > 0 && (
					<div className="w-full max-w-[160px] h-1 rounded-full bg-gray-200 overflow-hidden mb-6">
						<div
							className="h-full rounded-full bg-gray-700 transition-all duration-300"
							style={{ width: `${Math.min(100, (effectiveCurrent / effectiveGoal) * 100)}%` }}
						/>
					</div>
				)}

				{/* 컨트롤: 미니멀 −1 / +1 */}
				<div className="flex items-center gap-3 w-full max-w-[200px]">
					<button
						type="button"
						onClick={handleMinus}
						disabled={effectiveCurrent <= 0}
						className="flex-1 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-gray-200 rounded-lg hover:bg-gray-50 disabled:hover:bg-transparent"
						aria-label="1 감소"
					>
						−1
					</button>
					<button
						type="button"
						onClick={handlePlus}
						disabled={effectiveCurrent >= effectiveGoal}
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
