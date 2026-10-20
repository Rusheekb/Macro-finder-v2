import { useEffect, useMemo, useState } from 'react'
import { CompareView } from './components/CompareView'
import { defaultFilters, FiltersPanel, type Filters } from './components/FiltersPanel'
import { GoalPicker } from './components/GoalPicker'
import { ItemCard } from './components/ItemCard'
import { MealBuilder, type MealEntry } from './components/MealBuilder'
import { RestaurantsView } from './components/RestaurantsView'
import { TargetsPanel } from './components/TargetsPanel'
import { menuItems } from './data/menu'
import { restaurantById } from './data/restaurants'
import type { MenuItem } from './data/types'
import { useLocalStorage, useLocalStorageValue } from './hooks/useLocalStorage'
import { dailyTargets, defaultProfile, findSwap, type Profile } from './lib/nutrition'
import { defaultMealTargets, goalById, scoreAll, scoreItem, type GoalId, type MealTargets } from './lib/scoring'

type View = 'find' | 'compare' | 'meal' | 'restaurants'

const MAX_COMPARE = 4
const PAGE = 24
const itemById = new Map(menuItems.map((i) => [i.id, i]))

function applyFilters(items: MenuItem[], f: Filters): MenuItem[] {
  const q = f.query.trim().toLowerCase()
  return items.filter((i) => {
    if (f.restaurantIds.length && !f.restaurantIds.includes(i.restaurantId)) return false
    if (f.categories.length && !f.categories.includes(i.category)) return false
    if (f.mealsOnly && !f.categories.length && ['Side', 'Drink', 'Dessert'].includes(i.category)) return false
    if (i.calories > f.maxCalories) return false
    if (i.protein < f.minProtein) return false
    if (i.carbs > f.maxCarbs) return false
    if (f.vegetarian && !(i.tags?.includes('vegetarian') || i.tags?.includes('vegan'))) return false
    if (f.noFried && i.tags?.includes('fried')) return false
    if (q) {
      const hay = `${i.name} ${restaurantById[i.restaurantId].name} ${i.category} ${i.note ?? ''}`.toLowerCase()
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false
    }
    return true
  })
}

export default function App() {
  const [goal, setGoal] = useLocalStorageValue<GoalId>('mf.goal', 'high-protein')
  const [targets, setTargets] = useLocalStorage<MealTargets>('mf.targets', defaultMealTargets)
  const [profile, setProfile] = useLocalStorage<Profile>('mf.profile', defaultProfile)
  const [compareIds, setCompareIds] = useLocalStorageValue<string[]>('mf.compare', [])
  const [meal, setMeal] = useLocalStorageValue<MealEntry[]>('mf.meal', [])
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [view, setView] = useState<View>('find')
  const [showTargets, setShowTargets] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [limit, setLimit] = useState(PAGE)
  const [flash, setFlash] = useState<string | null>(null)
  const [highlightId, setHighlightId] = useState<string | null>(null)

  const daily = useMemo(() => dailyTargets(profile), [profile])

  const filtered = useMemo(() => applyFilters(menuItems, filters), [filters])
  const ranked = useMemo(() => scoreAll(filtered, goal, targets), [filtered, goal, targets])
  const visible = ranked.slice(0, limit)

  useEffect(() => setLimit(PAGE), [filters, goal])

  useEffect(() => {
    if (!flash) return
    const t = window.setTimeout(() => setFlash(null), 1800)
    return () => window.clearTimeout(t)
  }, [flash])

  useEffect(() => {
    if (!highlightId) return
    const el = document.getElementById(`item-${highlightId}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const t = window.setTimeout(() => setHighlightId(null), 2500)
    return () => window.clearTimeout(t)
  }, [highlightId, visible.length])

  const compareItems = compareIds.map((id) => itemById.get(id)).filter((x): x is MenuItem => Boolean(x))
  const mealEntries = meal
    .map((e) => ({ item: itemById.get(e.id), qty: e.qty }))
    .filter((e): e is { item: MenuItem; qty: number } => Boolean(e.item))

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_COMPARE) {
        setFlash(`Compare holds ${MAX_COMPARE} items. Remove one first.`)
        return prev
      }
      setFlash('Added to compare')
      return [...prev, id]
    })
  }

  const addToMeal = (id: string) => {
    setMeal((prev) => {
      const existing = prev.find((e) => e.id === id)
      if (existing) return prev.map((e) => (e.id === id ? { ...e, qty: e.qty + 1 } : e))
      return [...prev, { id, qty: 1 }]
    })
    setFlash('Added to meal')
  }

  const setQty = (id: string, qty: number) => {
    setMeal((prev) => (qty <= 0 ? prev.filter((e) => e.id !== id) : prev.map((e) => (e.id === id ? { ...e, qty } : e))))
  }

  const jumpToItem = (id: string) => {
    const item = itemById.get(id)
    if (!item) return
    // Make sure the target is visible: clear restrictive filters, keep restaurant focus.
    setFilters({ ...defaultFilters, mealsOnly: false, restaurantIds: [item.restaurantId] })
    setView('find')
    setLimit(500)
    setHighlightId(id)
  }

  const pickRestaurant = (restaurantId: string) => {
    setFilters({ ...defaultFilters, restaurantIds: [restaurantId] })
    setView('find')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const topPick = ranked[0]

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand" onClick={() => setView('find')} role="button" tabIndex={0}>
          <span className="logo" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="28" height="28"><rect width="64" height="64" rx="14" fill="currentColor" opacity=".15" /><path d="M14 44 L26 24 L34 36 L42 18 L50 44" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <span>
            <strong>MacroFinder</strong>
            <small>Eat out. Hit your macros.</small>
          </span>
        </div>
        <nav className="tabs" aria-label="Sections">
          <button className={view === 'find' ? 'on' : ''} onClick={() => setView('find')}>Find</button>
          <button className={view === 'restaurants' ? 'on' : ''} onClick={() => setView('restaurants')}>Restaurants</button>
          <button className={view === 'compare' ? 'on' : ''} onClick={() => setView('compare')}>
            Compare {compareIds.length > 0 && <span className="count">{compareIds.length}</span>}
          </button>
          <button className={view === 'meal' ? 'on' : ''} onClick={() => setView('meal')}>
            Meal {meal.length > 0 && <span className="count">{meal.reduce((a, e) => a + e.qty, 0)}</span>}
          </button>
        </nav>
        <button className="btn btn-ghost targets-btn" onClick={() => setShowTargets(true)}>
          🎯 {targets.calories} kcal · {targets.proteinMin} g P
        </button>
      </header>

      <section className="goal-strip">
        <GoalPicker goal={goal} onChange={setGoal} />
        <p className="goal-desc">{goalById[goal].description}</p>
      </section>

      <main className="content">
        {view === 'find' && (
          <div className="find-layout">
            <button className="btn btn-ghost filters-toggle" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters}>
              {showFilters ? 'Hide filters' : 'Filters'} · {ranked.length} items
            </button>
            <div className={`filters-col${showFilters ? ' open' : ''}`}>
              <FiltersPanel filters={filters} onChange={setFilters} resultCount={ranked.length} />
            </div>
            <div className="results">
              {topPick && (
                <div className="hero">
                  <span className="hero-kicker">Top pick for {goalById[goal].label.toLowerCase()}</span>
                  <h2>
                    {topPick.name} <span className="muted">at {restaurantById[topPick.restaurantId].name}</span>
                  </h2>
                  <p className="muted">
                    {topPick.calories} kcal · {topPick.protein} g protein · {topPick.carbs} g carbs · {topPick.fat} g fat · score {topPick.score}/100
                  </p>
                </div>
              )}
              {ranked.length === 0 && (
                <div className="empty">
                  <h2>No items match</h2>
                  <p>Loosen a filter or clear the search to see more options.</p>
                  <button className="btn btn-primary" onClick={() => setFilters(defaultFilters)}>Reset filters</button>
                </div>
              )}
              <div className="card-grid">
                {visible.map((item, idx) => {
                  const swap = findSwap(item, menuItems, goal, targets)
                  return (
                    <div key={item.id} id={`item-${item.id}`} className={highlightId === item.id ? 'highlight' : ''}>
                      <ItemCard
                        item={item}
                        score={item.score}
                        components={item.components}
                        swap={swap}
                        swapScore={swap ? scoreItem(swap, goal, targets).score : undefined}
                        inCompare={compareIds.includes(item.id)}
                        compareFull={compareIds.length >= MAX_COMPARE}
                        onToggleCompare={toggleCompare}
                        onAddToMeal={addToMeal}
                        onSelectSwap={jumpToItem}
                        mealCalories={targets.calories}
                        rank={idx + 1}
                      />
                    </div>
                  )
                })}
              </div>
              {visible.length < ranked.length && (
                <div className="load-more">
                  <button className="btn btn-ghost" onClick={() => setLimit((l) => l + PAGE)}>
                    Show more ({ranked.length - visible.length} remaining)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'restaurants' && (
          <RestaurantsView
            items={menuItems}
            goal={goal}
            targets={targets}
            onPick={pickRestaurant}
            onToggleCompare={toggleCompare}
            compareIds={compareIds}
          />
        )}

        {view === 'compare' && (
          <CompareView
            items={compareItems}
            goal={goal}
            targets={targets}
            onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
            onClear={() => setCompareIds([])}
            onAddToMeal={addToMeal}
            onBrowse={() => setView('find')}
          />
        )}

        {view === 'meal' && (
          <MealBuilder
            entries={mealEntries}
            targets={targets}
            daily={daily}
            onQty={setQty}
            onRemove={(id) => setMeal((prev) => prev.filter((e) => e.id !== id))}
            onClear={() => setMeal([])}
            onBrowse={() => setView('find')}
          />
        )}
      </main>

      <footer className="footer">
        <p>
          Nutrition values are approximations compiled from each restaurant's published nutrition information for standard builds.
          Recipes change by region and over time, so confirm with the restaurant before relying on a number. This is not medical advice.
        </p>
      </footer>

      {flash && <div className="toast" role="status">{flash}</div>}

      {showTargets && (
        <TargetsPanel
          profile={profile}
          onProfile={setProfile}
          targets={targets}
          onTargets={setTargets}
          onClose={() => setShowTargets(false)}
        />
      )}
    </div>
  )
}
