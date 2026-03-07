"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const BG_OPTIONS = [
	{ value: "white", label: "흰색", class: "bg-white" },
	{ value: "gray", label: "회색", class: "bg-gray-50" },
	{ value: "teal", label: "청록", class: "bg-teal-50" },
	{ value: "blue", label: "파랑", class: "bg-blue-50" },
	{ value: "green", label: "초록", class: "bg-green-50" },
	{ value: "orange", label: "주황", class: "bg-orange-50" },
	{ value: "violet", label: "보라", class: "bg-violet-50" },
] as const;

const DESIGN_OPTIONS = [
	{ value: "digital-1", label: "디지털 미니멀", type: "digital" as const },
	{ value: "digital-2", label: "디지털 세그먼트", type: "digital" as const },
	{ value: "digital-3", label: "디지털 글래스", type: "digital" as const },
	{ value: "digital-4", label: "디지털 네온", type: "digital" as const },
	{ value: "digital-5", label: "디지털 다크", type: "digital" as const },
	{ value: "analog-1", label: "아날로그 미니멀", type: "analog" as const },
	{ value: "analog-2", label: "아날로그 로만", type: "analog" as const },
	{ value: "analog-3", label: "아날로그 도트", type: "analog" as const },
	{ value: "analog-4", label: "아날로그 라인", type: "analog" as const },
	{ value: "analog-5", label: "아날로그 클래식", type: "analog" as const },
] as const;

const DEFAULT_DESIGN = "digital-1";

function getBgClass(value: string | null): string {
	const found = BG_OPTIONS.find((o) => o.value === value);
	return found ? found.class : "bg-white";
}

function buildSearchParams(design: string, bg: string, bgImage: string): string {
	const params = new URLSearchParams();
	if (design && design !== DEFAULT_DESIGN) params.set("design", design);
	if (bg && bg !== "white") params.set("bg", bg);
	if (bgImage.trim()) params.set("bgImage", bgImage.trim());
	const q = params.toString();
	return q ? `?${q}` : "";
}

function pad(n: number): string {
	return n < 10 ? `0${n}` : String(n);
}

export default function ClockMinimalWidget(props: {
	overrideDesign?: string;
	overrideBg?: string;
	overrideBgImage?: string;
} = {}) {
	const searchParams = useSearchParams();
	const { overrideDesign, overrideBg, overrideBgImage } = props;

	const [now, setNow] = useState(() => new Date());
	const [isEmbedded, setIsEmbedded] = useState(false);

	useEffect(() => {
		queueMicrotask(() => {
			setIsEmbedded(typeof window !== "undefined" && window.self !== window.top);
		});
	}, []);

	useEffect(() => {
		const id = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(id);
	}, []);

	const urlDesign = searchParams.get("design") ?? DEFAULT_DESIGN;
	const urlBg = searchParams.get("bg") ?? "white";
	const urlBgImage = searchParams.get("bgImage") ?? "";

	const design = DESIGN_OPTIONS.some((o) => o.value === urlDesign) ? urlDesign : DEFAULT_DESIGN;
	const designResolved = overrideDesign ?? design;
	const designOption = DESIGN_OPTIONS.find((o) => o.value === designResolved) ?? DESIGN_OPTIONS[0];
	const bgResolved = overrideBg ?? (BG_OPTIONS.some((o) => o.value === urlBg) ? urlBg : "white");
	const bgImageResolved = overrideBgImage !== undefined ? overrideBgImage : urlBgImage;

	const bgClass = getBgClass(bgResolved);
	const bgStyle =
		bgImageResolved.trim().length > 0
			? {
					backgroundImage: `url(${bgImageResolved.trim()})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}
			: undefined;

	const h = now.getHours();
	const m = now.getMinutes();
	const s = now.getSeconds();
	const h12 = h % 12 || 12;
	const ampm = h < 12 ? "AM" : "PM";
	const degSec = s * 6;
	const degMin = m * 6 + s / 10;
	const degHour = (h12 * 30 + m / 2) % 360;

	const isDigital = designOption.type === "digital";

	return (
		<div
			className={`clock-minimal-widget w-full max-w-sm mx-auto rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden min-h-[200px] flex items-center justify-center ${bgClass}`}
			style={bgStyle}
		>
			<div className="w-full flex items-center justify-center p-6 sm:p-8">
				{isDigital ? (
					<DigitalClock design={designOption.value} h={h} m={m} s={s} h12={h12} ampm={ampm} />
				) : (
					<AnalogClock design={designOption.value} degHour={degHour} degMin={degMin} degSec={degSec} />
				)}
			</div>
		</div>
	);
}

function DigitalClock({
	design,
	h,
	m,
	s,
	h12,
	ampm,
}: {
	design: string;
	h: number;
	m: number;
	s: number;
	h12: number;
	ampm: string;
}) {
	const time = `${pad(h12)}:${pad(m)}:${pad(s)}`;
	const short = `${pad(h12)}:${pad(m)}`;
	if (design === "digital-1") {
		return (
			<div className="text-center">
				<p className="text-4xl sm:text-5xl font-light tabular-nums text-gray-800 tracking-tight" aria-live="polite">
					{time}
				</p>
				<p className="text-sm text-gray-500 mt-1">{ampm}</p>
			</div>
		);
	}
	if (design === "digital-2") {
		return (
			<div className="flex items-center gap-1">
				{time.split("").map((ch, i) =>
					ch === ":" ? (
						<span key={i} className="text-3xl sm:text-4xl text-gray-400 font-light" aria-hidden>
							:
						</span>
					) : (
						<span
							key={i}
							className="w-8 h-12 sm:w-10 sm:h-14 flex items-center justify-center rounded bg-gray-800 text-white text-2xl sm:text-3xl font-mono"
							aria-hidden
						>
							{ch}
						</span>
					)
				)}
			</div>
		);
	}
	if (design === "digital-3") {
		return (
			<div className="px-6 py-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-lg">
				<p className="text-3xl sm:text-4xl font-light tabular-nums text-gray-800" aria-live="polite">
					{time}
				</p>
				<p className="text-xs text-gray-600 mt-1">{ampm}</p>
			</div>
		);
	}
	if (design === "digital-4") {
		return (
			<div className="text-center">
				<p
					className="text-4xl sm:text-5xl font-bold tabular-nums text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]"
					aria-live="polite"
				>
					{time}
				</p>
				<p className="text-sm text-teal-300/90 mt-1">{ampm}</p>
			</div>
		);
	}
	if (design === "digital-5") {
		return (
			<div className="rounded-xl bg-gray-900 px-6 py-4">
				<p className="text-3xl sm:text-4xl font-mono tabular-nums text-emerald-400" aria-live="polite">
					{time}
				</p>
				<p className="text-xs text-gray-500 mt-1">{ampm}</p>
			</div>
		);
	}
	return (
		<p className="text-4xl font-light tabular-nums text-gray-800" aria-live="polite">
			{short}
		</p>
	);
}

function AnalogClock({
	design,
	degHour,
	degMin,
	degSec,
}: {
	design: string;
	degHour: number;
	degMin: number;
	degSec: number;
}) {
	const size = 160;
	const cx = size / 2;
	const cy = size / 2;
	const r = size / 2 - 8;

	const tick = (i: number) => {
		const a = ((i * 6 - 90) * Math.PI) / 180;
		return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
	};

	const hand = (deg: number, len: number, stroke: string, strokeWidth: number) => {
		const a = ((deg - 90) * Math.PI) / 180;
		return {
			x2: cx + len * Math.cos(a),
			y2: cy + len * Math.sin(a),
			stroke,
			strokeWidth,
		};
	};

	const hourLen = r * 0.45;
	const minLen = r * 0.7;
	const secLen = r * 0.85;

	if (design === "analog-1") {
		return (
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="text-gray-800" aria-hidden>
				<circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="2" />
				<line
					x1={cx}
					y1={cy}
					x2={hand(degHour, hourLen, "currentColor", 3).x2}
					y2={hand(degHour, hourLen, "currentColor", 3).y2}
					stroke="currentColor"
					strokeWidth="3"
					strokeLinecap="round"
				/>
				<line
					x1={cx}
					y1={cy}
					x2={hand(degMin, minLen, "currentColor", 2).x2}
					y2={hand(degMin, minLen, "currentColor", 2).y2}
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<line
					x1={cx}
					y1={cy}
					x2={hand(degSec, secLen, "#ef4444", 1).x2}
					y2={hand(degSec, secLen, "#ef4444", 1).y2}
					stroke="#ef4444"
					strokeWidth="1"
					strokeLinecap="round"
				/>
			</svg>
		);
	}
	if (design === "analog-2") {
		const roman = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
		return (
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="text-gray-700" aria-hidden>
				<circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="2" />
				{roman.map((label, i) => {
					const p = tick((i + 1) * 5);
					return (
						<text
							key={i}
							x={p.x}
							y={p.y}
							textAnchor="middle"
							dominantBaseline="middle"
							className="text-[10px] font-serif fill-current"
						>
							{label}
						</text>
					);
				})}
				<line x1={cx} y1={cy} x2={hand(degHour, hourLen, "currentColor", 3).x2} y2={hand(degHour, hourLen, "currentColor", 3).y2} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
				<line x1={cx} y1={cy} x2={hand(degMin, minLen, "currentColor", 2).x2} y2={hand(degMin, minLen, "currentColor", 2).y2} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				<line x1={cx} y1={cy} x2={hand(degSec, secLen, "#b91c1c", 1).x2} y2={hand(degSec, secLen, "#b91c1c", 1).y2} stroke="#b91c1c" strokeWidth="1" strokeLinecap="round" />
			</svg>
		);
	}
	if (design === "analog-3") {
		return (
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="text-gray-600" aria-hidden>
				<circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
				{Array.from({ length: 60 }, (_, i) => {
					if (i % 5 !== 0) return null;
					const p = tick(i);
					return <circle key={i} cx={p.x} cy={p.y} r={2} fill="currentColor" />;
				})}
				<line x1={cx} y1={cy} x2={hand(degHour, hourLen, "currentColor", 2).x2} y2={hand(degHour, hourLen, "currentColor", 2).y2} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				<line x1={cx} y1={cy} x2={hand(degMin, minLen, "currentColor", 1.5).x2} y2={hand(degMin, minLen, "currentColor", 1.5).y2} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
				<line x1={cx} y1={cy} x2={hand(degSec, secLen, "#0ea5e9", 1).x2} y2={hand(degSec, secLen, "#0ea5e9", 1).y2} stroke="#0ea5e9" strokeWidth="1" strokeLinecap="round" />
			</svg>
		);
	}
	if (design === "analog-4") {
		return (
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="text-gray-500" aria-hidden>
				<circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="1" />
				{Array.from({ length: 12 }, (_, i) => {
					const a = ((i * 30 - 90) * Math.PI) / 180;
					const x1 = cx + (r - 4) * Math.cos(a);
					const y1 = cy + (r - 4) * Math.sin(a);
					const x2 = cx + r * Math.cos(a);
					const y2 = cy + r * Math.sin(a);
					return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" />;
				})}
				<line x1={cx} y1={cy} x2={hand(degHour, hourLen, "currentColor", 2).x2} y2={hand(degHour, hourLen, "currentColor", 2).y2} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				<line x1={cx} y1={cy} x2={hand(degMin, minLen, "currentColor", 1.5).x2} y2={hand(degMin, minLen, "currentColor", 1.5).y2} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
				<line x1={cx} y1={cy} x2={hand(degSec, secLen, "currentColor", 1).x2} y2={hand(degSec, secLen, "currentColor", 1).y2} stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
			</svg>
		);
	}
	if (design === "analog-5") {
		return (
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="text-gray-800" aria-hidden>
				<circle cx={cx} cy={cy} r={r} fill="white" stroke="currentColor" strokeWidth="3" />
				{Array.from({ length: 12 }, (_, i) => {
					const p = tick((i + 1) * 5);
					return (
						<text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="text-xs font-semibold fill-current">
							{i + 1}
						</text>
					);
				})}
				<line x1={cx} y1={cy} x2={hand(degHour, hourLen, "currentColor", 3).x2} y2={hand(degHour, hourLen, "currentColor", 3).y2} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
				<line x1={cx} y1={cy} x2={hand(degMin, minLen, "currentColor", 2).x2} y2={hand(degMin, minLen, "currentColor", 2).y2} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				<line x1={cx} y1={cy} x2={hand(degSec, secLen, "#dc2626", 1).x2} y2={hand(degSec, secLen, "#dc2626", 1).y2} stroke="#dc2626" strokeWidth="1" strokeLinecap="round" />
				<circle cx={cx} cy={cy} r={4} fill="currentColor" />
			</svg>
		);
	}

	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="text-gray-800" aria-hidden>
			<circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="2" />
			<line x1={cx} y1={cy} x2={hand(degHour, hourLen, "currentColor", 3).x2} y2={hand(degHour, hourLen, "currentColor", 3).y2} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
			<line x1={cx} y1={cy} x2={hand(degMin, minLen, "currentColor", 2).x2} y2={hand(degMin, minLen, "currentColor", 2).y2} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<line x1={cx} y1={cy} x2={hand(degSec, secLen, "#ef4444", 1).x2} y2={hand(degSec, secLen, "#ef4444", 1).y2} stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
		</svg>
	);
}

export { BG_OPTIONS, DESIGN_OPTIONS, buildSearchParams, getBgClass };
