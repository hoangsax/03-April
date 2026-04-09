import { Shop } from "../entity/shop.ts";
import { ShopManager } from "./shop-manager.ts";
import { FinanceManager } from "./finance-manager.ts";
import { CartManager } from "./cart-manager.ts";
import { DbManager } from "./db-manager.ts";
import { Cloth } from "../entity/cloth.ts";
import { Staff } from "../entity/staff.ts";
import { Receipt } from "../entity/receipt.ts";

export class MainManager {
    shop: Shop;
    shopManager: ShopManager;
    financeManager: FinanceManager;
    cartManager: CartManager;
    dbManager: DbManager;

    constructor(shop: Shop) {
        this.shop = shop;
        this.shopManager = new ShopManager(shop);
        this.financeManager = new FinanceManager();
        this.cartManager = new CartManager(this.shopManager);
        this.dbManager = new DbManager(this.shop, this.cartManager);
    }

    addCloth(cloth: Cloth): void {
        this.shopManager.addCloth(cloth);
        this.dbManager.saveDb();
    }

    addStaff(staff: Staff): void {
        this.shopManager.addStaff(staff);
        this.dbManager.saveDb();
    }

    searchClothBy<T extends keyof Cloth>(field: T, value: Cloth[T]): Cloth[] {
        return this.shopManager.searchClothBy(field, value);
    }

    getTotalRevenue(): number {
        return this.financeManager.getTotalRevenue(this.shop.transactionLog);
    }

    getNetProfit(): number {
        return this.financeManager.getNetProfit(this.shop.transactionLog);
    }

    generateFinancialData() {
        return this.financeManager.generateFinancialData(this.shop.transactionLog, this.shop.archiveSpace.archivedReceipts);
    }

    addToCart(cloth: Cloth): void {
        this.cartManager.addToCart(cloth);
        this.dbManager.saveDb();
    }

    purchaseCart(totalPayment: number, discount: number, staffID: number): boolean {
        if (this.cartManager.getCart().length === 0) {
            return false;
        }

        const receipt = this.shopManager.createReceipt(this.cartManager.getCart(), totalPayment, discount, staffID);
        if (!receipt) {
            return false;
        }

        const success = this.shopManager.sellCloths(receipt);
        if (success) {
            this.cartManager.clearCart();
            this.dbManager.saveDb();
        }
        return success;
    }

    getCartTotal(): number {
        return this.cartManager.getCartTotal();
    }

    processPurchase(cloths: Cloth[], totalPayment: number, discount: number, staffID: number): boolean {
        cloths.forEach(cloth => this.addToCart(cloth));
        return this.purchaseCart(totalPayment, discount, staffID);
    }

    getSystemReport(): object {
        return {
            shopInfo: this.shop.information,
            totalCloths: this.shop.cloths.size,
            totalStaff: this.shop.staffs.size,
            cartItems: this.cartManager.getCart().length,
            financial: this.generateFinancialData()
        };
    }
}