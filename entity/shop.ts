import { ArchiveSpace } from "./archive-space.ts";
import { Cloth } from "./cloth.ts";
import { Receipt } from "./receipt.ts";
import { StaffLog } from "./staff-log.ts";
import { Staff } from "./staff.ts";
import { TransactionLog } from "./transaction-log.ts";

export type ShopInformationType = {
    name: string;
    phone: string[];
    location: string;
};

export type OwnerInformation = {
    name: string,
    citizenID: string,
    dayOfBirth: string,
    phone: string,
    gender: string
}

export class Shop {
    owner: OwnerInformation;
    information: ShopInformationType;
    cloths = new Map<string, Cloth>();
    staffs = new Map<number, Staff>();
    transactionLog = new Map<number, TransactionLog>();
    staffLog = new Map<number, StaffLog>();
    archiveSpace = new ArchiveSpace();

    constructor(owner: OwnerInformation, information: ShopInformationType) {
        this.owner = owner;
        this.information = information;
    }

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

    addStaff(staff: Staff) {
        this.staffs.set(staff.id, staff);
    }

    removeStaff(id: number): boolean {
        return this.staffs.delete(id);
    }

    addToArchive(clothOrReceipt: Cloth | Receipt) {
        if (clothOrReceipt instanceof Cloth) {
            this.archiveSpace.addCloth(clothOrReceipt);
        }
        else {
            this.archiveSpace.addReceipt(clothOrReceipt)
        }
    }

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

}