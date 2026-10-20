import type { Restaurant } from './types'

export const restaurants: Restaurant[] = [
  { id: 'chipotle', name: 'Chipotle', cuisine: 'Mexican', color: '#a81612' },
  { id: 'mcdonalds', name: "McDonald's", cuisine: 'Burgers', color: '#d9a300' },
  { id: 'chickfila', name: 'Chick-fil-A', cuisine: 'Chicken', color: '#dd0031' },
  { id: 'subway', name: 'Subway', cuisine: 'Sandwiches', color: '#008c15' },
  { id: 'panera', name: 'Panera Bread', cuisine: 'Bakery cafe', color: '#5c7f3b' },
  { id: 'tacobell', name: 'Taco Bell', cuisine: 'Mexican', color: '#702082' },
  { id: 'wendys', name: "Wendy's", cuisine: 'Burgers', color: '#c8102e' },
  { id: 'starbucks', name: 'Starbucks', cuisine: 'Coffee', color: '#00704a' },
  { id: 'sweetgreen', name: 'Sweetgreen', cuisine: 'Salads & bowls', color: '#1c6b3a' },
  { id: 'panda', name: 'Panda Express', cuisine: 'Chinese', color: '#c41230' },
  { id: 'fiveguys', name: 'Five Guys', cuisine: 'Burgers', color: '#b3202c' },
  { id: 'innout', name: 'In-N-Out', cuisine: 'Burgers', color: '#e0252b' },
  { id: 'cava', name: 'CAVA', cuisine: 'Mediterranean', color: '#f2a900' },
  { id: 'dunkin', name: "Dunkin'", cuisine: 'Coffee & donuts', color: '#ff671f' },
  { id: 'burgerking', name: 'Burger King', cuisine: 'Burgers', color: '#f58220' },
  { id: 'shakeshack', name: 'Shake Shack', cuisine: 'Burgers', color: '#6bbf3b' },
  { id: 'dominos', name: "Domino's", cuisine: 'Pizza', color: '#006491' },
  { id: 'olivegarden', name: 'Olive Garden', cuisine: 'Italian', color: '#6f8f3a' },
]

export const restaurantById: Record<string, Restaurant> = Object.fromEntries(
  restaurants.map((r) => [r.id, r]),
)
