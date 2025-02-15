import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Meeting } from 'src/app/models/meeting';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {

  constructor(private firestore: Firestore) { }

  getMeeting(id: string): Observable<Meeting>{
    const projectRef = doc(this.firestore, `meetings/${id}`)
    const project = docData(projectRef, {idField: 'id'})
    return project as Observable<Meeting>
  }

  getMeetings(uid: string | undefined): Observable<Meeting[]>{
    if (uid) {
      const projectRef = collection(this.firestore, 'meetings')
      const q = query(projectRef, where('uid', '==', uid))
      const projects = collectionData(q, {idField: 'id'})
      return projects as Observable<Meeting[]>
    }
    const projectRef = collection(this.firestore, 'meetings')
    const projects = collectionData(projectRef, {idField: 'id'})
    return projects as Observable<Meeting[]>
  }
}
