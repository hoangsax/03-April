import { getDate, getTime } from "./utils.ts";

class StaffLog {
    static instanceCount = 0;
    id: number;
    date: string;
    time: string;
    description: string;

    constructor(description: string) {
        this.id = StaffLog.instanceCount++;
        this.date = getDate();
        this.time = getTime();
        this.description = description;
    }
}

export { StaffLog };