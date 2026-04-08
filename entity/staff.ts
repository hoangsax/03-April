import { StaffLog } from "./staff-log.ts";

export interface StaffPublicData {
    id: number;
    name: string;
    gender: string;
    citizenID: string;
    dayOfBirth: string;
    workingShift: StaffLog[];
}

export class Staff {
    static instanceCount = 0;
    id: number ;
    name: string ;
    gender: string ;
    citizenID: string ;
    dayOfBirth: string ;

    constructor(name: string, gender: string, citizenID: string, dayOfBirth: string) {
        this.id = Staff.instanceCount++;
        this.name = name;
        this.gender = gender;
        this.citizenID = citizenID;
        this.dayOfBirth = dayOfBirth;
    }
}
