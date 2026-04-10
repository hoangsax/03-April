import { Cloth } from "./cloth.ts";
import { getDate, getTime } from "./utils.ts";

export type TransactionType = "SELL" | "RESTOCK";

export class TransactionLog {
    static instanceCount = 0;
    id: number;
    date: string;
    time: string;
    type: TransactionType;
    cloths: Cloth[];
    totalPrice: number;
    receiptID: number;

    constructor(type: TransactionType, cloths: Cloth[], totalPrice: number, receiptID: number) {
        this.id = TransactionLog.instanceCount++;
        this.date = getDate();
        this.time = getTime();
        this.type = type;
        this.cloths = cloths;
        this.totalPrice = totalPrice;
        this.receiptID = receiptID;
    }
}