import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Message } from '../models/message';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  messagesCache: any = null

  constructor(private firestore: Firestore) { }

  addMessage(message: Message){
      const messageRef = collection(this.firestore, 'messages')
      return addDoc(messageRef, message)
  }

  getMessages(): Observable<Message[]>{
    if(this.messagesCache){
      return this.messagesCache as Observable<Message[]>;
    } else{
      const certificationRef = collection(this.firestore, 'messages')
      this.messagesCache = collectionData(certificationRef)
      return this.messagesCache as Observable<Message[]>
    }
  }
}
