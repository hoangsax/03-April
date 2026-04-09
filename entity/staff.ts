import { StaffLog } from "./staff-log.ts";

export class Staff {
    static instanceCount = 0;
    id: number ;
    name: string ;
    gender: string ;
    citizenID: string ;
    dayOfBirth: string ;

    constructor(data: {name: string, gender: string, citizenID: string, dayOfBirth: string}) {
        let { name, gender, citizenID, dayOfBirth } = data
        this.id = Staff.instanceCount++;
        this.name = name;
        this.gender = gender;
        this.citizenID = citizenID;
        this.dayOfBirth = dayOfBirth;
    }
}
