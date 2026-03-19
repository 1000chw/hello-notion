"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import {
	CALENDAR_PRESETS,
	DEFAULT_CALENDAR_PRESET,
	getCalendarPreset,
	type CalendarPresetId,
} from "@/components/widget/calendarPresets";

type KoEventType = "holiday" | "anniversary";
type KoEvent = { type: KoEventType; name: string };
type KoEventsByIso = Record<string, KoEvent[]>;

const WEEKDAYS_KO_MON = ["월", "화", "수", "목", "금", "토", "일"] as const;
const WEEKDAYS_KO_SUN = ["일", "월", "화", "수", "목", "금", "토"] as const;

const DEFAULT_START_WEEK: "mon" | "sun" = "mon";

export const CALENDAR_DESIGN_OPTIONS: ReadonlyArray<{ value: CalendarPresetId; label: string }> = CALENDAR_PRESETS.map(
	(p) => ({ value: p.id, label: p.name })
);

export function buildCalendarSearchParams(params: {
	design: CalendarPresetId;
	startWeek: "mon" | "sun";
	compact: boolean;
	showList: boolean;
	showDetails: boolean;
}): string {
	const sp = new URLSearchParams();
	if (params.design && params.design !== DEFAULT_CALENDAR_PRESET) sp.set("design", params.design);
	if (params.startWeek && params.startWeek !== DEFAULT_START_WEEK) sp.set("startWeek", params.startWeek);
	if (params.compact) sp.set("compact", "1");
	if (!params.showList) sp.set("showList", "0");
	if (!params.showDetails) sp.set("showDetails", "0");
	const q = sp.toString();
	return q ? `?${q}` : "";
}

function isoDateKey(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

function clampMonth(year: number, month0: number): { year: number; month0: number } {
	if (month0 < 0) return { year: year - 1, month0: 11 };
	if (month0 > 11) return { year: year + 1, month0: 0 };
	return { year, month0 };
}

function formatIsoDateOnly(d: Date): string {
	return isoDateKey(d);
}

async function fetchMonthEvents(viewYear: number, viewMonth0: number): Promise<KoEventsByIso> {
	const from = new Date(viewYear, viewMonth0, 1);
	const to = new Date(viewYear, viewMonth0 + 1, 0);
	const fromIso = formatIsoDateOnly(from);
	const toIso = formatIsoDateOnly(to);

	const { data, error } = await getSupabase()
		.from("calendar_events")
		.select("event_date,event_type,name")
		.gte("event_date", fromIso)
		.lte("event_date", toIso)
		.order("event_date", { ascending: true })
		.order("event_type", { ascending: true })
		.order("name", { ascending: true });

	if (error) throw error;

	const map: KoEventsByIso = {};
	for (const row of data ?? []) {
		const iso = String(row.event_date);
		const type = row.event_type as KoEventType;
		const name = String(row.name);
		(map[iso] ||= []).push({ type, name });
	}
	return map;
}

function getMonthGrid(year: number, month0: number, startWeek: "mon" | "sun") {
	const first = new Date(year, month0, 1);
	const firstDow = first.getDay(); // 0..6 (Sun..Sat)
	const startDow = startWeek === "sun" ? 0 : 1; // Sun=0, Mon=1
	const leading = (firstDow - startDow + 7) % 7;
	const gridStart = new Date(year, month0, 1 - leading);

	return Array.from({ length: 42 }, (_, i) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
}

function patternBackground(presetId: CalendarPresetId) {
	const preset = getCalendarPreset(presetId);
	const p = preset.tokens.pattern;
	if (p.type === "none") return undefined;
	if (p.type === "dots") {
		const c = encodeURIComponent(p.color);
		return `radial-gradient(${c} ${p.opacity}, transparent 0)`;
	}
	if (p.type === "grid") {
		const c = encodeURIComponent(p.color);
		return `linear-gradient(to right, ${c} ${p.opacity}, transparent 0), linear-gradient(to bottom, ${c} ${p.opacity}, transparent 0)`;
	}
	if (p.type === "scanlines") {
		const c = encodeURIComponent(p.color);
		return `repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0, rgba(0,0,0,0) ${p.gapPx}px, ${c} ${p.opacity} ${p.gapPx}px, ${c} ${p.opacity} ${p.gapPx + p.linePx}px)`;
	}
	return undefined;
}

function patternSize(presetId: CalendarPresetId) {
	const preset = getCalendarPreset(presetId);
	const p = preset.tokens.pattern;
	if (p.type === "dots") return `${p.sizePx}px ${p.sizePx}px`;
	if (p.type === "grid") return `${p.sizePx}px ${p.sizePx}px`;
	return undefined;
}

export default function CalendarWidget(props: {
	overrideDesign?: CalendarPresetId;
	overrideStartWeek?: "mon" | "sun";
	overrideCompact?: boolean;
	overrideShowList?: boolean;
	overrideShowDetails?: boolean;
} = {}) {
	const searchParams = useSearchParams();
	const { overrideDesign, overrideStartWeek, overrideCompact, overrideShowList, overrideShowDetails } = props;

	const urlDesign = searchParams.get("design") ?? DEFAULT_CALENDAR_PRESET;
	const urlStartWeek = searchParams.get("startWeek") === "sun" ? "sun" : DEFAULT_START_WEEK;
	const urlCompact = searchParams.get("compact") === "1";
	const urlShowList = searchParams.get("showList") !== "0";

	const urlShowDetailsRaw = searchParams.get("showDetails");
	const urlShowMarkersLegacy = searchParams.get("showMarkers") !== "0";
	const urlShowSelectedCardLegacy = searchParams.get("showSelectedCard") !== "0";
	const urlShowDetails =
		urlShowDetailsRaw === null ? urlShowMarkersLegacy && urlShowSelectedCardLegacy : urlShowDetailsRaw !== "0";

	const designResolved = overrideDesign ?? ((CALENDAR_PRESETS.some((p) => p.id === urlDesign) ? urlDesign : DEFAULT_CALENDAR_PRESET) as CalendarPresetId);
	const startWeekResolved = overrideStartWeek ?? urlStartWeek;
	const compactResolved = overrideCompact ?? urlCompact;
	const showListResolved = overrideShowList ?? urlShowList;
	const showDetailsResolved = overrideShowDetails ?? urlShowDetails;
	const showMarkersResolved = showDetailsResolved;
	const showSelectedCardResolved = showDetailsResolved;

	const preset = getCalendarPreset(designResolved);
	const weekdayLabels = startWeekResolved === "sun" ? WEEKDAYS_KO_SUN : WEEKDAYS_KO_MON;

	const today = useMemo(() => new Date(), []);
	const todayIso = useMemo(() => isoDateKey(today), [today]);

	const [view, setView] = useState(() => ({ y: today.getFullYear(), m0: today.getMonth() }));
	const [selectedIso, setSelectedIso] = useState(() => todayIso);

	const grid = useMemo(() => getMonthGrid(view.y, view.m0, startWeekResolved), [view.y, view.m0, startWeekResolved]);
	const viewLabel = useMemo(() => `${view.y}.${String(view.m0 + 1).padStart(2, "0")}`, [view.y, view.m0]);

	const [eventsByIso, setEventsByIso] = useState<KoEventsByIso>({});
	const [eventsLoading, setEventsLoading] = useState(false);
	const [eventsError, setEventsError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setEventsLoading(true);
		setEventsError(null);
		fetchMonthEvents(view.y, view.m0)
			.then((m) => {
				if (cancelled) return;
				setEventsByIso(m);
			})
			.catch((e) => {
				if (cancelled) return;
				setEventsByIso({});
				setEventsError(e instanceof Error ? e.message : "공휴일/기념일을 불러오지 못했어요.");
			})
			.finally(() => {
				if (cancelled) return;
				setEventsLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [view.y, view.m0]);

	const getEventsForIso = (iso: string): KoEvent[] => eventsByIso[iso] ?? [];

	const selectedEvents = useMemo(() => getEventsForIso(selectedIso), [selectedIso, eventsByIso]);

	const monthEventsTop = useMemo(() => {
		if (!showListResolved) return [];
		const items: { iso: string; e: KoEvent }[] = [];
		for (const d of grid) {
			if (d.getFullYear() !== view.y || d.getMonth() !== view.m0) continue;
			const iso = isoDateKey(d);
			for (const e of getEventsForIso(iso)) items.push({ iso, e });
		}
		const unique = new Map<string, { iso: string; e: KoEvent }>();
		for (const it of items) unique.set(`${it.iso}:${it.e.type}:${it.e.name}`, it);
		return Array.from(unique.values())
			.sort((a, b) => a.iso.localeCompare(b.iso))
			.slice(0, 5);
	}, [grid, view.y, view.m0, showListResolved]);

	const rootStyle: React.CSSProperties = {
		backgroundColor: preset.tokens.colors.bg,
		["--cal-bg" as any]: preset.tokens.colors.bg,
		["--cal-surface" as any]: preset.tokens.colors.surface,
		["--cal-surface2" as any]: preset.tokens.colors.surface2,
		["--cal-text" as any]: preset.tokens.colors.text,
		["--cal-muted" as any]: preset.tokens.colors.muted,
		["--cal-border" as any]: preset.tokens.colors.border,
		["--cal-accent" as any]: preset.tokens.colors.accent,
		["--cal-accent-text" as any]: preset.tokens.colors.accentText,
		["--cal-holiday" as any]: preset.tokens.colors.holiday,
		["--cal-anniversary" as any]: preset.tokens.colors.anniversary,
		["--cal-today" as any]: preset.tokens.colors.today,
		["--cal-radius-panel" as any]: preset.tokens.radius.panel,
		["--cal-radius-cell" as any]: preset.tokens.radius.cell,
		["--cal-radius-pill" as any]: preset.tokens.radius.pill,
		["--cal-shadow-panel" as any]: preset.tokens.shadow.panel,
		["--cal-shadow-cell-hover" as any]: preset.tokens.shadow.cellHover,
		backgroundImage: patternBackground(designResolved),
		backgroundSize: patternSize(designResolved),
	};

	const goPrev = () => {
		const next = clampMonth(view.y, view.m0 - 1);
		setView({ y: next.year, m0: next.month0 });
	};
	const goNext = () => {
		const next = clampMonth(view.y, view.m0 + 1);
		setView({ y: next.year, m0: next.month0 });
	};
	const goToday = () => {
		setView({ y: today.getFullYear(), m0: today.getMonth() });
		setSelectedIso(todayIso);
	};

	const cellSizeClass = compactResolved ? "h-9 sm:h-10" : "h-10 sm:h-11";
	const headerPadClass = compactResolved ? "px-5 pt-5" : "px-6 pt-6";
	const bodyPadClass = compactResolved ? "px-5 pb-5" : "px-6 pb-6";

	return (
		<div
			className="calendar-widget w-full max-w-sm mx-auto overflow-hidden border border-black/5"
			style={{
				...rootStyle,
				borderRadius: "var(--cal-radius-panel)",
				boxShadow: "var(--cal-shadow-panel)",
			}}
		>
			<div className={headerPadClass}>
				<div className="flex items-center justify-between gap-3">
					<div className="min-w-0">
						<p className="text-xs font-semibold tracking-tight" style={{ color: "var(--cal-muted)" }}>
							달력
						</p>
						<p className="text-xl font-semibold tabular-nums tracking-tight" style={{ color: "var(--cal-text)" }}>
							{viewLabel}
						</p>
					</div>

					<div className="flex items-center gap-2 shrink-0">
						<button
							type="button"
							onClick={goPrev}
							className="w-9 h-9 rounded-xl border text-sm font-semibold transition"
							style={{
								borderColor: "var(--cal-border)",
								background: "var(--cal-surface)",
								color: "var(--cal-text)",
							}}
							aria-label="이전 달"
						>
							◀
						</button>
						<button
							type="button"
							onClick={goToday}
							className="h-9 px-3 rounded-xl border text-xs font-semibold transition"
							style={{
								borderColor: "var(--cal-border)",
								background: "var(--cal-surface)",
								color: "var(--cal-text)",
							}}
						>
							오늘
						</button>
						<button
							type="button"
							onClick={goNext}
							className="w-9 h-9 rounded-xl border text-sm font-semibold transition"
							style={{
								borderColor: "var(--cal-border)",
								background: "var(--cal-surface)",
								color: "var(--cal-text)",
							}}
							aria-label="다음 달"
						>
							▶
						</button>
					</div>
				</div>

				<div className="mt-4 grid grid-cols-7 gap-1">
					{weekdayLabels.map((w) => {
						const isSun = w === "일";
						return (
							<div
								key={w}
								className="text-[11px] font-semibold text-center py-1"
								style={{ color: isSun ? "var(--cal-holiday)" : "var(--cal-muted)" }}
							>
								{w}
							</div>
						);
					})}
				</div>
			</div>

			<div className={bodyPadClass}>
				{eventsError && (
					<div className="mb-3 rounded-xl border px-3 py-2 text-xs font-semibold" style={{ borderColor: "var(--cal-border)", background: "var(--cal-surface)" }}>
						<span style={{ color: "var(--cal-text)" }}>데이터 로딩 실패:</span>{" "}
						<span style={{ color: "var(--cal-muted)" }}>{eventsError}</span>
					</div>
				)}
				{eventsLoading && (
					<div className="mb-3 rounded-xl border px-3 py-2 text-xs font-semibold" style={{ borderColor: "var(--cal-border)", background: "var(--cal-surface)" }}>
						<span style={{ color: "var(--cal-muted)" }}>이번 달 공휴일/기념일 불러오는 중…</span>
					</div>
				)}
				<div className="grid grid-cols-7 gap-1">
					{grid.map((d) => {
						const inMonth = d.getFullYear() === view.y && d.getMonth() === view.m0;
						const iso = isoDateKey(d);
						const day = d.getDate();
						const isToday = iso === todayIso;
						const isSelected = iso === selectedIso;
						const events = getEventsForIso(iso);
						const hasHoliday = events.some((e) => e.type === "holiday");
						const hasAnniversary = events.some((e) => e.type === "anniversary");

						const fg = !inMonth ? "rgba(0,0,0,.28)" : "var(--cal-text)";
						const fgResolved = preset.id === "sticker-night" || preset.id === "bento-glass" || preset.id === "midnight-luxe" || preset.id === "ocean-oled" || preset.id === "forest-calm" || preset.id === "slate-pro" || preset.id === "retro-terminal" || preset.id === "hologram-mist" ? (inMonth ? "var(--cal-text)" : "rgba(255,255,255,.28)") : fg;

						return (
							<button
								key={iso}
								type="button"
								onClick={() => setSelectedIso(iso)}
								className={`relative ${cellSizeClass} rounded-[var(--cal-radius-cell)] border transition hover:-translate-y-[1px]`}
								style={{
									borderColor: isSelected ? "var(--cal-accent)" : "var(--cal-border)",
									background: isSelected ? "var(--cal-accent)" : "var(--cal-surface)",
									color: isSelected ? "var(--cal-accent-text)" : fgResolved,
									boxShadow: isSelected ? "var(--cal-shadow-cell-hover)" : "none",
									outline: "none",
								}}
								aria-label={`${viewLabel} ${day}일`}
							>
								<span className="absolute left-2 top-1.5 text-xs font-semibold tabular-nums">{day}</span>

								{isToday && !isSelected && (
									<span
										className="absolute right-2 top-2 w-2.5 h-2.5 rounded-full"
										style={{ background: "var(--cal-today)" }}
										aria-hidden
									/>
								)}

								{showMarkersResolved && (hasHoliday || hasAnniversary) && (
									<span className="absolute left-2 bottom-1.5 flex items-center gap-1" aria-hidden>
										{hasHoliday && (
											<span className="w-1.5 h-1.5 rounded-full" style={{ background: isSelected ? "var(--cal-accent-text)" : "var(--cal-holiday)" }} />
										)}
										{hasAnniversary && (
											<span
												className="w-1.5 h-1.5 rounded-full"
												style={{ background: isSelected ? "var(--cal-accent-text)" : "var(--cal-anniversary)" }}
											/>
										)}
									</span>
								)}

								{isToday && isSelected && (
									<span className="absolute inset-0 rounded-[var(--cal-radius-cell)] ring-2" style={{ ringColor: "var(--cal-today)" } as any} aria-hidden />
								)}
							</button>
						);
					})}
				</div>

				{showSelectedCardResolved && (
					<div className="mt-4 rounded-2xl border p-4" style={{ borderColor: "var(--cal-border)", background: "var(--cal-surface2)" }}>
						<div className="flex items-center justify-between gap-2">
							<p className="text-xs font-semibold" style={{ color: "var(--cal-muted)" }}>
								선택한 날짜
							</p>
							<p className="text-xs font-semibold tabular-nums" style={{ color: "var(--cal-text)" }}>
								{selectedIso}
							</p>
						</div>

						{selectedEvents.length === 0 ? (
							<p className="mt-2 text-sm font-semibold" style={{ color: "var(--cal-text)" }}>
								이 날은 특별한 표시가 없어요.
							</p>
						) : (
							<ul className="mt-2 space-y-1.5">
								{selectedEvents.map((e, idx) => (
									<li key={`${e.type}:${e.name}:${idx}`} className="flex items-center gap-2">
										<span
											className="w-2.5 h-2.5 rounded-full"
											style={{
												background: e.type === "holiday" ? "var(--cal-holiday)" : "var(--cal-anniversary)",
											}}
											aria-hidden
										/>
										<span className="text-sm font-semibold" style={{ color: "var(--cal-text)" }}>
											{e.name}
										</span>
										<span className="text-xs font-semibold" style={{ color: "var(--cal-muted)" }}>
											{e.type === "holiday" ? "공휴일" : "기념일"}
										</span>
									</li>
								))}
							</ul>
						)}

						{showListResolved && monthEventsTop.length > 0 && (
							<div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--cal-border)" }}>
								<p className="text-xs font-semibold" style={{ color: "var(--cal-muted)" }}>
									이번 달 주요 일정
								</p>
								<ul className="mt-2 space-y-1.5">
									{monthEventsTop.map((it) => (
										<li key={`${it.iso}:${it.e.type}:${it.e.name}`} className="flex items-center justify-between gap-2">
											<span className="text-xs font-semibold tabular-nums" style={{ color: "var(--cal-muted)" }}>
												{it.iso.slice(5)}
											</span>
											<span className="text-sm font-semibold truncate" style={{ color: "var(--cal-text)" }}>
												{it.e.name}
											</span>
											<span
												className="w-2 h-2 rounded-full shrink-0"
												style={{ background: it.e.type === "holiday" ? "var(--cal-holiday)" : "var(--cal-anniversary)" }}
												aria-hidden
											/>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

