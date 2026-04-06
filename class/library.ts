import { calculateTotalTimeBetween, getDate, getTime } from "./utils.ts";
import { Member, Librarian } from "./people.ts";
import { SystemLog } from "./systemlog.ts";
import { BorrowLog } from "./borrowlog.ts";
import { Book, bookChangableField, bookFieldType } from "./book.ts";

const additionalInfomation = {
    penatyRate: 0.1
}

class Library {
    books = new Map<number, Book>();
    members = new Map<number, Member>();
    librarians = new Map<number, Librarian>();
    systemLogs = new Map<number, SystemLog>();
    borrowLogs = new Map<number, BorrowLog>();
    inShiftLibrarianID: number | null = null;

// Book related sections    
    addBook(book: Book) {
        this.books.set(book.ID, book);
    }

    addBooks(books: Book[]) {
        books.forEach(book => {
            this.books.set(book.ID, book)   ;
        });
    }

    updateBookInfo(id: number, field: bookChangableField, value: number | string | string[]) {
        let book = this.books.get(id);
        if (book) {
            book.changeBookInfo(field, value);
            return true;
        }
        return false;
    }

    removeBook(bookID: number): Boolean {
        if (this.books.get(bookID)) {
            this.books.delete(bookID);
            return true;
        }
        return false;
    }

    searchBookByCriteria(field: bookChangableField, value: bookFieldType) {
        let bookArray = Array.from(this.books.values());
        let resultArray = [];
        for (let i = 0; i < this.books.size; i++) {
            if (bookArray[i][field] === value) {
                resultArray.push(this.books.get(i));
            }
        }
        return bookArray;
    }

// People related sections
// Member related sections
    addMember(member: Member){
        this.members.set(member.ID, member);
        this.addSystemLog(new SystemLog(member.ID, getTime(), getDate(), `Member ID: ${member.ID} was added at ${getTime()} on ${getDate()}.`));
    }

    removeMember(memberID: number): Boolean {
        if (this.members.get(memberID)) {
            this.members.delete(memberID);
            this.addSystemLog(new SystemLog(memberID, getTime(), getDate(), `Member ID: ${memberID} was removed at ${getTime()} on ${getDate()}.`));
            return true;
        }
        return false;
    }

    lendingBookProcedure(bookID: number, memberID: number, DueDate: string): Boolean {
        if (this.inShiftLibrarianID !== null) {
            let book = this.books.get(bookID);
            let member = this.members.get(memberID);
            if (book && member && book.availableCopy > 0) {
                if (member.balance < book.price) {
                    return false;
                }
                book.availableCopy -= 1;
                let newBorrowLog = new BorrowLog(bookID, memberID, this.inShiftLibrarianID, DueDate);
                this.addBorrowLog(newBorrowLog);
                member.addPendingBorrowLog(newBorrowLog.logID);
                member.deductBalance(book.price);
                this.addSystemLog(new SystemLog(this.inShiftLibrarianID, getTime(), getDate(), `Librarian ID: ${this.inShiftLibrarianID} lent Book ID: ${bookID} to Member ID: ${memberID} at ${getTime()} on ${getDate()}.`));
                return true;
            }
        }
        return false
    }

    returnBookProcedure(bookID: number, memberID: number, borrowLogID: number): Boolean {
        let book = this.books.get(bookID);
        let member = this.members.get(memberID);
        let borrowLog = this.borrowLogs.get(borrowLogID);
        if (this.inShiftLibrarianID !== null && book && member && borrowLog) {
            book.availableCopy += 1;
            if (borrowLog.Status === "overdue"){
                member.overduePenaty(book.price)
            }
            borrowLog.updateStatus("returned", getDate());
            member.removePendingBorrowLog(borrowLogID);
            this.addSystemLog(new SystemLog(this.inShiftLibrarianID, getTime(), getDate(), `Librarian ID: ${this.inShiftLibrarianID} received Book ID: ${bookID} from Member ID: ${memberID} at ${getTime()} on ${getDate()}.`));
            return true;
        }
        return false;
    }
// Librarian related sections


    addLibrarian(librarian: Librarian) {
        this.librarians.set(librarian.ID, librarian);
        this.addSystemLog(new SystemLog(librarian.ID, getTime(), getDate(), `Librarian ID: ${librarian.ID} was added at ${getTime()} on ${getDate()}.`));
    }

    removeLibrarian(librarianID: number): Boolean {
        if (this.librarians.get(librarianID)) {
            this.librarians.delete(librarianID);
            this.addSystemLog(new SystemLog(librarianID, getTime(), getDate(), `Librarian ID: ${librarianID} was removed at ${getTime()} on ${getDate()}.`));
            return true;
        }
        return false;
    }

    getLibrarianOnShift(): Librarian | undefined {
        if (this.inShiftLibrarianID !== null) {
            return this.librarians.get(this.inShiftLibrarianID);
        }
    }

    setLibrarianOnShift(librarianID: number): Boolean {
        if (this.inShiftLibrarianID !== null) {
            return false;
        }
        let librarian = this.librarians.get(librarianID);
        if (librarian) {
            let newLog = new SystemLog(librarianID, getTime(), getDate(), `Librarian ID: ${librarianID} started shift at ${getTime()} on ${getDate()}.`);
            this.inShiftLibrarianID = librarianID;
            this.addSystemLog(newLog);
            librarian.addShiftLog(newLog.ID, "start");
            return true;
        }
        return false;
    }

    endLibrarianShift(): Boolean {
        if (this.inShiftLibrarianID === null) {
            return false;
        }
        let workingLibrarian = this.librarians.get(this.inShiftLibrarianID);
        if (workingLibrarian) {
            let endLog = new SystemLog(this.inShiftLibrarianID, getTime(), getDate(), `Librarian ID: ${this.inShiftLibrarianID} ended shift at ${getTime()} on ${getDate()}.`);
            let startLog = this.systemLogs.get(workingLibrarian.getLastShiftIDWithStatus("start"));
            if (startLog) {
                workingLibrarian.calculateTimeWorkingInSeconds(startLog, endLog);
            }
            workingLibrarian.addShiftLog(endLog.ID, "end");
            this.inShiftLibrarianID = null;
            return true;
        }
        return false;
    }

// Log related sections
    addSystemLog(systemLog: SystemLog) {
        this.systemLogs.set(systemLog.ID, systemLog);
    }

    addBorrowLog(borrowLog: BorrowLog) {
        this.borrowLogs.set(borrowLog.logID, borrowLog);
    }

    checkOverdueBooks(currentDate: string) {
        this.borrowLogs.forEach((borrowLog) => {
            if (borrowLog.Status === "pending" && borrowLog.DueDate < currentDate) {
                borrowLog.updateStatus("overdue");
            }
        });
    }
}

export { Library };