# Fashion Emporium Web UI

A modern web-based management system for the Fashion Emporium shop, visualizing the main-manager.ts functionality.

## Features

### 👕 Cloth Management
- **View all cloths** with detailed information (design name, barcode, color, size, material, price, categories)
- **Add new cloths** to the inventory with full details
- **Auto-generate unique barcodes** - No manual entry needed
  - Format: `CLOTH-YYYYMMDD-XXXXX` (e.g., `CLOTH-20240517-A7F2B`)
  - Click "Generate" button to create new barcode
  - Guaranteed unique by checking against existing inventory
- **Search & Filter** cloths by:
  - Color
  - Material
  - Size
  - Category
  - Design name (partial match)
- **Delete cloths** from inventory
- Real-time updating of cloth count

### 🛒 Shopping Cart
- **Add cloths to cart** directly from the inventory table
- **View cart items** with all details
- **Remove items** from cart
- **Cart summary** showing:
  - Item count
  - Subtotal
  - Discount percentage (adjustable)
  - Final total
- **Flexible checkout** with:
  - Discount application
  - Staff ID assignment
  - Payment amount entry
- **Clear cart** functionality

### 📊 Statistics & Overview
- **Real-time statistics** including:
  - Total cloths in inventory
  - Total inventory value
  - Total sales
  - Staff count
  - Average price per cloth
  - Transaction count
  - Restock count
- **Category breakdown** showing all unique:
  - Categories
  - Materials
  - Colors
  - Sizes
- **Auto-refresh** every 30 seconds

### 🏪 Shop Information
- Display current shop name and location
- Owner information display
- Quick access shop info banner
- Manual refresh option

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Express.js

### Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd /Users/user/Desktop/exercise
   ```

2. **Install dependencies:**
   ```bash
   npm install express
   ```

3. **Start the web server:**
   ```bash
   node web-server.js
   ```

4. **Open in browser:**
   - Navigate to `http://localhost:3000`
   - The UI will load the Fashion Emporium management system

## API Endpoints

All endpoints return JSON responses with the following structure:
```json
{
  "success": true/false,
  "data": {...},
  "error": "error message if failed"
}
```

### Cloth Endpoints

- **GET** `/api/cloths` - Get all cloths
- **GET** `/api/cloths/:barcode` - Get specific cloth by barcode
- **GET** `/api/cloths/search?field=color&value=Blue` - Search cloths
- **POST** `/api/cloths` - Add new cloth
- **PUT** `/api/cloths/:barcode` - Update cloth
- **DELETE** `/api/cloths/:barcode` - Archive a cloth

### Statistics Endpoints

- **GET** `/api/shop-stats` - Get all shop statistics
- **GET** `/api/shop-info` - Get shop and owner information

### Archive & Transaction Endpoints

- **POST** `/api/checkout` - Process a purchase and archive items
- **GET** `/api/archive/cloths` - Get all archived cloths
- **GET** `/api/archive/receipts` - Get all archived receipts
- **GET** `/api/transactions` - Get all transaction logs
- **GET** `/api/categories/recommendations?term=...` - Get category suggestions for search

## Usage Examples

### Add a New Cloth
1. Scroll to "Cloth Management" section
2. Fill in the form:
   - **Design Name**: "Classic T-Shirt"
   - **Barcode**: Click "Generate" button (auto-generates unique barcode like `CLOTH-20240517-A7F2B`)
   - **Price**: 29.99
   - **Size**: M
   - **Color**: Blue
   - **Material**: Cotton
   - **Categories**: Casual, Summer
3. Click "Add Cloth"

**Pro Tip**: Barcodes are read-only and auto-generated for consistency and uniqueness!

### Search for Cloths
1. Select search field (e.g., "Color")
2. Enter search value (e.g., "Blue")
3. Click "Search"

### Add to Cart and Checkout
1. Find desired cloths in the inventory
2. Click "Add" button for each cloth
3. View cart items in the "Shopping Cart" section
4. Adjust discount percentage if needed
5. Enter Staff ID and payment amount
6. Click "Complete Purchase"

### View Statistics
1. Scroll to "Statistics & Overview" section
2. View real-time shop statistics
3. See breakdown of categories, materials, colors, and sizes
4. Stats auto-refresh every 30 seconds

## Auto-Generated Barcode System

The barcode generation system ensures every cloth has a unique identifier without manual entry.

### Format
`CLOTH-YYYYMMDD-XXXXX` where:
- **CLOTH** = Product type prefix
- **YYYYMMDD** = Current date (e.g., 20260410)
- **YYYYMMDD** = Current date (e.g., 20240517)
- **XXXXX** = Random 5-character alphanumeric suffix

### Features
✅ Automatically generated on page load  
✅ Generate new barcode with "Generate" button  
✅ Collision detection - prevents duplicate barcodes  
✅ Auto-refresh after each item added  
✅ Read-only field prevents manual modification  
✅ Faster inventory data entry  

## Architecture

### Frontend
- **index.html** - Main UI template with Bootstrap 5
- **style.css** - Custom styling and responsive design
- **app.js** - Client-side logic and API communication

### Backend
- **web-server.js** - Express.js server providing REST API
- **pseudo-db.js** - In-memory database with persistence
- **fake_db.json** - JSON data file for persistence

## Data Persistence

All changes are automatically saved to `database/fake_db.json`. The database persists:
- All cloths and their details
- Shop information
- Owner information
- Transaction history
- Staff information

## Features Coming Soon

- Cost calculations and financial reports
- Staff management interface
- Transaction history viewer
- Advanced reporting and analytics
- User authentication
- Multiple user roles (Admin, Manager, Cashier)
- Inventory alerts and reordering
- Batch operations for cloths
- Export data functionality

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, modify in `web-server.js`:
```javascript
const PORT = 3001; // Change to another port
```

### Database Not Loading
Ensure `fake_db.json` exists in the `database/` folder. The server will attempt to load it on startup.

### Changes Not Persisting
Verify that the `database/` folder has write permissions. Check `web-server.js` for any console errors.

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (responsive design)

## License

Part of the Fashion Emporium Management System project.
