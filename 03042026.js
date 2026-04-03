class Book {
  static numberOfBook = 0;
  constructor(title, author, genre) {
    this.ID = Book.numberOfBook++;
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.available = true;
    this.borrowedHistory = [];
  }

  addBorrowedHistory(ID) {
    this.borrowedHistory.push(ID);
  }

  updateDetail(title, author, genre) {
    this.title = title;
    this.author = author;
    this.genre = genre;
  }
}

class Person {
  constructor(name, gender, birth) {
    this.name = name;
    this.gender = gender;
    this.birth = birth;
  }
}

class Librarian extends Person{
  static numberOfLibrarian = 0;
  constructor(name, gender, birth) {
    super(name, gender, birth);
    this.ID = Librarian.numberOfLibrarian++;
  }

  getID() {
    return this.ID;
  }
}

class Member extends Person{
  static numberOfMember = 0;
  constructor(name, gender, birth) {
    super(name, gender, birth);
    this.ID = Member.numberOfMember;
    this.borrowedHistory = [];
    Member.numberOfMember++;
  }

  addBorrowedHistory(ID) {
    this.borrowedHistory.push(ID);
  }

  getID() {
    return this.ID;
  }

}

class BorrowedLog {
  static numberOfLogs = 0;
  constructor(bookID, memberID, librarianID, borrowedDate, dueDate) {
    this.ID = BorrowedLog.numberOfLogs++;
    this.bookID = bookID;
    this.memberID = memberID;
    this.librarianID = librarianID;
    this.borrowedDate = borrowedDate;
    this.dueDate = dueDate;
  }

  getID() {
    return this.ID;
  }
}

class ShiftLog {
  static numberOfLogs = 0;
  constructor(librarianID, type, time, date){
    this.librarianID = librarianID;
    this.type = type; //Start or End the shift: 'start' | 'end'
    this.time = time;
    this.date = date;
  }
}

export class Library {
  constructor() {
    this.books = [];
    this.members = [];
    this.librarians = [];
    this.borrowedLogs = [];
    this.shiftLogs = [];
    this.inShiftLibrarian = null;
  }

  addBook(title, author, genre) {
    this.books.push(new Book(title, author, genre));
  }

  addBooks(listOfBook) {
    listOfBook.forEach(book => {
      this.books.push(new Book(book.title, book.author, book.genre));
    });
  }

  getBook(ID) {
    return this.books[ID];
  }

  searchBook(name) {
    let result = []
    this.books.forEach(book => { 
      if (book.title.includes(name)) {
        result.push(book)
      }
    })
    return result;
  }

  addMember(name, gender, birth) {
    return this.members.push(new Member(name, gender, birth));
  }

  getMemberInfo(ID) {
    return this.members[ID];
  }

  addLibrarian(name, gender, birth) {
    return this.librarians.push(new Librarian(name, gender, birth));
  }

  getLibrarianInfo(ID) {
    return this.librarians[ID];
  }

  addLogs(bookID, memberID, dueDate) {
    let tempLog = this.borrowedLogs.push(new BorrowedLog(bookID, memberID, this.inShiftLibrarian, this.getDate(), dueDate));
    this.members[memberID].addBorrowedHistory(tempLog.getID());
    this.books[bookID].addBorrowedHistory(tempLog.getID());
    return tempLog.getID();
  }

  getBorrowedLog(ID) {
    return this.borrowedLogs[ID];
  }

//shift

  startShift(librarianID) {
    this.inShiftLibrarian = librarianID;
    this.shiftLogs.push(new ShiftLog(librarianID, 'start', this.getTime(), this.getDate()));
    return true
  }

  endShift(librarianID) {
    if (librarianID === this.inShiftLibrarian){
      this.shiftLogs.push(new ShiftLog(this.inShiftLibrarian, 'start', this.getTime(), this.getDate()));
      this.inShiftLibrarian = null;
      return true
    }
    return false
  }

//Time

  getTime() {
    const now = new Date()
    let time = now.getHours.toString().padStart(2, '0') + ':' + now.getMinutes.toString().padStart(2, '0')
    return time;
  }

  getDate() {
    const now = new Date()
    let date = now.getDate().toString().padStart(2, '0') + '-' + now.getMonth().toString().padStart(2, '0') + '-' + now.getFullYear().toString();
    return date;
  }

}
