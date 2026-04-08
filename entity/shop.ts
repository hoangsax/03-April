import { ArchiveSpace } from "./archive-space.ts";
import { Cloth } from "./cloth.ts";
import { Receipt } from "./receipt.ts";
import { StaffLog } from "./staff-log.ts";
import { Staff } from "./staff.ts";
import { TransactionLog } from "./transaction-log.ts";

export type ShopInformationType = {
    name: string;
    phone: string;
    location: string;
};

export class Shop {
    private ownerID: number;
    information: ShopInformationType;
    cloths = new Map<string, Cloth>();
    staffs = new Map<number, Staff>();
    transactionLog = new Map<number, TransactionLog>();
    staffLog = new Map<number, StaffLog>();
    archiveSpace = new ArchiveSpace();

    constructor(ownerID: number, information: ShopInformationType) {
        this.ownerID = ownerID;
        this.information = information;
    }

    get _ownerID() {
        return this.ownerID;
    }

    // --- CLOTH MANAGEMENT ---

    addCloth(cloth: Cloth) {
        this.cloths.set(cloth.barcode, cloth);
    }

    addCloths(cloths: Cloth[]) {
        cloths.forEach((cloth) => this.addCloth(cloth));
    }

    removeCloth(barcode: string): boolean {
        const cloth = this.cloths.get(barcode);
        if (cloth) {
            this.addToArchive(cloth);
            return this.cloths.delete(barcode);
        }
        return false;
    }

    searchClothBy<T extends keyof Cloth>(field: T, value: Cloth[T]): Cloth[] {
        return Array.from(this.cloths.values()).filter(
            (cloth) => cloth[field] === value
        );
    }

    countClothBy<T extends keyof Cloth>(field: T, value: Cloth[T]): number {
        return this.searchClothBy(field, value).length;
    }

    // --- STAFF MANAGEMENT ---

    addStaff(staff: Staff) {
        this.staffs.set(staff.id, staff);
    }

    removeStaff(id: number): boolean {
        return this.staffs.delete(id);
    }

    searchStaffBy<T extends keyof Staff>(field: T, value: Staff[T]): Staff[] {
        return Array.from(this.staffs.values()).filter(
            (staff) => staff[field] === value
        )
    }

    // --- ARCHIVE MANAGEMENT ---

    addToArchive(clothOrReceipt: Cloth | Receipt) {
        if (clothOrReceipt instanceof Cloth) {
            this.archiveSpace.addCloth(clothOrReceipt);
        }
        else {
            this.archiveSpace.addReceipt(clothOrReceipt)
        }
    }

    // --- LOGS MANAGEMENT ---

    addToTransactionLog(log: TransactionLog) {
        this.transactionLog.set(log.id, log);
    }

    addToStaffLog(log: StaffLog) {
        this.staffLog.set(log.id, log);
    }

    clearTransactionLog() {
        this.transactionLog.clear();
    }

    clearStaffLog() {
        this.staffLog.clear();
    }

    searchTransactionBy<K extends keyof TransactionLog>(field: K, value: any): TransactionLog[] {
        return Array.from(this.transactionLog.values()).filter((log) => log[field] === value)
    }

    // --- GET METHOD ---

}