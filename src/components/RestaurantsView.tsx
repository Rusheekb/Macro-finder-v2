import { restaurants } from '../data/restaurants'
import type { MenuItem } from '../data/types'
import { goalById, scoreAll, type GoalId, type MealTargets } from '../lib/scoring'
import { ScoreRing } from './ScoreRing'

interface Props {
  items: MenuItem[]
  goal: GoalId
  targets: MealTargets
  onPick: (restaurantId: string) => void
  onToggleCompare: (id: string) => void
  compareIds: string[]
}

export function RestaurantsView({ items, goal, targets, onPick, onToggleCompare, compareIds }: Props) {
  const cards = restaurants
    .map((r) => {
      const mine = items.filter((i) => i.restaurantId === r.id && !['Drink', 'Dessert', 'Side'].includes(i.category))
      const ranked = scoreAll(mine, goal, targets)
      const avg = ranked.length ? Math.round(ranked.reduce((a, b) => a + b.score, 0) / ranked.length) : 0
      return { r, ranked, avg, top: ranked.slice(0, 3) }
    })
    .sort((a, b) => (b.top[0]?.score ?? 0) - (a.top[0]?.score ?? 0))

  return (
    <div className="restaurants">
      <div className="view-head">
        <div>
          <h2>Best picks by restaurant</h2>
          <p className="muted">
            Ranked by each chain's single best item for <strong>{goalById[goal].label}</strong>. The average tells you how forgiving a menu is overall.
          </p>
        </div>
      </div>
      <div className="restaurant-grid">
        {cards.map(({ r, top, avg, ranked }) => (
          <section className="restaurant-card" key={r.id} style={{ ['--chip' as string]: r.color }}>
            <header>
              <div>
                <h3>{r.name}</h3>
                <span className="muted small">{r.cuisine} · {ranked.length} mains · avg score {avg}</span>
              </div>
              <ScoreRing score={top[0]?.score ?? 0} size={48} />
            </header>
            <ol className="top-list">
              {top.map((t) => (
                <li key={t.id}>
                  <button
                    className={`top-item${compareIds.includes(t.id) ? ' on' : ''}`}
                    onClick={() => onToggleCompare(t.id)}
                    title={compareIds.includes(t.id) ? 'Remove from compare' : 'Add to compare'}
                  >
                    <span className="top-name">{t.name}</span>
                    <span className="top-macros">{t.calories} kcal · {t.protein}P · {t.carbs}C · {t.fat}F</span>
                    <span className="top-score">{t.score}</span>
                  </button>
                </li>
              ))}
            </ol>
            <button className="btn btn-link" onClick={() => onPick(r.id)}>See full menu →</button>
          </section>
        ))}
      </div>
    </div>
  )
}
