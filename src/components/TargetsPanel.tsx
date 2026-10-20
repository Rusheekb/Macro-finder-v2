import { activityLabels, dailyTargets, mealTargetsFromDaily, type Activity, type Objective, type Profile, type Sex } from '../lib/nutrition'
import type { MealTargets } from '../lib/scoring'

interface Props {
  profile: Profile
  onProfile: (p: Profile) => void
  targets: MealTargets
  onTargets: (t: MealTargets) => void
  onClose: () => void
}

export function TargetsPanel({ profile, onProfile, targets, onTargets, onClose }: Props) {
  const daily = dailyTargets(profile)
  const suggested = mealTargetsFromDaily(daily, profile.mealsPerDay)
  const setP = <K extends keyof Profile>(k: K, v: Profile[K]) => onProfile({ ...profile, [k]: v })
  const setT = <K extends keyof MealTargets>(k: K, v: MealTargets[K]) => onTargets({ ...targets, [k]: v })

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="targets-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2 id="targets-title">Your targets</h2>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <section className="modal-section">
          <h3>1. About you</h3>
          <p className="muted">Used to estimate daily needs with the Mifflin-St Jeor equation. Nothing leaves your browser.</p>
          <div className="form-grid">
            <label className="field">
              <span>Sex</span>
              <select value={profile.sex} onChange={(e) => setP('sex', e.target.value as Sex)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label className="field">
              <span>Age</span>
              <input type="number" min={14} max={100} value={profile.age} onChange={(e) => setP('age', Number(e.target.value))} />
            </label>
            <label className="field">
              <span>Height (cm)</span>
              <input type="number" min={120} max={230} value={profile.heightCm} onChange={(e) => setP('heightCm', Number(e.target.value))} />
            </label>
            <label className="field">
              <span>Weight (kg)</span>
              <input type="number" min={35} max={250} value={profile.weightKg} onChange={(e) => setP('weightKg', Number(e.target.value))} />
            </label>
            <label className="field span2">
              <span>Activity</span>
              <select value={profile.activity} onChange={(e) => setP('activity', e.target.value as Activity)}>
                {(Object.keys(activityLabels) as Activity[]).map((a) => (
                  <option key={a} value={a}>{activityLabels[a]}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Objective</span>
              <select value={profile.objective} onChange={(e) => setP('objective', e.target.value as Objective)}>
                <option value="lose">Lose fat (−500 kcal)</option>
                <option value="maintain">Maintain</option>
                <option value="gain">Gain muscle (+300 kcal)</option>
              </select>
            </label>
            <label className="field">
              <span>Meals per day</span>
              <input type="number" min={1} max={8} value={profile.mealsPerDay} onChange={(e) => setP('mealsPerDay', Number(e.target.value))} />
            </label>
          </div>
          <div className="daily-summary">
            <div><strong>{daily.calories}</strong><span>kcal / day</span></div>
            <div><strong>{daily.protein} g</strong><span>protein</span></div>
            <div><strong>{daily.carbs} g</strong><span>carbs</span></div>
            <div><strong>{daily.fat} g</strong><span>fat</span></div>
          </div>
        </section>

        <section className="modal-section">
          <h3>2. Per-meal budget</h3>
          <p className="muted">
            Drives the <strong>Custom targets</strong> goal, the "% of meal budget" badges and the meal builder.
          </p>
          <div className="form-grid">
            <label className="field">
              <span>Calories (max)</span>
              <input type="number" min={100} max={3000} step={10} value={targets.calories} onChange={(e) => setT('calories', Number(e.target.value))} />
            </label>
            <label className="field">
              <span>Protein (min, g)</span>
              <input type="number" min={0} max={200} value={targets.proteinMin} onChange={(e) => setT('proteinMin', Number(e.target.value))} />
            </label>
            <label className="field">
              <span>Carbs (max, g)</span>
              <input type="number" min={0} max={400} value={targets.carbsMax} onChange={(e) => setT('carbsMax', Number(e.target.value))} />
            </label>
            <label className="field">
              <span>Fat (max, g)</span>
              <input type="number" min={0} max={200} value={targets.fatMax} onChange={(e) => setT('fatMax', Number(e.target.value))} />
            </label>
          </div>
          <button className="btn btn-primary" onClick={() => onTargets(suggested)}>
            Use suggested: {suggested.calories} kcal · {suggested.proteinMin} g P · {suggested.carbsMax} g C · {suggested.fatMax} g F
          </button>
        </section>
      </div>
    </div>
  )
}
