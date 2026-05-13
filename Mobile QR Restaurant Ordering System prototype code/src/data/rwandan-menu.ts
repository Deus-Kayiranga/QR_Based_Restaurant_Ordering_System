// Comprehensive Rwandan Menu Items
export const rwandanMenuItems = [
  // === RWANDAN SPECIALTIES (Category 1) ===
  {
    item_id: 1, category_id: 1, item_name: 'Isombe (Cassava Leaves Stew)',
    description: 'Traditional Rwandan cassava leaves cooked with peanut sauce, served with rice',
    price: 8500, image_url: 'https://images.unsplash.com/photo-1638436684761-7e59f8a9072f?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: true,
    contains_allergens: 'Nuts', display_order: 1, is_popular: true,
  },
  {
    item_id: 2, category_id: 1, item_name: 'Ugali with Meat Sauce',
    description: 'Cornmeal porridge with rich beef stew, authentic Rwandan comfort food',
    price: 7500, image_url: 'https://images.unsplash.com/photo-1687020835955-59528e8c91dd?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: '', display_order: 2, is_popular: true,
  },
  {
    item_id: 3, category_id: 1, item_name: 'Matoke (Plantain Dish)',
    description: 'Steamed green bananas in savory peanut sauce with vegetables',
    price: 6800, image_url: 'https://images.unsplash.com/photo-1702538808213-4da9a0ee039c?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: true,
    contains_allergens: 'Nuts', display_order: 3, is_popular: false,
  },
  {
    item_id: 4, category_id: 1, item_name: 'Brochettes (Goat Skewers)',
    description: 'Grilled goat meat skewers marinated in spices, served with fries',
    price: 12000, image_url: 'https://images.unsplash.com/photo-1774668748614-f188f5b61535?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: '', display_order: 4, is_popular: true,
  },
  {
    item_id: 5, category_id: 1, item_name: 'Ibihaza (Pumpkin & Beans)',
    description: 'Sweet pumpkin and kidney beans in aromatic sauce',
    price: 5500, image_url: 'https://images.unsplash.com/photo-1772693471187-6e7d364f99ee?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 5, is_popular: false,
  },

  // === BURGERS (Category 2) ===
  {
    item_id: 6, category_id: 2, item_name: 'La Ta Bhore Classic Burger',
    description: 'Premium beef patty, cheddar, lettuce, tomato, special sauce on toasted bun',
    price: 9500, image_url: 'https://images.unsplash.com/photo-1627378378955-a3f4e406c5de?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: 'Gluten, Dairy, Eggs', display_order: 1, is_popular: true,
  },
  {
    item_id: 7, category_id: 2, item_name: 'Bacon Cheese Deluxe',
    description: 'Double beef patty, crispy bacon, Swiss cheese, caramelized onions',
    price: 12500, image_url: 'https://images.unsplash.com/photo-1632898657953-f41f81bfa892?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: 'Gluten, Dairy, Eggs, Pork', display_order: 2, is_popular: true,
  },
  {
    item_id: 8, category_id: 2, item_name: 'Veggie Burger',
    description: 'Homemade vegetable patty with avocado, sprouts, and herb mayo',
    price: 8000, image_url: 'https://images.unsplash.com/photo-1632898658005-af95f6fa589c?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: true,
    contains_allergens: 'Gluten, Eggs, Soy', display_order: 3, is_popular: false,
  },
  {
    item_id: 9, category_id: 2, item_name: 'Chicken Burger Supreme',
    description: 'Grilled chicken breast, lettuce, tomato, ranch dressing',
    price: 8800, image_url: 'https://images.unsplash.com/photo-1632898658030-ead731d252d4?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: 'Gluten, Dairy, Eggs', display_order: 4, is_popular: true,
  },

  // === GRILLED MEATS (Category 3) ===
  {
    item_id: 10, category_id: 3, item_name: 'Ribeye Steak (300g)',
    description: 'Premium ribeye steak grilled to perfection, served with vegetables',
    price: 18500, image_url: 'https://images.unsplash.com/photo-1774806288060-70caeeadc80b?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: '', display_order: 1, is_popular: true,
  },
  {
    item_id: 11, category_id: 3, item_name: 'T-Bone Steak (400g)',
    description: 'Juicy T-bone steak with herb butter and grilled vegetables',
    price: 22000, image_url: 'https://images.unsplash.com/photo-1758157835975-1cb4947750df?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: 'Dairy', display_order: 2, is_popular: true,
  },
  {
    item_id: 12, category_id: 3, item_name: 'Mixed Grill Platter',
    description: 'Beef, chicken, sausage, and liver skewers with fries',
    price: 16500, image_url: 'https://images.unsplash.com/photo-1773903238003-abaa522be94c?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: '', display_order: 3, is_popular: true,
  },
  {
    item_id: 13, category_id: 3, item_name: 'Beef Short Ribs',
    description: 'Slow-cooked beef ribs in BBQ glaze, served with coleslaw',
    price: 15000, image_url: 'https://images.unsplash.com/photo-1690983322475-29a61c585204?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: 'Gluten', display_order: 4, is_popular: false,
  },

  // === CHICKEN DISHES (Category 4) ===
  {
    item_id: 14, category_id: 4, item_name: 'Grilled Chicken (Half)',
    description: 'Half chicken marinated and grilled, served with rice and sauce',
    price: 11000, image_url: 'https://images.unsplash.com/photo-1663861623497-2151b2bb21fe?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: '', display_order: 1, is_popular: true,
  },
  {
    item_id: 15, category_id: 4, item_name: 'Chicken Wings (12pcs)',
    description: 'Crispy chicken wings tossed in buffalo or BBQ sauce',
    price: 8500, image_url: 'https://images.unsplash.com/photo-1763219802762-1d34ee0907c5?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: 'Gluten', display_order: 2, is_popular: true,
  },
  {
    item_id: 16, category_id: 4, item_name: 'Chicken Curry',
    description: 'Tender chicken in creamy curry sauce with vegetables',
    price: 9500, image_url: 'https://images.unsplash.com/photo-1765894711192-d35787eee3b6?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: 'Dairy', display_order: 3, is_popular: true,
  },
  {
    item_id: 17, category_id: 4, item_name: 'Chicken Salad Bowl',
    description: 'Grilled chicken on mixed greens with avocado and dressing',
    price: 7800, image_url: 'https://images.unsplash.com/photo-1761315600943-d8a5bb0c499f?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: 'Eggs', display_order: 4, is_popular: false,
  },
  {
    item_id: 18, category_id: 4, item_name: 'Fried Chicken Plate',
    description: '4 pieces of crispy fried chicken with fries and coleslaw',
    price: 10500, image_url: 'https://images.unsplash.com/photo-1657271518639-ce701811dcb4?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: 'Gluten, Eggs', display_order: 5, is_popular: true,
  },

  // === RICE & SIDES (Category 5) ===
  {
    item_id: 19, category_id: 5, item_name: 'Rwandan Pilau Rice',
    description: 'Fragrant spiced rice cooked with aromatic Rwandan spices',
    price: 4500, image_url: 'https://images.unsplash.com/photo-1772693471187-6e7d364f99ee?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 1, is_popular: true,
  },
  {
    item_id: 20, category_id: 5, item_name: 'Fried Rice',
    description: 'Stir-fried rice with vegetables, eggs, and soy sauce',
    price: 5000, image_url: 'https://images.unsplash.com/photo-1687020835955-59528e8c91dd?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: false,
    contains_allergens: 'Eggs, Soy', display_order: 2, is_popular: true,
  },
  {
    item_id: 21, category_id: 5, item_name: 'French Fries (Large)',
    description: 'Crispy golden fries seasoned with sea salt',
    price: 3000, image_url: 'https://images.unsplash.com/photo-1632898657999-ae6920976661?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 3, is_popular: true,
  },
  {
    item_id: 22, category_id: 5, item_name: 'Sweet Potato Fries',
    description: 'Sweet potato fries with honey dipping sauce',
    price: 3500, image_url: 'https://images.unsplash.com/photo-1627378378955-a3f4e406c5de?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 4, is_popular: false,
  },
  {
    item_id: 23, category_id: 5, item_name: 'Cassava Chips',
    description: 'Traditional Rwandan cassava fried until crispy',
    price: 2800, image_url: 'https://images.unsplash.com/photo-1702538808213-4da9a0ee039c?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 5, is_popular: true,
  },

  // === BRALIRWA BEERS (Category 6) ===
  {
    item_id: 24, category_id: 6, item_name: 'Primus (65cl)',
    description: 'Rwanda\'s most popular beer, crisp and refreshing lager',
    price: 2500, image_url: 'https://images.unsplash.com/photo-1635894452936-035ae0e2fc96?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: 'Gluten', display_order: 1, is_popular: true,
  },
  {
    item_id: 25, category_id: 6, item_name: 'Mützig (65cl)',
    description: 'Premium Rwandan lager with smooth taste',
    price: 2800, image_url: 'https://images.unsplash.com/photo-1655981652978-c466070cfe9c?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: 'Gluten', display_order: 2, is_popular: true,
  },
  {
    item_id: 26, category_id: 6, item_name: 'Skol (50cl)',
    description: 'Light and refreshing pilsner beer',
    price: 2000, image_url: 'https://images.unsplash.com/photo-1568665449496-c699397e3332?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: 'Gluten', display_order: 3, is_popular: false,
  },
  {
    item_id: 27, category_id: 6, item_name: 'Turbo King (50cl)',
    description: 'Strong lager for those who want more kick',
    price: 2200, image_url: 'https://images.unsplash.com/photo-1521572008054-962cefc90ce7?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: 'Gluten', display_order: 4, is_popular: false,
  },
  {
    item_id: 28, category_id: 6, item_name: 'Amstel (33cl)',
    description: 'International premium lager',
    price: 2600, image_url: 'https://images.unsplash.com/photo-1591077101603-132e07f5b1e3?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: 'Gluten', display_order: 5, is_popular: true,
  },

  // === SOFT DRINKS (Category 7) ===
  {
    item_id: 29, category_id: 7, item_name: 'Coca-Cola (50cl)',
    description: 'Classic Coca-Cola in ice-cold bottle',
    price: 1500, image_url: 'https://images.unsplash.com/photo-1598418732105-afb7f2c10bec?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 1, is_popular: true,
  },
  {
    item_id: 30, category_id: 7, item_name: 'Fanta Orange (50cl)',
    description: 'Refreshing orange soda',
    price: 1500, image_url: 'https://images.unsplash.com/photo-1598406506391-b3e522c3dc1f?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 2, is_popular: true,
  },
  {
    item_id: 31, category_id: 7, item_name: 'Sprite (50cl)',
    description: 'Crisp lemon-lime soda',
    price: 1500, image_url: 'https://images.unsplash.com/photo-1770329374091-4c363812e69f?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 3, is_popular: true,
  },
  {
    item_id: 32, category_id: 7, item_name: 'Tonic Water (33cl)',
    description: 'Schweppes Tonic Water',
    price: 1800, image_url: 'https://images.unsplash.com/photo-1567345243556-53a6a4790f5d?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 4, is_popular: false,
  },
  {
    item_id: 33, category_id: 7, item_name: 'Inyange Juice (1L)',
    description: 'Local Rwandan fruit juice - various flavors',
    price: 2500, image_url: 'https://images.unsplash.com/photo-1708416817517-089fccf84b7d?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 5, is_popular: true,
  },

  // === FRESH JUICES (Category 8) ===
  {
    item_id: 34, category_id: 8, item_name: 'Fresh Passion Juice',
    description: 'Freshly squeezed passion fruit juice',
    price: 3500, image_url: 'https://images.unsplash.com/photo-1708416817517-089fccf84b7d?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 1, is_popular: true,
  },
  {
    item_id: 35, category_id: 8, item_name: 'Mango Juice',
    description: 'Fresh mango juice blended to perfection',
    price: 3000, image_url: 'https://images.unsplash.com/photo-1687975091176-5a28a9860907?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 2, is_popular: true,
  },
  {
    item_id: 36, category_id: 8, item_name: 'Pineapple Juice',
    description: 'Tropical pineapple juice served cold',
    price: 3000, image_url: 'https://images.unsplash.com/photo-1633171704070-725075ceba3b?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 3, is_popular: true,
  },
  {
    item_id: 37, category_id: 8, item_name: 'Watermelon Juice',
    description: 'Refreshing watermelon juice',
    price: 2800, image_url: 'https://images.unsplash.com/photo-1731085906221-939034e41266?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 4, is_popular: false,
  },
  {
    item_id: 38, category_id: 8, item_name: 'Mixed Fruit Smoothie',
    description: 'Blend of tropical fruits with yogurt',
    price: 4500, image_url: 'https://images.unsplash.com/photo-1763741184209-8521419626af?w=800&q=80',
    destination_station: 'bar', is_available: true, is_vegetarian: true,
    contains_allergens: 'Dairy', display_order: 5, is_popular: true,
  },

  // === SALADS & VEGETABLES (Category 9) ===
  {
    item_id: 39, category_id: 9, item_name: 'Garden Fresh Salad',
    description: 'Mixed greens, cucumber, tomato, carrots with vinaigrette',
    price: 4500, image_url: 'https://images.unsplash.com/photo-1677653805080-59c57727c84e?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 1, is_popular: true,
  },
  {
    item_id: 40, category_id: 9, item_name: 'Coleslaw',
    description: 'Creamy cabbage and carrot salad',
    price: 2500, image_url: 'https://images.unsplash.com/photo-1654458804670-2f4f26ab3154?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: true,
    contains_allergens: 'Eggs', display_order: 2, is_popular: true,
  },
  {
    item_id: 41, category_id: 9, item_name: 'Grilled Vegetables',
    description: 'Seasonal vegetables char-grilled with herbs',
    price: 3800, image_url: 'https://images.unsplash.com/photo-1773903238003-abaa522be94c?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 3, is_popular: false,
  },
  {
    item_id: 42, category_id: 9, item_name: 'Fruit Salad',
    description: 'Fresh tropical fruits with lime dressing',
    price: 3500, image_url: 'https://images.unsplash.com/photo-1720022477068-2bd7ad8c8dab?w=800&q=80',
    destination_station: 'kitchen', is_available: true, is_vegetarian: true,
    contains_allergens: '', display_order: 4, is_popular: true,
  },
];
