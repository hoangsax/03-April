// Fashion Emporium Web UI - JavaScript Client

let cart = [];
let allCloths = [];
let shopStats = {}; // To store stats for dropdowns
let allArchivedCloths = []; // For modal
let allArchivedReceipts = []; // For modal

// ==================== Initialize ====================

document.addEventListener('DOMContentLoaded', function() {
    loadAllCloths();
    refreshShopInfo();
    loadStats();
    // Load archived items if a container for them exists in the HTML
    if (document.getElementById('archiveTableBody')) {
        loadArchivedCloths();
    }
    if (document.getElementById('receiptsTableBody')) {
        loadArchivedReceipts();
    }
    if (document.getElementById('transactionLogTable')) {
        loadTransactions();
    }
    
    // Event listeners
    document.getElementById('addClothForm').addEventListener('submit', handleAddCloth);
    document.getElementById('searchField').addEventListener('change', updateSearchInput);
    
    // Auto-generate barcode on first load
    generateBarcode();
});

// ==================== Utility Functions ====================

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(endpoint, options);
        const result = await response.json();

        if (!response.ok && !result.success) {
            showAlert(`Error: ${result.error || 'Unknown error'}`, 'danger');
            return null;
        }

        return result;
    } catch (error) {
        showAlert(`Network error: ${error.message}`, 'danger');
        return null;
    }
}

function showAlert(message, type = 'info') {
    const alertId = 'alert-' + Date.now();
    const alertHTML = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" style="animation: slideIn 0.3s ease-out;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    const container = document.getElementById('alertContainer');
    container.insertAdjacentHTML('beforeend', alertHTML);

    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

function formatPrice(price) {
    return parseFloat(price).toFixed(2);
}

// ==================== Barcode Generation ====================

/**
 * Generate a unique barcode in format: CLOTH-YYYYMMDD-XXXXX
 * Ensures uniqueness by checking existing barcodes
 */
function generateBarcode() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = `${year}${month}${day}`;
    
    // Generate random alphanumeric suffix
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomSuffix = '';
    for (let i = 0; i < 5; i++) {
        randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const barcode = `CLOTH-${timestamp}-${randomSuffix}`;
    
    // Check if barcode already exists
    const exists = allCloths.some(cloth => cloth.barcode === barcode);
    if (exists) {
        // Recursively generate a new one if collision
        return generateBarcode();
    }
    
    // Set the barcode field
    document.getElementById('barcode').value = barcode;
    showAlert(`Barcode generated: ${barcode}`, 'info');
}

/**
 * Auto-generate barcode when form loads
 */
function autoGenerateBarcode() {
    const designName = document.getElementById('designName').value.trim();
    if (!designName) {
        showAlert('Please enter design name first', 'warning');
        return;
    }
    generateBarcode();
}

// ==================== Cloth Management ====================

async function loadAllCloths() {
    const response = await apiCall('/api/cloths');
    
    if (response && response.success) {
        allCloths = response.data || [];
        renderClothsTable(allCloths);
        updateClothCount();
    }
}

function renderClothsTable(cloths) {
    const tbody = document.getElementById('clothsTableBody');
    
    if (!cloths || cloths.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No cloths found</td></tr>';
        return;
    }

    tbody.innerHTML = cloths.map((cloth, index) => `
        <tr id="cloth-row-${cloth.barcode}" class="${
            cart.some(item => item.barcode === cloth.barcode) ? 'table-warning' : ''
        }">
            
            <td><strong>${cloth.designName}</strong></td>
            <td><code>${cloth.barcode}</code></td>
            <td><span class="badge bg-light text-dark">${cloth.color || '-'}</span></td>
            <td>${cloth.size || '-'}</td>
            <td>${cloth.material || '-'}</td>
            <td class="price-display">$${formatPrice(cloth.basePrice)}</td>
            <td>
                ${cloth.categories && cloth.categories.length > 0 
                    ? cloth.categories.map(cat => `<span class="badge bg-secondary">${cat}</span>`).join(' ')
                    : '-'
                }
            </td>
            <td>
                <button class="btn btn-sm btn-info" onclick="addClothToCart('${cloth.barcode}')">
                    <i class="fas fa-cart-plus"></i> Add
                </button>
                <button class="btn btn-sm btn-danger" onclick="removeCloth('${cloth.barcode}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function handleAddCloth(e) {
    e.preventDefault();

    // Validate barcode is not empty
    const barcode = document.getElementById('barcode').value.trim();
    if (!barcode) {
        showAlert('Please generate a barcode first', 'warning');
        generateBarcode();
        return;
    }

    const clothData = {
        designName: document.getElementById('designName').value,
        barcode: barcode,
        basePrice: parseFloat(document.getElementById('basePrice').value),
        size: document.getElementById('size').value || undefined,
        color: document.getElementById('color').value || undefined,
        material: document.getElementById('material').value || undefined,
        categories: document.getElementById('categories').value ? 
            document.getElementById('categories').value.split(',').map(c => c.trim()) : []
    };

    const response = await apiCall('/api/cloths', 'POST', clothData);

    if (response && response.success) {
        showAlert('Cloth added successfully! Barcode: ' + barcode, 'success');
        document.getElementById('addClothForm').reset();
        loadAllCloths();
        generateBarcode(); // Generate new barcode for next item
    }
}

async function removeCloth(barcode) {
    if (confirm('Are you sure you want to archive this cloth? This will move it from active inventory to the archive.')) {
        const response = await apiCall(`/api/cloths/${barcode}`, 'DELETE');

        if (response && response.success) {
            showAlert(response.message || 'Cloth archived successfully!', 'success');
            loadAllCloths();
            if (document.getElementById('archiveTableBody')) {
                loadArchivedCloths(); // Refresh archive view if it exists
            }
        }
    }
}

async function searchCloths() {
    const searchField = document.getElementById('searchField').value;
    const searchValue = document.getElementById('searchValue').value;

    if (!searchField || !searchValue) {
        loadAllCloths();
        return;
    }

    const response = await apiCall(`/api/cloths/search?field=${searchField}&value=${encodeURIComponent(searchValue)}`);

    if (response && response.success) {
        renderClothsTable(response.data);
        document.getElementById('clothCountBadge').textContent = `${response.data.length} items`;
    }
}

function updateSearchInput() {
    const searchField = document.getElementById('searchField').value;
    const container = document.getElementById('searchValueContainer');
    
    const fieldsWithDropdown = ['category', 'color', 'material', 'size'];

    if (fieldsWithDropdown.includes(searchField)) {
        // It's a field that needs a dropdown.
        let options = [];
        const fieldName = searchField.charAt(0).toUpperCase() + searchField.slice(1);
        switch(searchField) {
            case 'category': options = shopStats.categories || []; break;
            case 'color': options = shopStats.colors || []; break;
            case 'material': options = shopStats.materials || []; break;
            case 'size': options = shopStats.sizes || []; break;
        }

        if (searchField === 'category') { // Category is now a typeable input with recommendations
            const inputHTML = `
                <input type="text" class="form-control" id="searchValue" placeholder="Type category..." list="categoryRecommendations">
                <datalist id="categoryRecommendations"></datalist>
            `;
            container.innerHTML = inputHTML;
            // Add event listener for input to fetch recommendations
            document.getElementById('searchValue').addEventListener('input', (e) => fetchCategoryRecommendations(e.target.value));
        } else {
            // Single-select for other fields
            const selectHTML = `
                <select id="searchValue" class="form-select">
                    <option value="">-- Select ${fieldName} --</option>
                    ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>
            `;
            container.innerHTML = selectHTML;
        }
    } else {
        // It's a text input field.
        const placeholder = searchField ? `Enter ${searchField}...` : 'Select a field to search';
        container.innerHTML = `<input type="text" class="form-control" id="searchValue" placeholder="${placeholder}">`;
    }
}

async function fetchCategoryRecommendations(searchTerm) {
    const datalist = document.getElementById('categoryRecommendations');
    if (!datalist) return;

    if (searchTerm.length < 2) { // Only fetch if at least 2 characters typed
        datalist.innerHTML = '';
        return;
    }

    const response = await apiCall(`/api/categories/recommendations?term=${encodeURIComponent(searchTerm)}`);
    if (response && response.success) {
        datalist.innerHTML = response.data.map(cat => `<option value="${cat}"></option>`).join('');
    } else {
        datalist.innerHTML = '';
    }
}

function updateClothCount() {
    document.getElementById('clothCountBadge').textContent = `${allCloths.length} items`;
}

// ==================== Cart Management ====================

/**
 * Add a cloth to cart by barcode (safer than passing entire object)
 * @param {string} barcode - The barcode of the cloth to add
 */
function addClothToCart(barcode) {
    const cloth = allCloths.find(c => c.barcode === barcode);
    if (!cloth) {
        showAlert('Cloth not found!', 'danger');
        return;
    }
    // Check for duplicates before adding to cart
    if (cart.some(item => item.barcode === cloth.barcode)) {
        showAlert(`${cloth.designName} (Barcode: ${cloth.barcode}) is already in the cart!`, 'warning');
    } else {
        cart.push({ ...cloth });
        showAlert(`${cloth.designName} added to cart!`, 'success');
        const row = document.getElementById(`cloth-row-${barcode}`);
        if (row) {
            row.classList.add('table-success'); // Add Bootstrap success class for highlighting
                row.classList.add('table-warning'); // Add persistent cart highlight
                setTimeout(() => row.classList.remove('table-success'), 1500); // Remove success highlight after 1.5s
        }
    }
    updateCart();
}

function removeFromCart(index) {
    const cloth = cart[index];
    cart.splice(index, 1);
    showAlert(`${cloth.designName} removed from cart!`, 'info');
    updateCart();

    const row = document.getElementById(`cloth-row-${cloth.barcode}`);
    if (row) {
        row.classList.remove('table-warning'); // Remove persistent highlight
        setTimeout(() => row.classList.remove('table-success'), 1500);
    }
}

function updateCart() {
    renderCartTable();
    updateCartSummary();
}

function renderCartTable() {
    const tbody = document.getElementById('cartTableBody');
    const badge = document.getElementById('cartCountBadge');

    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Cart is empty</td></tr>';
        badge.textContent = '0 items';
        badge.className = 'badge bg-secondary';
        return;
    }

    tbody.innerHTML = cart.map((cloth, index) => `
        <tr>
            <td><strong>${cloth.designName}</strong></td>
            <td><code>${cloth.barcode}</code></td>
            <td class="price-display">$${formatPrice(cloth.basePrice)}</td>
            <td><span class="badge bg-light text-dark">${cloth.color || '-'}</span></td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        </tr>
    `).join('');

    badge.textContent = `${cart.length} items`;
    badge.className = 'badge bg-danger';
}

function updateCartSummary() {
    const itemCount = cart.length;
    const subtotal = cart.reduce((sum, cloth) => sum + cloth.basePrice, 0);
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    document.getElementById('cartItemCount').textContent = itemCount;
    document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
    document.getElementById('cartTotal').textContent = formatPrice(total);
    document.getElementById('totalPayment').value = formatPrice(total);
}

function clearCart() {
    if (confirm('Clear the cart?')) {
        cart = [];
        updateCart();
        // Remove persistent highlight from all cloths in the table
        allCloths.forEach(cloth => {
            const row = document.getElementById(`cloth-row-${cloth.barcode}`);
            if (row) {
                row.classList.remove('table-warning');
            }
        });
        showAlert('Cart cleared!', 'info');
    }
}

document.getElementById('discount').addEventListener('input', updateCartSummary);

async function completeCheckout() {
    if (cart.length === 0) {
        showAlert('Cart is empty!', 'warning');
        return;
    }

    const totalPayment = parseFloat(document.getElementById('totalPayment').value);
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const staffID = parseInt(document.getElementById('staffId').value) || 1;

    if (totalPayment <= 0) {
        showAlert('Please enter a valid payment amount!', 'warning');
        return;
    }

    const checkoutData = {
        cartItems: cart, // Send the entire cart array
        totalPayment: totalPayment,
        discount: discount,
        staffID: staffID
    };

    const response = await apiCall('/api/checkout', 'POST', checkoutData);

    if (response && response.success) {
        showAlert(`Purchase successful! Receipt ID: ${response.receiptID}`, 'success');
        cart = [];
        updateCart();
        loadAllCloths(); // Refresh cloth list after purchase
        loadStats(); // Refresh stats after purchase
        loadArchivedCloths(); // Refresh the archive table
        loadArchivedReceipts(); // Refresh the receipts table
        loadTransactions(); // Refresh the transaction log
    } else {
        showAlert(`Checkout failed: ${response ? response.error : 'Unknown error'}`, 'danger');
    }
}

// ==================== Archive Management ====================

/**
 * Loads and displays archived cloths.
 * To use this, add a section in your index.html like:
 * <h2>Archived Cloths</h2>
 * <div class="table-responsive">
 *   <table class="table table-striped">
 *     <thead>
 *       <tr>
 *         <th>Design Name</th><th>Barcode</th><th>Color</th><th>Size</th><th>Material</th><th>Price</th><th>Archived At</th><th>Categories</th>
 *       </tr>
 *     </thead>
 *     <tbody id="archiveTableBody"></tbody>
 *   </table>
 * </div>
 */
async function loadArchivedCloths() {
    const response = await apiCall('/api/archive/cloths');
    if (response && response.success) {
        allArchivedCloths = response.data || []; // Store data
        renderArchiveTable(response.data);
    }
}

function renderArchiveTable(archivedCloths) {
    const tbody = document.getElementById('archiveTableBody');
    if (!tbody) return; // Don't do anything if the element doesn't exist

    if (!archivedCloths || archivedCloths.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No archived cloths found</td></tr>';
        return;
    }

    tbody.innerHTML = archivedCloths.map(cloth => `
        <tr>
            <td><strong>${cloth.designName}</strong></td>
            <td><code>${cloth.barcode}</code></td>
            <td><span class="badge bg-light text-dark">${cloth.color || '-'}</span></td>
            <td>${cloth.size || '-'}</td>
            <td>${cloth.material || '-'}</td>
            <td class="price-display">$${formatPrice(cloth.basePrice)}</td>
            <td>${new Date(cloth.archivedAt).toLocaleString()}</td>
            <td>
                ${cloth.categories && cloth.categories.length > 0 
                    ? cloth.categories.map(cat => `<span class="badge bg-secondary">${cat}</span>`).join(' ')
                    : '-'
                }
            </td>
        </tr>
    `).join('');
}

async function loadArchivedReceipts() {
    const response = await apiCall('/api/archive/receipts');
    if (response && response.success) {
        allArchivedReceipts = response.data || []; // Store data
        renderArchiveReceiptsTable(response.data);
    }
}

function renderArchiveReceiptsTable(receipts) {
    const tbody = document.getElementById('receiptsTableBody');
    if (!tbody) return;

    if (!receipts || receipts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No archived receipts found</td></tr>';
        return;
    }

    tbody.innerHTML = receipts.map(receipt => `
        <tr>
            <td><code>${receipt.receiptID}</code></td>
            <td>${new Date(receipt.archivedAt).toLocaleString()}</td>
            <td>${receipt.cloths.length}</td>
            <td class="price-display">$${formatPrice(receipt.totalPayment)}</td>
            <td>${receipt.staffID}</td>
            <td>
                <button class="btn btn-sm btn-outline-info" onclick="showReceiptItemsModal(${receipt.receiptID})">
                    <i class="fas fa-eye me-1"></i> View Items
                </button>
            </td>
        </tr>
    `).join('');
}

async function loadTransactions() {
    const response = await apiCall('/api/transactions');
    if (response && response.success) {
        renderTransactionsTable(response.data);
    }
}

function showReceiptItemsModal(receiptID) {
    const receipt = allArchivedReceipts.find(r => r.receiptID === receiptID);
    if (!receipt) {
        showAlert('Receipt not found!', 'danger');
        return;
    }

    const modalTitle = document.getElementById('receiptItemsModalLabel');
    const modalBody = document.getElementById('receiptItemsModalBody');
    const receiptItemsModal = new bootstrap.Modal(document.getElementById('receiptItemsModal'));

    modalTitle.textContent = `Items for Receipt #${receiptID}`;

    const barcodes = receipt.cloths;
    const items = barcodes.map(bc => allArchivedCloths.find(c => c.barcode === bc)).filter(Boolean);

    if (items.length === 0) {
        modalBody.innerHTML = '<p class="text-muted">No item details could be found in the archive for this receipt.</p>';
    } else {
        const itemsTable = `
            <div class="table-responsive">
                <table class="table table-sm table-striped">
                    <thead>
                        <tr>
                            <th>Design Name</th>
                            <th>Barcode</th>
                            <th>Color</th>
                            <th>Size</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td><strong>${item.designName}</strong></td>
                                <td><code>${item.barcode}</code></td>
                                <td>${item.color || '-'}</td>
                                <td>${item.size || '-'}</td>
                                <td class="price-display">$${formatPrice(item.basePrice)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        modalBody.innerHTML = itemsTable;
    }

    receiptItemsModal.show();
}

function renderTransactionsTable(logs) {
    const table = document.getElementById('transactionLogTable');
    if (!table) return;

    const tableHeader = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Items</th>
                <th>Total Price</th>
                <th>Receipt ID</th>
            </tr>
        </thead>
    `;

    if (!logs || logs.length === 0) {
        table.innerHTML = tableHeader + '<tbody><tr><td colspan="6" class="text-center text-muted">No transactions found</td></tr></tbody>';
        return;
    }

    const tableBody = `<tbody>${logs.map(log => `
        <tr>
            <td>${log.id}</td>
            <td>${log.date} ${log.time}</td>
            <td><span class="badge ${log.type === 'SELL' ? 'bg-success' : 'bg-primary'}">${log.type}</span></td>
            <td>${log.cloths.map(c => c.designName).join(', ') || 'N/A'}</td>
            <td class="price-display">$${formatPrice(log.totalPrice)}</td>
            <td>${log.receiptID && log.receiptID !== -1 ? `<code>${log.receiptID}</code>` : 'N/A'}</td>
        </tr>
    `).join('')}</tbody>`;

    table.innerHTML = tableHeader + tableBody;
}

// ==================== Shop Info ====================

async function refreshShopInfo() {
    const response = await apiCall('/api/shop-info');

    if (response && response.success) {
        const shopInfo = response.data.shopInfo;
        const ownerInfo = response.data.ownerInfo;

        document.getElementById('shop-name').textContent = shopInfo.name || 'Fashion Emporium';
        document.getElementById('shop-info-detail').textContent = 
            `📍 ${shopInfo.location || 'Unknown'} | 👤 Owner: ${ownerInfo.name || 'Unknown'}`;
    }
}

// ==================== Statistics ====================

async function loadStats() {
    const response = await apiCall('/api/shop-stats');

    if (response && response.success) {
        const stats = response.data;
        shopStats = stats; // Store for later use
        renderStats(shopStats);
    }
}

function renderStats(stats) {
    const statsContainer = document.getElementById('statsContainer');

    const statCards = `
        <div class="col-md-3 mb-3">
            <div class="stat-card blue">
                <i class="fas fa-tshirt" style="font-size: 1.5rem;"></i>
                <h3>${stats.totalCloths}</h3>
                <p>Total Cloths</p>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="stat-card green">
                <i class="fas fa-dollar-sign" style="font-size: 1.5rem;"></i>
                <h3>$${formatPrice(stats.totalInventoryValue)}</h3>
                <p>Inventory Value</p>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="stat-card orange">
                <i class="fas fa-chart-line" style="font-size: 1.5rem;"></i>
                <h3>$${formatPrice(stats.totalSales)}</h3>
                <p>Total Sales</p>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="stat-card purple">
                <i class="fas fa-users" style="font-size: 1.5rem;"></i>
                <h3>${stats.totalStaff}</h3>
                <p>Staff Members</p>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card text-center h-100">
                <div class="card-body">
                    <h6 class="text-muted">Average Price</h6>
                    <h3 class="price-display">$${formatPrice(stats.averagePrice)}</h3>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card text-center h-100">
                <div class="card-body">
                    <h6 class="text-muted">Transactions</h6>
                    <h3>${stats.totalTransactions}</h3>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card text-center h-100">
                <div class="card-body">
                    <h6 class="text-muted">Restocks</h6>
                    <h3>${stats.totalRestocks}</h3>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card text-center h-100">
                <div class="card-body">
                    <h6 class="text-muted">Unique Colors</h6>
                    <h3>${stats.colors.length}</h3>
                </div>
            </div>
        </div>

        <div class="col-md-12 mt-4">
            <div class="card">
                <div class="card-header bg-light">
                    <h5 class="mb-0">Categories & Attributes</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <h6>Categories (${stats.categories.length})</h6>
                            <div>
                                ${stats.categories.map(cat => 
                                    `<span class="badge bg-info me-1">${cat}</span>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="col-md-4">
                            <h6>Materials (${stats.materials.length})</h6>
                            <div>
                                ${stats.materials.map(mat => 
                                    `<span class="badge bg-success me-1">${mat}</span>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="col-md-4">
                            <h6>Sizes (${stats.sizes.length})</h6>
                            <div>
                                ${stats.sizes.map(size => 
                                    `<span class="badge bg-warning me-1">${size}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    statsContainer.innerHTML = statCards;
}

// Auto-load stats every 30 seconds
setInterval(loadStats, 30000);
