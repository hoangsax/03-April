import { Cloth } from "./cloth.ts";
import { Receipt } from "./receipt.ts";

class ArchiveSpace {
    archivedCloths = new Map<string, Cloth>();
    archivedReceipts = new Map<number, Receipt>();

    addCloth(cloth: Cloth): void {
        this.archivedCloths.set(cloth.barcode, cloth);
    }

    addReceipt(receipt: Receipt): void {
        this.archivedReceipts.set(receipt.id, receipt);
    }

    removeCloth(barcode: string): boolean {
        return this.archivedCloths.delete(barcode);
    }

    removeReceipt(id: number): boolean {
        return this.archivedReceipts.delete(id);
    }

    getAllArchivedCloths(): Cloth[] {
        return Array.from(this.archivedCloths.values());
    }

    isClothArchived(barcode: string): boolean {
        return this.archivedCloths.has(barcode);
    }

    resetCloth(): void {
        this.archivedCloths.clear();
    }

    resetReceipt(): void {
        this.archivedReceipts.clear();
    }
}

export { ArchiveSpace };