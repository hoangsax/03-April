// 1. Initialize the Shop
import { Shop } from "./shop.ts";
import { Cloth } from "./cloth.ts";
// --- SETUP TEST DATA ---

// 1. Create the Shop
const myShop = new Shop(1, {
    name: "Tech-Wear Boutique",
    phone: "555-0102",
    location: "Cyber Plaza"
});

// 2. Create Cloth Instances (Mixed Data)
const item1 = new Cloth("Classic Tee", "BT-001", "Black", 38, "Cotton", ["Basic"], 20);
const item2 = new Cloth("Classic Tee", "BT-002", "Black", 42, "Cotton", ["Basic"], 20);
const item3 = new Cloth("Denim Jacket", "DJ-001", "Blue", 40, "Denim", ["Streetwear"], 85);
const item4 = new Cloth("Slim Chinos", "SC-001", "Beige", 32, "Cotton", ["Formal"], 45);
const item5 = new Cloth("Classic Tee", "BT-003", "White", 38, "Cotton", ["Basic"], 20);

// 3. Populate the Shop
[item1, item2, item3, item4, item5].forEach(item => myShop.addCloth(item));

// --- EXECUTE TESTS ---

console.log("--- STARTING SHOP TESTS ---\n");

// TEST 1: Find by Color (Should return 2 Black items)
const blackItems = myShop.searchClothBy("color", "Black");
console.log(`Test 1 (Color 'Black'): Found ${blackItems?.length} items.`); 
// Expected: 2 (item1, item2)

// TEST 2: Find by Size (Should return 2 Size 38 items)
const size38Items = myShop.searchClothBy("size", 38);
console.log(`Test 2 (Size 32): Found ${size38Items?.length} items.`);
// Expected: 2 (item1, item5)

// TEST 3: Find by Material (Should return 4 Cotton items)
const cottonItems = myShop.searchClothBy("material", "Cotton");
console.log(`Test 3 (Material 'Cotton'): Found ${cottonItems?.length} items.`);
// Expected: 4

// TEST 4: Non-existent value
const greenItems = myShop.searchClothBy("color", "Green");
console.log(`Test 4 (Color 'Green'): Found ${greenItems?.length} items.`);
// Expected: 0 (The array should be empty)

// TEST 5: Verify removeCloth logic & Archive
console.log("\n--- ARCHIVE TEST ---");
myShop.removeCloth("BT-001"); // Removing the first Black Tee
const blackItemsAfter = myShop.searchClothBy("color", "Black");
console.log(`Black items after removal: ${blackItemsAfter?.length}`);
// Expected: 1