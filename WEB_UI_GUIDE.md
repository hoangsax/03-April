# 🛍️ Fashion Emporium Web UI - Quick Start Guide

## Overview

This is a modern web-based management system for the Fashion Emporium shop. It visualizes all the functional abilities of the `main-manager.ts` class, starting with cloth-related functions.

## 📋 What's Included

```
exercise/
├── web-server.js          # Express.js backend server
├── package.json           # Node.js dependencies
├── public/                # Frontend files
│   ├── index.html         # Main UI template
│   ├── style.css          # Styling
│   ├── app.js             # Client-side logic
│   └── README.md          # Detailed documentation
├── database/              # Database files
│   ├── pseudo-db.js       # In-memory database
│   └── fake_db.json       # Persistent data storage
└── setup.sh               # Setup script
```

## ⚡ Quick Start (3 steps)

### Step 1: Install Dependencies
```bash
cd /Users/user/Desktop/exercise
npm install
```

### Step 2: Start the Server
```bash
npm start
# or
node web-server.js
```

You should see:
```
🛍️  Fashion Emporium Web UI Server running at http://localhost:3000
📊 Database location: /Users/user/Desktop/exercise/database/fake_db.json
```

### Step 3: Open in Browser
- Visit: **http://localhost:3000**
- The web UI will load automatically

## 🎯 Main Features

### 1️⃣ Cloth Management
- **View all cloths** with complete details
- **Add new cloths** to inventory
- **Auto-generate unique barcodes** - Click "Generate" button (format: `CLOTH-YYYYMMDD-XXXXX`)
- **Search and filter** by: color, material, size, category, name
- **Delete cloths** from inventory
- Real-time inventory count

### 2️⃣ Shopping Cart
- **Add items** to cart
- **View cart** with all details
- **Apply discounts** (percentage-based)
- **Checkout** with payment processing
- **Clear cart** functionality

### 3️⃣ Statistics Dashboard
- **Real-time statistics**:
  - Total cloths in inventory
  - Inventory value
  - Total sales
  - Staff count
  - Average price
  - Transaction count
- **Category breakdown** with colors, materials, and sizes
- **Auto-refresh** every 30 seconds

### 4️⃣ Shop Information
- Display shop name and location
- Show owner information
- Quick access banner

## 📊 Sample Workflow

### Add a Test Cloth

1. Scroll to **Cloth Management** section
2. Click **Generate** button to create a unique barcode (auto-generates in format: `CLOTH-20240517-A7F2B`)
3. Fill the form:
   ```
   Design Name: Summer T-Shirt
   Barcode: (auto-generated - read only)
   Price: 24.99
   Size: M
   Color: Sky Blue
   Material: Cotton
   Categories: Casual, Summer
   ```
4. Click **Add Cloth**
5. Success alert should appear with barcode confirmation

### Search for Cloths

1. Go to **Search & Filter** box
2. Select field: "Color"
3. Enter: "Sky Blue"
4. Click **Search**
5. Only matching cloths appear

### Add to Cart

1. Click **Add** button next to a cloth
2. Item appears in the **Shopping Cart** section
3. You can add multiple items
4. Cart summary updates automatically

### Checkout

1. Adjust **Discount (%)** if needed
2. Enter **Staff ID** (e.g., 1)
3. Review **Total Payment** amount
4. Click **Complete Purchase**
5. Cart clears and success alert appears

## 🔌 API Endpoints

The server provides REST APIs:

### Get All Cloths
```bash
curl http://localhost:3000/api/cloths
```

### Add New Cloth
```bash
curl -X POST http://localhost:3000/api/cloths \
  -H "Content-Type: application/json" \
  -d '{
    "designName": "Polo Shirt",
    "barcode": "POLO001",
    "basePrice": 39.99,
    "color": "Red",
    "size": "L",
    "material": "Cotton",
    "categories": ["Casual", "Work"]
  }'
```

### Search Cloths
```bash
curl http://localhost:3000/api/cloths/search?field=color&value=Red
```

### Get Shop Statistics
```bash
curl http://localhost:3000/api/shop-stats
```

## 🗂️ Project Structure

```
Backend Architecture:
├── web-server.js          ← Express server (REST endpoints)
├── database/
│   ├── pseudo-db.js       ← In-memory DB with persistence
│   └── fake_db.json       ← JSON data storage
└── manager/
    └── main-manager.ts    ← Business logic

Frontend Architecture:
├── public/index.html      ← HTML template (Bootstrap 5)
├── public/style.css       ← Custom styling
└── public/app.js          ← Client-side logic (fetch API calls)
```

## 🛠️ Technology Stack

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, Bootstrap 5, Vanilla JavaScript
- **Database**: JSON file-based with pseudo-db.js
- **HTTP**: REST API
- **Icons**: FontAwesome

## 📱 Browser Support

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (responsive)

## 🚀 Features Implemented

### Current (Cloth-Related)
- ✅ View all cloths
- ✅ Add new cloth
- ✅ Search and filter
- ✅ Delete cloth
- ✅ Add to cart
- ✅ Cart management
- ✅ Checkout simulation
- ✅ Statistics dashboard

### Coming Soon
- Staff management
- Financial reports
- Transaction history
- User authentication
- Batch operations
- Advanced analytics

## 🔍 Troubleshooting

### Port 3000 Already in Use
Edit `web-server.js` line 7:
```javascript
const PORT = 3001; // Change this number
```

### Database File Not Found
The system will create it on first run. Ensure `database/` folder exists.

### Styles Not Loading
Clear browser cache: `Ctrl+Shift+Delete` (or Cmd+Shift+Delete on Mac)

### API Errors
Check browser console: `F12` → Console tab

## 📚 Additional Resources

- **Frontend Docs**: See `public/README.md`
- **Backend Docs**: See database files and pseudo-db.js comments
- **Main Manager**: See `manager/main-manager.ts`

## 🎓 Usage Tips

1. **Real-time updates**: All operations update live (no page refresh needed)
2. **Responsive design**: Works on desktop, tablet, and mobile
3. **Auto-save**: All changes persist to `fake_db.json`
4. **Auto-refresh stats**: Statistics update every 30 seconds
5. **Toast alerts**: Visual feedback for all operations

## 🆘 Need Help?

Check the following:
1. Is the server running? (check terminal output)
2. Is port 3000 accessible? (try http://localhost:3000)
3. Does `database/fake_db.json` exist?
4. Are there any console errors? (F12 → Console)
5. Check `web-server.js` for error logs

## 📝 Next Steps

1. ✅ Start the server: `npm start`
2. ✅ Open browser: `http://localhost:3000`
3. ✅ Add some test cloths
4. ✅ Try searching and filtering
5. ✅ Build a cart and checkout
6. ✅ Explore the statistics dashboard

---

**Happy shopping & managing! 🛍️**
