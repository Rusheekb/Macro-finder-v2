import type { MenuItem } from '../data/types'

export type GoalId = 'high-protein' | 'low-carb' | 'cut' | 'balanced' | 'bulk' | 'custom'

export interface GoalDef {
  id: GoalId
  label: string
  short: string
  description: string
  emoji: string
}

export const goals: GoalDef[] = [
  {
    id: 'high-protein',
    label: 'High protein',
    short: 'Protein',
    emoji: '💪',
    description: 'Most protein per calorie. Great for muscle retention and staying full.',
  },
  {
    id: 'low-carb',
    label: 'Low carb',
    short: 'Low carb',
    emoji: '🥑',
    description: 'Keeps carbs low while favouring protein-rich picks. Keto-friendly leaning.',
  },
  {
    id: 'cut',
    label: 'Cutting',
    short: 'Cut',
    emoji: '🔥',
    description: 'Fewest calories that still deliver protein and fibre so you stay satisfied.',
  },
  {
    id: 'balanced',
    label: 'Balanced',
    short: 'Balanced',
    emoji: '⚖️',
    description: 'Close to a 30 / 40 / 30 protein-carb-fat split with moderate calories.',
  },
  {
    id: 'bulk',
    label: 'Bulking',
    short: 'Bulk',
    emoji: '🏋️',
    description: 'Calorie-dense meals that still bring lots of protein for muscle gain.',
  },
  {
    id: 'custom',
    label: 'Custom targets',
    short: 'Custom',
    emoji: '🎯',
    description: 'Score against your own per-meal calorie cap and macro limits.',
  },
]

export const goalById: Record<GoalId, GoalDef> = Object.fromEntries(goals.map((g) => [g.id, g])) as Record<
  GoalId,
  GoalDef
>

/** Per-meal targets used by the custom goal and by the "fits your budget" readout. */
export interface MealTargets {
  calories: number
  proteinMin: number
  carbsMax: number
  fatMax: number
}

export const defaultMealTargets: MealTargets = {
  calories: 650,
  proteinMin: 35,
  carbsMax: 60,
  fatMax: 25,
}

export interface MacroBreakdown {
  /** fraction of calories from each macro, 0..1 */
  proteinPct: number
  carbPct: number
  fatPct: number
  /** grams of protein per 100 kcal */
  proteinPer100: number
}

export function macroBreakdown(item: Pick<MenuItem, 'calories' | 'protein' | 'carbs' | 'fat'>): MacroBreakdown {
  const pCal = item.protein * 4
  const cCal = item.carbs * 4
  const fCal = item.fat * 9
  const total = Math.max(pCal + cCal + fCal, 1)
  return {
    proteinPct: pCal / total,
    carbPct: cCal / total,
    fatPct: fCal / total,
    proteinPer100: item.calories > 0 ? (item.protein / item.calories) * 100 : 0,
  }
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/** 1 inside [lo, hi]; linear decay to 0 over `falloff` kcal outside. */
function bandScore(value: number, lo: number, hi: number, falloff: number): number {
  if (value < lo) return clamp01(1 - (lo - value) / falloff)
  if (value > hi) return clamp01(1 - (value - hi) / falloff)
  return 1
}

/** Lower is better: 1 at or below `best`, 0 at or above `worst`. */
function lowerBetter(value: number, best: number, worst: number): number {
  return clamp01(1 - (value - best) / (worst - best))
}

/** Higher is better: 0 at or below `floor`, 1 at or above `ceil`. */
function higherBetter(value: number, floor: number, ceil: number): number {
  return clamp01((value - floor) / (ceil - floor))
}

export interface ScoreComponent {
  key: string
  label: string
  weight: number
  /** 0..1 */
  value: number
}

export interface ScoreResult {
  /** 0..100 */
  score: number
  components: ScoreComponent[]
}

interface Signals {
  proteinDensity: number
  proteinAbs: number
  fiber: number
  sodium: number
  sugar: number
  split: (p: number, c: number, f: number) => number
}

function signals(item: MenuItem): Signals {
  const b = macroBreakdown(item)
  return {
    // 10 g protein per 100 kcal (40% of calories) is about as lean as menu food gets
    proteinDensity: higherBetter(b.proteinPer100, 1, 10),
    proteinAbs: higherBetter(item.protein, 5, 45),
    fiber: higherBetter(item.fiber ?? 0, 0, 10),
    sodium: lowerBetter(item.sodium ?? 800, 500, 2300),
    sugar: lowerBetter(item.sugar ?? 5, 8, 50),
    split: (p, c, f) => {
      const distance = Math.abs(b.proteinPct - p) + Math.abs(b.carbPct - c) + Math.abs(b.fatPct - f)
      return clamp01(1 - distance / 1.2)
    },
  }
}

function comp(key: string, label: string, weight: number, value: number): ScoreComponent {
  return { key, label, weight, value: clamp01(value) }
}

/**
 * Score a menu item for a goal. Returns 0..100 and the weighted components
 * used, so the UI can explain *why* an item ranks where it does.
 */
export function scoreItem(item: MenuItem, goal: GoalId, targets: MealTargets = defaultMealTargets): ScoreResult {
  const s = signals(item)
  let components: ScoreComponent[]

  switch (goal) {
    case 'high-protein':
      components = [
        comp('density', 'Protein per calorie', 0.45, s.proteinDensity),
        comp('protein', 'Total protein', 0.25, s.proteinAbs),
        comp('calories', 'Sensible calories', 0.15, bandScore(item.calories, 250, 750, 500)),
        comp('sodium', 'Sodium', 0.08, s.sodium),
        comp('sugar', 'Added sugar', 0.07, s.sugar),
      ]
      break
    case 'low-carb':
      components = [
        comp('carbs', 'Low carbs', 0.45, lowerBetter(item.carbs, 10, 60)),
        comp('density', 'Protein per calorie', 0.25, s.proteinDensity),
        comp('calories', 'Sensible calories', 0.15, bandScore(item.calories, 200, 700, 500)),
        comp('sodium', 'Sodium', 0.08, s.sodium),
        comp('fiber', 'Fibre', 0.07, s.fiber),
      ]
      break
    case 'cut':
      components = [
        comp('calories', 'Low calories', 0.4, lowerBetter(item.calories, 150, 800)),
        comp('density', 'Protein per calorie', 0.3, s.proteinDensity),
        comp('fiber', 'Fibre (satiety)', 0.1, s.fiber),
        comp('sugar', 'Added sugar', 0.1, s.sugar),
        comp('sodium', 'Sodium', 0.1, s.sodium),
      ]
      break
    case 'balanced':
      components = [
        comp('split', '30/40/30 macro split', 0.4, s.split(0.3, 0.4, 0.3)),
        comp('calories', 'Moderate calories', 0.25, bandScore(item.calories, 350, 700, 400)),
        comp('fiber', 'Fibre', 0.15, s.fiber),
        comp('sodium', 'Sodium', 0.1, s.sodium),
        comp('sugar', 'Added sugar', 0.1, s.sugar),
      ]
      break
    case 'bulk':
      components = [
        comp('protein', 'Total protein', 0.35, s.proteinAbs),
        comp('calories', 'Calorie dense', 0.3, bandScore(item.calories, 600, 1000, 500)),
        comp('density', 'Protein per calorie', 0.2, higherBetter(macroBreakdown(item).proteinPer100, 1, 7)),
        comp('sugar', 'Added sugar', 0.07, s.sugar),
        comp('sodium', 'Sodium', 0.08, s.sodium),
      ]
      break
    case 'custom': {
      const calFit = item.calories <= targets.calories ? 1 : lowerBetter(item.calories, targets.calories, targets.calories * 1.6)
      const protFit =
        item.protein >= targets.proteinMin ? 1 : higherBetter(item.protein, targets.proteinMin * 0.3, targets.proteinMin)
      const carbFit = item.carbs <= targets.carbsMax ? 1 : lowerBetter(item.carbs, targets.carbsMax, targets.carbsMax * 2)
      const fatFit = item.fat <= targets.fatMax ? 1 : lowerBetter(item.fat, targets.fatMax, targets.fatMax * 2)
      components = [
        comp('calories', `Under ${targets.calories} kcal`, 0.3, calFit),
        comp('protein', `At least ${targets.proteinMin} g protein`, 0.3, protFit),
        comp('carbs', `Under ${targets.carbsMax} g carbs`, 0.2, carbFit),
        comp('fat', `Under ${targets.fatMax} g fat`, 0.2, fatFit),
      ]
      break
    }
  }

  const totalWeight = components.reduce((a, c) => a + c.weight, 0)
  const raw = components.reduce((a, c) => a + c.weight * c.value, 0) / totalWeight
  return { score: Math.round(raw * 100), components }
}

export type ScoredItem = MenuItem & { score: number; components: ScoreComponent[] }

export function scoreAll(items: MenuItem[], goal: GoalId, targets?: MealTargets): ScoredItem[] {
  return items
    .map((item) => ({ ...item, ...scoreItem(item, goal, targets) }))
    .sort((a, b) => b.score - a.score || a.calories - b.calories)
}

export function scoreBand(score: number): 'great' | 'good' | 'ok' | 'poor' {
  if (score >= 75) return 'great'
  if (score >= 55) return 'good'
  if (score >= 35) return 'ok'
  return 'poor'
}
