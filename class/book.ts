type bookChangableField = 
    "name" |
    "releaseDate" |
    "author" |
    "genre" |
    "totalCopy" |
    "availableCopy" |
    "price";

type bookFieldType = number | string | string[];

class Book {
    static numberOfBook = 0;
    readonly ID: number;
    name: string;
    releaseDate: string;
    author: string;
    genre: string[];
    totalCopy: number;
    availableCopy: number;
    price: number;
    constructor(name: string, releaseDate: string, author: string, genre: string[], totalCopy: number, price: number) {
        this.ID = Book.numberOfBook++;
        this.name = name;
        this.releaseDate = releaseDate;
        this.author = author;
        this.genre = genre;
        this.totalCopy = totalCopy;
        this.availableCopy = totalCopy;
        this.price = price;
    }

    changeBookInfo(field: bookChangableField, value: bookFieldType) {
        if (field === "name" || field === "releaseDate" || field === "author") {
            this[field] = value as string;
        }
        else if (field === "genre") {
            this[field] = value as string[];
        }
        else if (field === "totalCopy" || field === "availableCopy" || field === "price") {
            this[field] = value as number;
        }
    }
}

export { Book, bookChangableField, bookFieldType };