import { BorrowLog } from "./borrowlog.ts";
import { SystemLog } from "./systemlog.ts";
import { calculateTotalTimeBetween, getDate } from "./utils.ts";

type peopleChangableField = 
    "name" |
    "DOB" |
    "gender" |
    "citizenID";

class People {
    name: string;
    DOB: string;
    gender: string;
    citizenID: number;
    createDate: string = getDate();
    constructor(name: string, DOB: string, gender: string, citizenID: number) {
        this.name = name;
        this.DOB = DOB;
        this.gender = gender;
        this.citizenID = citizenID;
    }

    changeInfoOnField(field: peopleChangableField, value: string | number) {
        if (field === "name" || field === "DOB" || field === "gender") {
            this[field] = value as string;
        }
        else if (field === "citizenID") {
            this[field] = value as number;
        }
    }
}

class Member extends People {
    static numberOfMember = 0;
    readonly ID: number;
    pendingBorrowLogID: number[] = [];
    constructor(name: string, DOB: string, gender: string, citizenID: number) {
        super(name, DOB, gender, citizenID);
        this.ID = Member.numberOfMember++;
    }

    addPendingBorrowLog(logID: number) {
        this.pendingBorrowLogID.push(logID);
    }

    removePendingBorrowLog(logID: number): Boolean {
        const index = this.pendingBorrowLogID.indexOf(logID);
        if (index !== -1) {
            this.pendingBorrowLogID.splice(index, 1);
            return true;
        }
        return false;
    }
}

enum shiftStatus {
    "start",
    "end"
}

class Librarian extends People {
    static numberOfLibrarian = 0;
    readonly ID: number;
    workingShiftLog = new Map<number, shiftStatus>();
    workingTimeInSeconds: number = 0;
    constructor(name: string, DOB: string, gender: string, citizenID: number) {
        super(name, DOB, gender, citizenID);
        this.ID = Librarian.numberOfLibrarian++;
    }

    addShiftLog(logID: number, status: "start" | "end") {
        this.workingShiftLog.set(logID, shiftStatus[status]);
    }

    resetShiftLog() {
        this.workingShiftLog = new Map<number, shiftStatus>();
    }

    calculateTimeWorkingInSeconds(startLog: SystemLog, endLog: SystemLog) {
        let timeDiffInSeconds = calculateTotalTimeBetween(startLog.getTime(), endLog.getTime());
        this.workingTimeInSeconds += timeDiffInSeconds;
    }

    resetWorkingTime() {
        this.workingTimeInSeconds = 0;
    }

    getLastShiftIDWithStatus(status: "start" | "end"): number {
        let offset = 0;
        if (this.workingShiftLog.size > 0) {
            if (Array.from(this.workingShiftLog.values()).pop() !== shiftStatus[status]) {
                offset = 1;
            }
            if (offset) {
                return Array.from(this.workingShiftLog.keys())[this.workingShiftLog.size - 1 - offset];
            }
            return Array.from(this.workingShiftLog.keys())[this.workingShiftLog.size - 1];
        }
        return -1;
    }
}

export { Member, Librarian };