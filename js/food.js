// js/food.js

let searchTimeout;
let currentSelectedFood = null;
const todayStr = new Date().toISOString().split('T')[0];

const FOOD_CATEGORIES = [
  { id: 'fruits', name: 'Fruits', icon: 'fa-apple-alt', color: '#FF4D6D' },
  { id: 'veg', name: 'Vegetables', icon: 'fa-carrot', color: '#FFB347' },
  { id: 'grains', name: 'Grains & Pulses', icon: 'fa-seedling', color: '#00F5A0' },
  { id: 'dairy_egg', name: 'Dairy & Eggs', icon: 'fa-egg', color: '#00D4FF' },
  { id: 'snacks', name: 'Snacks & Nuts', icon: 'fa-cookie', color: '#6366F1' }
];

const PREDEFINED_FOODS = {
  fruits: [
    { name: 'Apple (1 medium)', cal: 95, price: 20, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, sodium: 2, potassium: 195, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=200' },
    { name: 'Banana (1 medium)', cal: 105, price: 10, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1, sugar: 14, sodium: 1, potassium: 422, sat_fat: 0.1, chol: 0, img: 'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=200' },
    { name: 'Mango (1 cup)', cal: 99, price: 40, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, sugar: 23, sodium: 2, potassium: 277, sat_fat: 0.1, chol: 0, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200' },
    { name: 'Grapes (1 cup)', cal: 104, price: 50, protein: 1.1, carbs: 27, fat: 0.2, fiber: 1.4, sugar: 23, sodium: 3, potassium: 288, sat_fat: 0.1, chol: 0, img: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200' },
    { name: 'Orange (1 medium)', cal: 62, price: 15, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12, sodium: 0, potassium: 237, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1549888834-3ec93abae044?w=200' },
    { name: 'Papaya (1 cup)', cal: 62, price: 30, protein: 0.7, carbs: 16, fat: 0.4, fiber: 2.5, sugar: 11, sodium: 12, potassium: 264, sat_fat: 0.1, chol: 0, img: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26af?w=200' },
    { name: 'Watermelon (1 cup)', cal: 46, price: 20, protein: 0.9, carbs: 11, fat: 0.2, fiber: 0.6, sugar: 9, sodium: 2, potassium: 170, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=200' },
    { name: 'Pineapple (1 cup)', cal: 82, price: 40, protein: 0.9, carbs: 22, fat: 0.2, fiber: 2.3, sugar: 16, sodium: 2, potassium: 180, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200' },
    { name: 'Pomegranate (1 cup)', cal: 144, price: 60, protein: 2.9, carbs: 33, fat: 2.0, fiber: 7.0, sugar: 24, sodium: 5, potassium: 411, sat_fat: 0.2, chol: 0, img: 'https://images.unsplash.com/photo-1615486171439-d3e758e578c7?w=200' },
    { name: 'Guava (1 medium)', cal: 37, price: 15, protein: 1.4, carbs: 8, fat: 0.5, fiber: 3.0, sugar: 5, sodium: 1, potassium: 229, sat_fat: 0.1, chol: 0, img: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=200' },
    { name: 'Kiwi (1 medium)', cal: 42, price: 30, protein: 0.8, carbs: 10, fat: 0.4, fiber: 2.1, sugar: 6, sodium: 2, potassium: 215, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1585059895524-72359aa06a06?w=200' },
    { name: 'Strawberries (1 cup)', cal: 49, price: 80, protein: 1.0, carbs: 12, fat: 0.5, fiber: 3.0, sugar: 7, sodium: 1, potassium: 220, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200' },
    { name: 'Chikoo / Sapota (1 medium)', cal: 98, price: 20, protein: 0.7, carbs: 25, fat: 1.9, fiber: 9.0, sugar: 15, sodium: 20, potassium: 326, sat_fat: 0.3, chol: 0, img: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=200' },
    { name: 'Pear (1 medium)', cal: 101, price: 25, protein: 0.6, carbs: 27, fat: 0.3, fiber: 5.5, sugar: 17, sodium: 2, potassium: 206, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=200' },
    { name: 'Avocado (Half)', cal: 114, price: 100, protein: 1.3, carbs: 6, fat: 10.5, fiber: 4.6, sugar: 0.2, sodium: 5, potassium: 345, sat_fat: 1.5, chol: 0, img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200' }
  ],
  veg: [
    { name: 'Potato (100g boiled)', cal: 87, price: 10, protein: 1.9, carbs: 20, fat: 0.1, fiber: 1.8, sugar: 0.9, sodium: 5, potassium: 379, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200' },
    { name: 'Spinach (1 cup)', cal: 7, price: 15, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, sugar: 0.1, sodium: 24, potassium: 167, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200' },
    { name: 'Tomato (1 medium)', cal: 22, price: 8, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.5, sugar: 3.2, sodium: 6, potassium: 292, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200' },
    { name: 'Broccoli (1 cup)', cal: 31, price: 40, protein: 2.6, carbs: 6.0, fat: 0.3, fiber: 2.4, sugar: 1.5, sodium: 30, potassium: 288, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200' },
    { name: 'Carrot (1 medium)', cal: 25, price: 5, protein: 0.6, carbs: 5.8, fat: 0.1, fiber: 1.7, sugar: 2.9, sodium: 42, potassium: 195, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200' },
    { name: 'Onion (1 medium)', cal: 44, price: 5, protein: 1.2, carbs: 10.3, fat: 0.1, fiber: 1.9, sugar: 4.7, sodium: 4, potassium: 161, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200' },
    { name: 'Cauliflower (1 cup)', cal: 25, price: 20, protein: 2.0, carbs: 5.0, fat: 0.1, fiber: 2.5, sugar: 2.0, sodium: 30, potassium: 300, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=200' },
    { name: 'Cabbage (1 cup)', cal: 22, price: 15, protein: 1.1, carbs: 5.2, fat: 0.1, fiber: 2.2, sugar: 2.9, sodium: 16, potassium: 151, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1558197779-19fc7740e5ec?w=200' },
    { name: 'Capsicum (1 medium)', cal: 24, price: 12, protein: 1.0, carbs: 5.5, fat: 0.2, fiber: 2.0, sugar: 2.9, sodium: 3, potassium: 211, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=200' },
    { name: 'Bhindi / Okra (100g)', cal: 33, price: 20, protein: 1.9, carbs: 7.5, fat: 0.2, fiber: 3.2, sugar: 1.5, sodium: 7, potassium: 299, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=200' },
    { name: 'Bottle Gourd / Lauki (100g)', cal: 14, price: 15, protein: 0.6, carbs: 3.4, fat: 0.1, fiber: 0.5, sugar: 1.4, sodium: 2, potassium: 87, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1595856719959-1e33d0ebdf7a?w=200' },
    { name: 'Bitter Gourd / Karela (100g)', cal: 17, price: 20, protein: 1.0, carbs: 3.7, fat: 0.2, fiber: 2.8, sugar: 1.0, sodium: 5, potassium: 296, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1595856719959-1e33d0ebdf7a?w=200' },
    { name: 'Brinjal / Eggplant (1 cup)', cal: 20, price: 15, protein: 0.8, carbs: 4.8, fat: 0.2, fiber: 2.5, sugar: 2.9, sodium: 2, potassium: 188, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1601375836965-728b759600a9?w=200' },
    { name: 'Mushrooms (1 cup)', cal: 15, price: 30, protein: 2.2, carbs: 2.3, fat: 0.2, fiber: 0.7, sugar: 1.4, sodium: 4, potassium: 223, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=200' },
    { name: 'Green Peas (1 cup)', cal: 118, price: 20, protein: 7.9, carbs: 21, fat: 0.6, fiber: 8.3, sugar: 8.2, sodium: 7, potassium: 354, sat_fat: 0.1, chol: 0, img: 'https://images.unsplash.com/photo-1582294406248-c2fc89d6eefb?w=200' }
  ],
  grains: [
    { name: 'White Rice (1 cup cooked)', cal: 205, price: 25, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, sugar: 0.1, sodium: 1, potassium: 55, sat_fat: 0.1, chol: 0, img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=200' },
    { name: 'Brown Rice (1 cup cooked)', cal: 216, price: 30, protein: 5.0, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0.7, sodium: 2, potassium: 84, sat_fat: 0.4, chol: 0, img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=200' },
    { name: 'Roti / Chapati (1 piece)', cal: 120, price: 10, protein: 3.8, carbs: 22, fat: 1.5, fiber: 3.0, sugar: 0, sodium: 150, potassium: 90, sat_fat: 0.2, chol: 0, img: 'https://images.unsplash.com/photo-1627308595229-7830f5c90656?w=200' },
    { name: 'Paratha (Plain, 1 piece)', cal: 260, price: 20, protein: 5.0, carbs: 32, fat: 12, fiber: 3.5, sugar: 1.0, sodium: 200, potassium: 120, sat_fat: 4.0, chol: 10, img: 'https://images.unsplash.com/photo-1626077395027-e4352f7f98ee?w=200' },
    { name: 'Oats (100g dry)', cal: 389, price: 20, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6, sugar: 1.0, sodium: 2, potassium: 429, sat_fat: 1.2, chol: 0, img: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=200' },
    { name: 'Quinoa (1 cup cooked)', cal: 222, price: 60, protein: 8.1, carbs: 39, fat: 3.6, fiber: 5.2, sugar: 1.6, sodium: 13, potassium: 318, sat_fat: 0.4, chol: 0, img: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=200' },
    { name: 'Toor Dal (1 cup cooked)', cal: 198, price: 25, protein: 11, carbs: 35, fat: 0.9, fiber: 9, sugar: 1.5, sodium: 5, potassium: 300, sat_fat: 0.1, chol: 0, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200' },
    { name: 'Moong Dal (1 cup cooked)', cal: 212, price: 25, protein: 14, carbs: 39, fat: 0.8, fiber: 15, sugar: 2, sodium: 4, potassium: 266, sat_fat: 0.1, chol: 0, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200' },
    { name: 'Masoor Dal (1 cup cooked)', cal: 230, price: 25, protein: 16, carbs: 40, fat: 0.8, fiber: 16, sugar: 1.8, sodium: 4, potassium: 369, sat_fat: 0.1, chol: 0, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200' },
    { name: 'Chickpeas / Chole (1 cup)', cal: 269, price: 30, protein: 14.5, carbs: 45, fat: 4.2, fiber: 12.5, sugar: 8, sodium: 11, potassium: 477, sat_fat: 0.4, chol: 0, img: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=200' },
    { name: 'Rajma / Kidney Beans (1 cup)', cal: 225, price: 30, protein: 15.3, carbs: 40, fat: 0.9, fiber: 13.1, sugar: 0, sodium: 2, potassium: 713, sat_fat: 0.1, chol: 0, img: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=200' },
    { name: 'Urad Dal / Black Gram (1 cup)', cal: 227, price: 25, protein: 14.5, carbs: 41, fat: 0.8, fiber: 11, sugar: 1, sodium: 7, potassium: 360, sat_fat: 0.1, chol: 0, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200' },
    { name: 'Besan Chilla (1 piece)', cal: 150, price: 20, protein: 7.0, carbs: 18, fat: 5.5, fiber: 3.5, sugar: 2, sodium: 250, potassium: 180, sat_fat: 0.8, chol: 0, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=200' },
    { name: 'Idli (1 piece)', cal: 39, price: 10, protein: 1.2, carbs: 8, fat: 0.1, fiber: 0.5, sugar: 0.1, sodium: 15, potassium: 10, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=200' },
    { name: 'Dosa (Plain, 1 piece)', cal: 133, price: 30, protein: 3.0, carbs: 24, fat: 2.5, fiber: 1.0, sugar: 0.5, sodium: 94, potassium: 85, sat_fat: 0.5, chol: 0, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=200' }
  ],
  dairy_egg: [
    { name: 'Boiled Egg (1 large)', cal: 78, price: 10, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, sugar: 0.6, sodium: 62, potassium: 63, sat_fat: 1.6, chol: 186, img: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=200' },
    { name: 'Omelette (2 eggs)', cal: 188, price: 40, protein: 12.6, carbs: 1.2, fat: 14.1, fiber: 0, sugar: 0.8, sodium: 320, potassium: 150, sat_fat: 4.5, chol: 370, img: 'https://images.unsplash.com/photo-1495521939206-a217dfa14d5e?w=200' },
    { name: 'Scrambled Eggs (2 eggs)', cal: 199, price: 45, protein: 13, carbs: 2, fat: 15, fiber: 0, sugar: 1, sodium: 340, potassium: 160, sat_fat: 4.8, chol: 375, img: 'https://images.unsplash.com/photo-1510693215886-c4d3eb4759ea?w=200' },
    { name: 'Egg Curry (1 bowl)', cal: 240, price: 80, protein: 14, carbs: 12, fat: 16, fiber: 3, sugar: 4, sodium: 450, potassium: 300, sat_fat: 3.5, chol: 372, img: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=200' },
    { name: 'Milk (1 cup / 250ml)', cal: 103, price: 15, protein: 8.0, carbs: 12, fat: 2.4, fiber: 0, sugar: 12, sodium: 107, potassium: 366, sat_fat: 1.5, chol: 10, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200' },
    { name: 'Full Cream Milk (1 cup)', cal: 150, price: 20, protein: 8.0, carbs: 12, fat: 8.0, fiber: 0, sugar: 12, sodium: 105, potassium: 320, sat_fat: 4.5, chol: 24, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200' },
    { name: 'Paneer (100g raw)', cal: 265, price: 40, protein: 18.0, carbs: 1.2, fat: 20.0, fiber: 0, sugar: 1.2, sodium: 18, potassium: 105, sat_fat: 12, chol: 65, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=200' },
    { name: 'Paneer Tikka (1 serving)', cal: 280, price: 120, protein: 19.5, carbs: 10, fat: 18, fiber: 3.0, sugar: 4, sodium: 400, potassium: 250, sat_fat: 10, chol: 60, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=200' },
    { name: 'Curd / Yogurt (1 cup)', cal: 98, price: 15, protein: 8.5, carbs: 11, fat: 2.0, fiber: 0, sugar: 11, sodium: 113, potassium: 380, sat_fat: 1.2, chol: 10, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200' },
    { name: 'Greek Yogurt (1 cup)', cal: 100, price: 60, protein: 17, carbs: 6, fat: 0.7, fiber: 0, sugar: 5.5, sodium: 60, potassium: 240, sat_fat: 0.3, chol: 5, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200' },
    { name: 'Buttermilk / Chaas (1 glass)', cal: 40, price: 10, protein: 3.3, carbs: 4.8, fat: 0.9, fiber: 0, sugar: 4.8, sodium: 150, potassium: 151, sat_fat: 0.5, chol: 5, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200' },
    { name: 'Lassi (Sweet, 1 glass)', cal: 150, price: 40, protein: 5.0, carbs: 22, fat: 4.5, fiber: 0, sugar: 20, sodium: 90, potassium: 200, sat_fat: 2.5, chol: 15, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200' },
    { name: 'Butter (1 tbsp)', cal: 102, price: 10, protein: 0.1, carbs: 0, fat: 11.5, fiber: 0, sugar: 0, sodium: 91, potassium: 3, sat_fat: 7.3, chol: 31, img: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=200' },
    { name: 'Ghee (1 tbsp)', cal: 120, price: 15, protein: 0, carbs: 0, fat: 14.0, fiber: 0, sugar: 0, sodium: 0, potassium: 0, sat_fat: 9.0, chol: 36, img: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=200' },
    { name: 'Cheese Slice (1 piece)', cal: 60, price: 15, protein: 3.5, carbs: 0.5, fat: 5.0, fiber: 0, sugar: 0.5, sodium: 150, potassium: 20, sat_fat: 3.0, chol: 15, img: 'https://images.unsplash.com/photo-1626077395027-e4352f7f98ee?w=200' }
  ],
  snacks: [
    { name: 'Almonds (10-12 pieces)', cal: 85, price: 20, protein: 3.0, carbs: 3.0, fat: 7.0, fiber: 1.8, sugar: 0.6, sodium: 0, potassium: 105, sat_fat: 0.6, chol: 0, img: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=200' },
    { name: 'Walnuts (10-12 halves)', cal: 130, price: 30, protein: 3.0, carbs: 2.8, fat: 13, fiber: 1.3, sugar: 0.5, sodium: 0, potassium: 88, sat_fat: 1.2, chol: 0, img: 'https://images.unsplash.com/photo-1568285511210-9080bfeb2a4e?w=200' },
    { name: 'Cashews (10-12 pieces)', cal: 110, price: 25, protein: 3.5, carbs: 6.0, fat: 9.0, fiber: 0.6, sugar: 1.0, sodium: 2, potassium: 115, sat_fat: 1.5, chol: 0, img: 'https://images.unsplash.com/photo-1502573215201-1b960b72a4d3?w=200' },
    { name: 'Peanuts (Roasted, 50g)', cal: 290, price: 15, protein: 12.5, carbs: 8.0, fat: 24.5, fiber: 4.5, sugar: 2.0, sodium: 5, potassium: 350, sat_fat: 3.5, chol: 0, img: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=200' },
    { name: 'Peanut Butter (1 tbsp)', cal: 94, price: 10, protein: 4.0, carbs: 3.0, fat: 8.0, fiber: 1.0, sugar: 1.5, sodium: 70, potassium: 104, sat_fat: 1.6, chol: 0, img: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=200' },
    { name: 'Makhana / Fox Nuts (1 cup)', cal: 106, price: 40, protein: 3.1, carbs: 24, fat: 0.1, fiber: 2.3, sugar: 0, sodium: 3, potassium: 10, sat_fat: 0, chol: 0, img: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200' },
    { name: 'Roasted Chana (1 cup)', cal: 269, price: 20, protein: 14.5, carbs: 45, fat: 4.2, fiber: 12.5, sugar: 8.0, sodium: 11, potassium: 477, sat_fat: 0.4, chol: 0, img: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=200' },
    { name: 'Pumpkin Seeds (1 tbsp)', cal: 45, price: 15, protein: 2.5, carbs: 1.5, fat: 3.8, fiber: 0.5, sugar: 0.1, sodium: 1, potassium: 65, sat_fat: 0.7, chol: 0, img: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=200' },
    { name: 'Chia Seeds (1 tbsp)', cal: 60, price: 15, protein: 2.0, carbs: 5.0, fat: 3.5, fiber: 4.0, sugar: 0, sodium: 2, potassium: 50, sat_fat: 0.4, chol: 0, img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=200' },
    { name: 'Poha (1 bowl)', cal: 250, price: 30, protein: 5.0, carbs: 45, fat: 6.0, fiber: 2.5, sugar: 2.0, sodium: 300, potassium: 150, sat_fat: 1.0, chol: 0, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=200' },
    { name: 'Upma (1 bowl)', cal: 180, price: 30, protein: 5.0, carbs: 32, fat: 4.0, fiber: 2.5, sugar: 2.0, sodium: 400, potassium: 180, sat_fat: 0.5, chol: 0, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=200' },
    { name: 'Dhokla (2 pieces)', cal: 160, price: 20, protein: 6.0, carbs: 22, fat: 5.0, fiber: 3.0, sugar: 3.0, sodium: 350, potassium: 120, sat_fat: 0.5, chol: 0, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=200' },
    { name: 'Samosa (1 piece)', cal: 260, price: 15, protein: 3.5, carbs: 24, fat: 17, fiber: 2.0, sugar: 1.0, sodium: 300, potassium: 180, sat_fat: 4.0, chol: 0, img: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=200' },
    { name: 'Bhel Puri (1 plate)', cal: 280, price: 30, protein: 6.0, carbs: 55, fat: 5.0, fiber: 6.0, sugar: 10, sodium: 600, potassium: 350, sat_fat: 0.5, chol: 0, img: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=200' },
    { name: 'Protein Bar (1 bar)', cal: 200, price: 80, protein: 20.0, carbs: 22, fat: 6.0, fiber: 5.0, sugar: 2.0, sodium: 150, potassium: 180, sat_fat: 2.0, chol: 5, img: 'https://images.unsplash.com/photo-1622484211148-522204c3e800?w=200' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length < 3) {
      document.getElementById('resultsGrid').innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text3); padding: 40px;">Type at least 3 characters to search...</p>';
      return;
    }
    
    document.getElementById('resultsGrid').innerHTML = '<div class="loader"><i class="fas fa-spinner fa-spin fa-2x"></i><p style="margin-top:12px; font-size:12px;">Searching...</p></div>';
    
    searchTimeout = setTimeout(() => {
      searchLocalFoods(query);
    }, 300);
  });
  


  if (currentUser) {
    loadRecentFoods();
    renderCategories();
  }
});

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  const views = ['browseView', 'searchView', 'recentView', 'storeView'];
  views.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.classList.add('hide');
  });
  
  const target = document.getElementById(`${tab}View`);
  if (target) target.classList.remove('hide');
}

function renderCategories() {
  const pillsContainer = document.getElementById('categoryPills');
  if (!pillsContainer) return;
  
  pillsContainer.innerHTML = FOOD_CATEGORIES.map(c => `
    <button class="cat-pill" id="cat-pill-${c.id}" onclick="renderCategoryFoods('${c.id}')" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--surface); border: 1px solid transparent; border-radius: 20px; white-space: nowrap; font-size: 13px; font-weight: 600; color: var(--text2); transition: 0.2s; cursor: pointer;">
      <i class="fas ${c.icon}" style="color: ${c.color}"></i> ${c.name}
    </button>
  `).join('');
  
  // Default load first category
  renderCategoryFoods(FOOD_CATEGORIES[0].id);
}

function renderCategoryFoods(catId) {
  // Update active pill styling
  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.style.background = 'var(--surface)';
    pill.style.color = 'var(--text2)';
    pill.style.border = '1px solid transparent';
  });
  
  const activePill = document.getElementById(`cat-pill-${catId}`);
  if (activePill) {
    activePill.style.background = 'rgba(0, 245, 160, 0.1)';
    activePill.style.color = 'var(--primary)';
    activePill.style.border = '1px solid var(--primary)';
  }
  
  const grid = document.getElementById('categoryFoodsGrid');
  if (!grid) return;
  grid.classList.remove('hide');
  
  const foods = PREDEFINED_FOODS[catId] || [];
  grid.innerHTML = foods.map((f, index) => {
    return `
      <div class="food-card" onclick="openPredefinedFoodModal('${catId}', ${index})">
        <img src="${f.img}" alt="${f.name}" class="food-img" onerror="this.src='https://via.placeholder.com/64?text=Food'">
        <div class="food-name">${f.name}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; margin-bottom: 8px;">
          <div class="food-cal" style="margin: 0;">${f.cal} kcal</div>
          <div style="color: var(--primary); font-weight: 800; font-size: 14px;">₹${f.price}</div>
        </div>
        <button class="btn btn-outline btn-full" onclick="quickAddToCart(event, '${catId}', ${index})" style="font-size: 13px; padding: 6px; border-radius: 8px;">
          <i class="fas fa-cart-plus"></i> Add
        </button>
      </div>
    `;
  }).join('');
}

let currentFoodObj = null;

function openPredefinedFoodModal(catId, index) {
  const food = PREDEFINED_FOODS[catId][index];
  currentFoodObj = food;
  
  document.getElementById('modalName').textContent = food.name;
  document.getElementById('modalCal').textContent = `${food.cal} kcal`;
  document.getElementById('modalImg').src = food.img;
  
  document.getElementById('modalPrice').textContent = `₹${food.price}`;
  
  // Populate Macros
  document.getElementById('modalProtein').textContent = `${food.protein}g`;
  document.getElementById('modalCarbs').textContent = `${food.carbs}g`;
  document.getElementById('modalFat').textContent = `${food.fat}g`;
  document.getElementById('modalFiber').textContent = `${food.fiber}g`;
  document.getElementById('modalSugar').textContent = `${food.sugar}g`;
  document.getElementById('modalSodium').textContent = `${food.sodium}mg`;
  document.getElementById('modalPotassium').textContent = `${food.potassium}mg`;
  document.getElementById('modalSatFat').textContent = `${food.sat_fat}g`;
  document.getElementById('modalChol').textContent = `${food.chol}mg`;
  
  document.getElementById('servingCount').textContent = '1';
  document.getElementById('logModal').classList.remove('hide');
}

function openFoodModal(name, cal, img) {
  // Legacy fallback for search/recent items
  currentFoodObj = { name, cal, img, price: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0, potassium: 0, sat_fat: 0, chol: 0 };
  
  document.getElementById('modalName').textContent = name;
  document.getElementById('modalCal').textContent = `${cal} kcal`;
  document.getElementById('modalImg').src = img || 'https://via.placeholder.com/64?text=Food';
  
  document.getElementById('modalPrice').textContent = '₹0';
  document.getElementById('modalProtein').textContent = '-';
  document.getElementById('modalCarbs').textContent = '-';
  document.getElementById('modalFat').textContent = '-';
  document.getElementById('modalFiber').textContent = '-';
  document.getElementById('modalSugar').textContent = '-';
  document.getElementById('modalSodium').textContent = '-';
  document.getElementById('modalPotassium').textContent = '-';
  document.getElementById('modalSatFat').textContent = '-';
  document.getElementById('modalChol').textContent = '-';
  
  document.getElementById('servingCount').textContent = '1';
  document.getElementById('logModal').classList.remove('hide');
}

function updateServings(delta) {
  const el = document.getElementById('servingCount');
  let val = parseInt(el.textContent) + delta;
  if (val < 1) val = 1;
  el.textContent = val;
  
  if (currentFoodObj) {
    document.getElementById('modalCal').textContent = `${currentFoodObj.cal * val} kcal`;
    document.getElementById('modalPrice').textContent = `₹${currentFoodObj.price * val}`;
    
    // Update macro values proportionally
    document.getElementById('modalProtein').textContent = `${(currentFoodObj.protein * val).toFixed(1)}g`;
    document.getElementById('modalCarbs').textContent = `${(currentFoodObj.carbs * val).toFixed(1)}g`;
    document.getElementById('modalFat').textContent = `${(currentFoodObj.fat * val).toFixed(1)}g`;
    document.getElementById('modalFiber').textContent = `${(currentFoodObj.fiber * val).toFixed(1)}g`;
    document.getElementById('modalSugar').textContent = `${(currentFoodObj.sugar * val).toFixed(1)}g`;
    document.getElementById('modalSodium').textContent = `${(currentFoodObj.sodium * val)}mg`;
    document.getElementById('modalPotassium').textContent = `${(currentFoodObj.potassium * val)}mg`;
    document.getElementById('modalSatFat').textContent = `${(currentFoodObj.sat_fat * val).toFixed(1)}g`;
    document.getElementById('modalChol').textContent = `${(currentFoodObj.chol * val)}mg`;
  }
}

function addToCartFromModal() {
  if (!currentFoodObj) return;
  const servings = parseInt(document.getElementById('servingCount').textContent);
  
  if (currentFoodObj.price <= 0) {
    alert("This item cannot be purchased.");
    return;
  }

  const id = `food_${currentFoodObj.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;

  if (currentUser) {
    let cart = LocalDB.getData('cart', currentUser);
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.quantity += servings;
    } else {
      cart.push({ id, name: currentFoodObj.name, price: currentFoodObj.price, img: currentFoodObj.img, quantity: servings, added_at: new Date().toISOString() });
    }
    LocalDB.saveData('cart', currentUser, cart);
  } else {
    let cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.quantity += servings;
    } else {
      cart.push({ id, name: currentFoodObj.name, price: currentFoodObj.price, img: currentFoodObj.img, quantity: servings });
    }
    localStorage.setItem('tempCart', JSON.stringify(cart));
  }
  
  closeModal('logModal');
  showToast(`Added ${servings}x ${currentFoodObj.name} to Cart!`, 'success');
}

function quickAddToCart(event, catId, index) {
  event.stopPropagation(); // Prevents opening the modal
  const food = PREDEFINED_FOODS[catId][index];
  
  if (food.price <= 0) {
    alert("This item cannot be purchased.");
    return;
  }

  const id = `food_${food.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;

  if (currentUser) {
    let cart = LocalDB.getData('cart', currentUser) || [];
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name: food.name, price: food.price, img: food.img, quantity: 1, added_at: new Date().toISOString() });
    }
    LocalDB.saveData('cart', currentUser, cart);
  } else {
    let cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name: food.name, price: food.price, img: food.img, quantity: 1 });
    }
    localStorage.setItem('tempCart', JSON.stringify(cart));
  }
  
  showToast(`${food.name} added to Cart!`, 'success');
}

function logSelectedFood() {
  if (!currentUser || !currentFoodObj) return;
  const servings = parseInt(document.getElementById('servingCount').textContent);
  
  const logData = {
    id: Date.now().toString(),
    userId: currentUser,
    date: todayStr,
    name: currentFoodObj.name,
    calories: currentFoodObj.cal * servings,
    servings: servings,
    image: currentFoodObj.img,
    macros: {
      protein: currentFoodObj.protein * servings,
      carbs: currentFoodObj.carbs * servings,
      fat: currentFoodObj.fat * servings
    }
  };
  
  let logs = LocalDB.getData('foodLogs', currentUser);
  logs.push(logData);
  LocalDB.saveData('foodLogs', currentUser, logs);
  
  closeModal('logModal');
  showToast('Food logged!', 'success');
  loadRecentFoods();
}

function searchLocalFoods(query) {
  query = query.toLowerCase();
  let results = [];
  
  // Search through all categories
  Object.keys(PREDEFINED_FOODS).forEach(catId => {
    PREDEFINED_FOODS[catId].forEach((food, index) => {
      if (food.name.toLowerCase().includes(query)) {
        results.push({ food, catId, index });
      }
    });
  });
  
  if (results.length === 0) {
    document.getElementById('resultsGrid').innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text3); padding: 40px;">No foods found.</p>';
    return;
  }
  
  let html = '';
  results.forEach(res => {
    const f = res.food;
    html += `
      <div class="food-card" onclick="openPredefinedFoodModal('${res.catId}', ${res.index})">
        <img src="${f.img}" alt="${f.name}" class="food-img" onerror="this.src='https://via.placeholder.com/64?text=Food'">
        <div class="food-name">${f.name}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; margin-bottom: 8px;">
          <div class="food-cal" style="margin: 0;">${f.cal} kcal</div>
          <div style="color: var(--primary); font-weight: 800; font-size: 14px;">₹${f.price}</div>
        </div>
        <button class="btn btn-outline btn-full" onclick="quickAddToCart(event, '${res.catId}', ${res.index})" style="font-size: 13px; padding: 6px; border-radius: 8px;">
          <i class="fas fa-cart-plus"></i> Add
        </button>
      </div>
    `;
  });
  
  document.getElementById('resultsGrid').innerHTML = html;
}



function loadRecentFoods() {
  if (!currentUser) return;
  
  const logs = LocalDB.getData('foodLogs', currentUser);
  const unique = {};
  // Sort descending
  logs.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(l => {
    if (!unique[l.name]) unique[l.name] = l;
  });
  
  const recents = Object.values(unique).slice(0, 30);
  const grid = document.getElementById('recentGrid');
  
  if (recents.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text3); padding: 40px;">No recently logged foods.</p>';
    return;
  }
  
  grid.innerHTML = recents.map(r => {
    const safeName = r.name.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
    const img = r.img || 'https://via.placeholder.com/64?text=Food';
    return `
      <div class="food-card" onclick="openFoodModal('${safeName}', ${r.calories}, '${img}')">
        <img src="${img}" alt="${safeName}" class="food-img" onerror="this.src='https://via.placeholder.com/64?text=Food'">
        <div class="food-name">${r.name}</div>
        <div class="food-cal">${r.calories} kcal</div>
      </div>
    `;
  }).join('');
}
