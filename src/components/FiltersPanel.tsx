import { categories } from '../data/menu'
import { restaurants } from '../data/restaurants'
import type { Category } from '../data/types'

export interface Filters {
  query: string
  restaurantIds: string[]
  categories: Category[]
  maxCalories: number
  minProtein: number
  maxCarbs: number
  mealsOnly: boolean
  vegetarian: boolean
  noFried: boolean
}

export const defaultFilters: Filters = {
  query: '',
  restaurantIds: [],
  categories: [],
  maxCalories: 2000,
  minProtein: 0,
  maxCarbs: 200,
  mealsOnly: true,
  vegetarian: false,
  noFried: false,
}

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  resultCount: number
}

function toggle<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v]
}

export function FiltersPanel({ filters, onChange, resultCount }: Props) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => onChange({ ...filters, [k]: v })
  const active =
    filters.restaurantIds.length +
    filters.categories.length +
    (filters.maxCalories < 2000 ? 1 : 0) +
    (filters.minProtein > 0 ? 1 : 0) +
    (filters.maxCarbs < 200 ? 1 : 0) +
    (filters.vegetarian ? 1 : 0) +
    (filters.noFried ? 1 : 0)

  return (
    <aside className="filters">
      <div className="filters-head">
        <h2>Filters</h2>
        <span className="muted">{resultCount} items</span>
        {active > 0 && (
          <button className="btn btn-link" onClick={() => onChange({ ...defaultFilters, query: filters.query, mealsOnly: filters.mealsOnly })}>
            Reset
          </button>
        )}
      </div>

      <label className="field">
        <span>Search</span>
        <input
          type="search"
          placeholder="e.g. grilled chicken, bowl, taco"
          value={filters.query}
          onChange={(e) => set('query', e.target.value)}
        />
      </label>

      <div className="field">
        <span>Restaurants</span>
        <div className="chip-cloud">
          {restaurants.map((r) => (
            <button
              key={r.id}
              className={`chip${filters.restaurantIds.includes(r.id) ? ' on' : ''}`}
              style={{ ['--chip' as string]: r.color }}
              onClick={() => set('restaurantIds', toggle(filters.restaurantIds, r.id))}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>Category</span>
        <div className="chip-cloud">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip${filters.categories.includes(c) ? ' on' : ''}`}
              onClick={() => set('categories', toggle(filters.categories, c))}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <label className="field range">
        <span>
          Max calories <strong>{filters.maxCalories >= 2000 ? 'any' : filters.maxCalories}</strong>
        </span>
        <input
          type="range"
          min={100}
          max={2000}
          step={50}
          value={filters.maxCalories}
          onChange={(e) => set('maxCalories', Number(e.target.value))}
        />
      </label>
      <label className="field range">
        <span>
          Min protein <strong>{filters.minProtein} g</strong>
        </span>
        <input
          type="range"
          min={0}
          max={60}
          step={5}
          value={filters.minProtein}
          onChange={(e) => set('minProtein', Number(e.target.value))}
        />
      </label>
      <label className="field range">
        <span>
          Max carbs <strong>{filters.maxCarbs >= 200 ? 'any' : `${filters.maxCarbs} g`}</strong>
        </span>
        <input
          type="range"
          min={0}
          max={200}
          step={5}
          value={filters.maxCarbs}
          onChange={(e) => set('maxCarbs', Number(e.target.value))}
        />
      </label>

      <div className="field toggles">
        <label className="check">
          <input type="checkbox" checked={filters.mealsOnly} onChange={(e) => set('mealsOnly', e.target.checked)} />
          <span>Meals only (hide sides, drinks, desserts)</span>
        </label>
        <label className="check">
          <input type="checkbox" checked={filters.vegetarian} onChange={(e) => set('vegetarian', e.target.checked)} />
          <span>Vegetarian / vegan</span>
        </label>
        <label className="check">
          <input type="checkbox" checked={filters.noFried} onChange={(e) => set('noFried', e.target.checked)} />
          <span>Skip fried items</span>
        </label>
      </div>
    </aside>
  )
}
