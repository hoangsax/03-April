// Example usage of the Pseudo-Database
// This file demonstrates how clients can query and write to the database

const database = require('./pseudo-db.js');

console.log('===== Pseudo-Database Query Examples =====\n');

// Example 1: Get all cloths
console.log('1. Get all cloths:');
const allCloths = database.getAllCloths();
console.log(`Total cloths: ${allCloths.length}\n`);

// Example 2: Get cloth by barcode
console.log('2. Get cloth by barcode:');
const cloth = database.getClothByBarcode('PANTS001');
console.log('Found cloth:', cloth, '\n');

// Example 3: Get cloths by category
console.log('3. Get cloths by category (Formal):');
const formalCloths = database.getClothsByCategories(['Formal']);
console.log('Formal cloths count:', formalCloths.length);
console.log('Items:', formalCloths, '\n');

// Example 4: Get cloths by color
console.log('4. Get cloths by color (Black):');
const blackCloths = database.getClothsByColor('Black');
console.log('Black cloths:', blackCloths, '\n');

// Example 5: Get cloths by price range
console.log('5. Get cloths between $30 and $50:');
const midPriceCloths = database.getClothsByPriceRange(30, 50);
console.log('Items:', midPriceCloths, '\n');

// Example 6: Search by name
console.log('6. Search cloths by name (containing "Dress"):');
const dressResults = database.searchClothsByName('Dress');
console.log('Results:', dressResults, '\n');

// Example 7: Advanced filtering
console.log('7. Advanced filter (Category: Casual, Material: Cotton, Max Price: 60):');
const filtered = database.filterCloths({
  category: 'Casual',
  material: 'Cotton',
  maxPrice: 60
});
console.log('Filtered results:', filtered, '\n');

// Example 8: Get all available options
console.log('8. Get all available filter options:');
console.log('Categories:', database.getAllCategories());
console.log('Colors:', database.getAllColors());
console.log('Materials:', database.getAllMaterials());
console.log('Sizes:', database.getAllSizes(), '\n');

// Example 9: Get shop information
console.log('9. Get shop information:');
console.log('Shop Info:', database.getShopInfo());
console.log('Owner Info:', database.getOwnerInfo(), '\n');

// Example 10: Get statistics
console.log('10. Get statistics:');
console.log('Total cloths:', database.getClothCount());
console.log('Total inventory value: $' + database.getTotalInventoryValue().toFixed(2));
console.log('Average price: $' + database.getAveragePrice().toFixed(2));

console.log('\n===== Write Operations Examples =====\n');

// Example 11: Add a new cloth
console.log('11. Add a new cloth:');
const newCloth = database.addCloth({
  designName: 'Denim Jacket',
  barcode: 'JACKET001',
  color: 'Blue',
  size: 'M',
  material: 'Denim',
  categories: ['Casual', 'Outer wear'],
  basePrice: 89.99
});
console.log('Added cloth:', newCloth);
console.log('Updated total: ' + database.getClothCount() + ' cloths\n');

// Example 12: Update a cloth
console.log('12. Update a cloth:');
const updated = database.updateCloth('JACKET001', {
  basePrice: 79.99,
  categories: ['Casual', 'Outer wear', 'Popular']
});
console.log('Updated cloth:', updated, '\n');

// Example 13: Update shop info
console.log('13. Update shop information:');
const updatedShopInfo = database.updateShopInfo({
  location: 'Main Street, Downtown'
});
console.log('Updated shop info:', updatedShopInfo, '\n');

// Example 14: Update owner info
console.log('14. Update owner information:');
const updatedOwnerInfo = database.updateOwnerInfo({
  phone: '555-999-1111'
});
console.log('Updated owner info:', updatedOwnerInfo, '\n');

// Example 15: Bulk add cloths
console.log('15. Bulk add multiple cloths:');
const bulkResult = database.bulkAddCloths([
  {
    designName: 'Polo Shirt',
    barcode: 'POLO001',
    color: 'White',
    size: 'L',
    material: 'Cotton',
    categories: ['Casual', 'Work'],
    basePrice: 44.99
  },
  {
    designName: 'Wool Sweater',
    barcode: 'SWEATER001',
    color: 'Gray',
    size: 'M',
    material: 'Wool',
    categories: ['Casual', 'Winter'],
    basePrice: 64.99
  }
]);
console.log('Bulk add result:', bulkResult);
console.log('Updated total: ' + database.getClothCount() + ' cloths\n');

// Example 16: Delete a cloth
console.log('16. Delete a cloth:');
const deleteSuccess = database.deleteCloth('SWEATER001');
console.log('Delete successful:', deleteSuccess);
console.log('Updated total: ' + database.getClothCount() + ' cloths\n');

console.log('===== Staff Operations Examples =====\n');

// Example 17: Add a new staff member
console.log('17. Add a new staff member:');
const newStaff = database.addStaff({
  name: 'Alice Johnson',
  gender: 'Female',
  citizenID: '987654321',
  dayOfBirth: '1985-05-20'
});
console.log('Added staff:', newStaff);
console.log('Total staff: ' + database.getStaffCount() + '\n');

// Example 18: Query staff members
console.log('18. Query staff:');
console.log('All staff:', database.getAllStaffs());
console.log('Staff count:', database.getStaffCount());
console.log('Search by name "Alice":', database.searchStaffByName('Alice'), '\n');

// Example 19: Update a staff member
console.log('19. Update staff:');
const updatedStaff = database.updateStaff(newStaff.id, {
  name: 'Alice Smith'
});
console.log('Updated staff:', updatedStaff, '\n');

console.log('===== Transaction Log Operations Examples =====\n');

// Example 20: Add a transaction log
console.log('20. Add transaction log:');
const newTransaction = database.addTransactionLog({
  type: 'SELL',
  cloths: [
    {
      designName: 'Test Item',
      barcode: 'TEST001',
      basePrice: 49.99
    }
  ],
  totalPrice: 49.99,
  receiptID: 501
});
console.log('Added transaction:', newTransaction);
console.log('Total transactions: ' + database.getTransactionLogCount() + '\n');

// Example 21: Query transaction logs
console.log('21. Query transaction logs:');
console.log('All transaction types:', database.getAllTransactionTypes());
console.log('Transaction count:', database.getTransactionLogCount());
console.log('Total sales:', database.getTotalSales(), '\n');

// Example 22: Update a transaction log
console.log('22. Update transaction log:');
const updatedTransaction = database.updateTransactionLog(newTransaction.id, {
  type: 'RESTOCK'
});
console.log('Updated transaction:', updatedTransaction, '\n');

console.log('===== Staff Log Operations Examples =====\n');

// Example 23: Add a staff log (clock in)
console.log('23. Add staff log (START):');
const newStaffLog = database.addStaffLog({
  staffID: newStaff.id,
  type: 'START',
  note: 'Morning shift started'
});
console.log('Added staff log:', newStaffLog);
console.log('Total staff logs: ' + database.getStaffLogCount() + '\n');

// Example 24: Query staff logs
console.log('24. Query staff logs:');
console.log('All log types:', database.getAllStaffLogTypes());
console.log('Logs for staff ' + newStaff.id + ':', database.getStaffLogsByStaffId(newStaff.id));
console.log('Total staff logs: ' + database.getStaffLogCount() + '\n');

// Example 25: Update a staff log
console.log('25. Update staff log:');
const updatedStaffLog = database.updateStaffLog(newStaffLog.id, {
  type: 'END',
  note: 'Morning shift ended'
});
console.log('Updated staff log:', updatedStaffLog, '\n');

console.log('===== All data changes have been persisted to fake_db.json =====');

console.log('\n\n');
console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║                  SEARCH FUNCTION TEST CASES                   ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Add test data for comprehensive search testing
console.log('Setting up test data for search tests...\n');

// Add multiple cloths with various attributes
const testCloths = [
  {
    designName: 'Cotton T-Shirt White',
    barcode: 'TEST-TSHIRT-W-001',
    color: 'White',
    size: 'M',
    material: 'Cotton',
    categories: ['Casual', 'Everyday'],
    basePrice: 19.99
  },
  {
    designName: 'Cotton T-Shirt Blue',
    barcode: 'TEST-TSHIRT-B-001',
    color: 'Blue',
    size: 'L',
    material: 'Cotton',
    categories: ['Casual', 'Everyday'],
    basePrice: 19.99
  },
  {
    designName: 'Wool Sweater Gray',
    barcode: 'TEST-SWEATER-G-001',
    color: 'Gray',
    size: 'M',
    material: 'Wool',
    categories: ['Winter', 'Casual'],
    basePrice: 59.99
  },
  {
    designName: 'Silk Blouse Red',
    barcode: 'TEST-BLOUSE-R-001',
    color: 'Red',
    size: 'S',
    material: 'Silk',
    categories: ['Formal', 'Work'],
    basePrice: 79.99
  },
  {
    designName: 'Denim Jeans Blue',
    barcode: 'TEST-JEANS-B-001',
    color: 'Blue',
    size: 'M',
    material: 'Denim',
    categories: ['Casual', 'Everyday'],
    basePrice: 49.99
  },
  {
    designName: 'Linen Shirt White',
    barcode: 'TEST-LINEN-W-001',
    color: 'White',
    size: 'L',
    material: 'Linen',
    categories: ['Summer', 'Casual'],
    basePrice: 39.99
  }
];

// Bulk add test data
const bulkAddResult = database.bulkAddCloths(testCloths);
console.log(`✓ Added ${testCloths.length} test cloths for search testing\n`);

// ==================== TEST SUITE 1: SEARCH BY COLOR ====================
console.log('═══ TEST SUITE 1: SEARCH BY COLOR ═══\n');

// Test Case 1.1: Search for White cloths
console.log('Test 1.1 - Search for White color:');
const whiteResults = database.getClothsByColor('White');
console.log(`Expected: 2 items (Cotton T-Shirt White, Linen Shirt White)`);
console.log(`Actual: ${whiteResults.length} items`);
console.log(`Items: ${whiteResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${whiteResults.length === 2 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 1.2: Search for Blue cloths
console.log('Test 1.2 - Search for Blue color:');
const blueResults = database.getClothsByColor('Blue');
console.log(`Expected: 2 items (Cotton T-Shirt Blue, Denim Jeans Blue)`);
console.log(`Actual: ${blueResults.length} items`);
console.log(`Items: ${blueResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${blueResults.length === 2 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 1.3: Search for non-existent color
console.log('Test 1.3 - Search for non-existent color (Purple):');
const purpleResults = database.getClothsByColor('Purple');
console.log(`Expected: 0 items`);
console.log(`Actual: ${purpleResults.length} items`);
console.log(`Status: ${purpleResults.length === 0 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 1.4: Case sensitivity test
console.log('Test 1.4 - Case sensitivity test (lowercase "white"):');
const lowercaseWhiteResults = database.getClothsByColor('white');
console.log(`Expected: 0 items (searching with lowercase)`);
console.log(`Actual: ${lowercaseWhiteResults.length} items`);
console.log(`Status: ${lowercaseWhiteResults.length === 0 ? '✓ PASS' : '✗ FAIL'}\n`);

// ==================== TEST SUITE 2: SEARCH BY MATERIAL ====================
console.log('═══ TEST SUITE 2: SEARCH BY MATERIAL ═══\n');

// Test Case 2.1: Search for Cotton material
console.log('Test 2.1 - Search for Cotton material:');
const cottonResults = database.getClothsByMaterial('Cotton');
console.log(`Expected: 2 items (Cotton T-Shirt White, Cotton T-Shirt Blue)`);
console.log(`Actual: ${cottonResults.length} items`);
console.log(`Items: ${cottonResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${cottonResults.length === 2 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 2.2: Search for Wool material
console.log('Test 2.2 - Search for Wool material:');
const woolResults = database.getClothsByMaterial('Wool');
console.log(`Expected: 1 item (Wool Sweater Gray)`);
console.log(`Actual: ${woolResults.length} items`);
console.log(`Items: ${woolResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${woolResults.length === 1 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 2.3: Search for non-existent material
console.log('Test 2.3 - Search for non-existent material (Leather):');
const leatherResults = database.getClothsByMaterial('Leather');
console.log(`Expected: 0 items`);
console.log(`Actual: ${leatherResults.length} items`);
console.log(`Status: ${leatherResults.length === 0 ? '✓ PASS' : '✗ FAIL'}\n`);

// ==================== TEST SUITE 3: SEARCH BY SIZE ====================
console.log('═══ TEST SUITE 3: SEARCH BY SIZE ═══\n');

// Test Case 3.1: Search for Medium size
console.log('Test 3.1 - Search for Medium (M) size:');
const mediumResults = database.getClothsBySize('M');
console.log(`Expected: 3 items (Cotton T-Shirt White, Wool Sweater Gray, Denim Jeans Blue)`);
console.log(`Actual: ${mediumResults.length} items`);
console.log(`Items: ${mediumResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${mediumResults.length === 3 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 3.2: Search for Large size
console.log('Test 3.2 - Search for Large (L) size:');
const largeResults = database.getClothsBySize('L');
console.log(`Expected: 2 items (Cotton T-Shirt Blue, Linen Shirt White)`);
console.log(`Actual: ${largeResults.length} items`);
console.log(`Items: ${largeResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${largeResults.length === 2 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 3.3: Search for Small size
console.log('Test 3.3 - Search for Small (S) size:');
const smallResults = database.getClothsBySize('S');
console.log(`Expected: 1 item (Silk Blouse Red)`);
console.log(`Actual: ${smallResults.length} items`);
console.log(`Items: ${smallResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${smallResults.length === 1 ? '✓ PASS' : '✗ FAIL'}\n`);

// ==================== TEST SUITE 4: SEARCH BY CATEGORY ====================
console.log('═══ TEST SUITE 4: SEARCH BY CATEGORY ═══\n');

// Test Case 4.1: Search for Casual category
console.log('Test 4.1 - Search for Casual category:');
const casualResults = database.getClothsByCategories(['Casual']);
console.log(`Expected: 5 items (all test items have Casual category)`);
console.log(`Actual: ${casualResults.length} items`);
console.log(`Items: ${casualResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${casualResults.length === 5 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 4.2: Search for Winter category
console.log('Test 4.2 - Search for Winter category:');
const winterResults = database.getClothsByCategories(['Winter']);
console.log(`Expected: 1 item (Wool Sweater Gray)`);
console.log(`Actual: ${winterResults.length} items`);
console.log(`Items: ${winterResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${winterResults.length === 1 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 4.3: Search for Formal category
console.log('Test 4.3 - Search for Formal category:');
const formalResults = database.getClothsByCategories(['Formal']);
console.log(`Expected: 1 item (Silk Blouse Red)`);
console.log(`Actual: ${formalResults.length} items`);
console.log(`Items: ${formalResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${formalResults.length === 1 ? '✓ PASS' : '✗ FAIL'}\n`);

// ==================== TEST SUITE 5: SEARCH BY NAME ====================
console.log('═══ TEST SUITE 5: SEARCH BY NAME (PARTIAL MATCH) ═══\n');

// Test Case 5.1: Search for "T-Shirt"
console.log('Test 5.1 - Search for "T-Shirt":');
const tshirtNameResults = database.searchClothsByName('T-Shirt');
console.log(`Expected: 2 items (Cotton T-Shirt White, Cotton T-Shirt Blue)`);
console.log(`Actual: ${tshirtNameResults.length} items`);
console.log(`Items: ${tshirtNameResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${tshirtNameResults.length === 2 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 5.2: Search for "Sweater"
console.log('Test 5.2 - Search for "Sweater":');
const sweaterNameResults = database.searchClothsByName('Sweater');
console.log(`Expected: 1 item (Wool Sweater Gray)`);
console.log(`Actual: ${sweaterNameResults.length} items`);
console.log(`Items: ${sweaterNameResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${sweaterNameResults.length === 1 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 5.3: Case-insensitive partial search
console.log('Test 5.3 - Search for "shirt" (lowercase):');
const lowercaseShirtResults = database.searchClothsByName('shirt');
console.log(`Expected: 3 items if case-insensitive (contains "Shirt")`);
console.log(`Actual: ${lowercaseShirtResults.length} items`);
console.log(`Items: ${lowercaseShirtResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${lowercaseShirtResults.length >= 1 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 5.4: Search with no matches
console.log('Test 5.4 - Search for non-existent term "Jacket":');
const jacketNameResults = database.searchClothsByName('Jacket');
console.log(`Expected: 0 items`);
console.log(`Actual: ${jacketNameResults.length} items`);
console.log(`Status: ${jacketNameResults.length === 0 ? '✓ PASS' : '✗ FAIL'}\n`);

// ==================== TEST SUITE 6: PRICE RANGE SEARCH ====================
console.log('═══ TEST SUITE 6: PRICE RANGE SEARCH ═══\n');

// Test Case 6.1: Search in budget range ($20-$40)
console.log('Test 6.1 - Search for cloths in price range $20-$40:');
const budgetResults = database.getClothsByPriceRange(20, 40);
console.log(`Expected: 2 items (Cotton T-Shirt ~$19.99, Linen Shirt $39.99)`);
console.log(`Actual: ${budgetResults.length} items`);
console.log(`Items: ${budgetResults.map(c => `${c.designName} ($${c.basePrice})`).join(', ')}`);
console.log(`Status: ${budgetResults.length >= 1 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 6.2: Search in mid-range ($40-$60)
console.log('Test 6.2 - Search for cloths in price range $40-$60:');
const midRangeResults = database.getClothsByPriceRange(40, 60);
console.log(`Expected: 2 items (Denim Jeans $49.99, Wool Sweater $59.99)`);
console.log(`Actual: ${midRangeResults.length} items`);
console.log(`Items: ${midRangeResults.map(c => `${c.designName} ($${c.basePrice})`).join(', ')}`);
console.log(`Status: ${midRangeResults.length === 2 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 6.3: Search in premium range ($70-$100)
console.log('Test 6.3 - Search for cloths in price range $70-$100:');
const premiumResults = database.getClothsByPriceRange(70, 100);
console.log(`Expected: 1 item (Silk Blouse $79.99)`);
console.log(`Actual: ${premiumResults.length} items`);
console.log(`Items: ${premiumResults.map(c => `${c.designName} ($${c.basePrice})`).join(', ')}`);
console.log(`Status: ${premiumResults.length === 1 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 6.4: Search with no results in range
console.log('Test 6.4 - Search in empty price range ($200-$300):');
const emptyRangeResults = database.getClothsByPriceRange(200, 300);
console.log(`Expected: 0 items`);
console.log(`Actual: ${emptyRangeResults.length} items`);
console.log(`Status: ${emptyRangeResults.length === 0 ? '✓ PASS' : '✗ FAIL'}\n`);

// ==================== TEST SUITE 7: ADVANCED FILTERING ====================
console.log('═══ TEST SUITE 7: ADVANCED FILTERING ═══\n');

// Test Case 7.1: Filter by category and material
console.log('Test 7.1 - Filter Casual category with Cotton material:');
const casualCottonResults = database.filterCloths({
  category: 'Casual',
  material: 'Cotton'
});
console.log(`Expected: 2 items (Cotton T-Shirts)`);
console.log(`Actual: ${casualCottonResults.length} items`);
console.log(`Items: ${casualCottonResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${casualCottonResults.length === 2 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 7.2: Filter by material and price
console.log('Test 7.2 - Filter Cotton material with max price $50:');
const cottonBudgetResults = database.filterCloths({
  material: 'Cotton',
  maxPrice: 50
});
console.log(`Expected: 2 items (Cotton T-Shirts ~$19.99)`);
console.log(`Actual: ${cottonBudgetResults.length} items`);
console.log(`Items: ${cottonBudgetResults.map(c => `${c.designName} ($${c.basePrice})`).join(', ')}`);
console.log(`Status: ${cottonBudgetResults.length === 2 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 7.3: Complex filter with multiple criteria
console.log('Test 7.3 - Filter Casual category, Cotton material, size M, max $50:');
const complexResults = database.filterCloths({
  category: 'Casual',
  material: 'Cotton',
  size: 'M',
  maxPrice: 50
});
console.log(`Expected: 1 item (Cotton T-Shirt White)`);
console.log(`Actual: ${complexResults.length} items`);
console.log(`Items: ${complexResults.map(c => c.designName).join(', ')}`);
console.log(`Status: ${complexResults.length === 1 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 7.4: Filter with no matches
console.log('Test 7.4 - Filter with impossible criteria (Formal + Cotton):');
const noMatchResults = database.filterCloths({
  category: 'Formal',
  material: 'Cotton'
});
console.log(`Expected: 0 items (no Formal Cotton items)`);
console.log(`Actual: ${noMatchResults.length} items`);
console.log(`Status: ${noMatchResults.length === 0 ? '✓ PASS' : '✗ FAIL'}\n`);

// ==================== TEST SUITE 8: FILTER OPTIONS ====================
console.log('═══ TEST SUITE 8: GET ALL FILTER OPTIONS ═══\n');

// Test Case 8.1: Get all available colors
console.log('Test 8.1 - Get all available colors:');
const allColors = database.getAllColors();
console.log(`Available colors: ${allColors.join(', ')}`);
console.log(`Expected count: 5 or more`);
console.log(`Actual count: ${allColors.length}`);
console.log(`Status: ${allColors.length >= 5 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 8.2: Get all available materials
console.log('Test 8.2 - Get all available materials:');
const allMaterials = database.getAllMaterials();
console.log(`Available materials: ${allMaterials.join(', ')}`);
console.log(`Expected count: 5 or more (Cotton, Wool, Silk, Denim, Linen)`);
console.log(`Actual count: ${allMaterials.length}`);
console.log(`Status: ${allMaterials.length >= 5 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 8.3: Get all available sizes
console.log('Test 8.3 - Get all available sizes:');
const allSizes = database.getAllSizes();
console.log(`Available sizes: ${allSizes.join(', ')}`);
console.log(`Expected: S, M, L`);
console.log(`Status: ${allSizes.includes('S') && allSizes.includes('M') && allSizes.includes('L') ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 8.4: Get all available categories
console.log('Test 8.4 - Get all available categories:');
const allCategories = database.getAllCategories();
console.log(`Available categories: ${allCategories.join(', ')}`);
console.log(`Expected count: 5 or more`);
console.log(`Actual count: ${allCategories.length}`);
console.log(`Status: ${allCategories.length >= 5 ? '✓ PASS' : '✗ FAIL'}\n`);

// ==================== TEST SUMMARY ====================
console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║                      TEST SUITE COMPLETE                       ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('✓ All search function test cases have been executed!');;
