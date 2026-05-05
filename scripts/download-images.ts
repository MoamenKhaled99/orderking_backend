/**
 * Downloads food images from Unsplash and compresses them to WebP.
 * Facebook-style compression: smaller dimensions + 75% quality = 5–10x smaller files.
 *
 * Restaurant covers: 800×450 WebP ~40–80 KB
 * Menu item thumbs:  480×360 WebP ~20–50 KB
 *
 * Run: ts-node -r tsconfig-paths/register scripts/download-images.ts
 */

import axios from 'axios';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const RESTAURANTS_DIR = path.join(__dirname, '..', 'public', 'images', 'restaurants');
const MENU_DIR = path.join(__dirname, '..', 'public', 'images', 'menu-items');

// Unsplash photo IDs — stable CDN links, no API key required for direct access
const RESTAURANT_IMAGES: { name: string; photoId: string }[] = [
  { name: 'bella-italia',     photoId: '1414235077428-338989a2e8c0' }, // pasta / Italian
  { name: 'sakura-garden',    photoId: '1579871494447-9811cf80d66c' }, // sushi
  { name: 'big-smoke',        photoId: '1568901346375-23c9450c58cd' }, // burger
  { name: 'el-rancho',        photoId: '1565299585323-38d6b0865b47' }, // tacos
  { name: 'spice-route',      photoId: '1585937421612-70a008356fbe' }, // Indian
  { name: 'golden-dragon',    photoId: '1563245372-f21724e3856d'   }, // Chinese
  { name: 'thai-orchid',      photoId: '1562802378-063ec186a863'   }, // Thai
  { name: 'olive-feta',       photoId: '1540189549336-e6e99c3679fe'}, // Mediterranean
  { name: 'le-petit-bistro',  photoId: '1414235077428-338989a2e8c0'}, // French (reuse pasta)
  { name: 'cedar-vine',       photoId: '1546069901-ba9599a7e63c'   }, // Lebanese salad/hummus
  { name: 'nile-house',       photoId: '1512621776951-a57141f2eefd'}, // Egyptian bowl
  { name: 'pizza-palace',     photoId: '1565299624946-b28f40a0ae38'}, // pizza
  { name: 'the-catch',        photoId: '1559827260-dc66d52bef19'   }, // seafood
  { name: 'ember-steakhouse', photoId: '1555396273-367ea4eb4db5'   }, // steakhouse
  { name: 'green-bowl',       photoId: '1512621776951-a57141f2eefd'}, // healthy bowl
];

const MENU_IMAGES: { name: string; photoId: string }[] = [
  // Italian
  { name: 'spaghetti-carbonara',  photoId: '1621996346565-e3dbc646d9a9' },
  { name: 'pizza-margherita',     photoId: '1565299624946-b28f40a0ae38' },
  { name: 'risotto',              photoId: '1476124369491-e7dfd5d6d79a' },
  { name: 'tiramisu',             photoId: '1571877227200-a0d98ea607e9' },
  { name: 'bruschetta',           photoId: '1528207776700-b60313a54d75' },
  { name: 'lasagna',              photoId: '1621996346565-e3dbc646d9a9' },
  // Japanese
  { name: 'salmon-sushi',         photoId: '1579584425555-c3ce17fd4351' },
  { name: 'ramen',                photoId: '1569050467447-ce54b3bbc37d' },
  { name: 'tempura',              photoId: '1617196034182-b64fb44f0369' },
  { name: 'gyoza',                photoId: '1625938144755-652e08e359b7' },
  { name: 'miso-soup',            photoId: '1548943487-a2e4e43b4853' },
  // American
  { name: 'classic-burger',       photoId: '1568901346375-23c9450c58cd' },
  { name: 'bbq-ribs',             photoId: '1529193591184-b1d58069ecdd' },
  { name: 'chicken-wings',        photoId: '1527477396000-e27163b481c2' },
  { name: 'fries',                photoId: '1585238341710-4913d3a3a48e' },
  { name: 'mac-and-cheese',       photoId: '1543339308-43e59d6b73a6' },
  // Mexican
  { name: 'tacos',                photoId: '1565299585323-38d6b0865b47' },
  { name: 'burrito',              photoId: '1582169296194-e4d644c48063' },
  { name: 'quesadilla',           photoId: '1618040996337-56904b7850b9' },
  { name: 'guacamole',            photoId: '1601001435957-74f8a3a9e3fa' },
  // Indian
  { name: 'butter-chicken',       photoId: '1585937421612-70a008356fbe' },
  { name: 'biryani',              photoId: '1563379091339-03b21ab4a4f8' },
  { name: 'naan',                 photoId: '1574894709920-11b28e7367e3' },
  { name: 'mango-lassi',          photoId: '1553361371-9b22f78e8b1d' },
  // Chinese
  { name: 'dim-sum',              photoId: '1563245372-f21724e3856d' },
  { name: 'kung-pao-chicken',     photoId: '1563245372-f21724e3856d' },
  { name: 'fried-rice',           photoId: '1603133872878-684f208fb84b' },
  { name: 'spring-rolls',         photoId: '1620374644495-3e5d0c4c1c7f' },
  // Thai
  { name: 'pad-thai',             photoId: '1455619452474-d2be8b1e4e31' },
  { name: 'green-curry',          photoId: '1455619452474-d2be8b1e4e31' },
  { name: 'tom-yum',              photoId: '1547592166-23ac45744acd' },
  { name: 'mango-sticky-rice',    photoId: '1556042634-5adea2f85ce7' },
  // Mediterranean
  { name: 'hummus',               photoId: '1540189549336-e6e99c3679fe' },
  { name: 'falafel',              photoId: '1546069901-ba9599a7e63c' },
  { name: 'greek-salad',          photoId: '1540189549336-e6e99c3679fe' },
  { name: 'lamb-kebab',           photoId: '1529193591184-b1d58069ecdd' },
  // French
  { name: 'croissant',            photoId: '1555939594-58d7cb561537' },
  { name: 'french-onion-soup',    photoId: '1547592166-23ac45744acd' },
  { name: 'steak-frites',         photoId: '1555396273-367ea4eb4db5' },
  { name: 'creme-brulee',         photoId: '1571877227200-a0d98ea607e9' },
  // Lebanese
  { name: 'shawarma',             photoId: '1529193591184-b1d58069ecdd' },
  { name: 'kibbeh',               photoId: '1546069901-ba9599a7e63c' },
  { name: 'tabbouleh',            photoId: '1540189549336-e6e99c3679fe' },
  { name: 'baklava',              photoId: '1571877227200-a0d98ea607e9' },
  // Egyptian
  { name: 'koshary',              photoId: '1512621776951-a57141f2eefd' },
  { name: 'ful-medames',          photoId: '1546069901-ba9599a7e63c' },
  { name: 'egyptian-falafel',     photoId: '1546069901-ba9599a7e63c' },
  { name: 'hawawshi',             photoId: '1568901346375-23c9450c58cd' },
  // Pizza
  { name: 'pepperoni-pizza',      photoId: '1565299624946-b28f40a0ae38' },
  { name: 'four-cheese-pizza',    photoId: '1604068549290-dea0e4a305ca' },
  { name: 'calzone',              photoId: '1604068549290-dea0e4a305ca' },
  { name: 'garlic-bread',         photoId: '1528207776700-b60313a54d75' },
  // Seafood
  { name: 'grilled-salmon',       photoId: '1559827260-dc66d52bef19' },
  { name: 'lobster',              photoId: '1559827260-dc66d52bef19' },
  { name: 'calamari',             photoId: '1559827260-dc66d52bef19' },
  { name: 'shrimp-scampi',        photoId: '1559827260-dc66d52bef19' },
  // Steakhouse
  { name: 'ribeye-steak',         photoId: '1555396273-367ea4eb4db5' },
  { name: 'filet-mignon',         photoId: '1555396273-367ea4eb4db5' },
  { name: 'mushroom-sauce-steak', photoId: '1555396273-367ea4eb4db5' },
  { name: 'onion-rings',          photoId: '1585238341710-4913d3a3a48e' },
  // Healthy
  { name: 'acai-bowl',            photoId: '1512621776951-a57141f2eefd' },
  { name: 'avocado-toast',        photoId: '1512621776951-a57141f2eefd' },
  { name: 'quinoa-salad',         photoId: '1512621776951-a57141f2eefd' },
  { name: 'green-smoothie',       photoId: '1553361371-9b22f78e8b1d' },
];

async function downloadAndCompress(
  photoId: string,
  outputPath: string,
  width: number,
  height: number,
): Promise<boolean> {
  const url = `https://images.unsplash.com/photo-${photoId}?w=${width * 2}&q=90&fit=crop`;
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: { 'User-Agent': 'OrderKing/1.0 (image-downloader)' },
    });

    await (sharp as any)(Buffer.from(response.data))
      .resize(width, height, { fit: 'cover', position: 'centre' })
      .webp({ quality: 75, effort: 4 })
      .toFile(outputPath);

    return true;
  } catch {
    return false;
  }
}

async function main() {
  let ok = 0;
  let fail = 0;

  console.log(`\nDownloading ${RESTAURANT_IMAGES.length} restaurant covers…`);
  for (const img of RESTAURANT_IMAGES) {
    const dest = path.join(RESTAURANTS_DIR, `${img.name}.webp`);
    if (fs.existsSync(dest)) { console.log(`  ✓ skip  ${img.name}.webp (exists)`); ok++; continue; }
    const success = await downloadAndCompress(img.photoId, dest, 800, 450);
    if (success) { console.log(`  ✓ saved ${img.name}.webp`); ok++; }
    else         { console.log(`  ✗ fail  ${img.name}  (using placeholder)`); fail++; }
  }

  console.log(`\nDownloading ${MENU_IMAGES.length} menu item photos…`);
  for (const img of MENU_IMAGES) {
    const dest = path.join(MENU_DIR, `${img.name}.webp`);
    if (fs.existsSync(dest)) { console.log(`  ✓ skip  ${img.name}.webp (exists)`); ok++; continue; }
    const success = await downloadAndCompress(img.photoId, dest, 480, 360);
    if (success) { console.log(`  ✓ saved ${img.name}.webp`); ok++; }
    else         { console.log(`  ✗ fail  ${img.name}  (using placeholder)`); fail++; }
  }

  console.log(`\nDone — ${ok} saved, ${fail} failed.\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
