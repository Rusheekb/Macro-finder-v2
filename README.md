# MacroFinder

Compare the macros of menu items across popular restaurant chains and find the options that best fit your nutrition goals. The app is built to nudge people toward healthier choices when eating out: every item gets a transparent 0–100 "goal fit" score, healthier swaps at the same restaurant are surfaced automatically, and a meal builder shows how a full order stacks up against a personal calorie and macro budget.

## Features

- **Goal-based ranking.** Pick High protein, Low carb, Cutting, Balanced, Bulking, or Custom targets. Every item across every restaurant is scored for that goal and ranked.
- **Explainable scores.** "Why this score?" shows the weighted components (protein per calorie, calorie band, sodium, fibre, sugar, macro split) behind each number.
- **Healthier swaps.** When a better-scoring option exists at the same restaurant, the card links straight to it.
- **Side-by-side compare.** Put up to four items in a table that highlights the best value in each row for your goal.
- **Meal builder.** Stack items with quantities and see totals against your per-meal budget and daily targets, with over-budget and target-met nudges.
- **Best picks by restaurant.** See each chain's top three items for your goal and how forgiving the menu is overall.
- **Personal targets.** A built-in calculator (Mifflin-St Jeor) estimates daily calories and macros from your profile and splits them into a per-meal budget. Everything is stored locally in your browser.
- **Filters.** Search, restaurant, category, max calories, min protein, max carbs, vegetarian/vegan, and skip-fried toggles.

## Data

`src/data/menu.ts` holds roughly 230 items from 18 chains (Chipotle, McDonald's, Chick-fil-A, Subway, Panera, Taco Bell, Wendy's, Starbucks, Sweetgreen, Panda Express, Five Guys, In-N-Out, CAVA, Dunkin', Burger King, Shake Shack, Domino's, Olive Garden). Values are approximations compiled from each chain's published nutrition information for standard builds. Recipes change over time and by region, so confirm with the restaurant before relying on a figure. This is not medical advice.

Adding an item is a one-liner using the per-restaurant helper in that file. The test suite checks that every item's macros roughly agree with its listed calories, so typos get caught.

## Scoring

`src/lib/scoring.ts` computes a 0–100 score per goal from weighted, clamped signals:

| Goal | Main signals |
| --- | --- |
| High protein | Protein per 100 kcal, total protein, sensible calorie band |
| Low carb | Grams of carbs, protein density, calorie band |
| Cutting | Low calories, protein density, fibre, sugar, sodium |
| Balanced | Distance from a 30/40/30 protein/carb/fat split, moderate calories, fibre |
| Bulking | Total protein, 600–1000 kcal band, protein density |
| Custom | Fit against your own calorie cap, protein minimum, carb and fat maximums |

Sodium and sugar are small penalties in every goal so a "high protein" pick with 2000 mg sodium ranks below an equally lean option.

## Development

```bash
npm install
npm run dev        # start the dev server
npm test           # run unit tests (vitest)
npm run build      # typecheck and build to dist/
npm run preview    # serve the production build
```

Stack: Vite, React 19, TypeScript, plain CSS (light and dark mode), Vitest. No backend required; deploy `dist/` to any static host.
