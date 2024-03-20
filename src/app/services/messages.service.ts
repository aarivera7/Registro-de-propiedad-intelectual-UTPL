import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Message } from '../models/message';
import { Observable } from 'rxjs';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { limit } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  messagesCache: any = null

  constructor(private readonly firestore: Firestore, private readonly functions: Functions) { }

  newResponse(response: string){
    return httpsCallable(this.functions, 'newResponse')(response);
  }

  newMessage(message: any){
    console.log(message);
    return httpsCallable(this.functions, 'newMessage')(message);
  }

  getMessages(uid: string | undefined): Observable<Message[]>{
    if(this.messagesCache){
      return this.messagesCache as Observable<Message[]>;
    } 

    if(uid){
      const messageRef = collection(this.firestore, 'messages')
      const q = query(messageRef, where('senderUID', '==', uid))
      this.messagesCache = collectionData(q, {idField: 'id'})
      return this.messagesCache as Observable<Message[]>
    }

    const messageRef = collection(this.firestore, 'messages')
    const q = query(messageRef, limit(10))
    this.messagesCache = collectionData(q, {idField: 'id'})
    return this.messagesCache as Observable<Message[]>
  }
}
