import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CDN = 'https://images.unsplash.com/photo';
const R = (id: string) => `${CDN}-${id}?w=800&h=450&q=80&fit=crop&auto=format`;
const M = (id: string) => `${CDN}-${id}?w=480&h=360&q=80&fit=crop&auto=format`;

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();

  const restaurants = [
    // ─── 1. Italian ───────────────────────────────────────────────────────────
    {
      name: 'Bella Italia',
      description: 'Authentic Italian cuisine with homemade pasta, wood-fired pizza, and classic desserts in a warm trattoria setting.',
      address: '14 Olive Street, Downtown',
      category: 'Italian',
      imageUrl: R('1414235077428-338989a2e8c0'),
      items: [
        { name: 'Spaghetti Carbonara',   description: 'Classic Roman pasta with pancetta, egg yolk, pecorino, and black pepper',  price: '89.00',  category: 'Pasta',   imageUrl: M('1621996346565-e3dbc646d9a9') },
        { name: 'Pizza Margherita',      description: 'Wood-fired pizza with San Marzano tomato, fresh mozzarella, and basil',     price: '75.00',  category: 'Pizza',   imageUrl: M('1565299624946-b28f40a0ae38') },
        { name: 'Mushroom Risotto',      description: 'Creamy arborio rice with porcini mushrooms and parmesan',                   price: '95.00',  category: 'Risotto', imageUrl: M('1476124369491-e7dfd5d6d79a') },
        { name: 'Lasagna al Forno',      description: 'Layered pasta with Bolognese ragu, béchamel, and mozzarella',               price: '99.00',  category: 'Pasta',   imageUrl: M('1621996346565-e3dbc646d9a9') },
        { name: 'Bruschetta',            description: 'Grilled bread topped with fresh tomato, garlic, and basil',                 price: '45.00',  category: 'Starter', imageUrl: M('1528207776700-b60313a54d75') },
        { name: 'Tiramisu',              description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',   price: '55.00',  category: 'Dessert', imageUrl: M('1571877227200-a0d98ea607e9') },
      ],
    },

    // ─── 2. Japanese ──────────────────────────────────────────────────────────
    {
      name: 'Sakura Garden',
      description: 'Fresh sushi, steaming ramen, and traditional Japanese dishes crafted by our master chef from Osaka.',
      address: '7 Cherry Blossom Ave, Midtown',
      category: 'Japanese',
      imageUrl: R('1579871494447-9811cf80d66c'),
      items: [
        { name: 'Salmon Sushi Platter',  description: '12-piece assorted sushi with salmon, tuna, and yellowtail',                price: '135.00', category: 'Sushi',   imageUrl: M('1579584425555-c3ce17fd4351') },
        { name: 'Tonkotsu Ramen',        description: 'Rich pork bone broth with chashu pork, soft-boiled egg, and bamboo shoots', price: '95.00',  category: 'Ramen',   imageUrl: M('1569050467447-ce54b3bbc37d') },
        { name: 'Chicken Tempura',       description: 'Lightly battered chicken and vegetables, served with dipping sauce',        price: '85.00',  category: 'Fried',   imageUrl: M('1617196034182-b64fb44f0369') },
        { name: 'Gyoza (6 pcs)',         description: 'Pan-fried pork and cabbage dumplings with ponzu dipping sauce',             price: '55.00',  category: 'Starter', imageUrl: M('1625938144755-652e08e359b7') },
        { name: 'Miso Soup',             description: 'Traditional dashi broth with tofu, wakame, and green onions',               price: '30.00',  category: 'Soup',    imageUrl: M('1548943487-a2e4e43b4853') },
      ],
    },

    // ─── 3. American ──────────────────────────────────────────────────────────
    {
      name: 'Big Smoke Burgers',
      description: 'Smash burgers, slow-smoked BBQ ribs, crispy wings, and loaded fries. The ultimate American comfort food experience.',
      address: '88 Liberty Road, West Side',
      category: 'American',
      imageUrl: R('1568901346375-23c9450c58cd'),
      items: [
        { name: 'Classic Smash Burger',  description: 'Double smash patty, American cheese, pickles, onion, and house sauce',     price: '85.00',  category: 'Burgers', imageUrl: M('1568901346375-23c9450c58cd') },
        { name: 'BBQ Beef Ribs (half)',  description: 'Slow-smoked beef ribs with honey BBQ glaze and coleslaw',                   price: '145.00', category: 'BBQ',     imageUrl: M('1529193591184-b1d58069ecdd') },
        { name: 'Buffalo Wings (8 pcs)', description: 'Crispy wings tossed in spicy buffalo sauce, served with blue cheese dip',  price: '90.00',  category: 'Wings',   imageUrl: M('1527477396000-e27163b481c2') },
        { name: 'Loaded Fries',          description: 'Thick-cut fries topped with cheese sauce, bacon bits, and jalapeños',       price: '55.00',  category: 'Sides',   imageUrl: M('1585238341710-4913d3a3a48e') },
        { name: 'Mac & Cheese',          description: 'Creamy baked macaroni with a four-cheese blend and breadcrumb crust',       price: '65.00',  category: 'Sides',   imageUrl: M('1543339308-43e59d6b73a6') },
      ],
    },

    // ─── 4. Mexican ───────────────────────────────────────────────────────────
    {
      name: 'El Rancho',
      description: 'Vibrant Mexican street food — handmade corn tortillas, slow-braised meats, fresh salsas, and house-made guacamole.',
      address: '22 Habanero Lane, South Quarter',
      category: 'Mexican',
      imageUrl: R('1565299585323-38d6b0865b47'),
      items: [
        { name: 'Street Tacos (3 pcs)',  description: 'Corn tortillas with al pastor pork, onion, cilantro, and salsa verde',     price: '70.00',  category: 'Tacos',    imageUrl: M('1565299585323-38d6b0865b47') },
        { name: 'Burrito Bowl',          description: 'Cilantro rice, black beans, grilled chicken, pico de gallo, and sour cream', price: '90.00', category: 'Bowls',    imageUrl: M('1582169296194-e4d644c48063') },
        { name: 'Cheese Quesadilla',     description: 'Crispy flour tortilla with melted cheese, jalapeños, and chipotle sauce',   price: '65.00',  category: 'Snacks',   imageUrl: M('1618040996337-56904b7850b9') },
        { name: 'Fresh Guacamole',       description: 'Hand-mashed avocado with lime, cilantro, tomato, and jalapeño, with chips', price: '50.00',  category: 'Starters', imageUrl: M('1601001435957-74f8a3a9e3fa') },
      ],
    },

    // ─── 5. Indian ────────────────────────────────────────────────────────────
    {
      name: 'Spice Route',
      description: 'Bold North Indian flavors — aromatic curries, clay oven breads, and fragrant biryanis cooked with generations-old recipes.',
      address: '5 Turmeric Court, East Village',
      category: 'Indian',
      imageUrl: R('1585937421612-70a008356fbe'),
      items: [
        { name: 'Butter Chicken',        description: 'Tender chicken in rich tomato-cream sauce, served with basmati rice',      price: '95.00',  category: 'Curry',   imageUrl: M('1585937421612-70a008356fbe') },
        { name: 'Lamb Biryani',          description: 'Fragrant basmati rice layered with slow-cooked spiced lamb',               price: '115.00', category: 'Rice',    imageUrl: M('1563379091339-03b21ab4a4f8') },
        { name: 'Garlic Naan',           description: 'Freshly baked clay oven bread brushed with garlic butter and coriander',   price: '25.00',  category: 'Bread',   imageUrl: M('1574894709920-11b28e7367e3') },
        { name: 'Mango Lassi',           description: 'Chilled yogurt drink blended with Alphonso mango and a hint of cardamom',  price: '35.00',  category: 'Drinks',  imageUrl: M('1553361371-9b22f78e8b1d') },
      ],
    },

    // ─── 6. Chinese ───────────────────────────────────────────────────────────
    {
      name: 'Golden Dragon',
      description: 'Traditional Cantonese dim sum, wok-tossed classics, and handcrafted noodles in an authentic Hong Kong-style setting.',
      address: '33 Lotus Boulevard, Chinatown',
      category: 'Chinese',
      imageUrl: R('1563245372-f21724e3856d'),
      items: [
        { name: 'Dim Sum Basket (6 pcs)', description: 'Assorted steamed har gow, siu mai, and char siu bao',                     price: '75.00',  category: 'Dim Sum', imageUrl: M('1563245372-f21724e3856d') },
        { name: 'Kung Pao Chicken',       description: 'Wok-fried chicken with peanuts, dried chilli, and Sichuan peppercorns',   price: '90.00',  category: 'Mains',   imageUrl: M('1563245372-f21724e3856d') },
        { name: 'Yang Chow Fried Rice',   description: 'Classic egg fried rice with prawns, char siu pork, and vegetables',       price: '70.00',  category: 'Rice',    imageUrl: M('1603133872878-684f208fb84b') },
        { name: 'Crispy Spring Rolls (4)', description: 'Golden fried rolls filled with vegetables and glass noodles',             price: '55.00',  category: 'Starters',imageUrl: M('1620374644495-3e5d0c4c1c7f') },
      ],
    },

    // ─── 7. Thai ──────────────────────────────────────────────────────────────
    {
      name: 'Thai Orchid',
      description: 'Authentic Thai street food — the perfect balance of sweet, sour, salty, and spicy in every dish.',
      address: '9 Jasmine Street, North Beach',
      category: 'Thai',
      imageUrl: R('1562802378-063ec186a863'),
      items: [
        { name: 'Pad Thai',              description: 'Stir-fried rice noodles with shrimp, egg, bean sprouts, and tamarind sauce', price: '85.00', category: 'Noodles', imageUrl: M('1455619452474-d2be8b1e4e31') },
        { name: 'Green Curry',           description: 'Creamy coconut curry with chicken, Thai basil, and bamboo shoots',           price: '90.00', category: 'Curry',   imageUrl: M('1455619452474-d2be8b1e4e31') },
        { name: 'Tom Yum Soup',          description: 'Spicy-sour lemongrass soup with shrimp, mushrooms, and galangal',            price: '65.00', category: 'Soup',    imageUrl: M('1547592166-23ac45744acd') },
        { name: 'Mango Sticky Rice',     description: 'Sweet glutinous rice with fresh mango and coconut cream',                    price: '50.00', category: 'Dessert', imageUrl: M('1556042634-5adea2f85ce7') },
      ],
    },

    // ─── 8. Mediterranean ─────────────────────────────────────────────────────
    {
      name: 'Olive & Feta',
      description: 'Fresh mezze, grilled kebabs, and sun-drenched salads inspired by the coastlines of Greece, Turkey, and Lebanon.',
      address: '61 Aegean Way, Harbor District',
      category: 'Mediterranean',
      imageUrl: R('1540189549336-e6e99c3679fe'),
      items: [
        { name: 'Mezze Platter',         description: 'Hummus, baba ganoush, tabbouleh, olives, and warm pita',                   price: '95.00',  category: 'Sharing', imageUrl: M('1540189549336-e6e99c3679fe') },
        { name: 'Falafel Wrap',          description: 'Crispy falafel, tahini, pickled vegetables, and fresh herbs in flatbread', price: '65.00',  category: 'Wraps',   imageUrl: M('1546069901-ba9599a7e63c') },
        { name: 'Greek Salad',           description: 'Tomato, cucumber, Kalamata olives, red onion, and feta with olive oil',    price: '60.00',  category: 'Salads',  imageUrl: M('1540189549336-e6e99c3679fe') },
        { name: 'Lamb Kebab Plate',      description: 'Grilled spiced lamb kebabs with tzatziki, rice, and grilled vegetables',   price: '115.00', category: 'Grills',  imageUrl: M('1529193591184-b1d58069ecdd') },
      ],
    },

    // ─── 9. French ────────────────────────────────────────────────────────────
    {
      name: 'Le Petit Bistro',
      description: 'A cozy Parisian-style bistro serving buttery croissants, classic French onion soup, and perfectly cooked steaks.',
      address: '3 Rue de la Paix, Arts Quarter',
      category: 'French',
      imageUrl: R('1414235077428-338989a2e8c0'),
      items: [
        { name: 'Butter Croissant',      description: 'Freshly baked all-butter croissant, flaky and golden — served warm',       price: '35.00',  category: 'Bakery',  imageUrl: M('1555939594-58d7cb561537') },
        { name: 'French Onion Soup',     description: 'Slow-cooked caramelized onion broth topped with gruyère crouton',          price: '75.00',  category: 'Soup',    imageUrl: M('1547592166-23ac45744acd') },
        { name: 'Steak Frites',          description: 'Pan-seared bavette steak with herbed butter and crispy pommes frites',      price: '155.00', category: 'Mains',   imageUrl: M('1555396273-367ea4eb4db5') },
        { name: 'Crème Brûlée',          description: 'Vanilla custard with a caramelized sugar crust, served chilled',           price: '60.00',  category: 'Dessert', imageUrl: M('1571877227200-a0d98ea607e9') },
      ],
    },

    // ─── 10. Lebanese ─────────────────────────────────────────────────────────
    {
      name: 'Cedar & Vine',
      description: 'Authentic Lebanese home cooking — generous plates of mezze, charcoal grilled meats, and fresh-baked flatbread.',
      address: '18 Cedar Hill Road, Uptown',
      category: 'Lebanese',
      imageUrl: R('1546069901-ba9599a7e63c'),
      items: [
        { name: 'Chicken Shawarma',      description: 'Marinated chicken carved off the spit, wrapped in flatbread with garlic sauce', price: '75.00', category: 'Wraps',   imageUrl: M('1529193591184-b1d58069ecdd') },
        { name: 'Kibbeh Platter',        description: 'Baked lamb and bulgur wheat shells with pine nuts and spiced filling',      price: '90.00',  category: 'Mains',   imageUrl: M('1546069901-ba9599a7e63c') },
        { name: 'Tabbouleh',             description: 'Finely chopped parsley, tomato, bulgur, and lemon — a Lebanese classic',    price: '50.00',  category: 'Salads',  imageUrl: M('1540189549336-e6e99c3679fe') },
        { name: 'Baklava (4 pcs)',       description: 'Layers of filo pastry, crushed pistachios, and rose water syrup',           price: '55.00',  category: 'Dessert', imageUrl: M('1571877227200-a0d98ea607e9') },
      ],
    },

    // ─── 11. Egyptian ─────────────────────────────────────────────────────────
    {
      name: 'Nile House',
      description: "Cairo street food classics — Egypt's beloved koshary, crispy falafel, and hearty ful medames done the traditional way.",
      address: '45 Nile Corniche, Old Quarter',
      category: 'Egyptian',
      imageUrl: R('1512621776951-a57141f2eefd'),
      items: [
        { name: 'Koshary',               description: "Rice, lentils, pasta, caramelized onions, and spicy tomato sauce — Egypt's national dish", price: '45.00', category: 'Mains', imageUrl: M('1512621776951-a57141f2eefd') },
        { name: 'Ful Medames',           description: 'Slow-cooked fava beans with cumin, lemon, and olive oil, served with bread', price: '35.00',  category: 'Mains',  imageUrl: M('1546069901-ba9599a7e63c') },
        { name: "Ta'ameya (Falafel)",    description: 'Egyptian-style fava bean falafel — crispy outside, bright green inside',    price: '40.00',  category: 'Snacks', imageUrl: M('1546069901-ba9599a7e63c') },
        { name: 'Hawawshi',              description: 'Spiced minced meat baked inside crispy bread — the ultimate street sandwich', price: '60.00',  category: 'Mains',  imageUrl: M('1568901346375-23c9450c58cd') },
      ],
    },

    // ─── 12. Pizza ────────────────────────────────────────────────────────────
    {
      name: 'Pizza Palace',
      description: 'New York-style hand-tossed pizzas with premium toppings, crispy calzones, and garlic bread fresh from the stone oven.',
      address: '120 Dough Street, Riverside',
      category: 'Pizza',
      imageUrl: R('1565299624946-b28f40a0ae38'),
      items: [
        { name: 'Pepperoni Pizza',        description: 'Classic tomato sauce, mozzarella, and generous pepperoni on hand-tossed dough', price: '85.00', category: 'Pizza',   imageUrl: M('1565299624946-b28f40a0ae38') },
        { name: 'Four Cheese Pizza',      description: 'Mozzarella, gorgonzola, cheddar, and parmesan on a white sauce base',      price: '95.00',  category: 'Pizza',   imageUrl: M('1604068549290-dea0e4a305ca') },
        { name: 'Beef Calzone',           description: 'Folded pizza dough stuffed with beef, mozzarella, mushrooms, and peppers', price: '90.00',  category: 'Calzone', imageUrl: M('1604068549290-dea0e4a305ca') },
        { name: 'Cheesy Garlic Bread',    description: 'Toasted baguette with garlic butter, mozzarella, and fresh herbs',         price: '45.00',  category: 'Sides',   imageUrl: M('1528207776700-b60313a54d75') },
      ],
    },

    // ─── 13. Seafood ──────────────────────────────────────────────────────────
    {
      name: 'The Catch',
      description: 'Ocean-fresh seafood sourced daily — grilled, fried, or steamed with light Mediterranean touches.',
      address: '2 Harbor View Pier, Waterfront',
      category: 'Seafood',
      imageUrl: R('1559827260-dc66d52bef19'),
      items: [
        { name: 'Grilled Salmon',        description: 'Atlantic salmon fillet grilled with lemon butter, capers, and dill',       price: '130.00', category: 'Fish',    imageUrl: M('1559827260-dc66d52bef19') },
        { name: 'Lobster Thermidor',     description: 'Half lobster baked with cream, mustard, and gruyère glaze',               price: '220.00', category: 'Lobster', imageUrl: M('1559827260-dc66d52bef19') },
        { name: 'Fried Calamari',        description: 'Tender squid rings lightly dusted and fried, with aioli and lemon',        price: '80.00',  category: 'Starters',imageUrl: M('1559827260-dc66d52bef19') },
        { name: 'Garlic Shrimp Scampi',  description: 'Jumbo shrimp sautéed with garlic, white wine, and butter over linguine',  price: '120.00', category: 'Pasta',   imageUrl: M('1559827260-dc66d52bef19') },
      ],
    },

    // ─── 14. Steakhouse ───────────────────────────────────────────────────────
    {
      name: 'Ember Steakhouse',
      description: 'Premium dry-aged cuts cooked over live charcoal. A serious steakhouse for serious meat lovers.',
      address: '77 Charcoal Row, Business District',
      category: 'Steakhouse',
      imageUrl: R('1555396273-367ea4eb4db5'),
      items: [
        { name: 'Ribeye Steak (300g)',   description: 'Well-marbled USDA ribeye, dry-aged 28 days, cooked to your specification',  price: '220.00', category: 'Steaks', imageUrl: M('1555396273-367ea4eb4db5') },
        { name: 'Filet Mignon (200g)',   description: 'Tenderloin centre cut — the most tender steak on the menu, wrapped in bacon', price: '245.00', category: 'Steaks', imageUrl: M('1555396273-367ea4eb4db5') },
        { name: 'Striploin & Mushroom',  description: 'New York striploin with pan-seared wild mushroom and red wine reduction',    price: '195.00', category: 'Steaks', imageUrl: M('1555396273-367ea4eb4db5') },
        { name: 'Onion Rings',           description: 'Beer-battered thick-cut onion rings, golden and crispy',                    price: '50.00',  category: 'Sides',  imageUrl: M('1585238341710-4913d3a3a48e') },
      ],
    },

    // ─── 15. Healthy ──────────────────────────────────────────────────────────
    {
      name: 'Green Bowl',
      description: "Nutritious and delicious — build-your-own bowls, pressed juices, and plant-based meals that don't compromise on taste.",
      address: '30 Wellness Walk, University Area',
      category: 'Healthy',
      imageUrl: R('1512621776951-a57141f2eefd'),
      items: [
        { name: 'Açaí Power Bowl',       description: 'Açaí base topped with granola, banana, blueberries, and honey',            price: '75.00',  category: 'Bowls',   imageUrl: M('1512621776951-a57141f2eefd') },
        { name: 'Smashed Avocado Toast', description: 'Sourdough toast with smashed avocado, poached egg, chilli flakes, and seeds', price: '70.00', category: 'Brunch',  imageUrl: M('1512621776951-a57141f2eefd') },
        { name: 'Quinoa Power Salad',    description: 'Quinoa, roasted sweet potato, chickpeas, spinach, and lemon tahini dressing', price: '80.00', category: 'Salads',  imageUrl: M('1512621776951-a57141f2eefd') },
        { name: 'Green Detox Smoothie',  description: 'Spinach, cucumber, green apple, ginger, and coconut water',                 price: '45.00',  category: 'Drinks',  imageUrl: M('1553361371-9b22f78e8b1d') },
      ],
    },
  ];

  let totalItems = 0;
  for (const r of restaurants) {
    const { items, ...restaurantData } = r;
    const created = await prisma.restaurant.create({ data: restaurantData });
    await prisma.menuItem.createMany({
      data: items.map((item) => ({ ...item, restaurantId: created.id })),
    });
    totalItems += items.length;
    console.log(`  ✓ ${created.name} (${items.length} items)`);
  }

  console.log(`\n✓ Seeded ${restaurants.length} restaurants and ${totalItems} menu items`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
