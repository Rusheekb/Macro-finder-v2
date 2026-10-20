export type Category =
  | 'Burger'
  | 'Sandwich'
  | 'Wrap'
  | 'Bowl'
  | 'Salad'
  | 'Taco'
  | 'Entree'
  | 'Pizza'
  | 'Soup'
  | 'Breakfast'
  | 'Side'
  | 'Dessert'
  | 'Drink'

export interface Restaurant {
  id: string
  name: string
  cuisine: string
  /** Short accent colour used for the restaurant chip. */
  color: string
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  category: Category
  /** kcal */
  calories: number
  /** grams */
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  /** milligrams */
  sodium?: number
  /** Serving / customisation note shown under the name. */
  note?: string
  tags?: ItemTag[]
}

export type ItemTag = 'vegetarian' | 'vegan' | 'grilled' | 'fried' | 'kids'
