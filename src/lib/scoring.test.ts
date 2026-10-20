import { describe, expect, it } from 'vitest'
import { menuItems } from '../data/menu'
import { restaurants } from '../data/restaurants'
import { badgesFor, dailyTargets, defaultProfile, findSwap, mealTargetsFromDaily, sumItems } from './nutrition'
import { goals, macroBreakdown, scoreAll, scoreItem, type GoalId } from './scoring'

const byId = (id: string) => {
  const item = menuItems.find((i) => i.id === id)
  if (!item) throw new Error(`missing item ${id}`)
  return item
}

describe('dataset integrity', () => {
  it('has unique ids and known restaurants', () => {
    const ids = new Set<string>()
    const restaurantIds = new Set(restaurants.map((r) => r.id))
    for (const item of menuItems) {
      expect(ids.has(item.id), `duplicate id ${item.id}`).toBe(false)
      ids.add(item.id)
      expect(restaurantIds.has(item.restaurantId), `unknown restaurant for ${item.id}`).toBe(true)
    }
  })

  it('has macros that roughly agree with calories', () => {
    for (const item of menuItems) {
      if (item.calories < 60) continue
      const fromMacros = item.protein * 4 + item.carbs * 4 + item.fat * 9
      const ratio = fromMacros / item.calories
      expect(ratio, `${item.id}: ${fromMacros} kcal from macros vs ${item.calories} listed`).toBeGreaterThan(0.75)
      expect(ratio, `${item.id}: ${fromMacros} kcal from macros vs ${item.calories} listed`).toBeLessThan(1.3)
    }
  })

  it('every restaurant has at least five items', () => {
    for (const r of restaurants) {
      const count = menuItems.filter((i) => i.restaurantId === r.id).length
      expect(count, r.name).toBeGreaterThanOrEqual(5)
    }
  })
})

describe('macroBreakdown', () => {
  it('computes calorie fractions', () => {
    const b = macroBreakdown({ calories: 400, protein: 30, carbs: 40, fat: 10 })
    expect(b.proteinPct).toBeCloseTo(120 / 370)
    expect(b.carbPct).toBeCloseTo(160 / 370)
    expect(b.fatPct).toBeCloseTo(90 / 370)
    expect(b.proteinPer100).toBeCloseTo(7.5)
  })
})

describe('scoreItem', () => {
  it('returns 0..100 for every item and goal', () => {
    for (const goal of goals) {
      for (const item of menuItems) {
        const { score } = scoreItem(item, goal.id)
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      }
    }
  })

  it('ranks grilled nuggets above fries for high protein', () => {
    const nuggets = scoreItem(byId('chickfila:grilled-nuggets-12-ct'), 'high-protein').score
    const fries = scoreItem(byId('chickfila:waffle-potato-fries-medium'), 'high-protein').score
    expect(nuggets).toBeGreaterThan(fries)
  })

  it('ranks protein-style burgers above bunned burgers for low carb', () => {
    const protein = scoreItem(byId('innout:protein-style-double-double'), 'low-carb').score
    const bun = scoreItem(byId('innout:double-double'), 'low-carb').score
    expect(protein).toBeGreaterThan(bun)
  })

  it('penalises calorie-heavy items when cutting', () => {
    const alfredo = scoreItem(byId('olivegarden:chicken-alfredo'), 'cut').score
    const salmon = scoreItem(byId('olivegarden:herb-grilled-salmon'), 'cut').score
    expect(salmon).toBeGreaterThan(alfredo)
    expect(alfredo).toBeLessThan(35)
  })

  it('rewards calorie-dense protein when bulking', () => {
    const dbl = scoreItem(byId('mcdonalds:double-quarter-pounder-with-cheese'), 'bulk').score
    const apples = scoreItem(byId('mcdonalds:apple-slices'), 'bulk').score
    expect(dbl).toBeGreaterThan(apples)
  })

  it('custom goal gives full marks when all targets are met', () => {
    const item = byId('chickfila:grilled-nuggets-12-ct')
    const { score } = scoreItem(item, 'custom', { calories: 600, proteinMin: 30, carbsMax: 50, fatMax: 25 })
    expect(score).toBe(100)
  })

  it('custom goal penalises exceeding the calorie cap', () => {
    const item = byId('fiveguys:bacon-cheeseburger')
    const { score, components } = scoreItem(item, 'custom', { calories: 500, proteinMin: 30, carbsMax: 50, fatMax: 25 })
    expect(score).toBeLessThan(70)
    expect(components.find((c) => c.key === 'calories')?.value).toBeLessThan(1)
  })
})

describe('scoreAll', () => {
  it('sorts descending by score', () => {
    const goalIds: GoalId[] = ['high-protein', 'cut']
    for (const goal of goalIds) {
      const ranked = scoreAll(menuItems, goal)
      for (let i = 1; i < ranked.length; i++) {
        expect(ranked[i - 1].score).toBeGreaterThanOrEqual(ranked[i].score)
      }
    }
  })
})

describe('nutrition helpers', () => {
  it('computes daily targets with Mifflin-St Jeor', () => {
    const t = dailyTargets(defaultProfile)
    // BMR = 10*78 + 6.25*175 - 5*28 + 5 = 1738.75; TDEE = 1738.75 * 1.55 = 2695
    expect(t.calories).toBe(2695)
    expect(t.protein).toBe(Math.round(78 * 1.6))
    expect(t.protein * 4 + t.carbs * 4 + t.fat * 9).toBeLessThanOrEqual(t.calories + 4)
  })

  it('splits daily targets across meals', () => {
    const m = mealTargetsFromDaily({ calories: 2100, protein: 150, carbs: 210, fat: 70 }, 3)
    expect(m).toEqual({ calories: 700, proteinMin: 50, carbsMax: 70, fatMax: 23 })
  })

  it('badges flag high protein and high sodium', () => {
    const ids = badgesFor(byId('chickfila:chicken-nuggets-12-ct')).map((b) => b.id)
    expect(ids).toContain('protein')
    expect(ids).toContain('sodium')
  })

  it('finds a healthier swap at the same restaurant', () => {
    const swap = findSwap(byId('mcdonalds:big-mac'), menuItems, 'cut')
    expect(swap).not.toBeNull()
    expect(swap?.restaurantId).toBe('mcdonalds')
    expect(scoreItem(swap!, 'cut').score).toBeGreaterThan(scoreItem(byId('mcdonalds:big-mac'), 'cut').score)
  })

  it('sums a meal with quantities', () => {
    const totals = sumItems([
      { item: byId('tacobell:crunchy-taco'), qty: 2 },
      { item: byId('tacobell:black-beans'), qty: 1 },
    ])
    expect(totals.calories).toBe(170 * 2 + 50)
    expect(totals.protein).toBe(8 * 2 + 3)
  })
})
