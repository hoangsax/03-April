import { Cloth } from "./cloth.ts";
import { Receipt } from "./receipt.ts";

class ArchiveSpace {
    archivedCloths = new Map<string, Cloth>;
    archivedReceipts = new Map<number, Receipt>;

    addCloth(cloth: Cloth) {
        this.archivedCloths.set(cloth.barcode, cloth);
    }

    addReceipt(receipt: Receipt) {
        this.archivedReceipts.set(receipt.id, receipt);
    }

    removeCloth(barcode: string): Boolean {
        return this.archivedCloths.delete(barcode);
    }

    removeReceipt(id: number): Boolean {
        return this.archivedReceipts.delete(id);
    }

    resetCloth() {
        this.archivedCloths.clear();
    }

    resetReceipt() {
        this.archivedReceipts.clear()
    }

    clear() {
        this.resetCloth();
        this.resetReceipt();
    }
}

export { ArchiveSpace };