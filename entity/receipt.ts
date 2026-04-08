import { Cloth } from "./cloth.ts";
import { getDate, getTime } from "./utils.ts";

class Receipt {
    static instanceCount = 0;
    id: number;
    cloths: Cloth[];
    estimatePayment: number;
    clientPayment: number;
    change: number;
    discount: number;
    date: string;
    time: string;
    staffID: number;

    constructor(cloths: Cloth[], clientPayment: number, discount: number, staffID: number) {
        this.id = Receipt.instanceCount++;
        this.cloths = cloths;
        this.estimatePayment = cloths.reduce((curr, value) => curr + value.basePrice, 0);
        this.clientPayment = clientPayment;
        this.change = this.clientPayment - this.estimatePayment;
        this.discount = discount;
        this.date = getDate();
        this.time = getTime();
        this.staffID = staffID;
    }
}

export { Receipt };