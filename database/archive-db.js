const fs = require('fs');
const path = require('path');

const ARCHIVE_PATH = path.join(__dirname, 'archive.json');

let archiveData = {
    cloths: [],
    receipts: []
};

// Load or create archive file
function loadArchive() {
    try {
        if (fs.existsSync(ARCHIVE_PATH)) {
            const fileContent = fs.readFileSync(ARCHIVE_PATH, 'utf-8');
            archiveData = JSON.parse(fileContent);
        } else {
            saveArchive(); // Create the file with default structure
        }
    } catch (error) {
        console.error('Error loading or parsing archive.json:', error);
    }
}

function saveArchive() {
    fs.writeFileSync(ARCHIVE_PATH, JSON.stringify(archiveData, null, 2), 'utf-8');
}

loadArchive();

const archiveDB = {
    addArchivedCloth(cloth) {
        if (!cloth || !cloth.barcode) return null;
        // Avoid duplicates in archive
        if (archiveData.cloths.some(c => c.barcode === cloth.barcode)) return cloth;

        const archivedCloth = { ...cloth, archivedAt: new Date().toISOString() };
        archiveData.cloths.unshift(archivedCloth); // Add to the beginning
        saveArchive();
        return archivedCloth;
    },

    getAllArchivedCloths() {
        return archiveData.cloths;
    },

    addArchivedReceipt(receipt) {
        if (!receipt || !receipt.receiptID) return null;
        // Avoid duplicates in archive
        if (archiveData.receipts.some(r => r.receiptID === receipt.receiptID)) return receipt;

        const archivedReceipt = { ...receipt, archivedAt: new Date().toISOString() };
        archiveData.receipts.unshift(archivedReceipt); // Add to the beginning
        saveArchive();
        return archivedReceipt;
    },

    getAllArchivedReceipts() {
        return archiveData.receipts;
    }
};

module.exports = archiveDB;