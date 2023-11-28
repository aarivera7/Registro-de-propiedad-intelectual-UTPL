import { Timestamp } from "firebase/firestore"

export class Project{
    id?: string
    private name: string = ""
    uid: String
    nameAuthor: String
    private createDate: Timestamp
    description: String
    type: String
    keywords!: string;
    tentativeTitle?: String;
    summary?: String;
    numStep?: number;
    status?: string;
    progressReviewMeeting: any
    finalReviewMeeting: any
    documents: any = {}
    contract: any = {}
    approveStep2: boolean = false

    constructor(name: string, uid:String, nameAuthor:String, description: String, create_date: string, type: String){
        this.name = name
        this.uid = uid
        this.nameAuthor = nameAuthor
        this.createDate = Timestamp.fromDate(new Date(create_date))
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