import { getDate } from "./utils.ts";

class BorrowLog {
    static numberOfLog = 0;
    readonly logID: number;
    BookID: number;
    MemberID: number;
    EmployeeID: number;
    BorrowDate: string = getDate();
    DueDate: string;
    ReturnDate: string | null = null;
    Status: "pending" | "returned" | "overdue";

    constructor(BookID: number, MemberID: number, EmployeeID: number, DueDate: string) {
        this.logID = BorrowLog.numberOfLog++;
        this.BookID = BookID;
        this.MemberID = MemberID;
        this.EmployeeID = EmployeeID;
        this.DueDate = DueDate;
        this.Status = "pending";
    }

    updateStatus(newStatus: "pending" | "returned" | "overdue", ReturnDate?: string) {
        this.Status = newStatus;
        if (ReturnDate && this.Status === "returned") {
            this.ReturnDate = ReturnDate;
        }
    }
}

export { BorrowLog };