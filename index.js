import {Library} from './03042026.js'
import {libraryData} from './database_fake.js'
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';


let LibraryObj = new Library();
export function preProcess() {
  LibraryObj.addBooks(libraryData.books);
  libraryData.members.forEach((mem) => {
    LibraryObj.addMember(mem.name, mem.gender, mem.birth);
  })
  libraryData.librarians.forEach((lib) => {
    LibraryObj.addLibrarian(lib.name, lib.gender, lib.birth);
  })
}
preProcess()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to turn rl.question into a Promise (since we aren't using the 'promises' sub-module)
const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

/**
 * SUB-MENU: Book Management
 */
async function bookMenu() {
  let back = false;
  while (!back) {
    console.clear();
    console.log("--- BOOK MANAGEMENT ---");
    console.log("1. List All Books");
    console.log("2. Back to Main Menu");

    const choice = (await ask("\nSelection: ")).trim();

    if (choice === '1') {
      console.log("\nInventory:");
      libraryData.books.forEach(b => console.log(`- ${b.title}`));
      await ask("\nPress Enter to continue...");
    } else if (choice === '2') {
      back = true;
    }
  }
}

/**
 * MAIN MENU
 */
async function mainMenu() {
  let running = true;
  while (running) {
    console.clear();
    console.log("=== MAIN MENU ===");
    console.log("1. Books");
    console.log("2. Exit");

    const choice = (await ask("\nSelection: ")).trim();

    switch (choice) {
      case '1':
        bookMenu();
        break;
      case '2':
        console.log("Closing...");
        running = false;
        rl.close();
        break;
      default:
        await ask("Invalid choice. Press Enter to try again.");
    }
  }
}

mainMenu();