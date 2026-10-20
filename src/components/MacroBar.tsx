import { macroBreakdown } from '../lib/scoring'

interface Props {
  protein: number
  carbs: number
  fat: number
  calories: number
  showLabels?: boolean
}

export function MacroBar({ protein, carbs, fat, calories, showLabels }: Props) {
  const b = macroBreakdown({ protein, carbs, fat, calories })
  const p = Math.round(b.proteinPct * 100)
  const c = Math.round(b.carbPct * 100)
  const f = Math.max(0, 100 - p - c)
  return (
    <div className="macro-bar-wrap">
      <div
        className="macro-bar"
        role="img"
        aria-label={`${p}% protein, ${c}% carbs, ${f}% fat by calories`}
      >
        <span className="seg seg-protein" style={{ width: `${p}%` }} />
        <span className="seg seg-carbs" style={{ width: `${c}%` }} />
        <span className="seg seg-fat" style={{ width: `${f}%` }} />
      </div>
      {showLabels && (
        <div className="macro-bar-labels">
          <span><i className="dot dot-protein" />P {p}%</span>
          <span><i className="dot dot-carbs" />C {c}%</span>
          <span><i className="dot dot-fat" />F {f}%</span>
        </div>
      )}
    </div>
  )
}
