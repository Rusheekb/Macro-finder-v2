import { useState } from 'react'
import { restaurantById } from '../data/restaurants'
import type { MenuItem } from '../data/types'
import { badgesFor } from '../lib/nutrition'
import type { ScoreComponent } from '../lib/scoring'
import { MacroBar } from './MacroBar'
import { ScoreRing } from './ScoreRing'

interface Props {
  item: MenuItem
  score: number
  components: ScoreComponent[]
  swap?: MenuItem | null
  swapScore?: number
  inCompare: boolean
  compareFull: boolean
  onToggleCompare: (id: string) => void
  onAddToMeal: (id: string) => void
  onSelectSwap?: (id: string) => void
  /** Per-meal calorie budget, used to show "% of your meal". */
  mealCalories?: number
  rank?: number
}

export function ItemCard({
  item,
  score,
  components,
  swap,
  swapScore,
  inCompare,
  compareFull,
  onToggleCompare,
  onAddToMeal,
  onSelectSwap,
  mealCalories,
  rank,
}: Props) {
  const [open, setOpen] = useState(false)
  const r = restaurantById[item.restaurantId]
  const badges = badgesFor(item)
  const pct = mealCalories ? Math.round((item.calories / mealCalories) * 100) : null

  return (
    <article className={`item-card${inCompare ? ' in-compare' : ''}`}>
      <div className="item-card-main">
        <div className="item-card-head">
          {rank != null && <span className="rank">#{rank}</span>}
          <div className="item-title">
            <span className="restaurant-chip" style={{ ['--chip' as string]: r.color }}>
              {r.name}
            </span>
            <h3>{item.name}</h3>
            {item.note && <p className="item-note">{item.note}</p>}
          </div>
          <ScoreRing score={score} />
        </div>

        <div className="macro-grid">
          <div className="macro-cell cal">
            <strong>{item.calories}</strong>
            <span>kcal</span>
          </div>
          <div className="macro-cell protein">
            <strong>{item.protein}g</strong>
            <span>protein</span>
          </div>
          <div className="macro-cell carbs">
            <strong>{item.carbs}g</strong>
            <span>carbs</span>
          </div>
          <div className="macro-cell fat">
            <strong>{item.fat}g</strong>
            <span>fat</span>
          </div>
        </div>
        <MacroBar protein={item.protein} carbs={item.carbs} fat={item.fat} calories={item.calories} />

        {(badges.length > 0 || pct != null) && (
          <div className="badge-row">
            {pct != null && (
              <span className={`badge ${pct > 100 ? 'warn' : 'neutral'}`} title="Share of your per-meal calorie budget">
                {pct}% of meal budget
              </span>
            )}
            {badges.map((b) => (
              <span key={b.id} className={`badge ${b.tone}`} title={b.title}>
                {b.label}
              </span>
            ))}
          </div>
        )}

        {swap && (
          <button className="swap-hint" onClick={() => onSelectSwap?.(swap.id)} title="Jump to this item">
            <span className="swap-arrow" aria-hidden="true">↗</span>
            <span>
              Better pick here: <strong>{swap.name}</strong> ({swap.calories} kcal, {swap.protein} g protein
              {swapScore != null ? `, score ${swapScore}` : ''})
            </span>
          </button>
        )}

        <div className="item-actions">
          <button
            className={`btn ${inCompare ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onToggleCompare(item.id)}
            disabled={!inCompare && compareFull}
            title={!inCompare && compareFull ? 'Compare list is full (4 items)' : undefined}
          >
            {inCompare ? '✓ Comparing' : '+ Compare'}
          </button>
          <button className="btn btn-ghost" onClick={() => onAddToMeal(item.id)}>
            + Meal
          </button>
          <button className="btn btn-link" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            {open ? 'Hide details' : 'Why this score?'}
          </button>
        </div>

        {open && (
          <div className="details">
            <ul className="score-breakdown">
              {components.map((c) => (
                <li key={c.key}>
                  <span className="sb-label">{c.label}</span>
                  <span className="sb-bar">
                    <span style={{ width: `${Math.round(c.value * 100)}%` }} />
                  </span>
                  <span className="sb-value">
                    {Math.round(c.value * 100)} <small>× {Math.round(c.weight * 100)}%</small>
                  </span>
                </li>
              ))}
            </ul>
            <dl className="micro">
              <div><dt>Fibre</dt><dd>{item.fiber ?? '–'} g</dd></div>
              <div><dt>Sugar</dt><dd>{item.sugar ?? '–'} g</dd></div>
              <div><dt>Sodium</dt><dd>{item.sodium ?? '–'} mg</dd></div>
              <div><dt>Protein / 100 kcal</dt><dd>{item.calories ? ((item.protein / item.calories) * 100).toFixed(1) : '–'} g</dd></div>
            </dl>
          </div>
        )}
      </div>
    </article>
  )
}
