import { Cloth } from "../entity/cloth.ts";
import { Receipt } from "../entity/receipt.ts";
import { Shop } from "../entity/shop.ts";
import { StaffLog } from "../entity/staff-log.ts";
import { TransactionLog } from "../entity/transaction-log.ts";

class ShopManager {
    private shop: Shop;

    constructor(shop: Shop) {
        this.shop = shop;
    }

    createReceipt(cloths: Cloth[], clientPayment: number, discount: number, staffID: number): Receipt | null{
        const estimatePay = cloths.reduce((curr, val) => curr + val.basePrice, 0);
        if (estimatePay <= clientPayment) {
            return new Receipt(cloths, clientPayment, discount, staffID);
        }
        return null;
    }

    sellCloths(receipt: Receipt): Boolean {
        const cloths = receipt.cloths;
        const missingItem = cloths.filter((cloth) => this.shop.searchClothBy("barcode", cloth.barcode));
        if (missingItem.length > 0){
            return false;
        }
        cloths.forEach(element => {
            this.shop.removeCloth(element.barcode);
        });
        this.shop.addToTransactionLog(new TransactionLog("SELL", receipt.cloths, receipt.estimateCost, receipt.id));
        this.shop.addToArchive(receipt);
        return true;
    }

    restockCloths(cloths: Cloth[]) {
        cloths.forEach((cloth) => this.shop.addCloth(cloth));
        let price = cloths.reduce((curr, val) => curr + val.basePrice, 0);
        this.shop.addToTransactionLog(new TransactionLog("RESTOCK", cloths, price, -1));
    }

    shiftRecord(staffID: number, type: 'START' | 'END', note?: string) {
        this.shop.addToStaffLog(new StaffLog(staffID, type, note));
    }

    checkAvailability<T extends keyof Cloth>(field: T, value: Cloth[T]): Cloth[] {
        return this.shop.searchClothBy(field, value);
    }

}

export { ShopManager };