import { ArchiveSpace } from "./archiveSpace.ts";
import { Cloth } from "./cloth.ts";
import { Staff } from "./staff.ts";

export type ShopInformationType = {
    name: string;
    phone: string;
    location: string;
};

class Shop {
    readonly ownerID: number;
    information: ShopInformationType;

    cloths = new Map<string, Cloth>();
    staffs = new Map<number, Staff>();
    archiveSpace = new ArchiveSpace();

    constructor(ownerID: number, information: ShopInformationType) {
        this.ownerID = ownerID;
        this.information = information;
    }

    // --- CLOTH MANAGEMENT ---

    addCloth(cloth: Cloth): void {
        this.cloths.set(cloth.barcode, cloth);
    }

    restockCloth(cloths: Cloth[]): void {
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

    searchClothBy(field: keyof Cloth, value: any): Cloth[] {
        return Array.from(this.cloths.values()).filter(
            (cloth) => cloth[field] === value
        );
    }

    countClothBy(field: keyof Cloth, value: any): number {
        return this.searchClothBy(field, value).length;
    }

    // --- STAFF MANAGEMENT ---

    addStaff(staff: Staff): void {
        this.staffs.set(staff.id, staff);
    }

    removeStaff(id: number): boolean {
        return this.staffs.delete(id);
    }

    searchStaffBy(field: keyof Staff, value: any): Staff[] {
        return Array.from(this.staffs.values()).filter(
            (staff) => staff[field] === value
        )
    }

    // --- INTERNAL UTILITIES ---

    addToArchive(cloth: Cloth): void {
        this.archiveSpace.addClothToArchive(cloth);
    }
}

export { Shop };