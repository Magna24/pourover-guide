import React, { useState, useEffect, useRef, useMemo } from "react";

// ============ BUILT-IN RECIPES ============
const BUILTIN_RECIPES = [
  {
    id: "builtin-tetsu-4-6",
    name: "Tetsu Kasuya 4:6 Method",
    author: "Tetsu Kasuya",
    dripper: "V60",
    roast: "light",
    flavors: ["fruity", "sweet"],
    coffee: 20,
    water: 300,
    ratio: "1:15",
    grind: "medium-coarse",
    tempC: "92",
    totalTime: 210,
    description:
      "World Brewers Cup winning method. First 40% controls acidity/sweetness, last 60% controls strength.",
    stages: [
      { start: 0, end: 45, pourTo: 50, instruction: "Pour 50g — bloom (less = sweeter)" },
      { start: 45, end: 90, pourTo: 120, instruction: "Pour to 120g — second pour" },
      { start: 90, end: 130, pourTo: 180, instruction: "Pour to 180g" },
      { start: 130, end: 165, pourTo: 240, instruction: "Pour to 240g" },
      { start: 165, end: 210, pourTo: 300, instruction: "Pour to 300g — final pour" },
    ],
  },
  {
    id: "builtin-hoffmann-v60",
    name: "Hoffmann's Ultimate V60",
    author: "James Hoffmann",
    dripper: "V60",
    roast: "light",
    flavors: ["fruity", "clean"],
    coffee: 30,
    water: 500,
    ratio: "1:16.6",
    grind: "medium-fine",
    tempC: "96",
    totalTime: 240,
    description:
      "Two-pour technique with swirls. Clean, sweet, complex cup. Best for light roasts.",
    stages: [
      { start: 0, end: 10, pourTo: 60, instruction: "Pour 60g for bloom (2x coffee weight)" },
      { start: 10, end: 45, pourTo: 60, instruction: "Swirl gently, then wait" },
      { start: 45, end: 105, pourTo: 300, instruction: "Pour to 300g (60% total) in 30 sec" },
      { start: 105, end: 135, pourTo: 500, instruction: "Pour to 500g slowly over 30 sec" },
      { start: 135, end: 165, pourTo: 500, instruction: "Swirl to flatten bed" },
      { start: 165, end: 240, pourTo: 500, instruction: "Let it drawdown — done by 3:30-4:00" },
    ],
  },
  {
    id: "builtin-onyx",
    name: "Onyx Classic V60",
    author: "Onyx Coffee Lab",
    dripper: "V60",
    roast: "medium",
    flavors: ["sweet", "rich"],
    coffee: 22,
    water: 352,
    ratio: "1:16",
    grind: "medium",
    tempC: "94-96",
    totalTime: 195,
    description:
      "Reliable everyday recipe. Balanced cup, works across roast levels.",
    stages: [
      { start: 0, end: 45, pourTo: 50, instruction: "Bloom with 50g, swirl" },
      { start: 45, end: 75, pourTo: 150, instruction: "Pour to 150g — center pour, then circles" },
      { start: 75, end: 105, pourTo: 250, instruction: "Pour to 250g" },
      { start: 105, end: 135, pourTo: 352, instruction: "Pour to 352g — finish pour" },
      { start: 135, end: 195, pourTo: 352, instruction: "Let drawdown finish" },
    ],
  },
  {
    id: "builtin-kalita",
    name: "Kalita Wave Standard",
    author: "Kalita",
    dripper: "Kalita Wave",
    roast: "medium",
    flavors: ["sweet", "rich"],
    coffee: 22,
    water: 360,
    ratio: "1:16.4",
    grind: "medium",
    tempC: "93-95",
    totalTime: 210,
    description:
      "Flat-bottom forgiveness. Pulse pours for consistency.",
    stages: [
      { start: 0, end: 45, pourTo: 60, instruction: "Bloom 60g, gentle swirl" },
      { start: 45, end: 75, pourTo: 160, instruction: "Pulse to 160g" },
      { start: 75, end: 105, pourTo: 260, instruction: "Pulse to 260g" },
      { start: 105, end: 135, pourTo: 360, instruction: "Pulse to 360g" },
      { start: 135, end: 210, pourTo: 360, instruction: "Wait for drawdown" },
    ],
  },
  {
    id: "builtin-origami-dark",
    name: "Origami for Dark Roast",
    author: "Community",
    dripper: "Origami",
    roast: "dark",
    flavors: ["rich", "sweet"],
    coffee: 18,
    water: 270,
    ratio: "1:15",
    grind: "medium-coarse",
    tempC: "86-90",
    totalTime: 180,
    description:
      "Lower temp, coarser grind, shorter contact for dark roasts. Cuts bitterness, keeps body.",
    stages: [
      { start: 0, end: 40, pourTo: 50, instruction: "Bloom 50g — cooler water, gentle" },
      { start: 40, end: 80, pourTo: 150, instruction: "Pour to 150g" },
      { start: 80, end: 120, pourTo: 270, instruction: "Pour to 270g — keep moving" },
      { start: 120, end: 180, pourTo: 270, instruction: "Drawdown — pull early if bitter" },
    ],
  },
  {
    id: "builtin-ultimate-v60",
    name: "The Ultimate V60 Technique",
    author: "James Hoffmann",
    dripper: "V60",
    roast: "light",
    flavors: ["clean", "sweet"],
    coffee: 30,
    water: 500,
    ratio: "1:16.7",
    grind: "medium-fine",
    tempC: "96-100",
    totalTime: 210,
    description:
      "Hotter water, swirl bloom, two sharp pours. Targets a flat coffee bed for even extraction. Finish drawdown by 3:30.",
    stages: [
      { start: 0, end: 45, pourTo: 60, instruction: "Pour 60g bloom water (2× coffee), swirl until all grounds are wet" },
      { start: 45, end: 75, pourTo: 300, instruction: "Pour to 300g (60% of total) in 30 s — ~8 g/s flow rate" },
      { start: 75, end: 105, pourTo: 500, instruction: "Pour to 500g in 30 s — ~6.7 g/s, slightly slower than previous pour" },
      { start: 105, end: 210, pourTo: 500, instruction: "Stir 1× CW + 1× CCW, swirl gently, let drawdown finish by 3:30" },
    ],
  },
  {
    id: "builtin-1cup-v60",
    name: "1 Cup V60 Technique",
    author: "Community",
    dripper: "V60",
    roast: "any",
    flavors: ["clean", "sweet"],
    coffee: 15,
    water: 250,
    ratio: "1:16.7",
    grind: "medium-fine",
    tempC: "99-100",
    totalTime: 180,
    description:
      "Pulse-pour single-cup V60. Use the hottest water possible, keep spout close to surface, aim for 5 g/s. Swirl at bloom and finish.",
    stages: [
      { start: 0, end: 10, pourTo: 50, instruction: "Pour ~50g bloom water" },
      { start: 10, end: 45, pourTo: 50, instruction: "Swirl gently, let bloom finish" },
      { start: 45, end: 60, pourTo: 100, instruction: "Pour to ~100g total" },
      { start: 60, end: 70, pourTo: 100, instruction: "Pause" },
      { start: 70, end: 80, pourTo: 150, instruction: "Pour to ~150g total" },
      { start: 80, end: 90, pourTo: 150, instruction: "Pause" },
      { start: 90, end: 100, pourTo: 200, instruction: "Pour to ~200g total" },
      { start: 100, end: 110, pourTo: 200, instruction: "Pause" },
      { start: 110, end: 120, pourTo: 250, instruction: "Pour to ~250g total" },
      { start: 120, end: 180, pourTo: 250, instruction: "Swirl gently, wait for drawdown to finish by ~3:00" },
    ],
  },
  {
    id: "builtin-quick-bright",
    name: "Quick Bright Cup",
    author: "Community",
    dripper: "V60",
    roast: "light",
    flavors: ["fruity", "clean"],
    coffee: 15,
    water: 250,
    ratio: "1:16.6",
    grind: "medium-fine",
    tempC: "95-96",
    totalTime: 150,
    description:
      "Shorter brew, finer grind. Emphasizes acidity and fruit notes.",
    stages: [
      { start: 0, end: 30, pourTo: 45, instruction: "Quick bloom 45g" },
      { start: 30, end: 60, pourTo: 150, instruction: "Pour to 150g fast" },
      { start: 60, end: 90, pourTo: 250, instruction: "Pour to 250g" },
      { start: 90, end: 150, pourTo: 250, instruction: "Drawdown — should finish ~2:30" },
    ],
  },
];

// ============ STORAGE ============
const STORAGE_KEY = "pour_over_recipes_v1";
const TEMP_UNIT_KEY = "pour_over_temp_unit_v1";
const STARRED_KEY = "pour_over_starred_v1";
const BREW_RESULTS_KEY = "pour_over_brew_results_v1";
const DELETED_RECIPE_IDS_KEY = "pour_over_deleted_recipe_ids_v1";
const loadCustomRecipes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const saveCustomRecipes = (recipes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch {}
};
const loadTempUnit = () => {
  try {
    return localStorage.getItem(TEMP_UNIT_KEY) || "C";
  } catch {
    return "C";
  }
};
const saveTempUnit = (unit) => {
  try {
    localStorage.setItem(TEMP_UNIT_KEY, unit);
  } catch {}
};
const loadStarred = () => {
  try {
    const raw = localStorage.getItem(STARRED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const saveStarred = (ids) => {
  try {
    localStorage.setItem(STARRED_KEY, JSON.stringify(ids));
  } catch {}
};
const loadBrewResults = () => {
  try {
    const raw = localStorage.getItem(BREW_RESULTS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};
const saveBrewResults = (results) => {
  try {
    localStorage.setItem(BREW_RESULTS_KEY, JSON.stringify(results));
  } catch {}
};
const loadDeletedRecipeIds = () => {
  try {
    const raw = localStorage.getItem(DELETED_RECIPE_IDS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
const saveDeletedRecipeIds = (ids) => {
  try {
    localStorage.setItem(DELETED_RECIPE_IDS_KEY, JSON.stringify(ids));
  } catch {}
};

// ============ HELPERS ============
const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const getBrewAdjustmentHint = (result) => {
  if (!result) return null;
  const delta = result.drawdownTime - result.targetTime;
  if (delta >= 15) return "Try slightly coarser next time.";
  if (delta <= -15) return "Try slightly finer next time.";
  return "Close to target.";
};

// Convert tempC string (e.g., "92", "94-96", "94.5") to display string
// in the requested unit. Round to 1 decimal for fractional C, whole F.
const cToF = (c) => Math.round((c * 9) / 5 + 32);
const formatTemp = (tempC, unit) => {
  if (!tempC) return "—";
  const str = String(tempC).trim();
  // Range like "94-96"
  const rangeMatch = str.match(/^([\d.]+)\s*[-–]\s*([\d.]+)$/);
  if (rangeMatch) {
    const lo = parseFloat(rangeMatch[1]);
    const hi = parseFloat(rangeMatch[2]);
    if (unit === "F") return `${cToF(lo)}–${cToF(hi)}°F`;
    return `${lo}–${hi}°C`;
  }
  // Single value
  const num = parseFloat(str);
  if (isNaN(num)) return str;
  if (unit === "F") return `${cToF(num)}°F`;
  return `${num}°C`;
};

// Play a beep using Web Audio
const playBeep = (frequency = 800, duration = 150) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch {}
};

const vibrate = (pattern) => {
  if (navigator.vibrate) navigator.vibrate(pattern);
};

// ============ STYLES ============
const styles = {
  app: {
    minHeight: "100vh",
    background: "#f4ede0",
    color: "#1a1612",
    fontFamily: "'Fraunces', Georgia, serif",
    padding: "0",
    margin: "0",
    paddingBottom: "env(safe-area-inset-bottom)",
  },
  container: {
    maxWidth: "480px",
    margin: "0 auto",
    padding: "20px 18px 40px",
  },
  header: {
    textAlign: "center",
    marginBottom: "28px",
    paddingTop: "8px",
  },
  title: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontWeight: 900,
    fontSize: "32px",
    letterSpacing: "-0.02em",
    margin: "0 0 4px",
    fontStyle: "italic",
  },
  subtitle: {
    fontSize: "13px",
    color: "#7a6d5c",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontFamily: "'Inconsolata', monospace",
  },
  card: {
    background: "#fffaf0",
    border: "1px solid #d9cfbc",
    borderRadius: "4px",
    padding: "18px",
    marginBottom: "14px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  cardActive: {
    background: "#fffaf0",
    border: "1px solid #1a1612",
    borderRadius: "4px",
    padding: "18px",
    marginBottom: "14px",
    boxShadow: "3px 3px 0 #1a1612",
  },
  recipeName: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontWeight: 700,
    fontSize: "20px",
    margin: "0 0 4px",
    lineHeight: 1.2,
  },
  recipeAuthor: {
    fontSize: "12px",
    color: "#7a6d5c",
    fontFamily: "'Inconsolata', monospace",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "10px",
  },
  recipeMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "10px",
  },
  tag: {
    fontSize: "11px",
    padding: "3px 8px",
    background: "#1a1612",
    color: "#f4ede0",
    borderRadius: "2px",
    fontFamily: "'Inconsolata', monospace",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  tagAlt: {
    fontSize: "11px",
    padding: "3px 8px",
    background: "transparent",
    color: "#1a1612",
    border: "1px solid #1a1612",
    borderRadius: "2px",
    fontFamily: "'Inconsolata', monospace",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  button: {
    width: "100%",
    padding: "16px",
    background: "#1a1612",
    color: "#f4ede0",
    border: "none",
    borderRadius: "4px",
    fontSize: "15px",
    fontFamily: "'Inconsolata', monospace",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    cursor: "pointer",
    marginBottom: "10px",
  },
  buttonAlt: {
    width: "100%",
    padding: "14px",
    background: "transparent",
    color: "#1a1612",
    border: "1px solid #1a1612",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "'Inconsolata', monospace",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    cursor: "pointer",
    marginBottom: "10px",
  },
  filterChip: {
    padding: "8px 14px",
    border: "1px solid #1a1612",
    background: "transparent",
    color: "#1a1612",
    borderRadius: "20px",
    fontSize: "13px",
    fontFamily: "'Inconsolata', monospace",
    cursor: "pointer",
    marginRight: "6px",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  filterChipActive: {
    padding: "8px 14px",
    border: "1px solid #1a1612",
    background: "#1a1612",
    color: "#f4ede0",
    borderRadius: "20px",
    fontSize: "13px",
    fontFamily: "'Inconsolata', monospace",
    cursor: "pointer",
    marginRight: "6px",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  sectionLabel: {
    fontSize: "11px",
    fontFamily: "'Inconsolata', monospace",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: "#7a6d5c",
    marginBottom: "10px",
    marginTop: "8px",
  },
  textarea: {
    width: "100%",
    minHeight: "180px",
    padding: "14px",
    border: "1px solid #d9cfbc",
    background: "#fffaf0",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "'Inconsolata', monospace",
    color: "#1a1612",
    resize: "vertical",
    boxSizing: "border-box",
    marginBottom: "12px",
  },
  timerWrap: {
    textAlign: "center",
    padding: "24px 0 16px",
  },
  totalTime: {
    fontFamily: "'Fraunces', serif",
    fontSize: "72px",
    fontWeight: 900,
    fontStyle: "italic",
    lineHeight: 1,
    margin: "0",
    fontVariantNumeric: "tabular-nums",
  },
  totalTimeLabel: {
    fontSize: "11px",
    fontFamily: "'Inconsolata', monospace",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: "#7a6d5c",
    marginBottom: "4px",
  },
  stageCountdown: {
    fontFamily: "'Fraunces', serif",
    fontSize: "36px",
    fontWeight: 700,
    fontStyle: "italic",
    margin: "12px 0 4px",
    fontVariantNumeric: "tabular-nums",
  },
  instructionBox: {
    background: "#1a1612",
    color: "#f4ede0",
    padding: "24px 20px",
    borderRadius: "4px",
    textAlign: "center",
    margin: "20px 0",
  },
  instructionText: {
    fontFamily: "'Fraunces', serif",
    fontSize: "26px",
    fontWeight: 700,
    lineHeight: 1.2,
    margin: 0,
  },
  pourTarget: {
    fontFamily: "'Inconsolata', monospace",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    marginTop: "10px",
    opacity: 0.8,
  },
  stageList: {
    margin: "20px 0",
  },
  stageRow: {
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px dashed #d9cfbc",
    fontFamily: "'Inconsolata', monospace",
    fontSize: "13px",
  },
  stageRowActive: {
    display: "flex",
    alignItems: "center",
    padding: "12px 10px",
    borderRadius: "4px",
    background: "#1a1612",
    color: "#f4ede0",
    margin: "4px -10px",
    fontFamily: "'Inconsolata', monospace",
    fontSize: "13px",
  },
  stageRowDone: {
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px dashed #d9cfbc",
    fontFamily: "'Inconsolata', monospace",
    fontSize: "13px",
    opacity: 0.4,
    textDecoration: "line-through",
  },
  stageTime: {
    width: "70px",
    fontWeight: 700,
  },
  stageInstr: {
    flex: 1,
  },
  progressBar: {
    height: "4px",
    background: "#d9cfbc",
    borderRadius: "2px",
    overflow: "hidden",
    margin: "12px 0",
  },
  progressFill: {
    height: "100%",
    background: "#1a1612",
    transition: "width 0.3s linear",
  },
  backLink: {
    fontFamily: "'Inconsolata', monospace",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#1a1612",
    cursor: "pointer",
    marginBottom: "16px",
    display: "inline-block",
    textDecoration: "none",
    background: "transparent",
    border: "none",
    padding: 0,
  },
  errorBox: {
    padding: "12px",
    background: "#fce8e6",
    border: "1px solid #c0392b",
    borderRadius: "4px",
    color: "#c0392b",
    fontSize: "13px",
    fontFamily: "'Inconsolata', monospace",
    marginBottom: "12px",
  },
  deleteBtn: {
    fontSize: "11px",
    color: "#c0392b",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Inconsolata', monospace",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    padding: "4px 0",
  },
  unitToggle: {
    padding: "6px 12px",
    background: "transparent",
    color: "#1a1612",
    border: "1px solid #1a1612",
    borderRadius: "20px",
    fontSize: "12px",
    fontFamily: "'Inconsolata', monospace",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.05em",
  },
  tempBadge: {
    display: "inline-block",
    padding: "10px 18px",
    background: "#b85c2e",
    color: "#fffaf0",
    borderRadius: "4px",
    fontFamily: "'Fraunces', serif",
    fontSize: "20px",
    fontWeight: 700,
    fontStyle: "italic",
    marginTop: "8px",
    fontVariantNumeric: "tabular-nums",
  },
  tempBadgeLabel: {
    fontSize: "10px",
    fontFamily: "'Inconsolata', monospace",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: "#7a6d5c",
    display: "block",
    marginBottom: "4px",
  },
  starBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "36px",
    height: "36px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "22px",
    lineHeight: 1,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#d9cfbc",
    transition: "color 0.15s ease",
  },
  starBtnActive: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "36px",
    height: "36px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "22px",
    lineHeight: 1,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#e8a93d",
  },
  cardRelative: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d9cfbc",
    background: "#fffaf0",
    borderRadius: "4px",
    fontSize: "15px",
    fontFamily: "'Inconsolata', monospace",
    color: "#1a1612",
    boxSizing: "border-box",
    marginBottom: "8px",
  },
  inputLabel: {
    fontSize: "11px",
    fontFamily: "'Inconsolata', monospace",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#7a6d5c",
    marginBottom: "4px",
    display: "block",
  },
  formRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "8px",
  },
  formCol: {
    flex: 1,
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d9cfbc",
    background: "#fffaf0",
    borderRadius: "4px",
    fontSize: "15px",
    fontFamily: "'Inconsolata', monospace",
    color: "#1a1612",
    boxSizing: "border-box",
    marginBottom: "8px",
  },
  stageEditRow: {
    display: "flex",
    gap: "6px",
    marginBottom: "6px",
    alignItems: "center",
  },
  stageEditInputTime: {
    width: "70px",
    padding: "8px",
    border: "1px solid #d9cfbc",
    background: "#fffaf0",
    borderRadius: "4px",
    fontSize: "13px",
    fontFamily: "'Inconsolata', monospace",
    boxSizing: "border-box",
    textAlign: "center",
  },
  stageEditInputG: {
    width: "60px",
    padding: "8px",
    border: "1px solid #d9cfbc",
    background: "#fffaf0",
    borderRadius: "4px",
    fontSize: "13px",
    fontFamily: "'Inconsolata', monospace",
    boxSizing: "border-box",
    textAlign: "center",
  },
  stageEditInputInstr: {
    flex: 1,
    minWidth: 0,
    padding: "8px",
    border: "1px solid #d9cfbc",
    background: "#fffaf0",
    borderRadius: "4px",
    fontSize: "13px",
    fontFamily: "'Inconsolata', monospace",
    boxSizing: "border-box",
  },
  stageRemoveBtn: {
    width: "32px",
    height: "32px",
    background: "transparent",
    border: "1px solid #c0392b",
    color: "#c0392b",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    padding: 0,
    flexShrink: 0,
  },
  starCheckRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 14px",
    background: "#fffaf0",
    border: "1px solid #d9cfbc",
    borderRadius: "4px",
    marginBottom: "12px",
    cursor: "pointer",
    userSelect: "none",
  },
  loadingNote: {
    fontSize: "12px",
    fontFamily: "'Inconsolata', monospace",
    color: "#7a6d5c",
    textAlign: "center",
    marginTop: "8px",
    fontStyle: "italic",
  },
  brewNote: {
    padding: "14px",
    background: "#fffaf0",
    border: "1px solid #d9cfbc",
    borderRadius: "4px",
    fontFamily: "'Inconsolata', monospace",
    fontSize: "13px",
    lineHeight: 1.5,
    marginTop: "16px",
    marginBottom: "16px",
  },
  brewNoteHint: {
    color: "#7a6d5c",
    marginTop: "4px",
  },
};

// ============ MAIN APP ============
export default function PourOverApp() {
  const [view, setView] = useState("home"); // home | filter | detail | brew | add
  const [customRecipes, setCustomRecipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [filters, setFilters] = useState({ dripper: null, roast: null });
  const [tempUnit, setTempUnit] = useState("C");
  const [starred, setStarred] = useState([]);
  const [brewResults, setBrewResults] = useState({});
  const [deletedRecipeIds, setDeletedRecipeIds] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    setCustomRecipes(loadCustomRecipes());
    setTempUnit(loadTempUnit());
    setStarred(loadStarred());
    setBrewResults(loadBrewResults());
    setDeletedRecipeIds(loadDeletedRecipeIds());
    // Inject fonts
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,700;1,900&family=Inconsolata:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    // Keep screen awake
    let wakeLock = null;
    const requestWakeLock = async () => {
      try {
        if (navigator.wakeLock) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch {}
    };
    requestWakeLock();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") requestWakeLock();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLock) wakeLock.release().catch(() => {});
    };
  }, []);

  const toggleTempUnit = () => {
    const next = tempUnit === "C" ? "F" : "C";
    setTempUnit(next);
    saveTempUnit(next);
  };

  const toggleStar = (id) => {
    const next = starred.includes(id)
      ? starred.filter((x) => x !== id)
      : [...starred, id];
    setStarred(next);
    saveStarred(next);
  };

  const allRecipes = useMemo(
    () => [
      ...BUILTIN_RECIPES.filter((r) => !deletedRecipeIds.includes(r.id)),
      ...customRecipes,
    ],
    [customRecipes, deletedRecipeIds]
  );

  // Split & sort: starred first (in order they were starred), then the rest
  const sortedRecipes = useMemo(() => {
    const starredList = starred
      .map((id) => allRecipes.find((r) => r.id === id))
      .filter(Boolean);
    const unstarred = allRecipes.filter((r) => !starred.includes(r.id));
    return { starred: starredList, unstarred };
  }, [allRecipes, starred]);

  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((r) => {
      if (filters.dripper && r.dripper !== filters.dripper) return false;
      if (filters.roast && r.roast !== filters.roast && r.roast !== "any")
        return false;
      return true;
    });
  }, [allRecipes, filters]);

  // Sort filtered results too — starred bubble to top
  const filteredSorted = useMemo(() => {
    const starredFiltered = starred
      .map((id) => filteredRecipes.find((r) => r.id === id))
      .filter(Boolean);
    const unstarred = filteredRecipes.filter((r) => !starred.includes(r.id));
    return [...starredFiltered, ...unstarred];
  }, [filteredRecipes, starred]);

  const selectedRecipe = useMemo(() => {
    return allRecipes.find((r) => r.id === selectedRecipeId) || null;
  }, [allRecipes, selectedRecipeId]);

  const goHome = () => {
    setView("home");
    setSelectedRecipeId(null);
  };

  const openRecipe = (id) => {
    setSelectedRecipeId(id);
    setView("detail");
  };

  const saveCustomRecipe = (recipe) => {
    const next = [...customRecipes, recipe];
    setCustomRecipes(next);
    saveCustomRecipes(next);
  };

  const deleteRecipe = (id) => {
    const recipe = allRecipes.find((r) => r.id === id);
    if (!recipe) return;
    if (!confirm(`Delete "${recipe.name}"?`)) return;

    if (recipe.custom) {
      const next = customRecipes.filter((r) => r.id !== id);
      setCustomRecipes(next);
      saveCustomRecipes(next);
    } else {
      const nextDeleted = deletedRecipeIds.includes(id)
        ? deletedRecipeIds
        : [...deletedRecipeIds, id];
      setDeletedRecipeIds(nextDeleted);
      saveDeletedRecipeIds(nextDeleted);
    }

    if (starred.includes(id)) {
      const nextStarred = starred.filter((x) => x !== id);
      setStarred(nextStarred);
      saveStarred(nextStarred);
    }
    if (brewResults[id]) {
      const { [id]: _removed, ...remainingResults } = brewResults;
      setBrewResults(remainingResults);
      saveBrewResults(remainingResults);
    }

    if (selectedRecipeId === id) {
      goHome();
    }
  };

  const saveBrewResult = (recipeId, result) => {
    const next = { ...brewResults, [recipeId]: result };
    setBrewResults(next);
    saveBrewResults(next);
  };

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        {view === "home" && (
          <HomeView
            sortedRecipes={sortedRecipes}
            starred={starred}
            onToggleStar={toggleStar}
            onOpen={openRecipe}
            onFilter={() => setView("filter")}
            onAdd={() => setView("add")}
            onDelete={deleteRecipe}
            tempUnit={tempUnit}
            onToggleUnit={toggleTempUnit}
          />
        )}
        {view === "filter" && (
          <FilterView
            filters={filters}
            setFilters={setFilters}
            recipes={filteredSorted}
            starred={starred}
            onToggleStar={toggleStar}
            onOpen={openRecipe}
            onDelete={deleteRecipe}
            onBack={goHome}
            tempUnit={tempUnit}
          />
        )}
        {view === "detail" && selectedRecipe && (
          <DetailView
            recipe={selectedRecipe}
            brewResult={brewResults[selectedRecipe.id]}
            isStarred={starred.includes(selectedRecipe.id)}
            onToggleStar={() => toggleStar(selectedRecipe.id)}
            onDelete={() => deleteRecipe(selectedRecipe.id)}
            onBrew={() => setView("brew")}
            onBack={goHome}
            tempUnit={tempUnit}
            onToggleUnit={toggleTempUnit}
          />
        )}
        {view === "brew" && selectedRecipe && (
          <BrewView
            recipe={selectedRecipe}
            brewResult={brewResults[selectedRecipe.id]}
            onSaveResult={(result) => saveBrewResult(selectedRecipe.id, result)}
            onBack={() => setView("detail")}
            tempUnit={tempUnit}
            onToggleUnit={toggleTempUnit}
          />
        )}
        {view === "add" && (
          <AddRecipeView
            onSave={(recipe, starIt) => {
              saveCustomRecipe(recipe);
              if (starIt) {
                const next = [...starred, recipe.id];
                setStarred(next);
                saveStarred(next);
              }
            }}
            onBack={goHome}
          />
        )}
      </div>
    </div>
  );
}

// ============ HOME ============
function HomeView({ sortedRecipes, starred, onToggleStar, onOpen, onFilter, onAdd, onDelete, tempUnit, onToggleUnit }) {
  const renderCard = (r) => {
    const isStarred = starred.includes(r.id);
    return (
      <div
        key={r.id}
        style={{ ...styles.card, ...styles.cardRelative }}
        onClick={() => onOpen(r.id)}
      >
        <button
          style={isStarred ? styles.starBtnActive : styles.starBtn}
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(r.id);
          }}
          aria-label={isStarred ? "Unstar recipe" : "Star recipe"}
        >
          {isStarred ? "★" : "☆"}
        </button>
        <div style={{ ...styles.recipeName, paddingRight: "40px" }}>{r.name}</div>
        <div style={styles.recipeAuthor}>
          {r.author || "Custom"} · {r.coffee}g → {r.water}g · {fmtTime(r.totalTime)} · {formatTemp(r.tempC, tempUnit)}
        </div>
        <div style={styles.recipeMeta}>
          <span style={styles.tag}>{r.dripper}</span>
          <span style={styles.tagAlt}>{r.roast} roast</span>
          {r.flavors?.map((f) => (
            <span key={f} style={styles.tagAlt}>
              {f}
            </span>
          ))}
        </div>
        <button
          style={{ ...styles.deleteBtn, marginTop: "10px" }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(r.id);
          }}
        >
          × Delete
        </button>
      </div>
    );
  };

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>Pour</h1>
        <div style={styles.subtitle}>· coffee timer ·</div>
        <div style={{ marginTop: "12px" }}>
          <button style={styles.unitToggle} onClick={onToggleUnit}>
            Display in °{tempUnit}
          </button>
        </div>
      </div>

      <button style={styles.button} onClick={onFilter}>
        Filter
      </button>
      <button style={styles.buttonAlt} onClick={onAdd}>
        + Add Recipe
      </button>

      {sortedRecipes.starred.length > 0 && (
        <>
          <div style={{ ...styles.sectionLabel, marginTop: "28px" }}>
            ★ Starred · {sortedRecipes.starred.length}
          </div>
          {sortedRecipes.starred.map(renderCard)}
        </>
      )}

      <div style={{ ...styles.sectionLabel, marginTop: "28px" }}>
        {sortedRecipes.starred.length > 0 ? "Other Recipes" : "All Recipes"} · {sortedRecipes.unstarred.length}
      </div>
      {sortedRecipes.unstarred.map(renderCard)}
    </>
  );
}

// ============ FILTER ============
function FilterView({ filters, setFilters, recipes, starred, onToggleStar, onOpen, onDelete, onBack, tempUnit }) {
  const methods = ["V60", "Kalita Wave", "Origami", "Chemex", "Aeropress", "French Press", "Switch"];
  const roasts = ["light", "medium", "dark"];

  const toggle = (key, val) => {
    setFilters({ ...filters, [key]: filters[key] === val ? null : val });
  };

  return (
    <>
      <button type="button" style={styles.backLink} onClick={onBack}>
        ← Back
      </button>
      <div style={styles.header}>
        <h1 style={{ ...styles.title, fontSize: "28px" }}>Filter</h1>
      </div>

      <div style={styles.sectionLabel}>Method</div>
      <div style={{ marginBottom: "16px" }}>
        {methods.map((d) => (
          <button
            key={d}
            style={filters.dripper === d ? styles.filterChipActive : styles.filterChip}
            onClick={() => toggle("dripper", d)}
          >
            {d}
          </button>
        ))}
      </div>

      <div style={styles.sectionLabel}>Roast Level</div>
      <div style={{ marginBottom: "16px" }}>
        {roasts.map((r) => (
          <button
            key={r}
            style={filters.roast === r ? styles.filterChipActive : styles.filterChip}
            onClick={() => toggle("roast", r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div style={styles.sectionLabel}>
        {recipes.length} {recipes.length === 1 ? "match" : "matches"}
      </div>

      {recipes.map((r) => {
        const isStarred = starred.includes(r.id);
        return (
          <div key={r.id} style={{ ...styles.card, ...styles.cardRelative }} onClick={() => onOpen(r.id)}>
            <button
              style={isStarred ? styles.starBtnActive : styles.starBtn}
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(r.id);
              }}
              aria-label={isStarred ? "Unstar recipe" : "Star recipe"}
            >
              {isStarred ? "★" : "☆"}
            </button>
            <div style={{ ...styles.recipeName, paddingRight: "40px" }}>{r.name}</div>
            <div style={styles.recipeAuthor}>
              {r.author || "Custom"} · {r.coffee}g → {r.water}g · {formatTemp(r.tempC, tempUnit)}
            </div>
            <div style={styles.recipeMeta}>
              <span style={styles.tag}>{r.dripper}</span>
              <span style={styles.tagAlt}>{r.roast}</span>
              {r.flavors?.map((f) => (
                <span key={f} style={styles.tagAlt}>{f}</span>
              ))}
            </div>
            <button
              style={{ ...styles.deleteBtn, marginTop: "10px" }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(r.id);
              }}
            >
              × Delete
            </button>
          </div>
        );
      })}
      {recipes.length === 0 && (
        <div style={{ ...styles.card, textAlign: "center", color: "#7a6d5c" }}>
          No recipes match. Try removing a filter.
        </div>
      )}
    </>
  );
}

// ============ DETAIL ============
function DetailView({ recipe, brewResult, isStarred, onToggleStar, onDelete, onBrew, onBack, tempUnit, onToggleUnit }) {
  const adjustmentHint = getBrewAdjustmentHint(brewResult);
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <button type="button" style={{ ...styles.backLink, marginBottom: 0 }} onClick={onBack}>
          ← Back
        </button>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              ...styles.unitToggle,
              color: isStarred ? "#e8a93d" : "#1a1612",
              borderColor: isStarred ? "#e8a93d" : "#1a1612",
              fontSize: "16px",
              padding: "6px 14px",
            }}
            onClick={onToggleStar}
            aria-label={isStarred ? "Unstar" : "Star"}
          >
            {isStarred ? "★" : "☆"}
          </button>
          <button style={styles.unitToggle} onClick={onToggleUnit}>
            °{tempUnit}
          </button>
        </div>
      </div>
      <h1 style={{ ...styles.title, fontSize: "28px", textAlign: "left", marginBottom: "4px" }}>
        {recipe.name}
      </h1>
      <div style={{ ...styles.recipeAuthor, marginBottom: "16px" }}>
        {recipe.author || "Custom Recipe"}
      </div>

      <div style={styles.recipeMeta}>
        <span style={styles.tag}>{recipe.dripper}</span>
        <span style={styles.tagAlt}>{recipe.roast} roast</span>
        {recipe.flavors?.map((f) => (
          <span key={f} style={styles.tagAlt}>{f}</span>
        ))}
      </div>

      {recipe.description && (
        <p
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "15px",
            lineHeight: 1.5,
            color: "#3a322a",
            marginTop: "16px",
            fontStyle: "italic",
          }}
        >
          {recipe.description}
        </p>
      )}

      <div style={styles.brewNote}>
        {brewResult ? (
          <>
            <div>
              <strong>Last brew:</strong> grind setting {brewResult.grindSetting || "not recorded"}, drawdown {fmtTime(brewResult.drawdownTime)}.
            </div>
            <div style={styles.brewNoteHint}>{adjustmentHint}</div>
          </>
        ) : (
          <div style={styles.brewNoteHint}>
            No brew notes yet. Log this brew after the timer.
          </div>
        )}
      </div>

      <div style={{ ...styles.card, cursor: "default" }}>
        <div style={styles.sectionLabel}>Recipe Specs</div>
        <div style={{ fontFamily: "'Inconsolata', monospace", fontSize: "14px", lineHeight: 1.8 }}>
          <div>Coffee: <strong>{recipe.coffee}g</strong></div>
          <div>Water: <strong>{recipe.water}g</strong></div>
          <div>Ratio: <strong>{recipe.ratio}</strong></div>
          <div>Target grind: <strong>{recipe.grind}</strong></div>
          <div>Temp: <strong>{formatTemp(recipe.tempC, tempUnit)}</strong></div>
          <div>Target time: <strong>{fmtTime(recipe.totalTime)}</strong></div>
        </div>
      </div>

      <div style={{ ...styles.sectionLabel, marginTop: "20px" }}>Stages</div>
      <div style={{ ...styles.card, cursor: "default" }}>
        {recipe.stages.map((s, i) => (
          <div key={i} style={{ ...styles.stageRow, borderBottom: i === recipe.stages.length - 1 ? "none" : "1px dashed #d9cfbc" }}>
            <div style={styles.stageTime}>{fmtTime(s.start)}</div>
            <div style={styles.stageInstr}>{s.instruction}</div>
          </div>
        ))}
      </div>

      <button style={{ ...styles.button, marginTop: "20px", padding: "20px" }} onClick={onBrew}>
        ▶ Start Brewing
      </button>
      <button style={{ ...styles.deleteBtn, marginTop: "8px" }} onClick={onDelete}>
        × Delete Recipe
      </button>
    </>
  );
}

// ============ BREW (TIMER) ============
function BrewView({ recipe, brewResult, onSaveResult, onBack, tempUnit, onToggleUnit }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const prevGrind = brewResult?.grindSetting ? String(brewResult.grindSetting) : null;
  const [grindSetting, setGrindSetting] = useState(prevGrind || "20");
  const [grindTouched, setGrindTouched] = useState(!!prevGrind);
  const lastStageRef = useRef(-1);
  const startTimeRef = useRef(null);
  const accumulatedRef = useRef(0);

  // Find current stage based on elapsed seconds
  const currentStageIdx = recipe.stages.findIndex(
    (s) => elapsed >= s.start && elapsed < s.end
  );
  const currentStage =
    currentStageIdx >= 0
      ? recipe.stages[currentStageIdx]
      : elapsed >= recipe.totalTime
      ? null
      : recipe.stages[0];

  const isDone = elapsed >= recipe.totalTime;

  // Timer tick
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const newElapsed = Math.floor((now - startTimeRef.current) / 1000) + accumulatedRef.current;
      setElapsed(newElapsed);
    }, 100);
    return () => clearInterval(interval);
  }, [running]);

  // Stage change detection - play sound/vibrate
  useEffect(() => {
    if (!running) return;
    if (currentStageIdx !== lastStageRef.current && currentStageIdx >= 0) {
      if (lastStageRef.current !== -1) {
        // Stage changed (not first stage)
        playBeep(880, 200);
        vibrate([100, 50, 100]);
      }
      lastStageRef.current = currentStageIdx;
    }
    if (isDone && lastStageRef.current !== "target") {
      playBeep(660, 400);
      setTimeout(() => playBeep(880, 400), 200);
      vibrate([200, 100, 200, 100, 400]);
      lastStageRef.current = "target";
    }
  }, [currentStageIdx, isDone, running]);

  const startTimer = () => {
    if (running) return;
    startTimeRef.current = Date.now();
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    accumulatedRef.current = 0;
    lastStageRef.current = -1;
  };

  const finishDrawdown = () => {
    setRunning(false);
    onSaveResult({
      grindSetting: grindSetting.trim(),
      drawdownTime: elapsed,
      targetTime: recipe.totalTime,
      brewedAt: new Date().toISOString(),
    });
    onBack();
  };

  // Stage countdown (time left in current stage)
  const stageTimeLeft = currentStage
    ? Math.max(0, currentStage.end - elapsed)
    : 0;

  const progressPct = Math.min(100, (elapsed / recipe.totalTime) * 100);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <button type="button" style={{ ...styles.backLink, marginBottom: 0 }} onClick={onBack}>
          ← Back to Recipe
        </button>
      </div>

      {elapsed === 0 && !running && (
        <div style={{ ...styles.card, cursor: "default" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
            <label style={{ ...styles.inputLabel, marginBottom: 0 }}>Grind setting</label>
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontStyle: "italic", fontSize: "28px", lineHeight: 1 }}>
              {grindSetting}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="30"
            value={grindSetting}
            onChange={(e) => { setGrindSetting(e.target.value); setGrindTouched(true); }}
            style={{ width: "100%", accentColor: "#1a1612", cursor: "pointer" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Inconsolata', monospace", fontSize: "11px", color: "#7a6d5c", marginTop: "4px" }}>
            <span>10</span>
            <span>30</span>
          </div>
          {!grindTouched && (
            <div style={{ fontSize: "11px", color: "#c0392b", fontFamily: "'Inconsolata', monospace", marginTop: "6px" }}>
              Move the slider to set your grind before starting.
            </div>
          )}
        </div>
      )}

      {!running && elapsed === 0 && (
        <button
          style={{
            ...styles.button,
            padding: "22px",
            fontSize: "16px",
            opacity: grindTouched ? 1 : 0.4,
            cursor: grindTouched ? "pointer" : "not-allowed",
          }}
          onClick={grindTouched ? startTimer : undefined}
        >
          ▶ Start
        </button>
      )}

      <div style={styles.timerWrap}>
        <div style={styles.totalTimeLabel}>Total</div>
        <div style={styles.totalTime}>{fmtTime(elapsed)}</div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
        </div>
        {isDone ? (
          <div style={styles.loadingNote}>
            Target: {fmtTime(recipe.totalTime)} · Actual: {fmtTime(elapsed)}
          </div>
        ) : currentStage && (
          <>
            <div style={styles.totalTimeLabel}>This Stage</div>
            <div style={styles.stageCountdown}>{fmtTime(stageTimeLeft)}</div>
          </>
        )}
      </div>

      <div style={styles.instructionBox}>
        {isDone ? (
          <>
            <p style={styles.instructionText}>Drawdown finishing?</p>
            <div style={styles.pourTarget}>
              Tap done when the bed finishes draining
            </div>
          </>
        ) : currentStage ? (
          <>
            <p style={styles.instructionText}>{currentStage.instruction}</p>
            <div style={styles.pourTarget}>
              Target: {currentStage.pourTo}g on scale
            </div>
          </>
        ) : (
          <>
            <p style={styles.instructionText}>Ready</p>
            <div style={styles.pourTarget}>Press start when scale is zeroed</div>
          </>
        )}
      </div>

      <div style={styles.stageList}>
        <div style={styles.sectionLabel}>Next Stages</div>
        {recipe.stages.map((s, i) => {
          const isActive = i === currentStageIdx && !isDone;
          const isPast = elapsed >= s.end;
          if (isPast) return null;
          return (
            <div key={i} style={isActive ? styles.stageRowActive : styles.stageRow}>
              <div style={styles.stageTime}>{fmtTime(s.start)}</div>
              <div style={styles.stageInstr}>{s.instruction}</div>
            </div>
          );
        })}
      </div>

      <button
        style={{
          ...styles.button,
          padding: "22px",
          fontSize: "16px",
          background: isDone ? "#1a1612" : "#b85c2e",
        }}
        onClick={finishDrawdown}
      >
        ✓ Done Drawdown
      </button>
      {elapsed > 0 && (
        <button style={styles.buttonAlt} onClick={reset}>
          ↺ Reset
        </button>
      )}
    </>
  );
}

// ============ ADD RECIPE ============
// Helper: parse "mm:ss" or "m:ss" or seconds to integer seconds
const parseTimeStr = (s) => {
  if (typeof s === "number") return s;
  const str = String(s).trim();
  if (str.includes(":")) {
    const [m, sec] = str.split(":");
    return (parseInt(m) || 0) * 60 + (parseInt(sec) || 0);
  }
  return parseInt(str) || 0;
};

const isValidTimeStr = (s) => {
  const str = String(s).trim();
  if (!str) return false;
  if (str.includes(":")) {
    const parts = str.split(":");
    if (parts.length !== 2) return false;
    const [m, sec] = parts;
    return /^\d+$/.test(m) && /^\d{1,2}$/.test(sec) && Number(sec) < 60;
  }
  return /^\d+$/.test(str);
};

const toPositiveNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : null;
};

const parseRatioValue = (ratio) => {
  const str = String(ratio || "").trim();
  if (!str) return null;
  const ratioMatch = str.match(/^1\s*:\s*([\d.]+)$/);
  const value = ratioMatch ? Number(ratioMatch[1]) : Number(str);
  return Number.isFinite(value) && value > 0 ? value : null;
};

const formatRatioValue = (coffee, water) => {
  const ratio = water / coffee;
  const rounded = Math.round(ratio * 10) / 10;
  return `1:${Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1)}`;
};

const createBlankRecipeForm = () => ({
  name: "",
  author: "",
  description: "",
  coffee: 20,
  water: 300,
  ratio: "1:15",
  grind: "medium",
  tempC: "93",
  totalTimeStr: "3:30",
  dripper: "V60",
  roast: "medium",
  flavors: ["sweet"],
  stages: [
    { startStr: "0:00", pourTo: 60, instruction: "Bloom and saturate grounds" },
    { startStr: "0:45", pourTo: 180, instruction: "Pour to 180g" },
    { startStr: "1:30", pourTo: 300, instruction: "Pour to 300g and let draw down" },
  ],
});

const buildRecipeFromForm = (form) => {
  const errors = [];
  const coffee = Number(form.coffee);
  const water = Number(form.water);
  const ratio = parseRatioValue(form.ratio);
  const totalTime = parseTimeStr(form.totalTimeStr);

  if (!form.name.trim()) errors.push("Recipe name is required.");
  if (!Number.isFinite(coffee) || coffee <= 0) errors.push("Coffee must be greater than 0g.");
  if (!Number.isFinite(water) || water <= 0) errors.push("Water must be greater than 0g.");
  if (!ratio) errors.push("Ratio must be a valid value like 1:16.");
  if (!isValidTimeStr(form.totalTimeStr) || totalTime <= 0) {
    errors.push("Total time must be a valid time like 3:30.");
  }
  if (!form.stages.length) errors.push("Add at least one stage.");

  const parsedStages = form.stages.map((stage, i) => {
    const start = parseTimeStr(stage.startStr);
    const pourTo = Number(stage.pourTo);
    const instruction = String(stage.instruction || "").trim();

    if (!isValidTimeStr(stage.startStr)) {
      errors.push(`Stage ${i + 1} needs a valid start time.`);
    }
    if (!Number.isFinite(pourTo) || pourTo < 0) {
      errors.push(`Stage ${i + 1} needs a water target of 0g or more.`);
    }
    if (!instruction) {
      errors.push(`Stage ${i + 1} needs an instruction.`);
    }

    return { start, pourTo, instruction };
  });

  parsedStages.forEach((stage, i) => {
    if (i > 0 && stage.start <= parsedStages[i - 1].start) {
      errors.push("Stage start times must increase from top to bottom.");
    }
    if (i > 0 && stage.pourTo < parsedStages[i - 1].pourTo) {
      errors.push("Stage water targets must stay the same or increase.");
    }
  });

  const lastStage = parsedStages[parsedStages.length - 1];
  if (lastStage && totalTime > 0 && lastStage.start >= totalTime) {
    errors.push("The last stage must start before the total target time.");
  }

  if (errors.length) return { errors };

  return {
    errors: [],
    recipe: {
      id: `custom-${Date.now()}`,
      custom: true,
      name: form.name.trim(),
      author: form.author.trim(),
      dripper: form.dripper,
      roast: form.roast,
      flavors: form.flavors,
      coffee: Math.round(coffee),
      water: Math.round(water),
      ratio: form.ratio.trim().startsWith("1:") ? form.ratio.trim() : `1:${ratio}`,
      grind: form.grind.trim() || "medium",
      tempC: form.tempC.trim() || "93",
      totalTime,
      description: form.description.trim(),
      stages: parsedStages.map((stage, i, arr) => ({
        start: stage.start,
        end: i + 1 < arr.length ? arr[i + 1].start : totalTime,
        pourTo: Math.round(stage.pourTo),
        instruction: stage.instruction,
      })),
    },
  };
};

function AddRecipeView({ onSave, onBack }) {
  const [error, setError] = useState(null);
  const [form, setForm] = useState(() => createBlankRecipeForm());
  const [starOnSave, setStarOnSave] = useState(false);

  const updateField = (key, value) => {
    const next = { ...form, [key]: value };
    const coffee = toPositiveNumber(next.coffee);

    if (key === "water") {
      const water = toPositiveNumber(value);
      if (coffee && water) {
        next.ratio = formatRatioValue(coffee, water);
      }
    }

    if (key === "ratio") {
      const ratio = parseRatioValue(value);
      if (coffee && ratio) {
        next.water = Math.round(coffee * ratio);
      }
    }

    if (key === "coffee") {
      const nextCoffee = toPositiveNumber(value);
      const ratio = parseRatioValue(next.ratio);
      const water = toPositiveNumber(next.water);
      if (nextCoffee && ratio) {
        next.water = Math.round(nextCoffee * ratio);
      } else if (nextCoffee && water) {
        next.ratio = formatRatioValue(nextCoffee, water);
      }
    }

    setForm(next);
  };

  const updateStage = (i, key, value) => {
    const next = [...form.stages];
    next[i] = { ...next[i], [key]: value };
    setForm({ ...form, stages: next });
  };

  const addStage = () => {
    const last = form.stages[form.stages.length - 1];
    const lastStart = last ? parseTimeStr(last.startStr) : 0;
    setForm({
      ...form,
      stages: [
        ...form.stages,
        { startStr: fmtTime(lastStart + 30), pourTo: form.water || 0, instruction: "" },
      ],
    });
  };

  const removeStage = (i) => {
    setForm({ ...form, stages: form.stages.filter((_, idx) => idx !== i) });
  };

  const toggleFlavor = (f) => {
    const has = form.flavors.includes(f);
    setForm({
      ...form,
      flavors: has ? form.flavors.filter((x) => x !== f) : [...form.flavors, f],
    });
  };

  const handleSave = () => {
    const { errors, recipe } = buildRecipeFromForm(form);
    if (errors.length) {
      setError(errors.join("\n"));
      return;
    }
    setError(null);
    onSave(recipe, starOnSave);
    onBack();
  };

  return (
    <>
      <button type="button" style={styles.backLink} onClick={onBack}>
        ← Back
      </button>
      <div style={styles.header}>
        <h1 style={{ ...styles.title, fontSize: "28px" }}>Add Recipe</h1>
        <div style={styles.subtitle}>manual recipe</div>
      </div>

      {error && <div style={{ ...styles.errorBox, whiteSpace: "pre-line" }}>{error}</div>}

      <div style={{ ...styles.sectionLabel, marginTop: "0" }}>
        Recipe details
      </div>

          <label style={styles.inputLabel}>Recipe Name</label>
          <input
            style={styles.input}
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />

          <label style={styles.inputLabel}>Author / Source</label>
          <input
            style={styles.input}
            value={form.author}
            onChange={(e) => updateField("author", e.target.value)}
          />

          <label style={styles.inputLabel}>Description</label>
          <textarea
            style={{ ...styles.input, minHeight: "60px", fontFamily: "'Fraunces', serif", fontSize: "14px" }}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />

          <div style={styles.formRow}>
            <div style={styles.formCol}>
              <label style={styles.inputLabel}>Coffee (g)</label>
              <input
                style={styles.input}
                type="number"
                value={form.coffee}
                onChange={(e) => updateField("coffee", e.target.value)}
              />
            </div>
            <div style={styles.formCol}>
              <label style={styles.inputLabel}>Water (g)</label>
              <input
                style={styles.input}
                type="number"
                value={form.water}
                onChange={(e) => updateField("water", e.target.value)}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formCol}>
              <label style={styles.inputLabel}>Ratio</label>
              <input
                style={styles.input}
                value={form.ratio}
                onChange={(e) => updateField("ratio", e.target.value)}
                placeholder="1:16"
              />
            </div>
            <div style={styles.formCol}>
              <label style={styles.inputLabel}>Temp (°C, e.g. 94 or 94-96)</label>
              <input
                style={styles.input}
                value={form.tempC}
                onChange={(e) => updateField("tempC", e.target.value)}
                placeholder="93-95"
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formCol}>
              <label style={styles.inputLabel}>Grind</label>
              <input
                style={styles.input}
                value={form.grind}
                onChange={(e) => updateField("grind", e.target.value)}
                placeholder="medium-fine"
              />
            </div>
            <div style={styles.formCol}>
              <label style={styles.inputLabel}>Total Time (mm:ss)</label>
              <input
                style={styles.input}
                value={form.totalTimeStr}
                onChange={(e) => updateField("totalTimeStr", e.target.value)}
                placeholder="3:30"
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formCol}>
              <label style={styles.inputLabel}>Method</label>
              <select
                style={styles.select}
                value={form.dripper}
                onChange={(e) => updateField("dripper", e.target.value)}
              >
                <option>V60</option>
                <option>Kalita Wave</option>
                <option>Origami</option>
                <option>Chemex</option>
                <option>Aeropress</option>
                <option>French Press</option>
                <option>Switch</option>
                <option>Other</option>
              </select>
            </div>
            <div style={styles.formCol}>
              <label style={styles.inputLabel}>Roast</label>
              <select
                style={styles.select}
                value={form.roast}
                onChange={(e) => updateField("roast", e.target.value)}
              >
                <option value="light">light</option>
                <option value="medium">medium</option>
                <option value="dark">dark</option>
                <option value="any">any</option>
              </select>
            </div>
          </div>

          <label style={styles.inputLabel}>Flavors (tap to toggle)</label>
          <div style={{ marginBottom: "16px" }}>
            {[
              { id: "fruity", label: "Fruity" },
              { id: "sweet", label: "Sweet" },
              { id: "rich", label: "Rich" },
              { id: "clean", label: "Clean" },
            ].map((f) => (
              <button
                key={f.id}
                style={
                  form.flavors.includes(f.id)
                    ? styles.filterChipActive
                    : styles.filterChip
                }
                onClick={() => toggleFlavor(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <label style={{ ...styles.inputLabel, marginTop: "8px" }}>
            Stages · enter start time of each, total time auto-fills the last
          </label>
          {form.stages.map((s, i) => (
            <div key={i} style={styles.stageEditRow}>
              <input
                style={styles.stageEditInputTime}
                value={s.startStr}
                onChange={(e) => updateStage(i, "startStr", e.target.value)}
                placeholder="0:00"
              />
              <input
                style={styles.stageEditInputG}
                type="number"
                value={s.pourTo}
                onChange={(e) => updateStage(i, "pourTo", e.target.value)}
                placeholder="g"
              />
              <input
                style={styles.stageEditInputInstr}
                value={s.instruction}
                onChange={(e) => updateStage(i, "instruction", e.target.value)}
                placeholder="Instruction"
              />
              <button
                style={styles.stageRemoveBtn}
                onClick={() => removeStage(i)}
                aria-label="Remove stage"
              >
                ×
              </button>
            </div>
          ))}
          <button style={{ ...styles.buttonAlt, marginTop: "4px" }} onClick={addStage}>
            + Add Stage
          </button>

          <div
            style={styles.starCheckRow}
            onClick={() => setStarOnSave(!starOnSave)}
          >
            <span
              style={{
                fontSize: "20px",
                color: starOnSave ? "#e8a93d" : "#d9cfbc",
              }}
            >
              {starOnSave ? "★" : "☆"}
            </span>
            <span
              style={{
                fontFamily: "'Inconsolata', monospace",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Star this recipe
            </span>
          </div>

          <button style={styles.button} onClick={handleSave}>
            ✓ Save Recipe
          </button>
          <button
            style={styles.buttonAlt}
            onClick={() => {
              setForm(createBlankRecipeForm());
              setError(null);
              setStarOnSave(false);
            }}
          >
            ↺ Start Over
          </button>
    </>
  );
}
