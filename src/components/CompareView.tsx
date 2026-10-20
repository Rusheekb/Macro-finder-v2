import { restaurantById } from '../data/restaurants'
import type { MenuItem } from '../data/types'
import { macroBreakdown, type GoalId, type MealTargets, scoreItem } from '../lib/scoring'
import { goalById } from '../lib/scoring'
import { MacroBar } from './MacroBar'
import { ScoreRing } from './ScoreRing'

interface Props {
  items: MenuItem[]
  goal: GoalId
  targets: MealTargets
  onRemove: (id: string) => void
  onClear: () => void
  onAddToMeal: (id: string) => void
  onBrowse: () => void
}

type Row = {
  label: string
  value: (i: MenuItem) => number | undefined
  format: (n: number) => string
  /** 'high' = higher is better, 'low' = lower is better, null = no highlight */
  better: 'high' | 'low' | null
}

export function CompareView({ items, goal, targets, onRemove, onClear, onAddToMeal, onBrowse }: Props) {
  if (items.length === 0) {
    return (
      <div className="empty">
        <h2>Nothing to compare yet</h2>
        <p>Tap <strong>+ Compare</strong> on up to four items in the Find tab to see them side by side.</p>
        <button className="btn btn-primary" onClick={onBrowse}>Browse items</button>
      </div>
    )
  }

  const scored = items.map((i) => ({ item: i, score: scoreItem(i, goal, targets).score }))
  const lowCarb = goal === 'low-carb'
  const cutting = goal === 'cut'
  const bulking = goal === 'bulk'

  const rows: Row[] = [
    { label: `Score (${goalById[goal].label})`, value: (i) => scoreItem(i, goal, targets).score, format: (n) => `${n}`, better: 'high' },
    { label: 'Calories', value: (i) => i.calories, format: (n) => `${n} kcal`, better: bulking ? 'high' : cutting ? 'low' : null },
    { label: 'Protein', value: (i) => i.protein, format: (n) => `${n} g`, better: 'high' },
    { label: 'Carbs', value: (i) => i.carbs, format: (n) => `${n} g`, better: lowCarb ? 'low' : null },
    { label: 'Fat', value: (i) => i.fat, format: (n) => `${n} g`, better: cutting ? 'low' : null },
    { label: 'Fibre', value: (i) => i.fiber, format: (n) => `${n} g`, better: 'high' },
    { label: 'Sugar', value: (i) => i.sugar, format: (n) => `${n} g`, better: 'low' },
    { label: 'Sodium', value: (i) => i.sodium, format: (n) => `${n} mg`, better: 'low' },
    { label: 'Protein / 100 kcal', value: (i) => macroBreakdown(i).proteinPer100, format: (n) => `${n.toFixed(1)} g`, better: 'high' },
    { label: 'Protein share', value: (i) => macroBreakdown(i).proteinPct * 100, format: (n) => `${Math.round(n)}%`, better: 'high' },
  ]

  const bestIndex = (row: Row): number => {
    if (!row.better) return -1
    const values = items.map((i) => row.value(i))
    let best = -1
    values.forEach((v, idx) => {
      if (v == null) return
      if (best === -1) best = idx
      else {
        const bv = values[best] as number
        if ((row.better === 'high' && v > bv) || (row.better === 'low' && v < bv)) best = idx
      }
    })
    const distinct = new Set(values.filter((v) => v != null)).size
    return distinct > 1 ? best : -1
  }

  const winner = scored.reduce((a, b) => (b.score > a.score ? b : a))

  return (
    <div className="compare">
      <div className="view-head">
        <div>
          <h2>Compare</h2>
          <p className="muted">
            Best fit for <strong>{goalById[goal].label}</strong>: <strong>{winner.item.name}</strong> from{' '}
            {restaurantById[winner.item.restaurantId].name} (score {winner.score}).
          </p>
        </div>
        <button className="btn btn-ghost" onClick={onClear}>Clear all</button>
      </div>

      <div className="compare-scroll">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col" className="row-label" />
              {items.map((i) => {
                const r = restaurantById[i.restaurantId]
                const s = scored.find((x) => x.item.id === i.id)?.score ?? 0
                return (
                  <th scope="col" key={i.id} className={i.id === winner.item.id ? 'winner' : ''}>
                    <div className="compare-head">
                      <span className="restaurant-chip" style={{ ['--chip' as string]: r.color }}>{r.name}</span>
                      <strong>{i.name}</strong>
                      <ScoreRing score={s} size={48} />
                      <MacroBar protein={i.protein} carbs={i.carbs} fat={i.fat} calories={i.calories} showLabels />
                      <div className="compare-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => onAddToMeal(i.id)}>+ Meal</button>
                        <button className="btn btn-link btn-sm" onClick={() => onRemove(i.id)}>Remove</button>
                      </div>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const best = bestIndex(row)
              return (
                <tr key={row.label}>
                  <th scope="row" className="row-label">{row.label}</th>
                  {items.map((i, idx) => {
                    const v = row.value(i)
                    return (
                      <td key={i.id} className={idx === best ? 'best' : ''}>
                        {v == null ? '–' : row.format(v)}
                        {idx === best && <span className="sr-only"> (best)</span>}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="muted small">Highlighted cells mark the best value in each row for your current goal.</p>
    </div>
  )
}
