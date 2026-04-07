// Data Structure ideals for a cloth shop
// Cloth:
+ Barcode:
    - static initialValue

    + newBarcode(): string

+ Cloth:
    - static instanceCount
    - designName
    - barcode
    - color
    - size
    - material

+ Shop:
    - cloths: Map< barcode, Cloth >
    - transactionLogs: Map< date, TransactionLog[] >
    - archived: ArchiveSpace;
    - staffs: Staff[]
    - shopInformation: { name, phone, location }
    - owner: Staff

    + searchClothBy(): Cloth[]
    + countClothBy(): number
    + addCloth()
    + removeCloth() // Move the cloth instance to archived database
    + restockCloth()
    + sellCloth()

    + addStaff()
    + searchStaffBy(): Staff

+ Staff:
    - static instanceCount
    - name
    - gender
    - citizenID
    - dayOfBirth
    - staffID
    - workingShift: StaffLog[]

    + calculateWorkingTime(): number

+ Receipt:
    - id
    - cloths: Cloth[]
    - estimatePayment
    - totalPayment
    - change
    - discount
    - date
    - time
    - staffID

+ TransactionLog:
    - id
    - date
    - time
    - type: 'SELL' | 'RESTOCK'
    - items: Cloth[]
    - totalPrice

+ StaffLog:
    - id
    - date
    - time
    - description

+ ArchiveSpace:
    - cloths: Map < barcode, Cloth >
    - receipts: Map < date, Receipt >