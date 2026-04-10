const express = require('express');
const path = require('path');
const db = require('./database/pseudo-db.js');
const archiveDB = require('./database/archive-db.js');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==================== CLOTH ENDPOINTS ====================

/**
 * GET /api/cloths - Get all cloths
 */
app.get('/api/cloths', (req, res) => {
    try {
        const cloths = db.getAllCloths();
        res.json({
            success: true,
            data: cloths,
            count: cloths.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/cloths/search?field=color&value=Blue - Search cloths
 * IMPORTANT: This MUST come BEFORE the /:barcode route to match correctly
 */
app.get('/api/cloths/search', (req, res) => {
    try {
        const { field, value } = req.query;
        let results = [];

        if (field === 'category') {
            // Now category search is a partial match on a single value
            results = db.searchClothsByCategoryPartial(value);
        } else if (field === 'color') {
            results = db.getClothsByColor(value);
        } else if (field === 'material') {
            results = db.getClothsByMaterial(value);
        } else if (field === 'size') {
            // Size is a string (M, L, S, etc.), not an integer - don't parse it
            results = db.getClothsBySize(value);
        } else if (field === 'name') {
            results = db.searchClothsByName(value);
        } else if (field === 'barcode') {
            results = db.searchClothsByBarcode(value);
        } else {
            return res.status(400).json({ success: false, error: 'Invalid search field' });
        }

        res.json({ success: true, data: results, count: results.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/cloths/:barcode - Get cloth by barcode
 * IMPORTANT: This comes AFTER /search to avoid matching "search" as a barcode
 */
app.get('/api/cloths/:barcode', (req, res) => {
    try {
        const cloth = db.getClothByBarcode(req.params.barcode);
        if (cloth) {
            res.json({ success: true, data: cloth });
        } else {
            res.status(404).json({ success: false, error: 'Cloth not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/cloths - Add new cloth
 */
app.post('/api/cloths', (req, res) => {
    try {
        const clothData = req.body;
        const newCloth = db.addCloth(clothData);
        
        if (newCloth) {
            res.json({ success: true, message: 'Cloth added successfully', data: newCloth });
        } else {
            res.status(400).json({ success: false, error: 'Failed to add cloth' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PUT /api/cloths/:barcode - Update cloth
 */
app.put('/api/cloths/:barcode', (req, res) => {
    try {
        const updated = db.updateCloth(req.params.barcode, req.body);
        
        if (updated) {
            res.json({ success: true, message: 'Cloth updated successfully', data: updated });
        } else {
            res.status(400).json({ success: false, error: 'Failed to update cloth' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/cloths/:barcode - Archive cloth
 * This moves the cloth from active inventory to the archive, fulfilling the "ArchiveSpace" concept.
 */
app.delete('/api/cloths/:barcode', (req, res) => {
    try {
        const barcode = req.params.barcode;
        const clothToArchive = db.getClothByBarcode(barcode);

        if (!clothToArchive) {
            return res.status(404).json({ success: false, error: 'Cloth not found in active inventory.' });
        }

        // 1. Add the cloth to our persistent archive.
        archiveDB.addArchivedCloth(clothToArchive);

        // 2. Remove the cloth from the active inventory.
        const success = db.deleteCloth(barcode);

        if (success) {
            res.json({ success: true, message: 'Cloth archived successfully' });
        } else {
            res.status(500).json({ success: false, error: 'Failed to remove cloth from active inventory after archiving.' });
        }
    } catch (error) {
        console.error('Error during cloth archiving:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
/**
 * GET /api/shop-stats - Get shop statistics
 */
app.get('/api/shop-stats', (req, res) => {
    try {
        const stats = {
            totalCloths: db.getClothCount(),
            totalStaff: db.getStaffCount(),
            totalInventoryValue: db.getTotalInventoryValue(),
            averagePrice: db.getAveragePrice(),
            totalTransactions: db.getTransactionLogCount(),
            totalSales: db.getTotalSales(),
            totalRestocks: db.getTotalRestocks(),
            categories: db.getAllCategories(),
            colors: db.getAllColors(),
            materials: db.getAllMaterials(),
            sizes: db.getAllSizes()
        };
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/shop-info - Get shop info
 */
app.get('/api/shop-info', (req, res) => {
    try {
        const info = {
            shopInfo: db.getShopInfo(),
            ownerInfo: db.getOwnerInfo()
        };
        res.json({ success: true, data: info });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/checkout - Process a purchase
 * This endpoint simulates the high-level logic defined in main-manager.ts's purchaseCart method.
 */
app.post('/api/checkout', (req, res) => {
    try {
        const { cartItems, totalPayment, discount, staffID } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ success: false, error: 'Cart is empty.' });
        }
        if (totalPayment === undefined || totalPayment <= 0) {
            return res.status(400).json({ success: false, error: 'Invalid total payment amount.' });
        }
        // staffID is optional, default to 1 if not provided or invalid
        const actualStaffID = staffID && !isNaN(parseInt(staffID)) ? parseInt(staffID) : 1;

        // Generate a simple receipt ID. In a real system, this would be more robust
        // (e.g., managed by the database to ensure uniqueness and sequentiality).
        const receiptID = Date.now(); 

        // Prepare transaction log entry
        const transactionLogEntry = {
            type: 'SELL',
            // pseudo-db.js addTransactionLog expects cloth objects or barcodes,
            // and will convert cloth objects to barcodes for storage.
            cloths: cartItems, 
            totalPrice: totalPayment,
            receiptID: receiptID,
            staffID: actualStaffID,
            date: new Date().toISOString().split('T')[0], // Current date YYYY-MM-DD
            time: new Date().toTimeString().split(' ')[0] // Current time HH:MM:SS
        };

        // Add transaction log first for auditing purposes
        const newLog = db.addTransactionLog(transactionLogEntry);
        if (!newLog) {
            return res.status(500).json({ success: false, error: 'Failed to record transaction.' });
        }

        // Create and archive a receipt object
        const itemBarcodes = cartItems.map(item => item.barcode);
        const receipt = {
            receiptID: receiptID,
            cloths: itemBarcodes, // Store barcodes
            totalPayment: totalPayment,
            discount: discount,
            staffID: actualStaffID
        };
        archiveDB.addArchivedReceipt(receipt);

        // Archive and then remove sold cloths from active inventory
        let failedDeletions = [];
        for (const item of cartItems) {
            const clothToArchive = db.getClothByBarcode(item.barcode);

            if (clothToArchive) {
                // 1. Add the cloth to our persistent archive.
                archiveDB.addArchivedCloth(clothToArchive);

                // 2. Remove the cloth from the active inventory.
                const success = db.deleteCloth(item.barcode);
                if (!success) {
                    failedDeletions.push(item.barcode);
                }
            } else {
                console.warn(`Could not find cloth with barcode ${item.barcode} in DB to archive during checkout.`);
                failedDeletions.push(item.barcode);
            }
        }

        res.json({
            success: true,
            message: 'Purchase completed successfully!',
            receiptID: receiptID,
            transactionLog: newLog,
            failedDeletions: failedDeletions // Report any items that couldn't be deleted
        });

    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/archive/cloths - Get all archived cloths
 */
app.get('/api/archive/cloths', (req, res) => {
    try {
        const archivedCloths = archiveDB.getAllArchivedCloths();
        res.json({
            success: true,
            data: archivedCloths,
            count: archivedCloths.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/archive/receipts - Get all archived receipts
 */
app.get('/api/archive/receipts', (req, res) => {
    try {
        const archivedReceipts = archiveDB.getAllArchivedReceipts();
        res.json({
            success: true,
            data: archivedReceipts,
            count: archivedReceipts.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/transactions - Get all transaction logs with resolved cloth objects
 */
app.get('/api/transactions', (req, res) => {
    try {
        const logs = db.getAllTransactionLogs();
        const activeCloths = db.getAllCloths();
        const archivedCloths = archiveDB.getAllArchivedCloths();

        // Create a lookup map for all cloths, active and archived, for quick resolution
        const allClothsMap = new Map();
        activeCloths.forEach(c => allClothsMap.set(c.barcode, c));
        archivedCloths.forEach(c => allClothsMap.set(c.barcode, c));

        const resolvedLogs = logs.map(log => {
            const resolvedCloths = log.barcode
                .map(bc => allClothsMap.get(bc))
                .filter(Boolean); // Filter out any undefined if a cloth is not found
            return { ...log, cloths: resolvedCloths };
        });

        // Return latest transactions first
        res.json({ success: true, data: resolvedLogs.reverse() });
    } catch (error) {
        console.error('Error fetching transaction logs:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/categories/recommendations - Get category recommendations based on search term
 */
app.get('/api/categories/recommendations', (req, res) => {
    try {
        const { term } = req.query;
        if (!term) {
            return res.json({ success: true, data: [] });
        }
        const recommendations = db.searchCategories(term);
        res.json({ success: true, data: recommendations });
    } catch (error) {
        console.error('Error fetching category recommendations:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🛍️  Fashion Emporium Web UI Server running at http://localhost:${PORT}`);
    console.log(`📊 Database location: ${path.join(__dirname, 'database', 'fake_db.json')}\n`);
});
