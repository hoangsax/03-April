import { Cloth } from "./cloth.ts";
import { getDate, getTime } from "./utils.ts";
import { Receipt } from "./receipt.ts";

enum transactionType {
    restock,
    sell
}

class TransactionLog {
    static instanceCount = 0;
    id: number;
    date: string;
    time: string;
    type: transactionType;
    cloths: Cloth[];
    totalPrice: number;

    constructor(type: transactionType, items: Cloth[], totalPrice: number) {
        this.id = TransactionLog.instanceCount++;
        this.date = getDate();
        this.time = getTime();
        this.type = type;
        this.cloths = items;
        this.totalPrice = totalPrice;
    }
}

export { TransactionLog, transactionType };