import { Cloth } from "./cloth.ts";
import { Receipt } from "./receipt.ts";

class ArchiveSpace {
    archivedCloths = new Map<string, Cloth>;
    archivedReceipts = new Map<number, Receipt>;

    addClothToArchive(cloth: Cloth) {
        this.archivedCloths.set(cloth.barcode, cloth);
    }

    addReceiptsToArchive(receipt: Receipt) {
        this.archivedReceipts.set(receipt.id, receipt);
    }
}

export { ArchiveSpace };