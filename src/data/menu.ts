import type { Category, ItemTag, MenuItem } from './types'

/**
 * Nutrition values are approximations compiled from each chain's publicly
 * posted nutrition information (standard build unless the note says
 * otherwise). Recipes change, so always confirm with the restaurant's
 * official calculator before relying on a number for medical purposes.
 */

interface Extra {
  fiber?: number
  sugar?: number
  sodium?: number
  note?: string
  tags?: ItemTag[]
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function make(restaurantId: string) {
  return (
    name: string,
    category: Category,
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    extra: Extra = {},
  ): MenuItem => ({
    id: `${restaurantId}:${slug(name)}`,
    restaurantId,
    name,
    category,
    calories,
    protein,
    carbs,
    fat,
    ...extra,
  })
}

const chipotle = make('chipotle')
const mcd = make('mcdonalds')
const cfa = make('chickfila')
const subway = make('subway')
const panera = make('panera')
const tb = make('tacobell')
const wendys = make('wendys')
const sbux = make('starbucks')
const sg = make('sweetgreen')
const panda = make('panda')
const fg = make('fiveguys')
const ino = make('innout')
const cava = make('cava')
const dd = make('dunkin')
const bk = make('burgerking')
const ss = make('shakeshack')
const dom = make('dominos')
const og = make('olivegarden')

export const menuItems: MenuItem[] = [
  // ───────── Chipotle ─────────
  chipotle('Chicken Burrito Bowl', 'Bowl', 570, 45, 72, 13, {
    fiber: 12, sugar: 5, sodium: 1570, tags: ['grilled'],
    note: 'White rice, black beans, fajita veggies, tomato salsa, lettuce',
  }),
  chipotle('Steak Burrito Bowl', 'Bowl', 520, 33, 63, 14, {
    fiber: 11, sugar: 4, sodium: 1280, tags: ['grilled'],
    note: 'Brown rice, pinto beans, tomato salsa, lettuce',
  }),
  chipotle('Barbacoa Lifestyle Bowl', 'Bowl', 350, 33, 34, 9, {
    fiber: 10, sugar: 4, sodium: 1440,
    note: 'No rice. Black beans, fajita veggies, lettuce, tomato salsa',
  }),
  chipotle('Carnitas Burrito Bowl', 'Bowl', 850, 46, 80, 36, {
    fiber: 9, sugar: 6, sodium: 1560,
    note: 'White rice, pinto beans, cheese, sour cream, corn salsa',
  }),
  chipotle('Sofritas Burrito Bowl', 'Bowl', 765, 23, 84, 40, {
    fiber: 20, sugar: 7, sodium: 2030, tags: ['vegan'],
    note: 'Brown rice, black beans, fajita veggies, tomato salsa, guacamole',
  }),
  chipotle('Chicken Salad', 'Salad', 370, 42, 34, 9, {
    fiber: 12, sugar: 5, sodium: 1220, tags: ['grilled'],
    note: 'Supergreens, black beans, fajita veggies, tomato salsa, no dressing',
  }),
  chipotle('Chicken Burrito', 'Wrap', 1085, 60, 119, 39, {
    fiber: 11, sugar: 6, sodium: 2240,
    note: 'Flour tortilla, white rice, black beans, cheese, sour cream, tomato salsa',
  }),
  chipotle('Chicken Tacos (3)', 'Taco', 575, 45, 48, 21, {
    fiber: 4, sugar: 4, sodium: 1620,
    note: 'Soft flour tortillas, cheese, lettuce, tomato salsa',
  }),
  chipotle('Chicken Quesadilla', 'Entree', 810, 51, 54, 43, { fiber: 3, sugar: 2, sodium: 1600 }),
  chipotle('Chips & Guacamole', 'Side', 770, 9, 81, 47, { fiber: 14, sugar: 2, sodium: 765, tags: ['vegan'] }),
  chipotle('Side of Guacamole', 'Side', 230, 2, 8, 22, { fiber: 6, sugar: 1, sodium: 375, tags: ['vegan'] }),
  chipotle('Chicken (single serving)', 'Entree', 180, 32, 0, 7, { sodium: 310, tags: ['grilled'], note: '4 oz protein only' }),
  chipotle('Steak (single serving)', 'Entree', 150, 21, 1, 6, { sodium: 330, tags: ['grilled'], note: '4 oz protein only' }),

  // ───────── McDonald's ─────────
  mcd('Big Mac', 'Burger', 590, 25, 46, 34, { fiber: 3, sugar: 9, sodium: 1050 }),
  mcd('Quarter Pounder with Cheese', 'Burger', 520, 30, 42, 26, { fiber: 2, sugar: 10, sodium: 1140 }),
  mcd('Double Quarter Pounder with Cheese', 'Burger', 740, 48, 43, 42, { fiber: 2, sugar: 10, sodium: 1360 }),
  mcd('McDouble', 'Burger', 400, 22, 33, 20, { fiber: 2, sugar: 7, sodium: 920 }),
  mcd('Cheeseburger', 'Burger', 300, 15, 32, 13, { fiber: 1, sugar: 7, sodium: 720 }),
  mcd('Hamburger', 'Burger', 250, 12, 31, 9, { fiber: 1, sugar: 6, sodium: 510 }),
  mcd('McChicken', 'Sandwich', 400, 14, 39, 21, { fiber: 2, sugar: 5, sodium: 560, tags: ['fried'] }),
  mcd('McCrispy Chicken Sandwich', 'Sandwich', 470, 26, 46, 20, { fiber: 2, sugar: 10, sodium: 1140, tags: ['fried'] }),
  mcd('Spicy McCrispy', 'Sandwich', 530, 27, 48, 26, { fiber: 2, sugar: 10, sodium: 1320, tags: ['fried'] }),
  mcd('Filet-O-Fish', 'Sandwich', 390, 16, 39, 19, { fiber: 2, sugar: 5, sodium: 580, tags: ['fried'] }),
  mcd('Chicken McNuggets (10 pc)', 'Entree', 410, 23, 25, 24, { fiber: 1, sugar: 0, sodium: 840, tags: ['fried'] }),
  mcd('Chicken McNuggets (6 pc)', 'Entree', 250, 14, 15, 15, { fiber: 1, sugar: 0, sodium: 500, tags: ['fried'] }),
  mcd('Chicken McNuggets (4 pc)', 'Entree', 170, 9, 10, 10, { fiber: 1, sugar: 0, sodium: 340, tags: ['fried', 'kids'] }),
  mcd('Medium French Fries', 'Side', 320, 4, 43, 15, { fiber: 4, sugar: 0, sodium: 260, tags: ['fried', 'vegetarian'] }),
  mcd('Small French Fries', 'Side', 230, 3, 31, 11, { fiber: 3, sugar: 0, sodium: 190, tags: ['fried', 'vegetarian'] }),
  mcd('Apple Slices', 'Side', 15, 0, 4, 0, { fiber: 0, sugar: 3, sodium: 0, tags: ['vegan', 'kids'] }),
  mcd('Egg McMuffin', 'Breakfast', 310, 17, 30, 13, { fiber: 2, sugar: 3, sodium: 770 }),
  mcd('Sausage McMuffin with Egg', 'Breakfast', 480, 20, 30, 31, { fiber: 2, sugar: 2, sodium: 830 }),
  mcd('Sausage Burrito', 'Breakfast', 310, 13, 25, 17, { fiber: 1, sugar: 2, sodium: 800 }),
  mcd('Hotcakes', 'Breakfast', 580, 9, 101, 15, { fiber: 2, sugar: 45, sodium: 590, tags: ['vegetarian'] }),
  mcd('Oreo McFlurry', 'Dessert', 510, 12, 80, 16, { fiber: 1, sugar: 60, sodium: 260, tags: ['vegetarian'] }),
  mcd('Vanilla Cone', 'Dessert', 200, 5, 33, 5, { fiber: 0, sugar: 23, sodium: 80, tags: ['vegetarian'] }),
  mcd('Coca-Cola (medium)', 'Drink', 200, 0, 55, 0, { sugar: 55, sodium: 10, tags: ['vegan'] }),
  mcd('Diet Coke (medium)', 'Drink', 0, 0, 0, 0, { sugar: 0, sodium: 30, tags: ['vegan'] }),

  // ───────── Chick-fil-A ─────────
  cfa('Chicken Sandwich', 'Sandwich', 420, 28, 41, 17, { fiber: 1, sugar: 6, sodium: 1400, tags: ['fried'] }),
  cfa('Spicy Chicken Sandwich', 'Sandwich', 450, 28, 45, 19, { fiber: 1, sugar: 6, sodium: 1620, tags: ['fried'] }),
  cfa('Deluxe Chicken Sandwich', 'Sandwich', 490, 31, 42, 22, { fiber: 2, sugar: 6, sodium: 1450, tags: ['fried'] }),
  cfa('Grilled Chicken Sandwich', 'Sandwich', 390, 28, 44, 12, { fiber: 3, sugar: 10, sodium: 850, tags: ['grilled'] }),
  cfa('Grilled Chicken Club', 'Sandwich', 520, 38, 44, 22, { fiber: 3, sugar: 10, sodium: 1220, tags: ['grilled'] }),
  cfa('Grilled Nuggets (8 ct)', 'Entree', 130, 25, 1, 3, { fiber: 0, sugar: 1, sodium: 440, tags: ['grilled'] }),
  cfa('Grilled Nuggets (12 ct)', 'Entree', 200, 38, 2, 5, { fiber: 0, sugar: 1, sodium: 660, tags: ['grilled'] }),
  cfa('Chicken Nuggets (8 ct)', 'Entree', 250, 27, 11, 11, { fiber: 0, sugar: 1, sodium: 1210, tags: ['fried'] }),
  cfa('Chicken Nuggets (12 ct)', 'Entree', 380, 40, 16, 17, { fiber: 0, sugar: 1, sodium: 1810, tags: ['fried'] }),
  cfa('Chick-n-Strips (3 ct)', 'Entree', 310, 29, 16, 14, { fiber: 1, sugar: 1, sodium: 1040, tags: ['fried'] }),
  cfa('Market Salad with Grilled Chicken', 'Salad', 330, 27, 26, 13, {
    fiber: 5, sugar: 15, sodium: 700, tags: ['grilled'], note: 'No dressing',
  }),
  cfa('Spicy Southwest Salad with Grilled Chicken', 'Salad', 450, 33, 32, 22, {
    fiber: 7, sugar: 7, sodium: 1040, tags: ['grilled'], note: 'No dressing',
  }),
  cfa('Cobb Salad with Grilled Nuggets', 'Salad', 500, 41, 25, 28, {
    fiber: 5, sugar: 6, sodium: 1570, tags: ['grilled'], note: 'No dressing',
  }),
  cfa('Waffle Potato Fries (medium)', 'Side', 420, 5, 45, 24, { fiber: 5, sugar: 1, sodium: 240, tags: ['fried', 'vegetarian'] }),
  cfa('Fruit Cup (medium)', 'Side', 60, 1, 14, 0, { fiber: 2, sugar: 12, sodium: 0, tags: ['vegan'] }),
  cfa('Kale Crunch Side', 'Side', 170, 3, 14, 12, { fiber: 3, sugar: 8, sodium: 140, tags: ['vegetarian'] }),
  cfa('Mac & Cheese (medium)', 'Side', 450, 19, 29, 28, { fiber: 1, sugar: 2, sodium: 1090, tags: ['vegetarian'] }),
  cfa('Chicken Biscuit', 'Breakfast', 460, 19, 45, 23, { fiber: 2, sugar: 6, sodium: 1510, tags: ['fried'] }),
  cfa('Egg White Grill', 'Breakfast', 290, 26, 30, 8, { fiber: 1, sugar: 2, sodium: 980, tags: ['grilled'] }),
  cfa('Hash Browns', 'Breakfast', 270, 3, 25, 18, { fiber: 3, sugar: 0, sodium: 440, tags: ['fried', 'vegetarian'] }),
  cfa('Lemonade (medium)', 'Drink', 220, 0, 58, 0, { sugar: 54, sodium: 10, tags: ['vegan'] }),
  cfa('Diet Lemonade (medium)', 'Drink', 50, 0, 14, 0, { sugar: 11, sodium: 10, tags: ['vegan'] }),
  cfa('Cookies & Cream Milkshake', 'Dessert', 630, 14, 88, 25, { fiber: 1, sugar: 70, sodium: 400, tags: ['vegetarian'] }),

  // ───────── Subway ─────────
  subway('Turkey Breast (6-inch)', 'Sandwich', 280, 18, 42, 4, { fiber: 2, sugar: 6, sodium: 790, note: 'Italian bread, standard veggies, no cheese' }),
  subway('Oven Roasted Turkey & Ham (6-inch)', 'Sandwich', 290, 19, 42, 5, { fiber: 2, sugar: 6, sodium: 880, note: 'Italian bread, standard veggies, no cheese' }),
  subway('Rotisserie-Style Chicken (6-inch)', 'Sandwich', 350, 25, 41, 8, { fiber: 2, sugar: 6, sodium: 700, note: 'Italian bread, standard veggies, no cheese' }),
  subway('Oven Roasted Chicken (6-inch)', 'Sandwich', 320, 23, 42, 5, { fiber: 2, sugar: 7, sodium: 580, note: 'Italian bread, standard veggies, no cheese' }),
  subway('Black Forest Ham (6-inch)', 'Sandwich', 270, 18, 41, 4, { fiber: 2, sugar: 7, sodium: 780, note: 'Italian bread, standard veggies, no cheese' }),
  subway('Veggie Delite (6-inch)', 'Sandwich', 200, 8, 37, 2, { fiber: 3, sugar: 5, sodium: 290, tags: ['vegan'], note: 'Italian bread, standard veggies, no cheese' }),
  subway('Tuna (6-inch)', 'Sandwich', 450, 20, 41, 23, { fiber: 2, sugar: 5, sodium: 580, note: 'Italian bread, standard veggies, no cheese' }),
  subway('Steak & Cheese (6-inch)', 'Sandwich', 380, 26, 42, 11, { fiber: 2, sugar: 6, sodium: 1100 }),
  subway('Italian B.M.T. (6-inch)', 'Sandwich', 390, 19, 41, 16, { fiber: 2, sugar: 6, sodium: 1160 }),
  subway('Spicy Italian (6-inch)', 'Sandwich', 450, 20, 41, 23, { fiber: 2, sugar: 6, sodium: 1400 }),
  subway('Meatball Marinara (6-inch)', 'Sandwich', 450, 19, 52, 17, { fiber: 4, sugar: 11, sodium: 940 }),
  subway('Cold Cut Combo (6-inch)', 'Sandwich', 350, 15, 41, 13, { fiber: 2, sugar: 6, sodium: 1030 }),
  subway('Chicken & Bacon Ranch (6-inch)', 'Sandwich', 570, 34, 42, 29, { fiber: 2, sugar: 6, sodium: 1180 }),
  subway('Turkey Breast (Footlong)', 'Sandwich', 560, 36, 84, 7, { fiber: 4, sugar: 12, sodium: 1580 }),
  subway('Chicken & Bacon Ranch (Footlong)', 'Sandwich', 1140, 68, 84, 58, { fiber: 4, sugar: 12, sodium: 2360 }),
  subway('Rotisserie-Style Chicken Salad', 'Salad', 170, 22, 10, 4, { fiber: 3, sugar: 5, sodium: 420, note: 'No dressing' }),
  subway('Turkey Breast Salad', 'Salad', 110, 13, 10, 2, { fiber: 3, sugar: 5, sodium: 530, note: 'No dressing' }),
  subway('Chocolate Chip Cookie', 'Dessert', 210, 2, 30, 10, { fiber: 1, sugar: 18, sodium: 150, tags: ['vegetarian'] }),

  // ───────── Panera Bread ─────────
  panera('Fuji Apple Chicken Salad (whole)', 'Salad', 560, 32, 37, 33, { fiber: 6, sugar: 22, sodium: 870 }),
  panera('Green Goddess Cobb Salad with Chicken (whole)', 'Salad', 530, 40, 16, 35, { fiber: 7, sugar: 5, sodium: 1030 }),
  panera('Caesar Salad with Chicken (whole)', 'Salad', 440, 33, 20, 24, { fiber: 4, sugar: 3, sodium: 980 }),
  panera('Mediterranean Bowl with Chicken', 'Bowl', 600, 34, 62, 25, { fiber: 9, sugar: 6, sodium: 1060 }),
  panera('Baja Bowl with Chicken', 'Bowl', 640, 35, 68, 26, { fiber: 11, sugar: 8, sodium: 1230 }),
  panera('Mediterranean Veggie Sandwich (whole)', 'Sandwich', 560, 23, 83, 14, { fiber: 7, sugar: 8, sodium: 1200, tags: ['vegetarian'] }),
  panera('Bacon Turkey Bravo (whole)', 'Sandwich', 710, 43, 70, 28, { fiber: 4, sugar: 9, sodium: 2010 }),
  panera('Toasted Frontega Chicken (whole)', 'Sandwich', 790, 44, 72, 36, { fiber: 4, sugar: 6, sodium: 1830 }),
  panera('Chipotle Chicken Avocado Melt (whole)', 'Sandwich', 940, 47, 75, 48, { fiber: 7, sugar: 5, sodium: 1960 }),
  panera('Broccoli Cheddar Soup (bowl)', 'Soup', 360, 15, 26, 23, { fiber: 4, sugar: 9, sodium: 1340, tags: ['vegetarian'] }),
  panera('Chicken Noodle Soup (bowl)', 'Soup', 140, 8, 16, 5, { fiber: 1, sugar: 2, sodium: 1040 }),
  panera('Ten Vegetable Soup (bowl)', 'Soup', 100, 5, 19, 2, { fiber: 4, sugar: 7, sodium: 780, tags: ['vegan'] }),
  panera('Mac & Cheese (bowl)', 'Entree', 950, 33, 83, 54, { fiber: 3, sugar: 10, sodium: 2060, tags: ['vegetarian'] }),
  panera('Avocado, Egg White & Spinach Sandwich', 'Breakfast', 350, 19, 39, 14, { fiber: 7, sugar: 3, sodium: 660, tags: ['vegetarian'] }),
  panera('Steel Cut Oatmeal with Strawberries & Pecans', 'Breakfast', 360, 8, 55, 14, { fiber: 7, sugar: 17, sodium: 160, tags: ['vegan'] }),
  panera('Greek Yogurt Parfait', 'Breakfast', 240, 13, 35, 6, { fiber: 3, sugar: 21, sodium: 60, tags: ['vegetarian'] }),
  panera('Plain Bagel', 'Breakfast', 290, 10, 56, 2, { fiber: 2, sugar: 4, sodium: 450, tags: ['vegan'] }),
  panera('Cinnamon Crunch Bagel', 'Breakfast', 430, 9, 82, 8, { fiber: 2, sugar: 30, sodium: 410, tags: ['vegetarian'] }),

  // ───────── Taco Bell ─────────
  tb('Crunchy Taco', 'Taco', 170, 8, 13, 10, { fiber: 3, sugar: 1, sodium: 300 }),
  tb('Soft Taco', 'Taco', 180, 9, 18, 9, { fiber: 2, sugar: 1, sodium: 500 }),
  tb('Chicken Soft Taco', 'Taco', 170, 12, 16, 5, { fiber: 2, sugar: 1, sodium: 460, tags: ['grilled'] }),
  tb('Fresco Chicken Soft Taco', 'Taco', 150, 11, 16, 4, { fiber: 2, sugar: 1, sodium: 440, tags: ['grilled'] }),
  tb('Bean Burrito', 'Wrap', 350, 13, 54, 9, { fiber: 9, sugar: 3, sodium: 1010, tags: ['vegetarian'] }),
  tb('Burrito Supreme (beef)', 'Wrap', 390, 16, 51, 14, { fiber: 8, sugar: 4, sodium: 1020 }),
  tb('Beefy 5-Layer Burrito', 'Wrap', 490, 18, 63, 18, { fiber: 7, sugar: 4, sodium: 1250 }),
  tb('Power Menu Bowl (chicken)', 'Bowl', 470, 26, 50, 19, { fiber: 9, sugar: 2, sodium: 1200, tags: ['grilled'] }),
  tb('Power Menu Bowl (veggie)', 'Bowl', 430, 12, 59, 16, { fiber: 11, sugar: 2, sodium: 960, tags: ['vegetarian'] }),
  tb('Crunchwrap Supreme', 'Wrap', 530, 16, 71, 21, { fiber: 6, sugar: 6, sodium: 1200 }),
  tb('Cheesy Gordita Crunch', 'Taco', 500, 20, 41, 28, { fiber: 4, sugar: 5, sodium: 850 }),
  tb('Chalupa Supreme (beef)', 'Taco', 350, 13, 31, 20, { fiber: 3, sugar: 3, sodium: 540, tags: ['fried'] }),
  tb('Chicken Quesadilla', 'Entree', 510, 27, 37, 28, { fiber: 3, sugar: 3, sodium: 1230 }),
  tb('Nachos BellGrande', 'Side', 740, 16, 83, 39, { fiber: 12, sugar: 5, sodium: 1050 }),
  tb('Black Beans', 'Side', 50, 3, 8, 1, { fiber: 3, sugar: 0, sodium: 135, tags: ['vegan'] }),
  tb('Cinnamon Twists', 'Dessert', 170, 1, 26, 6, { fiber: 1, sugar: 10, sodium: 200, tags: ['vegan'] }),
  tb('Baja Blast (medium)', 'Drink', 220, 0, 60, 0, { sugar: 60, sodium: 50, tags: ['vegan'] }),

  // ───────── Wendy's ─────────
  wendys("Dave's Single", 'Burger', 590, 30, 42, 34, { fiber: 3, sugar: 9, sodium: 1180 }),
  wendys("Dave's Double", 'Burger', 850, 48, 42, 52, { fiber: 3, sugar: 9, sodium: 1480 }),
  wendys('Baconator', 'Burger', 960, 57, 40, 67, { fiber: 2, sugar: 8, sodium: 1860 }),
  wendys('Jr. Cheeseburger', 'Burger', 290, 15, 26, 14, { fiber: 1, sugar: 6, sodium: 630 }),
  wendys('Jr. Hamburger', 'Burger', 250, 13, 25, 11, { fiber: 1, sugar: 5, sodium: 480 }),
  wendys('Grilled Chicken Sandwich', 'Sandwich', 350, 33, 36, 9, { fiber: 2, sugar: 7, sodium: 900, tags: ['grilled'] }),
  wendys('Classic Chicken Sandwich', 'Sandwich', 490, 28, 49, 21, { fiber: 2, sugar: 6, sodium: 1260, tags: ['fried'] }),
  wendys('Spicy Chicken Sandwich', 'Sandwich', 500, 29, 50, 22, { fiber: 2, sugar: 6, sodium: 1280, tags: ['fried'] }),
  wendys('Crispy Chicken Nuggets (10 pc)', 'Entree', 450, 22, 26, 29, { fiber: 1, sugar: 0, sodium: 1040, tags: ['fried'] }),
  wendys('Crispy Chicken Nuggets (4 pc)', 'Entree', 170, 9, 11, 11, { fiber: 0, sugar: 0, sodium: 400, tags: ['fried', 'kids'] }),
  wendys('Apple Pecan Chicken Salad (full)', 'Salad', 550, 31, 45, 28, { fiber: 7, sugar: 32, sodium: 1040, tags: ['grilled'], note: 'With dressing' }),
  wendys('Parmesan Caesar Chicken Salad (full)', 'Salad', 440, 37, 15, 27, { fiber: 4, sugar: 4, sodium: 1150, tags: ['grilled'], note: 'With dressing' }),
  wendys('Chili (small)', 'Soup', 240, 15, 23, 9, { fiber: 6, sugar: 6, sodium: 1010 }),
  wendys('Chili (large)', 'Soup', 340, 22, 34, 15, { fiber: 10, sugar: 9, sodium: 1400 }),
  wendys('Plain Baked Potato', 'Side', 270, 7, 61, 0, { fiber: 7, sugar: 3, sodium: 40, tags: ['vegan'] }),
  wendys('Natural-Cut Fries (medium)', 'Side', 350, 5, 48, 16, { fiber: 4, sugar: 0, sodium: 470, tags: ['fried', 'vegetarian'] }),
  wendys('Chocolate Frosty (small)', 'Dessert', 350, 9, 58, 9, { fiber: 1, sugar: 48, sodium: 190, tags: ['vegetarian'] }),

  // ───────── Starbucks ─────────
  sbux('Egg White & Roasted Red Pepper Egg Bites', 'Breakfast', 170, 12, 11, 8, { fiber: 1, sugar: 2, sodium: 450, tags: ['vegetarian'] }),
  sbux('Bacon & Gruyère Egg Bites', 'Breakfast', 300, 19, 9, 20, { fiber: 0, sugar: 1, sodium: 680 }),
  sbux('Spinach, Feta & Egg White Wrap', 'Breakfast', 290, 20, 34, 8, { fiber: 3, sugar: 4, sodium: 840, tags: ['vegetarian'] }),
  sbux('Turkey Bacon, Cheddar & Egg White Sandwich', 'Breakfast', 230, 17, 28, 5, { fiber: 2, sugar: 2, sodium: 560 }),
  sbux('Sausage, Cheddar & Egg Sandwich', 'Breakfast', 480, 19, 40, 28, { fiber: 2, sugar: 4, sodium: 920 }),
  sbux('Bacon, Gouda & Egg Sandwich', 'Breakfast', 360, 19, 33, 18, { fiber: 1, sugar: 3, sodium: 810 }),
  sbux('Impossible Breakfast Sandwich', 'Breakfast', 420, 22, 36, 22, { fiber: 2, sugar: 5, sodium: 790, tags: ['vegetarian'] }),
  sbux('Rolled & Steel-Cut Oatmeal', 'Breakfast', 160, 5, 28, 3, { fiber: 4, sugar: 0, sodium: 125, tags: ['vegan'], note: 'Plain, no toppings' }),
  sbux('Eggs & Cheddar Protein Box', 'Entree', 470, 24, 40, 25, { fiber: 5, sugar: 19, sodium: 670, tags: ['vegetarian'] }),
  sbux('Chicken & Hummus Protein Box', 'Entree', 300, 17, 30, 13, { fiber: 6, sugar: 8, sodium: 560 }),
  sbux('Blueberry Muffin', 'Dessert', 360, 6, 53, 14, { fiber: 1, sugar: 29, sodium: 350, tags: ['vegetarian'] }),
  sbux('Butter Croissant', 'Dessert', 260, 5, 32, 12, { fiber: 1, sugar: 6, sodium: 360, tags: ['vegetarian'] }),
  sbux('Chocolate Chip Cookie', 'Dessert', 370, 5, 51, 17, { fiber: 2, sugar: 30, sodium: 290, tags: ['vegetarian'] }),
  sbux('Caffè Latte (grande, 2%)', 'Drink', 190, 13, 19, 7, { sugar: 18, sodium: 170, tags: ['vegetarian'] }),
  sbux('Caffè Americano (grande)', 'Drink', 15, 1, 3, 0, { sugar: 0, sodium: 10, tags: ['vegan'] }),
  sbux('Cold Brew (grande)', 'Drink', 5, 0, 0, 0, { sugar: 0, sodium: 15, tags: ['vegan'] }),
  sbux('Vanilla Sweet Cream Cold Brew (grande)', 'Drink', 110, 1, 14, 5, { sugar: 14, sodium: 20, tags: ['vegetarian'] }),
  sbux('Iced Brown Sugar Oatmilk Shaken Espresso (grande)', 'Drink', 120, 2, 18, 3, { sugar: 13, sodium: 80, tags: ['vegan'] }),
  sbux('Caramel Frappuccino (grande)', 'Drink', 380, 5, 54, 16, { sugar: 54, sodium: 230, tags: ['vegetarian'] }),
  sbux('Pumpkin Spice Latte (grande, 2%)', 'Drink', 390, 14, 52, 14, { sugar: 50, sodium: 240, tags: ['vegetarian'] }),

  // ───────── Sweetgreen ─────────
  sg('Harvest Bowl', 'Bowl', 700, 35, 63, 37, { fiber: 8, sugar: 14, sodium: 980, tags: ['grilled'] }),
  sg('Kale Caesar with Chicken', 'Salad', 500, 37, 20, 31, { fiber: 5, sugar: 3, sodium: 1080, tags: ['grilled'] }),
  sg('Chicken Pesto Parm', 'Bowl', 630, 39, 45, 33, { fiber: 6, sugar: 5, sodium: 1120, tags: ['grilled'] }),
  sg('Guacamole Greens', 'Salad', 540, 28, 27, 37, { fiber: 11, sugar: 6, sodium: 710, tags: ['grilled'] }),
  sg('Super Green Goddess', 'Salad', 490, 14, 48, 28, { fiber: 13, sugar: 7, sodium: 760, tags: ['vegan'] }),
  sg('Shroomami', 'Bowl', 530, 28, 57, 22, { fiber: 9, sugar: 8, sodium: 1130, tags: ['vegan'] }),
  sg('Crispy Rice Bowl', 'Bowl', 680, 35, 52, 37, { fiber: 7, sugar: 9, sodium: 1230, tags: ['grilled'] }),
  sg('Buffalo Chicken Bowl', 'Bowl', 650, 38, 40, 39, { fiber: 7, sugar: 5, sodium: 1480, tags: ['grilled'] }),
  sg('Hot Honey Chicken', 'Bowl', 710, 37, 72, 30, { fiber: 7, sugar: 17, sodium: 1060, tags: ['grilled'] }),
  sg('Steakhouse Chopped', 'Bowl', 700, 37, 40, 43, { fiber: 7, sugar: 8, sodium: 1260, tags: ['grilled'] }),
  sg('Roasted Chicken (protein add)', 'Entree', 170, 30, 0, 5, { sodium: 460, tags: ['grilled'], note: 'Protein serving only' }),

  // ───────── Panda Express ─────────
  panda('Orange Chicken', 'Entree', 490, 25, 51, 23, { fiber: 2, sugar: 19, sodium: 820, tags: ['fried'] }),
  panda('Grilled Teriyaki Chicken', 'Entree', 300, 36, 8, 13, { fiber: 0, sugar: 8, sodium: 530, tags: ['grilled'] }),
  panda('String Bean Chicken Breast', 'Entree', 190, 14, 13, 9, { fiber: 4, sugar: 4, sodium: 590 }),
  panda('Kung Pao Chicken', 'Entree', 290, 16, 14, 19, { fiber: 2, sugar: 6, sodium: 970 }),
  panda('Black Pepper Chicken', 'Entree', 280, 13, 15, 19, { fiber: 2, sugar: 6, sodium: 1130 }),
  panda('Mushroom Chicken', 'Entree', 220, 13, 10, 14, { fiber: 1, sugar: 4, sodium: 840 }),
  panda('Broccoli Beef', 'Entree', 150, 9, 13, 7, { fiber: 2, sugar: 7, sodium: 520 }),
  panda('Beijing Beef', 'Entree', 480, 14, 46, 27, { fiber: 1, sugar: 24, sodium: 660, tags: ['fried'] }),
  panda('Honey Walnut Shrimp', 'Entree', 360, 13, 35, 23, { fiber: 2, sugar: 9, sodium: 440, tags: ['fried'] }),
  panda('Chow Mein', 'Side', 510, 13, 80, 20, { fiber: 6, sugar: 9, sodium: 860, tags: ['vegetarian'] }),
  panda('Fried Rice', 'Side', 520, 11, 85, 16, { fiber: 1, sugar: 3, sodium: 850, tags: ['vegetarian'] }),
  panda('White Steamed Rice', 'Side', 380, 7, 87, 0, { fiber: 0, sugar: 0, sodium: 0, tags: ['vegan'] }),
  panda('Super Greens', 'Side', 90, 6, 10, 3, { fiber: 5, sugar: 3, sodium: 260, tags: ['vegan'] }),
  panda('Chicken Egg Roll', 'Side', 200, 8, 20, 10, { fiber: 2, sugar: 2, sodium: 390, tags: ['fried'] }),
  panda('Cream Cheese Rangoon (3)', 'Side', 190, 5, 24, 8, { fiber: 1, sugar: 1, sodium: 180, tags: ['fried', 'vegetarian'] }),

  // ───────── Five Guys ─────────
  fg('Hamburger', 'Burger', 700, 39, 39, 43, { fiber: 2, sugar: 8, sodium: 430, note: 'Two patties, no toppings' }),
  fg('Cheeseburger', 'Burger', 840, 47, 40, 55, { fiber: 2, sugar: 8, sodium: 1050, note: 'Two patties, no toppings' }),
  fg('Bacon Cheeseburger', 'Burger', 920, 51, 40, 62, { fiber: 2, sugar: 8, sodium: 1310, note: 'Two patties, no toppings' }),
  fg('Little Hamburger', 'Burger', 480, 23, 39, 26, { fiber: 2, sugar: 8, sodium: 380, note: 'One patty, no toppings' }),
  fg('Little Cheeseburger', 'Burger', 550, 27, 40, 32, { fiber: 2, sugar: 8, sodium: 690, note: 'One patty, no toppings' }),
  fg('Little Bacon Cheeseburger', 'Burger', 630, 31, 40, 39, { fiber: 2, sugar: 8, sodium: 950, note: 'One patty, no toppings' }),
  fg('Bunless Cheeseburger (lettuce wrap)', 'Burger', 580, 38, 1, 46, { fiber: 0, sugar: 0, sodium: 740, note: 'Two patties, two slices cheese' }),
  fg('Hot Dog', 'Sandwich', 520, 18, 40, 35, { fiber: 2, sugar: 8, sodium: 1130 }),
  fg('Veggie Sandwich', 'Sandwich', 440, 16, 60, 15, { fiber: 4, sugar: 12, sodium: 1040, tags: ['vegetarian'] }),
  fg('Little Fries', 'Side', 530, 8, 72, 23, { fiber: 7, sugar: 2, sodium: 530, tags: ['fried', 'vegan'] }),
  fg('Regular Fries', 'Side', 950, 15, 131, 41, { fiber: 13, sugar: 3, sodium: 960, tags: ['fried', 'vegan'] }),
  fg('Vanilla Milkshake', 'Dessert', 670, 16, 84, 32, { fiber: 0, sugar: 76, sodium: 390, tags: ['vegetarian'] }),

  // ───────── In-N-Out ─────────
  ino('Hamburger', 'Burger', 390, 16, 39, 19, { fiber: 3, sugar: 10, sodium: 650 }),
  ino('Cheeseburger', 'Burger', 480, 22, 39, 27, { fiber: 3, sugar: 10, sodium: 1000 }),
  ino('Double-Double', 'Burger', 670, 37, 39, 41, { fiber: 3, sugar: 10, sodium: 1440 }),
  ino('Protein Style Hamburger', 'Burger', 240, 13, 11, 17, { fiber: 3, sugar: 7, sodium: 370, note: 'Lettuce wrap, no bun' }),
  ino('Protein Style Cheeseburger', 'Burger', 330, 18, 11, 25, { fiber: 3, sugar: 7, sodium: 720, note: 'Lettuce wrap, no bun' }),
  ino('Protein Style Double-Double', 'Burger', 520, 33, 11, 39, { fiber: 3, sugar: 7, sodium: 1160, note: 'Lettuce wrap, no bun' }),
  ino('Flying Dutchman', 'Burger', 380, 30, 1, 28, { fiber: 0, sugar: 0, sodium: 760, note: 'Two patties, two slices cheese, no bun' }),
  ino('Grilled Cheese', 'Sandwich', 380, 12, 39, 20, { fiber: 3, sugar: 10, sodium: 720, tags: ['vegetarian'] }),
  ino('French Fries', 'Side', 370, 7, 52, 15, { fiber: 2, sugar: 0, sodium: 250, tags: ['fried', 'vegan'] }),
  ino('Chocolate Shake', 'Dessert', 590, 9, 70, 29, { fiber: 0, sugar: 62, sodium: 350, tags: ['vegetarian'] }),

  // ───────── CAVA ─────────
  cava('Grilled Chicken Greens Bowl', 'Bowl', 515, 44, 25, 24, {
    fiber: 8, sugar: 6, sodium: 1100, tags: ['grilled'],
    note: 'SuperGreens, grilled chicken, roasted vegetables, hummus, tzatziki, tomato & cucumber',
  }),
  cava('Grilled Chicken Grain Bowl', 'Bowl', 920, 61, 105, 30, {
    fiber: 14, sugar: 7, sodium: 1480, tags: ['grilled'],
    note: 'Saffron rice, grilled chicken, black lentils, roasted vegetables, hummus, tzatziki, feta',
  }),
  cava('Harissa Honey Chicken Pita', 'Wrap', 725, 46, 59, 34, {
    fiber: 5, sugar: 12, sodium: 1350, tags: ['grilled'],
    note: 'Pita, harissa honey chicken, hummus, pickled onions, tomato & cucumber, garlic dressing',
  }),
  cava('Spicy Lamb Meatball Grain Bowl', 'Bowl', 750, 35, 75, 38, {
    fiber: 9, sugar: 8, sodium: 1420,
    note: 'Brown rice, spicy lamb meatballs, roasted vegetables, crazy feta, tzatziki',
  }),
  cava('Falafel Greens Bowl', 'Bowl', 815, 28, 96, 38, {
    fiber: 20, sugar: 8, sodium: 1560, tags: ['vegan', 'fried'],
    note: 'SuperGreens, falafel, black lentils, roasted vegetables, hummus, lemon herb tahini',
  }),
  cava('Grilled Chicken (protein add)', 'Entree', 250, 37, 0, 11, { sodium: 460, tags: ['grilled'], note: 'Protein serving only' }),
  cava('Pita Chips', 'Side', 210, 5, 35, 6, { fiber: 2, sugar: 1, sodium: 400, tags: ['vegan'] }),

  // ───────── Dunkin' ─────────
  dd('Egg & Cheese Wake-Up Wrap', 'Breakfast', 180, 8, 13, 10, { fiber: 0, sugar: 1, sodium: 390, tags: ['vegetarian'] }),
  dd('Turkey Sausage Wake-Up Wrap', 'Breakfast', 240, 13, 14, 15, { fiber: 0, sugar: 1, sodium: 540 }),
  dd('Egg & Cheese English Muffin', 'Breakfast', 320, 14, 36, 13, { fiber: 1, sugar: 3, sodium: 640, tags: ['vegetarian'] }),
  dd('Bacon, Egg & Cheese Bagel', 'Breakfast', 480, 23, 55, 18, { fiber: 2, sugar: 7, sodium: 1130 }),
  dd('Sausage, Egg & Cheese Croissant', 'Breakfast', 720, 22, 40, 53, { fiber: 1, sugar: 6, sodium: 1170 }),
  dd('Plain Bagel', 'Breakfast', 300, 11, 60, 2, { fiber: 2, sugar: 5, sodium: 570, tags: ['vegan'] }),
  dd('Hash Browns (6 pc)', 'Side', 130, 1, 17, 6, { fiber: 1, sugar: 0, sodium: 360, tags: ['fried', 'vegan'] }),
  dd('Glazed Donut', 'Dessert', 240, 3, 31, 11, { fiber: 1, sugar: 12, sodium: 290, tags: ['vegetarian'] }),
  dd('Boston Kreme Donut', 'Dessert', 270, 3, 37, 12, { fiber: 1, sugar: 17, sodium: 320, tags: ['vegetarian'] }),
  dd('Iced Latte (medium, 2%)', 'Drink', 140, 9, 14, 5, { sugar: 13, sodium: 130, tags: ['vegetarian'] }),
  dd('Caramel Craze Iced Signature Latte (medium)', 'Drink', 320, 9, 48, 9, { sugar: 46, sodium: 170, tags: ['vegetarian'] }),
  dd('Hot Coffee (medium, black)', 'Drink', 5, 0, 1, 0, { sugar: 0, sodium: 10, tags: ['vegan'] }),

  // ───────── Burger King ─────────
  bk('Whopper', 'Burger', 670, 31, 58, 40, { fiber: 2, sugar: 12, sodium: 910 }),
  bk('Whopper Jr.', 'Burger', 330, 14, 32, 18, { fiber: 1, sugar: 7, sodium: 560 }),
  bk('Impossible Whopper', 'Burger', 630, 25, 58, 34, { fiber: 4, sugar: 12, sodium: 1080, tags: ['vegetarian'] }),
  bk('Bacon King', 'Burger', 1150, 61, 51, 79, { fiber: 2, sugar: 11, sodium: 2150 }),
  bk('Hamburger', 'Burger', 250, 13, 28, 10, { fiber: 1, sugar: 6, sodium: 500 }),
  bk('Cheeseburger', 'Burger', 280, 15, 28, 13, { fiber: 1, sugar: 6, sodium: 700 }),
  bk('Original Chicken Sandwich', 'Sandwich', 660, 23, 60, 40, { fiber: 2, sugar: 6, sodium: 1170, tags: ['fried'] }),
  bk('BK Royal Crispy Chicken', 'Sandwich', 460, 22, 43, 22, { fiber: 2, sugar: 7, sodium: 1050, tags: ['fried'] }),
  bk('Chicken Fries (9 pc)', 'Entree', 290, 14, 20, 17, { fiber: 1, sugar: 0, sodium: 780, tags: ['fried'] }),
  bk('French Fries (medium)', 'Side', 380, 5, 53, 17, { fiber: 4, sugar: 0, sodium: 670, tags: ['fried', 'vegan'] }),
  bk('Onion Rings (medium)', 'Side', 410, 5, 53, 19, { fiber: 3, sugar: 5, sodium: 1080, tags: ['fried', 'vegetarian'] }),
  bk("Sausage, Egg & Cheese Croissan'wich", 'Breakfast', 500, 19, 32, 32, { fiber: 1, sugar: 4, sodium: 1000 }),
  bk('Soft Serve Cone', 'Dessert', 190, 4, 30, 5, { fiber: 0, sugar: 20, sodium: 100, tags: ['vegetarian'] }),

  // ───────── Shake Shack ─────────
  ss('ShackBurger (single)', 'Burger', 530, 30, 27, 33, { fiber: 1, sugar: 6, sodium: 1200 }),
  ss('ShackBurger (double)', 'Burger', 790, 46, 28, 55, { fiber: 1, sugar: 6, sodium: 1690 }),
  ss('Hamburger (single)', 'Burger', 360, 22, 26, 19, { fiber: 1, sugar: 4, sodium: 600 }),
  ss("'Shroom Burger", 'Burger', 490, 15, 55, 25, { fiber: 3, sugar: 7, sodium: 900, tags: ['vegetarian', 'fried'] }),
  ss('Chicken Shack', 'Sandwich', 600, 40, 49, 26, { fiber: 2, sugar: 7, sodium: 1340, tags: ['fried'] }),
  ss('Chicken Bites (6 pc)', 'Entree', 290, 22, 20, 13, { fiber: 1, sugar: 0, sodium: 700, tags: ['fried'] }),
  ss('Hot Dog', 'Sandwich', 400, 14, 30, 27, { fiber: 1, sugar: 6, sodium: 1100 }),
  ss('Crinkle Cut Fries', 'Side', 470, 6, 67, 21, { fiber: 5, sugar: 1, sodium: 920, tags: ['fried', 'vegan'] }),
  ss('Vanilla Shake', 'Dessert', 580, 15, 59, 31, { fiber: 0, sugar: 50, sodium: 320, tags: ['vegetarian'] }),

  // ───────── Domino's ─────────
  dom('Hand Tossed Cheese Pizza (1 slice, large)', 'Pizza', 290, 11, 34, 11, { fiber: 2, sugar: 3, sodium: 640, tags: ['vegetarian'] }),
  dom('Hand Tossed Pepperoni Pizza (1 slice, large)', 'Pizza', 310, 13, 34, 14, { fiber: 2, sugar: 3, sodium: 720 }),
  dom('Thin Crust Cheese Pizza (1 slice, large)', 'Pizza', 220, 9, 16, 13, { fiber: 1, sugar: 1, sodium: 450, tags: ['vegetarian'] }),
  dom('Pacific Veggie Pizza (1 slice, large)', 'Pizza', 310, 14, 36, 13, { fiber: 3, sugar: 4, sodium: 700, tags: ['vegetarian'] }),
  dom('Philly Cheese Steak Pizza (1 slice, large)', 'Pizza', 300, 14, 34, 12, { fiber: 2, sugar: 3, sodium: 690 }),
  dom('Boneless Chicken (8 pc)', 'Entree', 490, 20, 44, 25, { fiber: 2, sugar: 1, sodium: 1100, tags: ['fried'] }),
  dom('Plain Chicken Wings (8 pc)', 'Entree', 480, 40, 1, 33, { fiber: 0, sugar: 0, sodium: 1400 }),
  dom('Chicken Caesar Salad', 'Salad', 170, 17, 10, 7, { fiber: 2, sugar: 3, sodium: 580, note: 'No dressing' }),
  dom('Bread Twists / Breadstick (1)', 'Side', 110, 3, 15, 4, { fiber: 1, sugar: 1, sodium: 160, tags: ['vegetarian'] }),
  dom('Chocolate Lava Crunch Cake', 'Dessert', 350, 4, 45, 17, { fiber: 2, sugar: 21, sodium: 220, tags: ['vegetarian'] }),

  // ───────── Olive Garden ─────────
  og('Herb-Grilled Salmon', 'Entree', 460, 50, 8, 28, { fiber: 3, sugar: 3, sodium: 760, tags: ['grilled'] }),
  og('Chicken Margherita', 'Entree', 540, 59, 16, 24, { fiber: 4, sugar: 6, sodium: 1040, tags: ['grilled'] }),
  og('Shrimp Scampi', 'Entree', 510, 34, 60, 16, { fiber: 5, sugar: 5, sodium: 1750 }),
  og('Spaghetti with Meat Sauce', 'Entree', 710, 30, 90, 24, { fiber: 7, sugar: 10, sodium: 1360 }),
  og('Lasagna Classico', 'Entree', 930, 48, 50, 60, { fiber: 5, sugar: 13, sodium: 2290 }),
  og('Chicken Parmigiana', 'Entree', 1060, 60, 68, 60, { fiber: 7, sugar: 11, sodium: 2280, tags: ['fried'] }),
  og('Fettuccine Alfredo', 'Entree', 1310, 45, 95, 83, { fiber: 5, sugar: 7, sodium: 1630, tags: ['vegetarian'] }),
  og('Chicken Alfredo', 'Entree', 1570, 71, 96, 99, { fiber: 5, sugar: 7, sodium: 2080 }),
  og('Tour of Italy', 'Entree', 1480, 75, 92, 85, { fiber: 7, sugar: 14, sodium: 3170 }),
  og('Minestrone Soup', 'Soup', 110, 5, 18, 1, { fiber: 4, sugar: 5, sodium: 810, tags: ['vegan'] }),
  og('Zuppa Toscana', 'Soup', 220, 8, 16, 15, { fiber: 2, sugar: 2, sodium: 960 }),
  og('House Salad with Dressing', 'Salad', 150, 2, 11, 10, { fiber: 2, sugar: 4, sodium: 580, tags: ['vegetarian'] }),
  og('Breadstick with Garlic Topping (1)', 'Side', 140, 4, 25, 3, { fiber: 1, sugar: 1, sodium: 460, tags: ['vegetarian'] }),
]

export const categories: Category[] = [
  'Bowl',
  'Salad',
  'Burger',
  'Sandwich',
  'Wrap',
  'Taco',
  'Entree',
  'Pizza',
  'Soup',
  'Breakfast',
  'Side',
  'Dessert',
  'Drink',
]
