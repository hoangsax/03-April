import { Cloth } from "./cloth.ts";
import { getDate, getTime } from "./utils.ts";

export class Receipt {
    static instanceCount = 0;
    id: number;
    cloths: Cloth[];
    estimateCost: number;
    totalPayment: number;
    change: number;
    discount: number;
    date: string;
    time: string;
    staffID: number;

    constructor(cloths: Cloth[], totalPayment: number, discount: number, staffID: number) {
        this.id = Receipt.instanceCount++;
        this.cloths = cloths;
        this.estimateCost = cloths.reduce((sum, cloth) => sum + cloth.basePrice, 0);
        this.totalPayment = totalPayment;
        this.change = this.totalPayment - this.estimateCost;
        this.discount = discount;
        this.date = getDate();
        this.time = getTime();
        this.staffID = staffID;
    }
}