import { goals, type GoalId } from '../lib/scoring'

interface Props {
  goal: GoalId
  onChange: (g: GoalId) => void
}

export function GoalPicker({ goal, onChange }: Props) {
  return (
    <div className="goal-picker" role="radiogroup" aria-label="Nutrition goal">
      {goals.map((g) => (
        <button
          key={g.id}
          role="radio"
          aria-checked={goal === g.id}
          className={`goal-chip${goal === g.id ? ' active' : ''}`}
          onClick={() => onChange(g.id)}
          title={g.description}
        >
          <span className="goal-emoji" aria-hidden="true">{g.emoji}</span>
          <span className="goal-label">{g.label}</span>
        </button>
      ))}
    </div>
  )
}
