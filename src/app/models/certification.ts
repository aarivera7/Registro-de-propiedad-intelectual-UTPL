import { Timestamp } from "firebase/firestore"

export class Certification {
    name: String
    realizedBy: String
    private registerDate: Timestamp
    private finishDate: Timestamp

    constructor (name: String, realizedBy: String, registerDate: string, finishedDate: string){
        this.name = name
        this.realizedBy = realizedBy
        this.registerDate = Timestamp.fromDate(new Date(registerDate))
        this.finishDate = Timestamp.fromDate(new Date(finishedDate))
    }

    public getRegisterDate(): Date  {
        return this.registerDate.toDate()
    }

    public getFinishDate(): Date {
        return this.finishDate.toDate()
    }
}