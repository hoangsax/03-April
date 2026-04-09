
import { Receipt } from "../entity/receipt.ts";
import { TransactionLog } from "../entity/transaction-log.ts";

type FinancialData = {
    revenue: number,
    expenses: number,
    profit: number,
    totalTransactions: number,
    totalReceipts: number
}

export class FinanceManager {
    constructor() {
    }

    getTotalRevenue(transactionLog: Map<number, TransactionLog>): number {
        let total = 0;
        transactionLog.forEach(log => {
            if (log.type === "SELL") {
                total += log.totalPrice;
            }
        });
        return total;
    }

    getTotalExpenses(transactionLog: Map<number, TransactionLog>): number {
        let total = 0;
        transactionLog.forEach(log => {
            if (log.type === "RESTOCK") {
                total += log.totalPrice;
            }
        });
        return total;
    }

    getNetProfit(transactionLog: Map<number, TransactionLog>): number {
        return this.getTotalRevenue(transactionLog) - this.getTotalExpenses(transactionLog);
    }

    getAllReceipts(archivedReceipts: Map<number, Receipt>): Receipt[] {
        return Array.from(archivedReceipts.values());
    }

    getAllTransactions(transactionLog: Map<number, TransactionLog>): TransactionLog[] {
        return Array.from(transactionLog.values());
    }



    generateFinancialData(transactionLog: Map<number, TransactionLog>, archivedReceipts: Map<number, Receipt>): FinancialData {
        const revenue = this.getTotalRevenue(transactionLog);
        const expenses = this.getTotalExpenses(transactionLog);
        const profit = this.getNetProfit(transactionLog);
        const totalTransactions = transactionLog.size;
        const totalReceipts = archivedReceipts.size;

        return { revenue, expenses, profit, totalTransactions, totalReceipts };
    }
}
