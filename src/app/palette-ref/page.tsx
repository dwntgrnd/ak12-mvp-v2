"use client";

import Script from "next/script";
import { useState } from "react";

const brandPalette: Record<string, { label: string; base: string; role: string; scale: Record<string | number, string> }> = {
  orange: {
    label: "Orange",
    base: "#F08632",
    role: "Primary accent, CTAs, brand energy",
    scale: {
      50:  "#FEF5EC",
      100: "#FDE9D4",
      200: "#FBD0A8",
      300: "#F8B47A",
      400: "#F49A53",
      500: "#F08632",
      600: "#D97020",
      700: "#B35819",
      800: "#8C4415",
      900: "#6B3412",
    },
  },
  gold: {
    label: "Gold",
    base: "#FFC205",
    role: "Warning, caution, attention signals",
    scale: {
      50:  "#FFFAEB",
      100: "#FFF2CC",
      200: "#FFE699",
      300: "#FFD966",
      400: "#FFCC33",
      500: "#FFC205",
      600: "#DBA504",
      700: "#B58603",
      800: "#8C6802",
      900: "#6B4F02",
    },
  },
  green: {
    label: "Green",
    base: "#00DE9C",
    role: "Success, positive trends, confirmation",
    scale: {
      50:  "#ECFDF6",
      100: "#D1FAE9",
      200: "#A7F3D5",
      300: "#6EEABC",
      400: "#34DCA8",
      500: "#00DE9C",
      600: "#00B880",
      700: "#009466",
      800: "#00724F",
      900: "#005C40",
    },
  },
  cyan: {
    label: "Cyan",
    base: "#03C4D4",
    role: "Interactive accent, focus rings, links, emphasis surfaces",
    scale: {
      50:  "#ECFEFF",
      100: "#CFFAFE",
      200: "#A5F2FB",
      300: "#67E5F4",
      400: "#2DD3E5",
      500: "#03C4D4",
      600: "#029DAB",
      700: "#027D89",
      800: "#06636D",
      900: "#0A4F59",
    },
  },
  blue: {
    label: "Blue",
    base: "#2990C5",
    role: "Mid-range interactive, secondary emphasis",
    scale: {
      50:  "#EFF8FF",
      100: "#DBEFFE",
      200: "#BFDFFD",
      300: "#93CAFB",
      400: "#5AAEF0",
      500: "#2990C5",
      600: "#2278A8",
      700: "#1C6089",
      800: "#1B5070",
      900: "#1C435D",
    },
  },
  deepBlue: {
    label: "Deep Blue",
    base: "#1E698F",
    role: "Sidebar depth, section emphasis, text hierarchy",
    scale: {
      50:  "#F0F7FB",
      100: "#DAEDF5",
      200: "#B9DDEC",
      300: "#89C5DD",
      400: "#52A5C8",
      500: "#2E87AE",
      600: "#1E698F",
      700: "#1C5A7A",
      800: "#1C4B65",
      900: "#1C3F55",
    },
  },
  navy: {
    label: "Navy",
    base: "#172642",
    role: "Dark base, primary text, sidebar background",
    scale: {
      50:  "#F1F4F8",
      100: "#DCE2EC",
      200: "#B9C5D9",
      300: "#8FA2BF",
      400: "#67799E",
      500: "#4C5F83",
      600: "#3A4B6A",
      700: "#2E3C56",
      800: "#213049",
      900: "#172642",
    },
  },
  red: {
    label: "Red (Semantic)",
    base: "#FA2E57",
    role: "Destructive, error — semantic only, not brand",
    scale: {
      50:  "#FFF1F3",
      300: "#FDA4B4",
      500: "#FA2E57",
      700: "#C81E45",
      900: "#881337",
    },
  },
};

const neutrals: Record<string, { label: string; base: string; role: string; scale: Record<string | number, string> }> = {
  slate: {
    label: "Slate (Neutral)",
    base: "#64748B",
    role: "Borders, backgrounds, muted text",
    scale: {
      50:  "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
  },
};

const surfaces = {
  white: "#FFFFFF",
  warmWhite: "#F4F5F5",
};

function Swatch({ hex, name, textDark = true }: { hex: string; name: string; textDark?: boolean }) {
  const [copied, setCopied] = useState(false);
  const handleClick = () => {
    navigator.clipboard?.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <button
      onClick={handleClick}
      className="group flex flex-col items-stretch cursor-pointer transition-transform hover:scale-105"
      title={`Copy ${hex}`}
    >
      <div
        className="h-14 rounded-lg border border-black/5 flex items-end justify-between px-2 pb-1.5 transition-shadow group-hover:shadow-md"
        style={{ backgroundColor: hex }}
      >
        {copied && (
          <span className={`text-[10px] font-mono font-bold ${textDark ? "text-black/70" : "text-white/90"}`}>
            Copied!
          </span>
        )}
      </div>
      <div className="mt-1.5 text-center">
        <div className="text-[11px] font-semibold text-gray-700 font-mono">{name}</div>
        <div className="text-[10px] text-gray-400 font-mono uppercase">{hex}</div>
      </div>
    </button>
  );
}

function ColorRow({ data }: { data: { label: string; base: string; role: string; scale: Record<string | number, string> } }) {
  const entries = Object.entries(data.scale);
  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-3 mb-3">
        <h3 className="text-base font-semibold text-gray-900">{data.label}</h3>
        <span className="text-xs text-gray-400 font-mono">{data.base}</span>
        <span className="text-xs text-gray-500 italic">{data.role}</span>
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${entries.length}, minmax(0, 1fr))` }}>
        {entries.map(([step, hex]) => (
          <Swatch key={step} hex={hex} name={step} textDark={parseInt(step) < 600} />
        ))}
      </div>
    </div>
  );
}

function SurfaceDemo() {
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-gray-900 mb-1">Surface Hierarchy</h3>
      <p className="text-xs text-gray-500 mb-4">Three levels differentiated by background color alone. No decorative borders.</p>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Option A: cyan-50", bg: "#ECFEFF" },
          { label: "Option B: cyan-50/80 + cyan-100 blend", bg: "#E0F9FC" },
          { label: "Option C: blue-50", bg: "#EFF8FF" },
        ].map(({ label, bg }) => (
          <div key={label} className="text-center">
            <div className="text-[11px] font-mono text-gray-400 mb-2">{label}</div>
            <div className="rounded-xl p-4" style={{ backgroundColor: "#F8FAFC" }}>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="rounded-md p-3" style={{ backgroundColor: bg }}>
                  <div className="text-xs text-gray-700 leading-relaxed">
                    LAUSD is actively evaluating K-8 math materials with $12.5M allocated.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-6" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="text-[11px] font-mono text-gray-400 mb-3">PAGE SURFACE — slate-50 · #F8FAFC</div>
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="text-[11px] font-mono text-gray-400 mb-3">CARD SURFACE — white · #FFFFFF</div>
          <div className="rounded-md p-4" style={{ backgroundColor: "#E0F9FC" }}>
            <div className="text-[11px] font-mono text-gray-400 mb-1">EMPHASIS SURFACE — background tint only, no border</div>
            <div className="text-sm text-gray-700 leading-relaxed">
              LAUSD is actively evaluating K-8 math materials aligned to the CA Math Framework, with $12.5M allocated for 2024-25.
            </div>
          </div>
          <div className="rounded-md p-4 mt-4" style={{ backgroundColor: "#F8FAFC" }}>
            <div className="text-[11px] font-mono text-gray-400 mb-1">INSET SURFACE — slate-50 · #F8FAFC</div>
            <div className="text-xs text-gray-500">Detail content recesses into the page-level background color.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypeScaleDemo() {
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Typography Hierarchy</h3>
      <div className="space-y-4 bg-white rounded-lg border border-gray-200 p-6">
        {[
          { label: "Page Title — 24/700", style: { fontSize: "24px", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em", color: "#172642" }, text: "Los Angeles Unified" },
          { label: "Section — 18/600", style: { fontSize: "18px", fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.01em", color: "#172642" }, text: "Goals & Funding" },
          { label: "Subsection — 15/600", style: { fontSize: "15px", fontWeight: 600, lineHeight: 1.4, color: "#172642" }, text: "View all LCAP goals" },
          { label: "Body — 14/400", style: { fontSize: "14px", fontWeight: 400, lineHeight: 1.6, color: "#172642" }, text: "Math proficiency trails ELA significantly, making math the more urgent instructional need." },
          { label: "Body Emph — 14/600", style: { fontSize: "14px", fontWeight: 600, lineHeight: 1.6, color: "#172642" }, text: "$12.5M allocated for 2024-25" },
          { label: "Caption — 12/500", style: { fontSize: "12px", fontWeight: 500, lineHeight: 1.5, letterSpacing: "0.025em", color: "#64748B" }, text: "Sources: CDE DataQuest (2023-24), District LCAP (2024-25)" },
          { label: "Overline — 11/500", style: { fontSize: "11px", fontWeight: 500, lineHeight: 1.4, letterSpacing: "0.05em", textTransform: "uppercase" as const, color: "#64748B" }, text: "Active Evaluation" },
        ].map(({ label, style, text }) => (
          <div key={label} className="flex items-baseline gap-4">
            <span className="text-[11px] font-mono text-gray-400 w-36 shrink-0">{label}</span>
            <span style={style}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BriefAnatomyDemo() {
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-gray-900 mb-1">Research Brief Anatomy — Full Example</h3>
      <p className="text-xs text-gray-500 mb-4">No decorative borders. Hierarchy through background color, typography weight, and spacing.</p>
      <div className="rounded-xl p-6" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="rounded-md p-4" style={{ backgroundColor: "#E0F9FC" }}>
            <p style={{ fontSize: "14px", fontWeight: 400, lineHeight: 1.6, color: "#172642" }}>
              LAUSD is actively evaluating K-8 math materials aligned to the CA Math Framework, with $12.5M allocated for 2024-25.
            </p>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { overline: "Active Evaluation", title: "K-8 Math Materials", sub: "$12.5M allocated · 2024-25 cycle" },
                { overline: "Driving Priority", title: "LCAP Goal 1: Proficiency for All", sub: "Primary instructional goal" },
                { overline: "Secondary Signal", title: "ELA Curriculum Refresh", sub: "Planned for 2025-26" },
                { overline: "District Scale", title: "420,000+ students", sub: "Largest district in California" },
              ].map(({ overline, title, sub }) => (
                <div key={overline}>
                  <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "#64748B" }}>{overline}</div>
                  <div className="mt-1" style={{ fontSize: "14px", fontWeight: 600, color: "#172642" }}>{title}</div>
                  <div className="mt-0.5" style={{ fontSize: "12px", fontWeight: 500, color: "#64748B" }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <div className="rounded-md p-4" style={{ backgroundColor: "#F8FAFC" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#172642", marginBottom: "8px" }}>Other Funding Signals</div>
              <div style={{ fontSize: "13px", fontWeight: 400, lineHeight: 1.6, color: "#475569" }}>
                Educator Effectiveness Block Grant — $45M state allocation expiring 2026.
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button className="flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-md group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
              <span style={{ fontSize: "15px", fontWeight: 600 }} className="text-gray-700">View all LCAP goals</span>
            </button>
          </div>
          <div className="mt-6 pt-3" style={{ borderTop: "1px solid #E2E8F0" }}>
            <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748B", letterSpacing: "0.025em" }}>
              Sources: <span className="underline underline-offset-2">LAUSD LCAP 2024-25</span>, <span className="underline underline-offset-2">CDE DataQuest</span> (2023-24)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NegativeStateDemo() {
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-gray-900 mb-1">Negative Signal Brief — &quot;Not Now&quot; State</h3>
      <p className="text-xs text-gray-500 mb-4">Honest intelligence is still valuable. Different emphasis surface for neutral/negative signals.</p>
      <div className="rounded-xl p-6" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="rounded-md p-4" style={{ backgroundColor: "#F1F5F9" }}>
            <p style={{ fontSize: "14px", fontWeight: 400, lineHeight: 1.6, color: "#334155" }}>
              This district&apos;s current LCAP priorities focus on social-emotional learning and attendance recovery. No active curriculum evaluation is signaled for 2024-25.
            </p>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { overline: "Current Focus", title: "SEL & Attendance Recovery", sub: "No instructional materials signal" },
                { overline: "Next Review Cycle", title: "2025-26 (estimated)", sub: "Based on typical LCAP cadence" },
              ].map(({ overline, title, sub }) => (
                <div key={overline}>
                  <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "#94A3B8" }}>{overline}</div>
                  <div className="mt-1" style={{ fontSize: "14px", fontWeight: 600, color: "#334155" }}>{title}</div>
                  <div className="mt-0.5" style={{ fontSize: "12px", fontWeight: 500, color: "#64748B" }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-3" style={{ borderTop: "1px solid #E2E8F0" }}>
            <span style={{ fontSize: "12px", fontWeight: 500, color: "#94A3B8", letterSpacing: "0.025em" }}>
              Sources: <span className="underline underline-offset-2">District LCAP 2024-25</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonDemo() {
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Button Tiers</h3>
      <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center gap-4">
        <button className="px-4 py-2 rounded-md text-sm font-semibold text-white" style={{ backgroundColor: "#F08632" }}>Generate Playbook</button>
        <button className="px-4 py-2 rounded-md text-sm font-medium border" style={{ borderColor: "#E2E8F0", color: "#172642", backgroundColor: "#FFFFFF" }}>Save District</button>
        <button className="px-4 py-2 rounded-md text-sm font-medium" style={{ color: "#64748B" }}>Find Similar</button>
      </div>
    </div>
  );
}

function MetricTileDemo() {
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Metric Tiles</h3>
      <div className="rounded-xl p-6" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Enrollment", value: "420,370", delta: "-2.1%", color: "#FA2E57", up: false },
            { label: "ELA Proficiency", value: "43.1%", delta: "+1.8%", color: "#00DE9C", up: true },
            { label: "Math Proficiency", value: "32.8%", delta: "+2.3%", color: "#00DE9C", up: true },
            { label: "FRPM Eligible", value: "80.3%", delta: "—", color: "#64748B", up: null },
          ].map(({ label, value, delta, color, up }) => (
            <div key={label} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div style={{ fontSize: "12px", fontWeight: 500, color: "#64748B", letterSpacing: "0.025em" }}>{label}</div>
              <div className="mt-1" style={{ fontSize: "24px", fontWeight: 700, color: "#172642", lineHeight: 1.2 }}>{value}</div>
              <div className="mt-1 flex items-center gap-1">
                {up !== null && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {up
                      ? <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></>
                      : <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></>
                    }
                  </svg>
                )}
                <span style={{ fontSize: "12px", fontWeight: 500, color }}>{delta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InteractiveCardDemo() {
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Interactive Cards — Discovery List</h3>
      <div className="rounded-xl p-6" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="space-y-3">
          {[
            { name: "Los Angeles Unified", meta: "Los Angeles County · 420,370 students · K-12", badge: "Strong Fit", badgeBg: "#ECFDF6", dot: "#00DE9C", text: "#009466" },
            { name: "San Diego Unified", meta: "San Diego County · 121,185 students · K-12", badge: "Moderate Fit", badgeBg: "#FFFAEB", dot: "#FFC205", text: "#B58603" },
          ].map(({ name, meta, badge, badgeBg, dot, text }) => (
            <div key={name} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#172642" }}>{name}</div>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "#64748B", marginTop: "2px" }}>{meta}</div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ backgroundColor: badgeBg }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dot }}></div>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: text }}>{badge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabBarDemo() {
  const [active, setActive] = useState(0);
  const tabs = ["Goals & Funding", "Academic Performance", "Competitive Intel"];
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Tab Bar</h3>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex gap-6" style={{ borderBottom: "1px solid #E2E8F0" }}>
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActive(i)}
              className="relative pb-3 cursor-pointer"
              style={{ fontSize: "14px", fontWeight: active === i ? 600 : 500, color: active === i ? "#172642" : "#64748B" }}
            >
              {tab}
              {active === i && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: "#03C4D4" }} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PaletteReferencePage() {
  return (
    <>
    <Script src="https://mcp.figma.com/mcp/html-to-design/capture.js" strategy="afterInteractive" />
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900">AK12 Visual Standards — Reference v2</h1>
          <p className="text-sm text-gray-500 mt-1">Extended brand palette · Component anatomy · No decorative borders · Click swatches to copy</p>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Brand Colors — Extended Scales</h2>
          <p className="text-xs text-gray-500 mb-6">Base value at 500. Lighter values for surfaces/backgrounds, darker for hover states and text-on-tint.</p>
          {(["orange","cyan","blue","deepBlue","navy","gold","green","red"] as const).map((key) => (
            <ColorRow key={key} data={brandPalette[key]} />
          ))}
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Neutrals & Surfaces</h2>
          <p className="text-xs text-gray-500 mb-6">Structural palette for borders, backgrounds, and muted text.</p>
          <ColorRow data={neutrals.slate} />
          <div className="flex gap-6 mt-4">
            {[{ label: "White", hex: surfaces.white }, { label: "Brand Warm White", hex: surfaces.warmWhite }].map(({ label, hex }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg border border-gray-200" style={{ backgroundColor: hex }}></div>
                <div>
                  <div className="text-[11px] font-mono font-semibold text-gray-700">{label}</div>
                  <div className="text-[10px] font-mono text-gray-400">{hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-10 border-gray-200" />

        <h2 className="text-lg font-semibold text-gray-900 mb-6">Component Standards</h2>
        <TypeScaleDemo />
        <SurfaceDemo />
        <BriefAnatomyDemo />
        <NegativeStateDemo />
        <TabBarDemo />
        <ButtonDemo />
        <MetricTileDemo />
        <InteractiveCardDemo />
      </div>
    </div>
    </>
  );
}
