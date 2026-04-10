// Pseudo-Database for Fashion Emporium
// This file acts as an in-memory database that clients can query and update

const fs = require('fs');
const path = require('path');
const fakeDB = require('./fake_db.json');
const archiveDB = require('./archive-db.js');

class PseudoDB {
  constructor() {
    this.dbFilePath = path.join(__dirname, './fake_db.json');
    this.data = fakeDB;
    this.cloths = fakeDB.cloths || [];
    this.shopInfo = fakeDB.shopInfo || {};
    this.owner = fakeDB.owner || {};
    this.staffs = fakeDB.staffs || [];
    this.transactionLog = fakeDB.transactionLog || [];
    this.staffLog = fakeDB.staffLog || [];
  }

  /**
   * Save the current data to the JSON file
   * @private
   * @returns {boolean} True if save was successful
   */
  _saveToFile() {
    try {
      const dataToSave = {
        shopInfo: this.shopInfo,
        owner: this.owner,
        cloths: this.cloths,
        staffs: this.staffs,
        transactionLog: this.transactionLog,
        staffLog: this.staffLog
      };
      fs.writeFileSync(this.dbFilePath, JSON.stringify(dataToSave, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('Error saving to database file:', error);
      return false;
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Find a single item in an array by predicate
   * @private
   */
  _findBy(array, predicate) {
    return array.find(predicate) || null;
  }

  /**
   * Find index of item in array by predicate
   * @private
   */
  _findIndexBy(array, predicate) {
    return array.findIndex(predicate);
  }

  /**
   * Filter array by predicate
   * @private
   */
  _filterBy(array, predicate) {
    return array.filter(predicate);
  }

  /**
   * Get unique values from array using extractor function
   * @private
   */
  _getUniqueValues(array, extractorFn, shouldSort = false) {
    const values = new Set();
    array.forEach(item => {
      const value = extractorFn(item);
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => values.add(v));
        } else {
          values.add(value);
        }
      }
    });
    const result = Array.from(values);
    return shouldSort ? result.sort((a, b) => a - b) : result;
  }

  /**
   * Filter array by date range
   * @private
   */
  _filterByDateRange(array, dateField, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return array.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= start && itemDate <= end;
    });
  }

  /**
   * Generate next ID for array
   * @private
   */
  _getNextId(array) {
    return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
  }

  /**
   * Add item to array with auto-generated ID and save
   * @private
   */
  _addItem(array, data, tableName) {
    try {
      const newItem = {
        ...data,
        id: this._getNextId(array)
      };
      array.push(newItem);
      if (this._saveToFile()) {
        return newItem;
      }
      array.pop();
      return null;
    } catch (error) {
      console.error(`Error adding to ${tableName}:`, error);
      return null;
    }
  }

  /**
   * Update item in array by ID and save
   * @private
   */
  _updateItemById(array, id, updates, tableName) {
    try {
      if (updates.id !== undefined && updates.id !== id) {
        console.error('Cannot update id field (primary key). ID is immutable.');
        return null;
      }

      const index = this._findIndexBy(array, item => item.id === id);
      if (index === -1) {
        console.error(`Record with id ${id} not found in ${tableName}`);
        return null;
      }

      const { id: _, ...safeUpdates } = updates;
      const updated = { ...array[index], ...safeUpdates, id };
      array[index] = updated;

      if (this._saveToFile()) {
        return updated;
      }
      array[index] = { ...array[index], ...updates };
      return null;
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      return null;
    }
  }

  /**
   * Delete item from array by ID and save
   * @private
   */
  _deleteItemById(array, id, tableName) {
    try {
      const index = this._findIndexBy(array, item => item.id === id);
      if (index === -1) {
        console.error(`Record with id ${id} not found in ${tableName}`);
        return false;
      }
      array.splice(index, 1);
      if (this._saveToFile()) {
        return true;
      }
      array.splice(index, 0, array[index]);
      return false;
    } catch (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      return false;
    }
  }

  /**
   * Get sum of numeric field filtered by predicate
   * @private
   */
  _sumByCondition(array, numericField, predicate) {
    return array
      .filter(predicate)
      .reduce((sum, item) => sum + (item[numericField] || 0), 0);
  }

  // ==================== BARCODE RESOLUTION HELPERS ====================

  /**
   * Resolve barcode to full cloth objects (without modifying database)
   * @param {Array} barcode - Array of barcode strings
   * @param {string} source - Where to get cloths from: 'shop' or 'archiveSpace'
   * @returns {Array} Array of cloth objects
   */
  resolveBarcode(barcode, source = 'shop') {
    // The source data is now external for the archive.
    const sourceArray = source === 'archiveSpace' ? archiveDB.getAllArchivedCloths() : this.cloths;
    return barcode.map(bc => sourceArray.find(cloth => cloth.barcode === bc)).filter(cloth => cloth !== undefined);
  }

  /**
   * Get transaction log with resolved cloth objects
   * @param {number} id - Transaction log ID
   * @returns {Object|null} Transaction log with cloths array
   */
  getTransactionLogWithCloths(id) {
    const log = this.getTransactionLogById(id);
    if (!log) return null;
    // SELL transactions have cloths in archiveSpace, RESTOCK in shop
    const source = log.type === 'SELL' ? 'archiveSpace' : 'shop';
    return {
      ...log,
      cloths: this.resolveBarcode(log.barcode, source)
    };
  }

  /**
   * Get all transaction logs with resolved cloth objects
   * @returns {Array} Array of transaction logs with cloths
   */
  getAllTransactionLogsWithCloths() {
    return this.transactionLog.map(log => ({
      ...log,
      cloths: this.resolveBarcode(log.barcode, log.type === 'SELL' ? 'archiveSpace' : 'shop')
    }));
  }

  /**
   * Get transaction logs by type with resolved cloth objects
   * @param {string} type - Transaction type (SELL or RESTOCK)
   * @returns {Array} Array of matching transaction logs with cloths
   */
  getTransactionLogsByTypeWithCloths(type) {
    const source = type === 'SELL' ? 'archiveSpace' : 'shop';
    return this.getTransactionLogsByType(type).map(log => ({
      ...log,
      cloths: this.resolveBarcode(log.barcode, source)
    }));
  }

  /**
   * Get receipt with resolved cloth objects from archiveSpace
   * @param {number} id - Receipt ID
   * @returns {Object|null} Receipt with cloths array
   */
  getReceiptWithCloths(id) {
    const receipt = this.getReceiptById(id);
    if (!receipt) return null;
    return {
      ...receipt,
      cloths: this.resolveBarcode(receipt.barcode, 'archiveSpace')
    };
  }

  /**
   * Get all receipts with resolved cloth objects from archiveSpace
   * @returns {Array} Array of receipts with cloths
   */
  getAllReceiptsWithCloths() {
    return this.receipts.map(receipt => ({
      ...receipt,
      cloths: this.resolveBarcode(receipt.barcode, 'archiveSpace')
    }));
  }

  /**
   * Get all cloths
   * @returns {Array} Array of all cloth items
   */
  getAllCloths() {
    return this.cloths;
  }

  /**
   * Get cloth by barcode
   * @param {string} barcode - The barcode of the cloth
   * @returns {Object|null} The cloth object or null if not found
   */
  getClothByBarcode(barcode) {
    return this._findBy(this.cloths, cloth => cloth.barcode === barcode);
  }

  /**
   * Get cloths by a list of categories (matches any)
   * @param {Array<string>} categories - The categories to filter by
   * @returns {Array} Array of cloths matching any of the specified categories
   */
  getClothsByCategories(categories) {
    if (!Array.isArray(categories) || categories.length === 0) {
      return [];
    }
    const categorySet = new Set(categories);
    return this._filterBy(this.cloths, cloth => 
      cloth.categories && cloth.categories.some(cat => categorySet.has(cat))
    );
  }

  /**
   * Search cloths by category (partial match on any category)
   * @param {string} searchTerm - The search term
   * @returns {Array} Array of cloths matching the search term in any of their categories
   */
  searchClothsByCategoryPartial(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this._filterBy(this.cloths, cloth =>
      cloth.categories && cloth.categories.some(cat => cat.toLowerCase().includes(term))
    );
  }

  /**
   * Search for categories (partial match)
   * @param {string} searchTerm - The search term
   * @returns {Array} Array of unique categories matching the search term
   */
  searchCategories(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.getAllCategories().filter(cat => cat.toLowerCase().includes(term));
  }

  /**
   * Get cloths by color
   * @param {string} color - The color to filter by
   * @returns {Array} Array of cloths with the specified color
   */
  getClothsByColor(color) {
    return this._filterBy(this.cloths, cloth => cloth.color === color);
  }

  /**
   * Get cloths by material
   * @param {string} material - The material to filter by
   * @returns {Array} Array of cloths made of the specified material
   */
  getClothsByMaterial(material) {
    return this._filterBy(this.cloths, cloth => cloth.material === material);
  }

  /**
   * Get cloths by size
   * @param {number} size - The size to filter by
   * @returns {Array} Array of cloths with the specified size
   */
  getClothsBySize(size) {
    return this._filterBy(this.cloths, cloth => cloth.size === size);
  }

  /**
   * Get cloths within a price range
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   * @returns {Array} Array of cloths within the price range
   */
  getClothsByPriceRange(minPrice, maxPrice) {
    return this._filterBy(this.cloths, cloth => 
      cloth.basePrice >= minPrice && cloth.basePrice <= maxPrice
    );
  }

  /**
   * Search cloths by design name (partial match)
   * @param {string} searchTerm - The search term
   * @returns {Array} Array of cloths matching the search term
   */
  searchClothsByName(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this._filterBy(this.cloths, cloth => 
      cloth.designName.toLowerCase().includes(term)
    );
  }

  /**
   * Search cloths by barcode (partial match)
   * @param {string} searchTerm - The search term
   * @returns {Array} Array of cloths matching the search term
   */
  searchClothsByBarcode(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this._filterBy(this.cloths, cloth => 
      cloth.barcode.toLowerCase().includes(term)
    );
  }

  /**
   * Get cloths with advanced filtering
   * @param {Object} filters - Filter criteria
   * @returns {Array} Array of cloths matching all filters
   */
  filterCloths(filters) {
    return this._filterBy(this.cloths, cloth => {
      if (filters.color && cloth.color !== filters.color) return false;
      if (filters.material && cloth.material !== filters.material) return false;
      if (filters.size && cloth.size !== filters.size) return false;
      if (filters.category && !cloth.categories.includes(filters.category)) return false;
      if (filters.minPrice && cloth.basePrice < filters.minPrice) return false;
      if (filters.maxPrice && cloth.basePrice > filters.maxPrice) return false;
      if (filters.designName && !cloth.designName.toLowerCase().includes(filters.designName.toLowerCase())) return false;
      return true;
    });
  }

  /**
   * Get shop information
   * @returns {Object} Shop information object
   */
  getShopInfo() {
    return this.shopInfo;
  }

  /**
   * Get shop phone numbers
   * @returns {Array} Array of phone numbers
   */
  getShopPhones() {
    return this.shopInfo.phone || [];
  }

  /**
   * Get shop location
   * @returns {string} Shop location
   */
  getShopLocation() {
    return this.shopInfo.location || '';
  }

  /**
   * Get owner information
   * @returns {Object} Owner information object
   */
  getOwnerInfo() {
    return this.owner;
  }

  /**
   * Get owner name
   * @returns {string} Owner name
   */
  getOwnerName() {
    return this.owner.name || '';
  }

  // ==================== STAFF QUERIES ====================

  /**
   * Get all staff members
   * @returns {Array} Array of all staff members
   */
  getAllStaffs() {
    return this.staffs;
  }

  /**
   * Get staff member by ID
   * @param {number} id - The staff ID
   * @returns {Object|null} The staff object or null if not found
   */
  getStaffById(id) {
    return this._findBy(this.staffs, staff => staff.id === id);
  }

  /**
   * Search staff by name (partial match, case-insensitive)
   * @param {string} searchTerm - The name to search for
   * @returns {Array} Array of matching staff members
   */
  searchStaffByName(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this._filterBy(this.staffs, staff => 
      staff.name && staff.name.toLowerCase().includes(term)
    );
  }

  /**
   * Get staff by gender
   * @param {string} gender - The gender to filter by
   * @returns {Array} Array of staff members with specified gender
   */
  getStaffByGender(gender) {
    return this._filterBy(this.staffs, staff => staff.gender === gender);
  }

  /**
   * Get all unique staff genders
   * @returns {Array} Array of unique genders
   */
  getAllStaffGenders() {
    return this._getUniqueValues(this.staffs, staff => staff.gender);
  }

  /**
   * Get total number of staff members
   * @returns {number} Total count of staff
   */
  getStaffCount() {
    return this.staffs.length;
  }

  // ==================== TRANSACTION LOG QUERIES ====================

  /**
   * Get all transaction logs
   * @returns {Array} Array of all transaction logs
   */
  getAllTransactionLogs() {
    return this.transactionLog;
  }

  /**
   * Get transaction log by ID
   * @param {number} id - The transaction log ID
   * @returns {Object|null} The transaction log or null if not found
   */
  getTransactionLogById(id) {
    return this._findBy(this.transactionLog, log => log.id === id);
  }

  /**
   * Get transaction logs by type
   * @param {string} type - The transaction type (e.g., "SELL", "RESTOCK")
   * @returns {Array} Array of matching transaction logs
   */
  getTransactionLogsByType(type) {
    return this._filterBy(this.transactionLog, log => log.type === type);
  }

  /**
   * Get transaction logs by date
   * @param {string} date - The date to filter by (format: YYYY-MM-DD)
   * @returns {Array} Array of transaction logs on that date
   */
  getTransactionLogsByDate(date) {
    return this._filterBy(this.transactionLog, log => log.date === date);
  }

  /**
   * Get transaction logs within date range
   * @param {string} startDate - Start date (format: YYYY-MM-DD)
   * @param {string} endDate - End date (format: YYYY-MM-DD)
   * @returns {Array} Array of transaction logs in the date range
   */
  getTransactionLogsByDateRange(startDate, endDate) {
    return this._filterByDateRange(this.transactionLog, 'date', startDate, endDate);
  }

  /**
   * Get transaction logs by receipt ID
   * @param {number} receiptID - The receipt ID
   * @returns {Array} Array of transaction logs with that receipt ID
   */
  getTransactionLogsByReceiptId(receiptID) {
    return this._filterBy(this.transactionLog, log => log.receiptID === receiptID);
  }

  /**
   * Get total sales (sum of all SELL transactions)
   * @returns {number} Total sales amount
   */
  getTotalSales() {
    return this._sumByCondition(this.transactionLog, 'totalPrice', log => log.type === 'SELL');
  }

  /**
   * Get total restocks (sum of all RESTOCK transactions)
   * @returns {number} Total restock amount
   */
  getTotalRestocks() {
    return this._sumByCondition(this.transactionLog, 'totalPrice', log => log.type === 'RESTOCK');
  }

  /**
   * Get transaction count by type
   * @param {string} type - The transaction type
   * @returns {number} Count of transactions of that type
   */
  getTransactionCountByType(type) {
    return this._filterBy(this.transactionLog, log => log.type === type).length;
  }

  /**
   * Get all available transaction types
   * @returns {Array} Array of unique transaction types
   */
  getAllTransactionTypes() {
    return this._getUniqueValues(this.transactionLog, log => log.type);
  }

  /**
   * Get total transaction logs count
   * @returns {number} Total count of all transactions
   */
  getTransactionLogCount() {
    return this.transactionLog.length;
  }

  // ==================== STAFF LOG QUERIES ====================

  /**
   * Get all staff logs
   * @returns {Array} Array of all staff logs
   */
  getAllStaffLogs() {
    return this.staffLog;
  }

  /**
   * Get staff log by ID
   * @param {number} id - The staff log ID
   * @returns {Object|null} The staff log or null if not found
   */
  getStaffLogById(id) {
    return this._findBy(this.staffLog, log => log.id === id);
  }

  /**
   * Get staff logs by staff ID
   * @param {number} staffID - The staff member's ID
   * @returns {Array} Array of logs for that staff member
   */
  getStaffLogsByStaffId(staffID) {
    return this._filterBy(this.staffLog, log => log.staffID === staffID);
  }

  /**
   * Get staff logs by type
   * @param {string} type - The log type (e.g., "START", "END")
   * @returns {Array} Array of logs of that type
   */
  getStaffLogsByType(type) {
    return this._filterBy(this.staffLog, log => log.type === type);
  }

  /**
   * Get staff logs by date
   * @param {string} date - The date to filter by (format: YYYY-MM-DD)
   * @returns {Array} Array of staff logs on that date
   */
  getStaffLogsByDate(date) {
    return this._filterBy(this.staffLog, log => log.date === date);
  }

  /**
   * Get staff logs within date range
   * @param {string} startDate - Start date (format: YYYY-MM-DD)
   * @param {string} endDate - End date (format: YYYY-MM-DD)
   * @returns {Array} Array of staff logs in the date range
   */
  getStaffLogsByDateRange(startDate, endDate) {
    return this._filterByDateRange(this.staffLog, 'date', startDate, endDate);
  }

  /**
   * Get staff shift records by staff ID and date
   * @param {number} staffID - The staff member's ID
   * @param {string} date - The date to filter by
   * @returns {Array} Array of shift logs for that staff on that date
   */
  getStaffShiftsByDate(staffID, date) {
    return this._filterBy(this.staffLog, log => log.staffID === staffID && log.date === date);
  }

  /**
   * Get all available staff log types
   * @returns {Array} Array of unique log types
   */
  getAllStaffLogTypes() {
    return this._getUniqueValues(this.staffLog, log => log.type);
  }

  /**
   * Get total staff logs count
   * @returns {number} Total count of all staff logs
   */
  getStaffLogCount() {
    return this.staffLog.length;
  }

  /**
   * Get all available categories
   * @returns {Array} Array of unique categories
   */
  getAllCategories() {
    return this._getUniqueValues(this.cloths, cloth => cloth.categories);
  }

  /**
   * Get all available colors
   * @returns {Array} Array of unique colors
   */
  getAllColors() {
    return this._getUniqueValues(this.cloths, cloth => cloth.color);
  }

  /**
   * Get all available materials
   * @returns {Array} Array of unique materials
   */
  getAllMaterials() {
    return this._getUniqueValues(this.cloths, cloth => cloth.material);
  }

  /**
   * Get all available sizes
   * @returns {Array} Array of unique sizes (sorted)
   */
  getAllSizes() {
    return this._getUniqueValues(this.cloths, cloth => cloth.size, true);
  }

  /**
   * Get total number of cloths
   * @returns {number} Total count of cloths
   */
  getClothCount() {
    return this.cloths.length;
  }

  /**
   * Get total inventory value
   * @returns {number} Sum of all cloth prices
   */
  getTotalInventoryValue() {
    return this._sumByCondition(this.cloths, 'basePrice', () => true);
  }

  /**
   * Get average cloth price
   * @returns {number} Average price of all cloths
   */
  getAveragePrice() {
    if (this.cloths.length === 0) return 0;
    return this.getTotalInventoryValue() / this.cloths.length;
  }

  // ==================== WRITE OPERATIONS ====================

  /**
   * Add a new cloth to the database
   * @param {Object} clothData - The cloth data object
   * @param {string} clothData.designName - Name of the cloth design
   * @param {string} clothData.barcode - Unique barcode identifier
   * @param {string} clothData.color - Color of the cloth
   * @param {number} clothData.size - Size
   * @param {string} clothData.material - Material composition
   * @param {Array} clothData.categories - Array of categories
   * @param {number} clothData.basePrice - Price in dollars
   * @returns {Object|null} The added cloth object or null if failed
   */
  addCloth(clothData) {
    try {
      // Validate required fields
      if (!clothData.designName || !clothData.barcode || !clothData.basePrice) {
        console.error('Missing required fields: designName, barcode, and basePrice are required');
        return null;
      }

      // Check if barcode already exists
      if (this.getClothByBarcode(clothData.barcode)) {
        console.error(`Cloth with barcode ${clothData.barcode} already exists`);
        return null;
      }

      // Create the cloth object
      const newCloth = {
        designName: clothData.designName,
        barcode: clothData.barcode,
        color: clothData.color || '',
        size: clothData.size || 0,
        material: clothData.material || '',
        categories: clothData.categories || [],
        basePrice: clothData.basePrice
      };

      // Add to array
      this.cloths.push(newCloth);

      // Save to file
      if (this._saveToFile()) {
        return newCloth;
      }

      // If save failed, remove from array and return null
      this.cloths.pop();
      return null;
    } catch (error) {
      console.error('Error adding cloth:', error);
      return null;
    }
  }

  /**
   * Update an existing cloth by barcode
   * @param {string} barcode - The barcode of the cloth to update
   * @param {Object} updates - The fields to update
   * @returns {Object|null} The updated cloth object or null if not found or failed
   */
  updateCloth(barcode, updates) {
    try {
      if (updates.barcode !== undefined && updates.barcode !== barcode) {
        console.error('Cannot update barcode field (primary key). Barcode is immutable.');
        return null;
      }

      const clothIndex = this._findIndexBy(this.cloths, cloth => cloth.barcode === barcode);

      if (clothIndex === -1) {
        console.error(`Cloth with barcode ${barcode} not found`);
        return null;
      }

      const { barcode: _, ...safeUpdates } = updates;
      const updatedCloth = {
        ...this.cloths[clothIndex],
        ...safeUpdates,
        barcode: barcode
      };

      this.cloths[clothIndex] = updatedCloth;

      if (this._saveToFile()) {
        return updatedCloth;
      }

      this.cloths[clothIndex] = { ...this.cloths[clothIndex], ...updates };
      return null;
    } catch (error) {
      console.error('Error updating cloth:', error);
      return null;
    }
  }

  /**
   * Delete a cloth by barcode
   * @param {string} barcode - The barcode of the cloth to delete
   * @returns {boolean} True if deleted successfully, false otherwise
   */
  deleteCloth(barcode) {
    try {
      const clothIndex = this._findIndexBy(this.cloths, cloth => cloth.barcode === barcode);

      if (clothIndex === -1) {
        console.error(`Cloth with barcode ${barcode} not found`);
        return false;
      }

      this.cloths.splice(clothIndex, 1);

      if (this._saveToFile()) {
        return true;
      }

      this.cloths.splice(clothIndex, 0, this.cloths[clothIndex]);
      return false;
    } catch (error) {
      console.error('Error deleting cloth:', error);
      return false;
    }
  }

  /**
   * Add a new staff member
   * @param {Object} staffData - The staff data object
   * @param {string} staffData.name - Staff member's name
   * @param {string} staffData.gender - Staff member's gender
   * @param {string} staffData.citizenID - Citizen ID
   * @param {string} staffData.dayOfBirth - Date of birth
   * @returns {Object|null} The added staff object or null if failed
   */
  addStaff(staffData) {
    if (!staffData.name) {
      console.error('Missing required field: name is required');
      return null;
    }
    const result = this._addItem(this.staffs, staffData, 'staffs');
    this._saveToFile();
    return result;
  }

  /**
   * Update a staff member by ID
   * @param {number} id - The staff ID to update
   * @param {Object} updates - The fields to update
   * @returns {Object|null} The updated staff object or null if not found or failed
   */
  updateStaff(id, updates) {
    return this._updateItemById(this.staffs, id, updates, 'staffs');
  }

  /**
   * Delete a staff member by ID
   * @param {number} id - The staff ID to delete
   * @returns {boolean} True if deleted successfully, false otherwise
   */
  deleteStaff(id) {
    return this._deleteItemById(this.staffs, id, 'staffs');
  }

  /**
   * Add a new transaction log
   * @param {Object} logData - The transaction log data
   * @param {string} logData.type - Transaction type (SELL or RESTOCK)
   * @param {Array} logData.cloths - Array of Cloth objects
   * @param {number} logData.totalPrice - Total price
   * @param {number} logData.receiptID - Receipt ID
   * @param {string} logData.date - Transaction date (optional, defaults to today)
   * @param {string} logData.time - Transaction time (optional, defaults to current time)
   * @returns {Object|null} The added transaction log or null if failed
   */
  addTransactionLog(logData) {
    if (!logData.type || !logData.cloths || logData.totalPrice === undefined) {
      console.error('Missing required fields: type, cloths, and totalPrice are required');
      return null;
    }
    // Convert cloths to barcode for storage
    const log = {
      type: logData.type,
      barcode: logData.cloths.map(cloth => cloth.barcode || cloth),
      totalPrice: logData.totalPrice,
      receiptID: logData.receiptID,
      staffID: logData.staffID,
      date: logData.date || new Date().toISOString().split('T')[0],
      time: logData.time || new Date().toTimeString().split(' ')[0]
    };
    const result = this._addItem(this.transactionLog, log, 'transactionLog');
    this._saveToFile();
    return result;
  }

  /**
   * Update a transaction log by ID
   * @param {number} id - The transaction log ID to update
   * @param {Object} updates - The fields to update
   * @returns {Object|null} The updated transaction log or null if not found or failed
   */
  updateTransactionLog(id, updates) {
    return this._updateItemById(this.transactionLog, id, updates, 'transactionLog');
  }

  /**
   * Delete a transaction log by ID
   * @param {number} id - The transaction log ID to delete
   * @returns {boolean} True if deleted successfully, false otherwise
   */
  deleteTransactionLog(id) {
    return this._deleteItemById(this.transactionLog, id, 'transactionLog');
  }

  /**
   * Add a new staff log
   * @param {Object} logData - The staff log data
   * @param {number} logData.staffID - Staff member's ID
   * @param {string} logData.type - Log type (START or END)
   * @param {string} logData.note - Optional note
   * @param {string} logData.date - Log date (optional, defaults to today)
   * @param {string} logData.time - Log time (optional, defaults to current time)
   * @returns {Object|null} The added staff log or null if failed
   */
  addStaffLog(logData) {
    if (logData.staffID === undefined || !logData.type) {
      console.error('Missing required fields: staffID and type are required');
      return null;
    }
    const log = {
      ...logData,
      date: logData.date || new Date().toISOString().split('T')[0],
      time: logData.time || new Date().toTimeString().split(' ')[0]
    };
    const result = this._addItem(this.staffLog, log, 'staffLog');
    this._saveToFile();
    return result;
  }

  /**
   * Update a staff log by ID
   * @param {number} id - The staff log ID to update
   * @param {Object} updates - The fields to update
   * @returns {Object|null} The updated staff log or null if not found or failed
   */
  updateStaffLog(id, updates) {
    return this._updateItemById(this.staffLog, id, updates, 'staffLog');
  }

  /**
   * Delete a staff log by ID
   * @param {number} id - The staff log ID to delete
   * @returns {boolean} True if deleted successfully, false otherwise
   */
  deleteStaffLog(id) {
    return this._deleteItemById(this.staffLog, id, 'staffLog');
  }

  /**
   * Update shop information
   * @param {Object} updates - The shop fields to update
   * @returns {Object|null} The updated shop info or null if failed
   */
  updateShopInfo(updates) {
    try {
      this.shopInfo = {
        ...this.shopInfo,
        ...updates
      };

      // Save to file
      if (this._saveToFile()) {
        return this.shopInfo;
      }

      return null;
    } catch (error) {
      console.error('Error updating shop info:', error);
      return null;
    }
  }

  /**
   * Update shop phone numbers
   * @param {Array} phones - Array of phone numbers
   * @returns {Array|null} The updated phone array or null if failed
   */
  updateShopPhones(phones) {
    try {
      if (!Array.isArray(phones)) {
        console.error('Phones must be an array');
        return null;
      }

      this.shopInfo.phone = phones;

      // Save to file
      if (this._saveToFile()) {
        return this.shopInfo.phone;
      }

      return null;
    } catch (error) {
      console.error('Error updating shop phones:', error);
      return null;
    }
  }

  /**
   * Update owner information
   * @param {Object} updates - The owner fields to update
   * @returns {Object|null} The updated owner info or null if failed
   */
  updateOwnerInfo(updates) {
    try {
      this.owner = {
        ...this.owner,
        ...updates
      };

      // Save to file
      if (this._saveToFile()) {
        return this.owner;
      }

      return null;
    } catch (error) {
      console.error('Error updating owner info:', error);
      return null;
    }
  }

  /**
   * Bulk add multiple cloths
   * @param {Array} clothsArray - Array of cloth objects to add
   * @returns {Object} Object with counts of successful and failed additions
   */
  bulkAddCloths(clothsArray) {
    const result = {
      successful: 0,
      failed: 0,
      errors: []
    };

    if (!Array.isArray(clothsArray)) {
      console.error('Input must be an array');
      return result;
    }

    for (const clothData of clothsArray) {
      const added = this.addCloth(clothData);
      if (added) {
        result.successful++;
      } else {
        result.failed++;
        result.errors.push(`Failed to add: ${clothData.designName || clothData.barcode}`);
      }
    }

    return result;
  }

  /**
   * Clear all cloths (be careful with this!)
   * @returns {boolean} True if successful, false otherwise
   */
  clearAllCloths() {
    try {
      this.cloths = [];

      // Save to file
      return this._saveToFile();
    } catch (error) {
      console.error('Error clearing cloths:', error);
      return false;
    }
  }

  /**
   * Reload data from file (useful if file was modified externally)
   * @returns {boolean} True if successful, false otherwise
   */
  reloadFromFile() {
    try {
      delete require.cache[require.resolve('./fake_db.json')];
      const reloadedDB = require('./fake_db.json');
      
      this.data = reloadedDB;
      this.cloths = reloadedDB.cloths || [];
      this.shopInfo = reloadedDB.shopInfo || {};
      this.owner = reloadedDB.owner || {};
      this.staffs = reloadedDB.staffs || [];
      this.transactionLog = reloadedDB.transactionLog || [];
      this.staffLog = reloadedDB.staffLog || [];
      
      return true;
    } catch (error) {
      console.error('Error reloading from file:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
const database = new PseudoDB();

module.exports = database;
