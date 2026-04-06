class SystemLog {
    static numberOfLog = 0;
    readonly ID: number;
    EmployeeID: number;
    Time: string;
    Date: string;
    Note: string;
    
    constructor(EmployeeID: number, Time: string, Date: string, Note: string) {
        this.ID = SystemLog.numberOfLog++;
        this.EmployeeID = EmployeeID;
        this.Time = Time;
        this.Date = Date;
        this.Note = Note;
    }

    getTime() {
        return this.Time;
    }
}

export { SystemLog };