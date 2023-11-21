import { Timestamp } from "firebase/firestore"

export class Message{
    sender: String
    project: String
    subject: String
    content: String
    private date: Timestamp
    
    constructor (sender: String, project: String, subject: String, content: String, date: string) {
        this.sender = sender
        this.project = project
        this.subject = subject
        this.content = content
        this.date = Timestamp.fromDate(new Date(date))
    }

    
    public get dateMessage() : Date {
        return this.date.toDate()
    }
    
}