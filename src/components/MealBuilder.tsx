import { restaurantById } from '../data/restaurants'
import type { MenuItem } from '../data/types'
import { sumItems, type DailyTargets } from '../lib/nutrition'
import type { MealTargets } from '../lib/scoring'

export interface MealEntry {
  id: string
  qty: number
}

interface Props {
  entries: { item: MenuItem; qty: number }[]
  targets: MealTargets
  daily: DailyTargets
  onQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
  onClear: () => void
  onBrowse: () => void
}

function Progress({ label, value, max, unit, mode }: { label: string; value: number; max: number; unit: string; mode: 'max' | 'min' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const over = mode === 'max' && value > max
  const under = mode === 'min' && value < max
  const tone = over ? 'over' : mode === 'min' ? (under ? 'under' : 'met') : pct > 90 ? 'near' : 'ok'
  return (
    <div className={`progress ${tone}`}>
      <div className="progress-label">
        <span>{label}</span>
        <span>
          <strong>{Math.round(value)}</strong> / {max} {unit}
          {over && <em> · over by {Math.round(value - max)}</em>}
          {mode === 'min' && under && <em> · {Math.round(max - value)} to go</em>}
        </span>
      </div>
      <div className="progress-track"><span style={{ width: `${pct}%` }} /></div>
    </div>
  )
}

export function MealBuilder({ entries, targets, daily, onQty, onRemove, onClear, onBrowse }: Props) {
  const totals = sumItems(entries)
  const empty = entries.length === 0

  return (
    <div className="meal">
      <div className="view-head">
        <div>
          <h2>Meal builder</h2>
          <p className="muted">Stack items from one or more restaurants and see how the whole meal fits your budget.</p>
        </div>
        {!empty && <button className="btn btn-ghost" onClick={onClear}>Clear meal</button>}
      </div>

      <div className="meal-layout">
        <div className="meal-list">
          {empty ? (
            <div className="empty small-empty">
              <p>No items yet. Use <strong>+ Meal</strong> on any item.</p>
              <button className="btn btn-primary" onClick={onBrowse}>Find items</button>
            </div>
          ) : (
            entries.map(({ item, qty }) => {
              const r = restaurantById[item.restaurantId]
              return (
                <div className="meal-row" key={item.id}>
                  <div className="meal-row-title">
                    <span className="restaurant-chip" style={{ ['--chip' as string]: r.color }}>{r.name}</span>
                    <strong>{item.name}</strong>
                    <span className="muted small">
                      {item.calories * qty} kcal · {item.protein * qty}P / {item.carbs * qty}C / {item.fat * qty}F
                    </span>
                  </div>
                  <div className="qty">
                    <button className="btn btn-ghost btn-sm" onClick={() => onQty(item.id, qty - 1)} aria-label="Decrease quantity">−</button>
                    <span>{qty}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => onQty(item.id, qty + 1)} aria-label="Increase quantity">+</button>
                    <button className="btn btn-link btn-sm" onClick={() => onRemove(item.id)}>Remove</button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <aside className="meal-summary">
          <h3>This meal vs. your per-meal budget</h3>
          <Progress label="Calories" value={totals.calories} max={targets.calories} unit="kcal" mode="max" />
          <Progress label="Protein" value={totals.protein} max={targets.proteinMin} unit="g" mode="min" />
          <Progress label="Carbs" value={totals.carbs} max={targets.carbsMax} unit="g" mode="max" />
          <Progress label="Fat" value={totals.fat} max={targets.fatMax} unit="g" mode="max" />

          <h3>Share of your day</h3>
          <div className="day-share">
            <div><strong>{daily.calories ? Math.round((totals.calories / daily.calories) * 100) : 0}%</strong><span>of {daily.calories} kcal</span></div>
            <div><strong>{daily.protein ? Math.round((totals.protein / daily.protein) * 100) : 0}%</strong><span>of {daily.protein} g protein</span></div>
            <div><strong>{Math.round(totals.sodium)}</strong><span>mg sodium ({Math.round((totals.sodium / 2300) * 100)}% of 2300)</span></div>
            <div><strong>{Math.round(totals.fiber)} g</strong><span>fibre</span></div>
          </div>
          {!empty && totals.calories > targets.calories && (
            <p className="nudge warn">
              This meal is over budget by {Math.round(totals.calories - targets.calories)} kcal. Try dropping a side or swapping to a lighter main.
            </p>
          )}
          {!empty && totals.protein >= targets.proteinMin && totals.calories <= targets.calories && (
            <p className="nudge good">Nice. Protein target met within your calorie budget.</p>
          )}
        </aside>
      </div>
    </div>
  )
}
