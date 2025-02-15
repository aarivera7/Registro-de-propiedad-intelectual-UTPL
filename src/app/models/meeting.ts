import { Timestamp, DocumentReference } from "@angular/fire/firestore";


export class Meeting {
    assistance!: boolean;
    date!: Date;
    id!: string;
    modality!: string;
    place!: string;
    project!: DocumentReference;
    projectId!: string;
    projectName!: string;
    timeFinish!: Timestamp;
    timeStart!: Timestamp;
    type!: string;
    uid!: string;
}