# This is an AI-generate database for experimental purposes only.
# Pseudo-Database API Documentation

## Overview
The pseudo-database is an in-memory database that loads data from `database/fake_db.json`, provides a simple query API, and allows persistent writes to the JSON file. All changes are automatically saved to disk.

**Key Fields:**
- **Cloths table:** `barcode` is the primary key (immutable)
- **Staffs table:** `id` is the primary key (immutable, auto-generated)
- **Transaction Log:** `id` is the primary key (immutable, auto-generated)
- **Staff Log:** `id` is the primary key (immutable, auto-generated)

## Installation & Usage

```javascript
const database = require('./pseudo-db.js');
```

## API Methods

### Read Operations

#### Cloth Queries

#### `getAllCloths()`
Returns all cloths in the database.
```javascript
const cloths = database.getAllCloths();
```

#### `getClothByBarcode(barcode)`
Get a specific cloth by its barcode.
```javascript
const cloth = database.getClothByBarcode('PANTS001');
```

#### `getClothsByCategory(category)`
Get all cloths belonging to a specific category.
```javascript
const formalCloths = database.getClothsByCategory('Formal');
```

#### `getClothsByColor(color)`
Get all cloths of a specific color.
```javascript
const blackCloths = database.getClothsByColor('Black');
```

#### `getClothsByMaterial(material)`
Get all cloths made from a specific material.
```javascript
const woolCloths = database.getClothsByMaterial('Wool Blend');
```

#### `getClothsBySize(size)`
Get all cloths of a specific size.
```javascript
const size34 = database.getClothsBySize(34);
```

#### `getClothsByPriceRange(minPrice, maxPrice)`
Get cloths within a price range.
```javascript
const affordable = database.getClothsByPriceRange(30, 60);
```

#### `searchClothsByName(searchTerm)`
Search cloths by design name (partial match, case-insensitive).
```javascript
const dresses = database.searchClothsByName('Dress');
```

#### `filterCloths(filters)`
Advanced filtering with multiple criteria. All filter conditions are AND-ed together.
```javascript
const results = database.filterCloths({
  category: 'Casual',
  color: 'Khaki',
  material: 'Cotton',
  minPrice: 20,
  maxPrice: 50,
  designName: 'Shorts'
});
```

### Filter Options
- `color` (string): Filter by color
- `material` (string): Filter by material
- `size` (number): Filter by size
- `category` (string): Filter by category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `designName` (string): Search in design name

### Shop Queries

#### `getShopInfo()`
Get all shop information.
```javascript
const info = database.getShopInfo();
```

#### `getShopPhones()`
Get shop phone numbers.
```javascript
const phones = database.getShopPhones();
```

#### `getShopLocation()`
Get shop location.
```javascript
const location = database.getShopLocation();
```

#### `getOwnerInfo()`
Get owner information.
```javascript
const owner = database.getOwnerInfo();
```

#### `getOwnerName()`
Get owner's name.
```javascript
const name = database.getOwnerName();
```

### Write Operations

#### `addCloth(clothData)`
Add a new cloth to the database. The cloth is added to memory and persisted to the JSON file.
```javascript
const newCloth = database.addCloth({
  designName: 'Cotton T-Shirt',
  barcode: 'TSHIRT001',
  color: 'Blue',
  size: 'M',
  material: 'Cotton',
  categories: ['Casual', 'Summer'],
  basePrice: 19.99
});
```

**Required fields:** `designName`, `barcode`, `basePrice`

**Returns:** The cloth object if successful, null if failed (e.g., duplicate barcode)

#### `updateCloth(barcode, updates)`
Update an existing cloth by its barcode. **Note: The barcode (primary key) cannot be updated.**
```javascript
const updated = database.updateCloth('TSHIRT001', {
  color: 'Red',
  basePrice: 24.99
});
```

**Key field protection:** Attempting to update the barcode will return null and log an error.

**Returns:** The updated cloth object if successful, null otherwise

#### `deleteCloth(barcode)`
Delete a cloth from the database by its barcode.
```javascript
const success = database.deleteCloth('TSHIRT001');
```

**Returns:** True if deleted successfully, false otherwise

#### `bulkAddCloths(clothsArray)`
Add multiple cloths at once.
```javascript
const result = database.bulkAddCloths([
  {
    designName: 'Shirt A',
    barcode: 'SHIRT_A',
    basePrice: 29.99
  },
  {
    designName: 'Shirt B',
    barcode: 'SHIRT_B',
    basePrice: 34.99
  }
]);
// Returns: { successful: 2, failed: 0, errors: [] }
```

**Returns:** Object with `{ successful, failed, errors }` counts

#### `updateShopInfo(updates)`
Update shop information.
```javascript
const updated = database.updateShopInfo({
  name: 'New Shop Name',
  location: 'New Location'
});
```

**Returns:** The updated shop info object if successful, null otherwise

#### `updateShopPhones(phones)`
Update shop phone numbers.
```javascript
const phones = database.updateShopPhones(['555-123-4567', '555-987-6543']);
```

**Returns:** The updated phones array if successful, null otherwise

#### `updateOwnerInfo(updates)`
Update owner information.
```javascript
const updated = database.updateOwnerInfo({
  name: 'New Owner Name',
  phone: '555-111-2222'
});
```

**Returns:** The updated owner info object if successful, null otherwise

#### `addStaff(staffData)`
Add a new staff member.
```javascript
const newStaff = database.addStaff({
  name: 'John Doe',
  gender: 'Male',
  citizenID: '123456789',
  dayOfBirth: '1990-01-15'
});
```

**Required fields:** `name`

**Returns:** The staff object with auto-generated `id` if successful, null if failed

#### `updateStaff(id, updates)`
Update a staff member by ID. **Note: The id (primary key) cannot be updated.**
```javascript
const updated = database.updateStaff(1, {
  name: 'Jane Doe',
  phone: '555-111-2222'
});
```

**Returns:** The updated staff object if successful, null otherwise

#### `deleteStaff(id)`
Delete a staff member by ID.
```javascript
const success = database.deleteStaff(1);
```

**Returns:** True if deleted successfully, false otherwise

#### `addTransactionLog(logData)`
Add a new transaction log.
```javascript
const newLog = database.addTransactionLog({
  type: 'SELL',
  cloths: [clothObject1, clothObject2],
  totalPrice: 99.99,
  receiptID: 123,
  date: '2024-05-17',  // optional
  time: '14:30:00'     // optional
});
```

**Required fields:** `type`, `cloths`, `totalPrice`

**Returns:** The transaction log with auto-generated `id` if successful, null if failed

#### `updateTransactionLog(id, updates)`
Update a transaction log by ID. **Note: The id (primary key) cannot be updated.**
```javascript
const updated = database.updateTransactionLog(1, {
  totalPrice: 109.99,
  receiptID: 124
});
```

**Returns:** The updated transaction log if successful, null otherwise

#### `deleteTransactionLog(id)`
Delete a transaction log by ID.
```javascript
const success = database.deleteTransactionLog(1);
```

**Returns:** True if deleted successfully, false otherwise

#### `addStaffLog(logData)`
Add a new staff log (clock in/out record).
```javascript
const newLog = database.addStaffLog({
  staffID: 1,
  type: 'START',
  note: 'Morning shift',
  date: '2026-04-10',  // optional
  time: '08:00:00'     // optional
});
```

**Required fields:** `staffID`, `type`

**Returns:** The staff log with auto-generated `id` if successful, null if failed

#### `updateStaffLog(id, updates)`
Update a staff log by ID. **Note: The id (primary key) cannot be updated.**
```javascript
const updated = database.updateStaffLog(1, {
  type: 'END',
  note: 'Completed shift'
});
```

**Returns:** The updated staff log if successful, null otherwise

#### `deleteStaffLog(id)`
Delete a staff log by ID.
```javascript
const success = database.deleteStaffLog(1);
```

**Returns:** True if deleted successfully, false otherwise

#### `clearAllCloths()`
Remove all cloths from the database. **Use with caution!**
```javascript
const success = database.clearAllCloths();
```

**Returns:** True if successful, false otherwise

#### `reloadFromFile()`
Reload data from the JSON file (useful if the file was modified externally).
```javascript
const success = database.reloadFromFile();
```

**Returns:** True if successful, false otherwise

### Staff Queries

#### `getAllStaffs()`
Get all staff members.
```javascript
const staffs = database.getAllStaffs();
```

#### `getStaffById(id)`
Get a staff member by their ID.
```javascript
const staff = database.getStaffById(1);
```

#### `searchStaffByName(searchTerm)`
Search staff by name (partial match, case-insensitive).
```javascript
const results = database.searchStaffByName('John');
```

#### `getStaffByGender(gender)`
Get staff members by gender.
```javascript
const maleStaff = database.getStaffByGender('Male');
```

#### `getAllStaffGenders()`
Get all unique genders in staff list.
```javascript
const genders = database.getAllStaffGenders();
```

#### `getStaffCount()`
Get total number of staff members.
```javascript
const count = database.getStaffCount();
```

### Transaction Log Queries

#### `getAllTransactionLogs()`
Get all transaction logs.
```javascript
const logs = database.getAllTransactionLogs();
```

#### `getTransactionLogById(id)`
Get a transaction log by ID.
```javascript
const log = database.getTransactionLogById(1);
```

#### `getTransactionLogsByType(type)`
Get transaction logs by type (SELL or RESTOCK).
```javascript
const sales = database.getTransactionLogsByType('SELL');
```

#### `getTransactionLogsByDate(date)`
Get transaction logs on a specific date (format: YYYY-MM-DD).
```javascript
const logs = database.getTransactionLogsByDate('2026-04-10');
```

#### `getTransactionLogsByDateRange(startDate, endDate)`
Get transaction logs within a date range.
```javascript
const logs = database.getTransactionLogsByDateRange('2026-04-01', '2026-04-30');
```

#### `getTransactionLogsByReceiptId(receiptID)`
Get transaction logs by receipt ID.
```javascript
const logs = database.getTransactionLogsByReceiptId(123);
```

#### `getTotalSales()`
Get total amount from all SELL transactions.
```javascript
const total = database.getTotalSales();
```

#### `getTotalRestocks()`
Get total amount from all RESTOCK transactions.
```javascript
const total = database.getTotalRestocks();
```

#### `getTransactionCountByType(type)`
Get count of transactions by type.
```javascript
const sellCount = database.getTransactionCountByType('SELL');
```

#### `getAllTransactionTypes()`
Get all unique transaction types.
```javascript
const types = database.getAllTransactionTypes();
```

#### `getTransactionLogCount()`
Get total count of all transaction logs.
```javascript
const count = database.getTransactionLogCount();
```

### Staff Log Queries

#### `getAllStaffLogs()`
Get all staff logs.
```javascript
const logs = database.getAllStaffLogs();
```

#### `getStaffLogById(id)`
Get a staff log by ID.
```javascript
const log = database.getStaffLogById(1);
```

#### `getStaffLogsByStaffId(staffID)`
Get all logs for a specific staff member.
```javascript
const logs = database.getStaffLogsByStaffId(1);
```

#### `getStaffLogsByType(type)`
Get staff logs by type (START or END).
```javascript
const startLogs = database.getStaffLogsByType('START');
```

#### `getStaffLogsByDate(date)`
Get staff logs on a specific date (format: YYYY-MM-DD).
```javascript
const logs = database.getStaffLogsByDate('2026-04-10');
```

#### `getStaffLogsByDateRange(startDate, endDate)`
Get staff logs within a date range.
```javascript
const logs = database.getStaffLogsByDateRange('2026-04-01', '2026-04-30');
```

#### `getStaffShiftsByDate(staffID, date)`
Get shift records for a specific staff member on a specific date.
```javascript
const shifts = database.getStaffShiftsByDate(1, '2026-04-10');
```

#### `getAllStaffLogTypes()`
Get all unique staff log types.
```javascript
const types = database.getAllStaffLogTypes();
```

#### `getStaffLogCount()`
Get total count of all staff logs.
```javascript
const count = database.getStaffLogCount();
```

### Metadata & Statistics

#### `getAllCategories()`
Get all unique categories.
```javascript
const categories = database.getAllCategories();
```

#### `getAllColors()`
Get all unique colors.
```javascript
const colors = database.getAllColors();
```

#### `getAllMaterials()`
Get all unique materials.
```javascript
const materials = database.getAllMaterials();
```

#### `getAllSizes()`
Get all unique sizes (sorted).
```javascript
const sizes = database.getAllSizes();
```

#### `getClothCount()`
Get total number of cloths.
```javascript
const count = database.getClothCount();
```

#### `getTotalInventoryValue()`
Get total value of all cloths.
```javascript
const value = database.getTotalInventoryValue();
```

#### `getAveragePrice()`
Get average price of all cloths.
```javascript
const average = database.getAveragePrice();
```

## Example Usage

See `example-queries.js` for comprehensive examples of how to use all query methods.

## Data Structure

Each cloth object has the following properties:
- `designName` (string): Name of the cloth design
- `barcode` (string): Unique barcode identifier
- `color` (string): Color of the cloth
- `size` (number): Size
- `material` (string): Material composition
- `categories` (array): Array of categories
- `basePrice` (number): Price in dollars

## Notes
- The database is loaded once on initialization
- All queries return new arrays or objects (not references to internal data)
- Text searches are case-insensitive
- Prices are compared as numbers
