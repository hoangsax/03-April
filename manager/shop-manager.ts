import { Cloth } from "../entity/cloth.ts";
import { Receipt } from "../entity/receipt.ts";
import { Shop } from "../entity/shop.ts";
import { Staff } from "../entity/staff.ts";
import { StaffLog } from "../entity/staff-log.ts";
import { TransactionLog } from "../entity/transaction-log.ts";

class ShopManager {
  private shop: Shop;

  constructor(shop: Shop) {
    this.shop = shop;
  }

  createReceipt(
    cloths: Cloth[],
    clientPayment: number,
    discount: number,
    staffID: number,
  ): Receipt | null {
    const estimatePay = cloths.reduce((curr, val) => curr + val.basePrice, 0);
    if (estimatePay <= clientPayment) {
      return new Receipt(cloths, clientPayment, discount, staffID);
    }
    return null;
  }

  sellCloths(receipt: Receipt): boolean {
    const cloths = receipt.cloths;
    const missingItem = cloths.filter((cloth) =>
      this.searchClothBy("barcode", cloth.barcode).length === 0,
    );
    if (missingItem.length > 0) {
      return false;
    }
    cloths.forEach((element) => {
      this.removeCloth(element.barcode);
    });
    this.addToTransactionLog(
      new TransactionLog(
        "SELL",
        receipt.cloths,
        receipt.estimateCost,
        receipt.id,
      ),
    );
    this.addToArchive(receipt);
    return true;
  }

  restockCloths(cloths: Cloth[]) {
    cloths.forEach((cloth) => this.addCloth(cloth));
    const price = cloths.reduce((curr, val) => curr + val.basePrice, 0);
    this.addToTransactionLog(
      new TransactionLog("RESTOCK", cloths, price, -1),
    );
  }

  shiftRecord(staffID: number, type: "START" | "END", note?: string) {
    this.addToStaffLog(new StaffLog(staffID, type, note));
  }

  checkAvailability<T extends keyof Cloth>(field: T, value: Cloth[T]): Cloth[] {
    return this.searchClothBy(field, value);
  }

  searchClothBy<T extends keyof Cloth>(field: T, value: Cloth[T]): Cloth[] {
    return Array.from(this.shop.cloths.values()).filter(
      (cloth) => cloth[field] === value
    );
  }

  countClothBy<T extends keyof Cloth>(field: T, value: Cloth[T]): number {
    return this.searchClothBy(field, value).length;
  }

  searchStaffBy<T extends keyof Staff>(field: T, value: Staff[T]): Staff[] {
    return Array.from(this.shop.staffs.values()).filter(
      (staff) => staff[field] === value
    );
  }

  searchTransactionBy<K extends keyof TransactionLog>(field: K, value: any): TransactionLog[] {
    return Array.from(this.shop.transactionLog.values()).filter((log) => log[field] === value);
  }


  addCloth(cloth: Cloth) {
    this.shop.cloths.set(cloth.barcode, cloth);
  }

  addCloths(cloths: Cloth[]) {
    cloths.forEach((cloth) => this.addCloth(cloth));
  }

  removeCloth(barcode: string): boolean {
    const cloth = this.shop.cloths.get(barcode);
    if (cloth) {
      this.addToArchive(cloth);
      return this.shop.cloths.delete(barcode);
    }
    return false;
  }

  addStaff(staff: Staff) {
    this.shop.staffs.set(staff.id, staff);
  }

  removeStaff(id: number): boolean {
    return this.shop.staffs.delete(id);
  }

  addToArchive(clothOrReceipt: Cloth | Receipt) {
    if (clothOrReceipt instanceof Cloth) {
      this.shop.archiveSpace.addCloth(clothOrReceipt);
    } else {
      this.shop.archiveSpace.addReceipt(clothOrReceipt);
    }
  }

  addToTransactionLog(log: TransactionLog) {
    this.shop.transactionLog.set(log.id, log);
  }

  addToStaffLog(log: StaffLog) {
    this.shop.staffLog.set(log.id, log);
  }

  clearTransactionLog() {
    this.shop.transactionLog.clear();
  }

  clearStaffLog() {
    this.shop.staffLog.clear();
  }
}

export { ShopManager };
