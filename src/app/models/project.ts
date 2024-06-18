import { Timestamp } from "firebase/firestore"

export class Project{
    id?: string
    private name: string = ""
    uid: String
    nameAuthor: String
    private createDate: Timestamp
    description: String
    type: string
    keywords!: string;
    tentativeTitle?: String;
    summary?: String;
    numStep?: number;
    status?: string;
    finalReviewMeeting: any
    documents: any
    contract: any
    legalizedContract: any
    application: any
    approveStep1!: boolean
    approveStep2!: boolean
    approveStep5!: boolean
    publish!: boolean
    progressReviewMeeting: any;

    constructor(name: string, uid:String, nameAuthor:String, description: String, create_date: string, type: string){
        this.name = name
        this.uid = uid
        this.nameAuthor = nameAuthor
        this.createDate = Timestamp.fromMillis(0)
        this.description = description
        this.type = type
    }

    public get getId() : string {
        return this.id == undefined ? "" : this.id
    }

    public get getCreateDate() : Date {
        return this.createDate.toDate()
    }

    public get getName() : string {
        return this.name
    }

    public get getDescription() : String {
        return this.description
    }

    public set setKeywords(value: string) {
        this.keywords = value;
    }

    public set setTentativeTitle(value: String) {
        this.tentativeTitle = value;
    }

    public set setSummary(value: String) {
        this.summary = value;
    }
}
