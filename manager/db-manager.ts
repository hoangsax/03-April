import { Shop } from "../entity/shop.ts";
import { CartManager } from "./cart-manager.ts";
import { Cloth } from "../entity/cloth.ts";

export class DbManager {
  private shop: Shop;
  private cartManager: CartManager;
  private dbPath = new URL("../fake_db.json", import.meta.url);

  constructor(shop: Shop, cartManager: CartManager) {
    this.shop = shop;
    this.cartManager = cartManager;
  }

  private lastSavedPayload: string | null = null;

  saveDb(): void {
    const data = this.buildDbPayload();
    const payloadText = JSON.stringify(data, null, 2);

    if (!this.lastSavedPayload) {
      const existingText = this.readExistingDbText();
      if (existingText !== null) {
        this.lastSavedPayload = existingText;
      }
    }

    if (this.lastSavedPayload === payloadText) {
      return;
    }

    const fs: any = (globalThis as any).require?.("fs");
    if (fs) {
      fs.writeFileSync(this.dbPath, payloadText, "utf-8");
      this.lastSavedPayload = payloadText;
      return;
    }
    // @ts-ignore
    import("fs")
      .then((fsModule: any) => {
        fsModule.writeFileSync(this.dbPath, payloadText, "utf-8");
        this.lastSavedPayload = payloadText;
      })
      .catch((error: unknown) => {
        console.error("Failed to persist fake_db.json:", error);
      });
  }

  private readExistingDbText(): string | null {
    const fs: any = (globalThis as any).require?.("fs");
    if (!fs) {
      return null;
    }
    try {
      if (!fs.existsSync(this.dbPath)) {
        return null;
      }
      return fs.readFileSync(this.dbPath, "utf-8");
    } catch {
      return null;
    }
  }

  private buildDbPayload() {
    return {
      shopInfo: this.shop.information,
      owner: this.shop.owner,
      cloths: Array.from(this.shop.cloths.values()).map((cloth: Cloth) => ({
        designName: cloth.designName,
        barcode: cloth.barcode,
        color: cloth.color,
        size: cloth.size,
        material: cloth.material,
        categories: cloth.categories,
        basePrice: cloth.basePrice,
      })),
      staffs: Array.from(this.shop.staffs.values()).map((staff) => ({
        id: staff.id,
        name: staff.name,
        gender: staff.gender,
        citizenID: staff.citizenID,
        dayOfBirth: staff.dayOfBirth,
      })),
      transactions: Array.from(this.shop.transactionLog.values()).map((log) => ({
        id: log.id,
        date: log.date,
        time: log.time,
        type: log.type,
        cloths: log.cloths.map((cloth: Cloth) => cloth.barcode),
        totalPrice: log.totalPrice,
        receiptID: log.receiptID,
      })),
      receipts: Array.from(this.shop.archiveSpace.archivedReceipts.values()).map((receipt) => ({
        id: receipt.id,
        date: receipt.date,
        time: receipt.time,
        cloths: receipt.cloths.map((cloth: Cloth) => cloth.barcode),
        estimateCost: receipt.estimateCost,
        totalPayment: receipt.totalPayment,
        change: receipt.change,
        discount: receipt.discount,
        staffID: receipt.staffID,
      })),
      archiveSpace: {
        archivedCloths: Array.from(this.shop.archiveSpace.archivedCloths.values()).map((cloth: Cloth) => ({
          designName: cloth.designName,
          barcode: cloth.barcode,
          color: cloth.color,
          size: cloth.size,
          material: cloth.material,
          categories: cloth.categories,
          basePrice: cloth.basePrice,
        })),
        archivedReceipts: Array.from(this.shop.archiveSpace.archivedReceipts.values()).map((receipt) => ({
          id: receipt.id,
          date: receipt.date,
          time: receipt.time,
          cloths: receipt.cloths.map((cloth: Cloth) => cloth.barcode),
          estimateCost: receipt.estimateCost,
          totalPayment: receipt.totalPayment,
          change: receipt.change,
          discount: receipt.discount,
          staffID: receipt.staffID,
        })),
      },
      cart: this.cartManager.getCart().map((cloth: Cloth) => cloth.barcode),
    };
  }
}
