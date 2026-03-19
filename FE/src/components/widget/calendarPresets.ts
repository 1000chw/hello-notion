export type CalendarPresetId =
	| "marshmallow-pop"
	| "sticker-night"
	| "cherry-gel"
	| "peach-milk-tea"
	| "playroom-blocks"
	| "candy-outline"
	| "paper-diary"
	| "hologram-mist"
	| "soft-mono"
	| "kawaii-cloud"
	| "retro-terminal"
	| "studio-minimal"
	| "bento-glass"
	| "neo-brutal"
	| "warm-editorial"
	| "midnight-luxe"
	| "ocean-oled"
	| "forest-calm"
	| "sakura-pixel"
	| "slate-pro";

export type CalendarPreset = {
	id: CalendarPresetId;
	name: string;
	tokens: {
		colors: {
			bg: string;
			surface: string;
			surface2: string;
			text: string;
			muted: string;
			border: string;
			accent: string;
			accentText: string;
			holiday: string;
			anniversary: string;
			today: string;
		};
		radius: {
			panel: string;
			cell: string;
			pill: string;
		};
		shadow: {
			panel: string;
			cellHover: string;
		};
		pattern:
			| { type: "none" }
			| { type: "dots"; color: string; opacity: number; sizePx: number }
			| { type: "grid"; color: string; opacity: number; sizePx: number }
			| { type: "scanlines"; color: string; opacity: number; linePx: number; gapPx: number };
	};
};

export const DEFAULT_CALENDAR_PRESET: CalendarPresetId = "studio-minimal";

export const CALENDAR_PRESETS: readonly CalendarPreset[] = [
	{
		id: "marshmallow-pop",
		name: "Marshmallow Pop",
		tokens: {
			colors: {
				bg: "#FFF7ED",
				surface: "rgba(255,255,255,.78)",
				surface2: "rgba(255,255,255,.55)",
				text: "#3A2E2A",
				muted: "rgba(58,46,42,.60)",
				border: "rgba(58,46,42,.12)",
				accent: "#FFB4C6",
				accentText: "#2A151B",
				holiday: "#E11D48",
				anniversary: "#7C3AED",
				today: "#7EE7C9",
			},
			radius: { panel: "24px", cell: "18px", pill: "999px" },
			shadow: {
				panel: "0 16px 40px rgba(58,46,42,.10)",
				cellHover: "0 10px 22px rgba(58,46,42,.14)",
			},
			pattern: { type: "dots", color: "#FFB4C6", opacity: 0.16, sizePx: 18 },
		},
	},
	{
		id: "sticker-night",
		name: "Sticker Night",
		tokens: {
			colors: {
				bg: "#0B1020",
				surface: "rgba(255,255,255,.08)",
				surface2: "rgba(255,255,255,.06)",
				text: "#E8ECF6",
				muted: "rgba(232,236,246,.70)",
				border: "rgba(199,203,214,.18)",
				accent: "#7C5CFF",
				accentText: "#F4F1FF",
				holiday: "#B6FF3B",
				anniversary: "#FF4FD8",
				today: "#2DE2E6",
			},
			radius: { panel: "22px", cell: "16px", pill: "999px" },
			shadow: { panel: "0 16px 50px rgba(0,0,0,.45)", cellHover: "0 12px 28px rgba(0,0,0,.40)" },
			pattern: { type: "dots", color: "#7C5CFF", opacity: 0.18, sizePx: 22 },
		},
	},
	{
		id: "cherry-gel",
		name: "Cherry Gel",
		tokens: {
			colors: {
				bg: "#FFF9FB",
				surface: "rgba(255,255,255,.76)",
				surface2: "rgba(255,255,255,.55)",
				text: "#1F2430",
				muted: "rgba(31,36,48,.62)",
				border: "rgba(31,36,48,.10)",
				accent: "#FF3B6B",
				accentText: "#FFFFFF",
				holiday: "#DC2626",
				anniversary: "#6B4EFF",
				today: "#6B4EFF",
			},
			radius: { panel: "22px", cell: "18px", pill: "999px" },
			shadow: { panel: "0 18px 46px rgba(107,78,255,.14)", cellHover: "0 12px 26px rgba(255,59,107,.18)" },
			pattern: { type: "grid", color: "#FF3B6B", opacity: 0.10, sizePx: 20 },
		},
	},
	{
		id: "peach-milk-tea",
		name: "Peach Milk Tea",
		tokens: {
			colors: {
				bg: "#F4E7D3",
				surface: "rgba(255,253,247,.72)",
				surface2: "rgba(255,253,247,.52)",
				text: "#6B4A3B",
				muted: "rgba(107,74,59,.60)",
				border: "rgba(107,74,59,.14)",
				accent: "#FFB38A",
				accentText: "#3B241B",
				holiday: "#B91C1C",
				anniversary: "#2563EB",
				today: "#E9F6FF",
			},
			radius: { panel: "26px", cell: "18px", pill: "999px" },
			shadow: { panel: "0 16px 44px rgba(107,74,59,.18)", cellHover: "0 12px 24px rgba(107,74,59,.22)" },
			pattern: { type: "grid", color: "#6B4A3B", opacity: 0.08, sizePx: 22 },
		},
	},
	{
		id: "playroom-blocks",
		name: "Playroom Blocks",
		tokens: {
			colors: {
				bg: "#FFFDF7",
				surface: "#FFFFFF",
				surface2: "rgba(17,24,39,.04)",
				text: "#111827",
				muted: "rgba(17,24,39,.62)",
				border: "rgba(17,24,39,.12)",
				accent: "#3B82F6",
				accentText: "#FFFFFF",
				holiday: "#FF4D4D",
				anniversary: "#FBBF24",
				today: "#C7FF00",
			},
			radius: { panel: "18px", cell: "12px", pill: "12px" },
			shadow: { panel: "0 18px 0 rgba(17,24,39,.10)", cellHover: "0 10px 0 rgba(17,24,39,.14)" },
			pattern: { type: "dots", color: "#3B82F6", opacity: 0.10, sizePx: 16 },
		},
	},
	{
		id: "candy-outline",
		name: "Candy Outline",
		tokens: {
			colors: {
				bg: "#FFFFFF",
				surface: "rgba(255,255,255,.90)",
				surface2: "rgba(17,17,17,.03)",
				text: "#111111",
				muted: "rgba(17,17,17,.58)",
				border: "rgba(17,17,17,.12)",
				accent: "#FF6AD5",
				accentText: "#111111",
				holiday: "#E11D48",
				anniversary: "#4DEEEA",
				today: "#4DEEEA",
			},
			radius: { panel: "22px", cell: "14px", pill: "999px" },
			shadow: { panel: "0 18px 44px rgba(17,17,17,.08)", cellHover: "0 14px 26px rgba(255,106,213,.12)" },
			pattern: { type: "none" },
		},
	},
	{
		id: "paper-diary",
		name: "Paper Diary",
		tokens: {
			colors: {
				bg: "#F8F3E8",
				surface: "rgba(255,255,255,.70)",
				surface2: "rgba(43,43,43,.04)",
				text: "#2B2B2B",
				muted: "rgba(43,43,43,.60)",
				border: "rgba(43,43,43,.12)",
				accent: "#7A8F5A",
				accentText: "#1D2516",
				holiday: "#B85C38",
				anniversary: "#6D28D9",
				today: "#B85C38",
			},
			radius: { panel: "20px", cell: "14px", pill: "999px" },
			shadow: { panel: "0 18px 44px rgba(43,43,43,.10)", cellHover: "0 12px 22px rgba(43,43,43,.14)" },
			pattern: { type: "grid", color: "#2B2B2B", opacity: 0.06, sizePx: 22 },
		},
	},
	{
		id: "hologram-mist",
		name: "Hologram Mist",
		tokens: {
			colors: {
				bg: "#0A0F2C",
				surface: "rgba(255,255,255,.10)",
				surface2: "rgba(255,255,255,.06)",
				text: "#E9ECFF",
				muted: "rgba(233,236,255,.70)",
				border: "rgba(215,220,228,.18)",
				accent: "#FF4FD8",
				accentText: "#0A0F2C",
				holiday: "#2DE2E6",
				anniversary: "#FF4FD8",
				today: "#2DE2E6",
			},
			radius: { panel: "24px", cell: "16px", pill: "999px" },
			shadow: { panel: "0 22px 70px rgba(0,0,0,.45)", cellHover: "0 16px 36px rgba(45,226,230,.18)" },
			pattern: { type: "dots", color: "#2DE2E6", opacity: 0.12, sizePx: 24 },
		},
	},
	{
		id: "soft-mono",
		name: "Soft Mono",
		tokens: {
			colors: {
				bg: "#FAFAF7",
				surface: "#FFFFFF",
				surface2: "#F3F4F6",
				text: "#191918",
				muted: "rgba(25,25,24,.55)",
				border: "rgba(25,25,24,.10)",
				accent: "#191918",
				accentText: "#FFFFFF",
				holiday: "#DC2626",
				anniversary: "#6B7280",
				today: "#D8D6CF",
			},
			radius: { panel: "18px", cell: "10px", pill: "999px" },
			shadow: { panel: "0 16px 44px rgba(25,25,24,.08)", cellHover: "0 10px 22px rgba(25,25,24,.10)" },
			pattern: { type: "none" },
		},
	},
	{
		id: "kawaii-cloud",
		name: "Kawaii Cloud",
		tokens: {
			colors: {
				bg: "#E6F4FF",
				surface: "rgba(255,255,255,.78)",
				surface2: "rgba(255,255,255,.58)",
				text: "#1B2A4A",
				muted: "rgba(27,42,74,.62)",
				border: "rgba(27,42,74,.12)",
				accent: "#C7B6FF",
				accentText: "#1B2A4A",
				holiday: "#FF3D7F",
				anniversary: "#6B4EFF",
				today: "#FFD66B",
			},
			radius: { panel: "28px", cell: "999px", pill: "999px" },
			shadow: { panel: "0 18px 50px rgba(27,42,74,.10)", cellHover: "0 16px 30px rgba(27,42,74,.12)" },
			pattern: { type: "dots", color: "#FFFFFF", opacity: 0.24, sizePx: 22 },
		},
	},
	{
		id: "retro-terminal",
		name: "Retro Terminal",
		tokens: {
			colors: {
				bg: "#071A10",
				surface: "rgba(7,26,16,.86)",
				surface2: "rgba(53,242,140,.06)",
				text: "#B7FFD6",
				muted: "rgba(183,255,214,.68)",
				border: "rgba(53,242,140,.22)",
				accent: "#35F28C",
				accentText: "#071A10",
				holiday: "#FFB000",
				anniversary: "#35F28C",
				today: "#FFB000",
			},
			radius: { panel: "14px", cell: "6px", pill: "6px" },
			shadow: { panel: "0 20px 70px rgba(0,0,0,.55)", cellHover: "0 12px 24px rgba(53,242,140,.18)" },
			pattern: { type: "scanlines", color: "#35F28C", opacity: 0.08, linePx: 1, gapPx: 6 },
		},
	},
	{
		id: "studio-minimal",
		name: "Studio Minimal",
		tokens: {
			colors: {
				bg: "#FFFFFF",
				surface: "#FFFFFF",
				surface2: "#F3F4F6",
				text: "#0B0B0C",
				muted: "rgba(11,11,12,.60)",
				border: "rgba(11,11,12,.10)",
				accent: "#2F6BFF",
				accentText: "#FFFFFF",
				holiday: "#DC2626",
				anniversary: "#7C3AED",
				today: "#2F6BFF",
			},
			radius: { panel: "18px", cell: "12px", pill: "999px" },
			shadow: { panel: "0 18px 46px rgba(11,11,12,.08)", cellHover: "0 12px 22px rgba(11,11,12,.10)" },
			pattern: { type: "none" },
		},
	},
	{
		id: "bento-glass",
		name: "Bento Glass",
		tokens: {
			colors: {
				bg: "#0F172A",
				surface: "rgba(255,255,255,.08)",
				surface2: "rgba(255,255,255,.06)",
				text: "#E5E7EB",
				muted: "rgba(229,231,235,.70)",
				border: "rgba(255,255,255,.14)",
				accent: "#6EE7B7",
				accentText: "#0F172A",
				holiday: "#FB7185",
				anniversary: "#6EE7B7",
				today: "#FB7185",
			},
			radius: { panel: "22px", cell: "16px", pill: "999px" },
			shadow: { panel: "0 22px 70px rgba(0,0,0,.45)", cellHover: "0 14px 28px rgba(110,231,183,.16)" },
			pattern: { type: "grid", color: "#FFFFFF", opacity: 0.06, sizePx: 26 },
		},
	},
	{
		id: "neo-brutal",
		name: "Neo Brutal",
		tokens: {
			colors: {
				bg: "#FDFDFD",
				surface: "#FFFFFF",
				surface2: "rgba(17,17,17,.04)",
				text: "#111111",
				muted: "rgba(17,17,17,.62)",
				border: "rgba(17,17,17,.22)",
				accent: "#C7FF00",
				accentText: "#111111",
				holiday: "#FF2EA6",
				anniversary: "#111111",
				today: "#FF2EA6",
			},
			radius: { panel: "10px", cell: "6px", pill: "6px" },
			shadow: { panel: "0 18px 0 rgba(17,17,17,.22)", cellHover: "0 10px 0 rgba(17,17,17,.25)" },
			pattern: { type: "none" },
		},
	},
	{
		id: "warm-editorial",
		name: "Warm Editorial",
		tokens: {
			colors: {
				bg: "#FFF6E8",
				surface: "rgba(255,255,255,.74)",
				surface2: "rgba(28,27,26,.04)",
				text: "#1C1B1A",
				muted: "rgba(28,27,26,.60)",
				border: "rgba(28,27,26,.12)",
				accent: "#D4623A",
				accentText: "#FFFFFF",
				holiday: "#B91C1C",
				anniversary: "#7B8B6F",
				today: "#7B8B6F",
			},
			radius: { panel: "20px", cell: "12px", pill: "999px" },
			shadow: { panel: "0 18px 50px rgba(28,27,26,.10)", cellHover: "0 12px 24px rgba(212,98,58,.14)" },
			pattern: { type: "grid", color: "#1C1B1A", opacity: 0.05, sizePx: 28 },
		},
	},
	{
		id: "midnight-luxe",
		name: "Midnight Luxe",
		tokens: {
			colors: {
				bg: "#05060A",
				surface: "rgba(255,255,255,.08)",
				surface2: "rgba(255,255,255,.06)",
				text: "#EDE7DD",
				muted: "rgba(237,231,221,.70)",
				border: "rgba(217,183,106,.22)",
				accent: "#D9B76A",
				accentText: "#05060A",
				holiday: "#D9B76A",
				anniversary: "#7A1E3A",
				today: "#D9B76A",
			},
			radius: { panel: "22px", cell: "14px", pill: "999px" },
			shadow: { panel: "0 24px 80px rgba(0,0,0,.55)", cellHover: "0 14px 28px rgba(217,183,106,.16)" },
			pattern: { type: "dots", color: "#D9B76A", opacity: 0.10, sizePx: 26 },
		},
	},
	{
		id: "ocean-oled",
		name: "Ocean OLED",
		tokens: {
			colors: {
				bg: "#000000",
				surface: "rgba(255,255,255,.06)",
				surface2: "rgba(255,255,255,.05)",
				text: "#E5F9FF",
				muted: "rgba(229,249,255,.68)",
				border: "rgba(0,229,255,.18)",
				accent: "#00E5FF",
				accentText: "#000000",
				holiday: "#00E5FF",
				anniversary: "#2D6BFF",
				today: "#2D6BFF",
			},
			radius: { panel: "18px", cell: "12px", pill: "999px" },
			shadow: { panel: "0 22px 80px rgba(0,0,0,.70)", cellHover: "0 12px 24px rgba(0,229,255,.14)" },
			pattern: { type: "none" },
		},
	},
	{
		id: "forest-calm",
		name: "Forest Calm",
		tokens: {
			colors: {
				bg: "#0E2A1E",
				surface: "rgba(221,231,225,.10)",
				surface2: "rgba(221,231,225,.06)",
				text: "#DDE7E1",
				muted: "rgba(221,231,225,.70)",
				border: "rgba(63,191,127,.20)",
				accent: "#3FBF7F",
				accentText: "#0E2A1E",
				holiday: "#FCA5A5",
				anniversary: "#3FBF7F",
				today: "#DDE7E1",
			},
			radius: { panel: "22px", cell: "14px", pill: "999px" },
			shadow: { panel: "0 22px 70px rgba(0,0,0,.55)", cellHover: "0 14px 26px rgba(63,191,127,.14)" },
			pattern: { type: "dots", color: "#3FBF7F", opacity: 0.10, sizePx: 26 },
		},
	},
	{
		id: "sakura-pixel",
		name: "Sakura Pixel",
		tokens: {
			colors: {
				bg: "#FFE4EE",
				surface: "#FFFFFF",
				surface2: "rgba(75,29,63,.04)",
				text: "#4B1D3F",
				muted: "rgba(75,29,63,.60)",
				border: "rgba(75,29,63,.12)",
				accent: "#FF3D7F",
				accentText: "#FFFFFF",
				holiday: "#FF3D7F",
				anniversary: "#6B4EFF",
				today: "#4B1D3F",
			},
			radius: { panel: "16px", cell: "8px", pill: "999px" },
			shadow: { panel: "0 18px 46px rgba(75,29,63,.10)", cellHover: "0 12px 22px rgba(255,61,127,.14)" },
			pattern: { type: "grid", color: "#FF3D7F", opacity: 0.10, sizePx: 14 },
		},
	},
	{
		id: "slate-pro",
		name: "Slate Pro",
		tokens: {
			colors: {
				bg: "#0F172A",
				surface: "rgba(226,232,240,.10)",
				surface2: "rgba(226,232,240,.06)",
				text: "#E2E8F0",
				muted: "rgba(226,232,240,.70)",
				border: "rgba(226,232,240,.16)",
				accent: "#22C55E",
				accentText: "#0F172A",
				holiday: "#F87171",
				anniversary: "#60A5FA",
				today: "#22C55E",
			},
			radius: { panel: "18px", cell: "10px", pill: "999px" },
			shadow: { panel: "0 22px 70px rgba(0,0,0,.45)", cellHover: "0 12px 22px rgba(34,197,94,.14)" },
			pattern: { type: "grid", color: "#E2E8F0", opacity: 0.06, sizePx: 24 },
		},
	},
] as const;

export function getCalendarPreset(id: string | null | undefined): CalendarPreset {
	if (!id) return CALENDAR_PRESETS.find((p) => p.id === DEFAULT_CALENDAR_PRESET) ?? CALENDAR_PRESETS[0];
	return CALENDAR_PRESETS.find((p) => p.id === id) ?? (CALENDAR_PRESETS.find((p) => p.id === DEFAULT_CALENDAR_PRESET) ?? CALENDAR_PRESETS[0]);
}

