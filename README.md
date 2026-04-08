# Clothing Shop Management System - OOP System Analysis

This documentation outlines the core Object-Oriented Programming (OOP) structures and data relationships for a retail clothing management system, focusing on inventory lifecycle and staff operations.

## Features

- **Inventory Control:** Add, restock, and remove clothes with automated barcode generation.
- **Transaction Tracking:** Log every sale and restock event with detailed transaction logs.
- **Staff Management:** Track staff profiles, shifts.
- **Archiving:** Move outdated or removed inventory and historical receipts to a dedicated archive space to keep the active shop database optimized.
- **Search & Analytics:** Filter clothing by attributes and count stock levels dynamically.

---

## Class Structures

### 👕 Clothing & Inventory
Core entities for defining products and their unique identifiers.

| Class | Attributes | Methods |
| :--- | :--- | :--- |
| **Barcode** | `initialValue` (static) | `newBarcode()` |
| **Cloth** | `instanceCount` (static), `designName`, `barcode`, `color`, `size`, `material` | — |

### 🏬 Shop Operations
The central controller managing inventory, staff, and logs.

| Class | Attributes | Methods |
| :--- | :--- | :--- |
| **Shop** | `cloths`, `transactionLogs`, `archived`, `staffs`, `shopInformation`, `owner` | `searchClothBy()`, `countClothBy()`, `addCloth()`, `removeCloth()`, `addCloths()`, `sellCloth()`, `addStaff()`, `searchStaffBy()` |
| **ArchiveSpace** | `cloths`, `receipts` | — |

### 👥 Staff & Logging
Management of human resources and operational history.

| Class | Attributes | Methods |
| :--- | :--- | :--- |
| **Staff** | `instanceCount` (static), `name`, `gender`, `citizenID`, `dayOfBirth`, `staffID`, `workingShift` |
| **StaffLog** | `id`, `date`, `time`, `description` | — |

---

## Data Models

### 🧾 Financial Records
Structures for customer billing and internal tracking.

#### 1. Receipt
Detailed breakdown of a customer purchase.
- `id`, `cloths` (List), `estimatePayment`, `totalPayment`, `change`, `discount`, `date`, `time`, `staffID`

#### 2. TransactionLog
System-level log for inventory movement.
- `id`, `date`, `time`, `type` (`SELL` or `RESTOCK`), `items`, `totalPrice`

---

## System Workflow Note
> When a cloth is removed via `removeCloth()`, it is not deleted from the system; instead, the instance is moved to the **ArchiveSpace** to maintain data integrity for historical reporting.