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
