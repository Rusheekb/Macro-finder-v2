import type { MenuItem } from '../data/types'
import { macroBreakdown, scoreItem, type GoalId, type MealTargets } from './scoring'

/* ───────── Daily targets (TDEE) ───────── */

export type Sex = 'male' | 'female'
export type Activity = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
export type Objective = 'lose' | 'maintain' | 'gain'

export interface Profile {
  sex: Sex
  age: number
  heightCm: number
  weightKg: number
  activity: Activity
  objective: Objective
  mealsPerDay: number
}

export const defaultProfile: Profile = {
  sex: 'male',
  age: 28,
  heightCm: 175,
  weightKg: 78,
  activity: 'moderate',
  objective: 'maintain',
  mealsPerDay: 3,
}

export const activityMultiplier: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
}

export const activityLabels: Record<Activity, string> = {
  sedentary: 'Sedentary (desk job, little exercise)',
  light: 'Light (1–3 workouts / week)',
  moderate: 'Moderate (3–5 workouts / week)',
  active: 'Active (6–7 workouts / week)',
  'very-active': 'Very active (physical job + training)',
}

export interface DailyTargets {
  calories: number
  protein: number
  carbs: number
  fat: number
}

/** Mifflin-St Jeor basal metabolic rate. */
export function bmr(p: Profile): number {
  const base = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age
  return p.sex === 'male' ? base + 5 : base - 161
}

export function tdee(p: Profile): number {
  return bmr(p) * activityMultiplier[p.activity]
}

/**
 * Daily calorie and macro targets. Protein is set per kg of bodyweight,
 * fat as a fraction of calories, and carbs fill the remainder.
 */
export function dailyTargets(p: Profile): DailyTargets {
  const maintenance = tdee(p)
  const adjustment = p.objective === 'lose' ? -500 : p.objective === 'gain' ? 300 : 0
  const calories = Math.max(1200, Math.round(maintenance + adjustment))
  const proteinPerKg = p.objective === 'lose' ? 2.0 : p.objective === 'gain' ? 1.8 : 1.6
  const protein = Math.round(p.weightKg * proteinPerKg)
  const fat = Math.round((calories * 0.28) / 9)
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4))
  return { calories, protein, carbs, fat }
}

/** Split daily targets into a per-meal budget used by the custom goal. */
export function mealTargetsFromDaily(d: DailyTargets, mealsPerDay: number): MealTargets {
  const n = Math.max(1, mealsPerDay)
  return {
    calories: Math.round(d.calories / n),
    proteinMin: Math.round(d.protein / n),
    carbsMax: Math.round(d.carbs / n),
    fatMax: Math.round(d.fat / n),
  }
}

/* ───────── Badges & nudges ───────── */

export interface Badge {
  id: string
  label: string
  tone: 'good' | 'warn'
  title: string
}

export function badgesFor(item: MenuItem): Badge[] {
  const out: Badge[] = []
  const b = macroBreakdown(item)
  if (item.protein >= 25 && b.proteinPct >= 0.3) {
    out.push({ id: 'protein', label: 'High protein', tone: 'good', title: `${item.protein} g protein, ${Math.round(b.proteinPct * 100)}% of calories` })
  }
  if (item.carbs <= 20 && item.calories >= 100) {
    out.push({ id: 'lowcarb', label: 'Low carb', tone: 'good', title: `${item.carbs} g carbs` })
  }
  if (item.calories <= 400 && item.calories >= 100 && item.protein >= 15) {
    out.push({ id: 'light', label: 'Light & filling', tone: 'good', title: `${item.calories} kcal with ${item.protein} g protein` })
  }
  if ((item.fiber ?? 0) >= 7) {
    out.push({ id: 'fiber', label: 'Fibre rich', tone: 'good', title: `${item.fiber} g fibre` })
  }
  if (item.calories >= 900) {
    out.push({ id: 'calbomb', label: 'Calorie heavy', tone: 'warn', title: `${item.calories} kcal in one item` })
  }
  if ((item.sodium ?? 0) >= 1500) {
    out.push({ id: 'sodium', label: 'High sodium', tone: 'warn', title: `${item.sodium} mg sodium (65%+ of a 2300 mg daily limit)` })
  }
  if ((item.sugar ?? 0) >= 30) {
    out.push({ id: 'sugar', label: 'Sugar heavy', tone: 'warn', title: `${item.sugar} g sugar` })
  }
  return out
}

/**
 * Suggest a better option at the same restaurant for the active goal:
 * same category when possible, must score higher and not blow up calories.
 */
export function findSwap(item: MenuItem, all: MenuItem[], goal: GoalId, targets?: MealTargets): MenuItem | null {
  const base = scoreItem(item, goal, targets).score
  const candidates = all
    .filter((o) => o.restaurantId === item.restaurantId && o.id !== item.id)
    .filter((o) => o.category === item.category || ['Bowl', 'Salad', 'Entree', 'Sandwich', 'Wrap', 'Burger'].includes(o.category))
    .filter((o) => !['Drink', 'Dessert', 'Side'].includes(o.category) || o.category === item.category)
    .map((o) => ({ item: o, score: scoreItem(o, goal, targets).score }))
    .filter((c) => c.score >= base + 8)
    .sort((a, b) => {
      const sameCatA = a.item.category === item.category ? 1 : 0
      const sameCatB = b.item.category === item.category ? 1 : 0
      return sameCatB - sameCatA || b.score - a.score
    })
  return candidates[0]?.item ?? null
}

/* ───────── Totals ───────── */

export interface Totals {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
}

export function sumItems(items: { item: MenuItem; qty: number }[]): Totals {
  return items.reduce<Totals>(
    (acc, { item, qty }) => ({
      calories: acc.calories + item.calories * qty,
      protein: acc.protein + item.protein * qty,
      carbs: acc.carbs + item.carbs * qty,
      fat: acc.fat + item.fat * qty,
      fiber: acc.fiber + (item.fiber ?? 0) * qty,
      sugar: acc.sugar + (item.sugar ?? 0) * qty,
      sodium: acc.sodium + (item.sodium ?? 0) * qty,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 },
  )
}
