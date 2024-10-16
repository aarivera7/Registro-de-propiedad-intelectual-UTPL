import { Timestamp } from "firebase/firestore"

export class ProjectDocument {
    status: string;
    observation: string;
    documents: string[];
    private date: Timestamp;
    type?: string;
    uid: string

    constructor(status: string, observation: string, documents: string[], date: Timestamp, type: string, uid: string) {
        this.status = status;
        this.observation = observation;
        this.documents = documents;
        this.date = date;
        this.type = type;
        this.uid = uid;
    }

    get getDate(): Date {
        return this.date.toDate();
    }

    set setDate(date: Date) {
        this.date = Timestamp.fromDate(date);
    }

    set setDateNow(date: Timestamp) {
        this.date = date;
    }
}
