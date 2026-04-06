import { calculateTotalTimeBetween, getDate, getTime } from "./utils.ts";
import { Member, Librarian } from "./people.ts";
import { SystemLog } from "./systemlog.ts";
import { BorrowLog } from "./borrowlog.ts";
import { Book } from "./book.ts";

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

    removeBook(bookID: number): Boolean {
        if (this.books.get(bookID)) {
            this.books.delete(bookID);
            return true;
        }
        return false;
    }


// People related sections
    addMember(member: Member){
        this.members.set(member.ID, member);
    }

    removeMember(memberID: number): Boolean {
        if (this.members.get(memberID)) {
            this.members.delete(memberID);
            return true;
        }
        return false;
    }

    addLibrarian(librarian: Librarian) {
        this.librarians.set(librarian.ID, librarian);
    }

    removeLibrarian(librarianID: number): Boolean {
        if (this.librarians.get(librarianID)) {
            this.librarians.delete(librarianID);
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
}

export { Library };