import { getDate, getTime } from "./utils.ts";

export class StaffLog {
    static instanceCount = 0;
    id: number;
    staffID: number;
    date: string;
    time: string;
    type: 'START' | 'END';
    note?: string;

    constructor(staffID: number, type: 'START' | 'END', note?: string) {
        this.id = StaffLog.instanceCount++;
        this.staffID = staffID;
        this.date = getDate();
        this.time = getTime();
        this.type = type;
        this.note = note;
    }
}