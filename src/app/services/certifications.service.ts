import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, query, where, updateDoc } from '@angular/fire/firestore';
import { Certification } from '../models/certification';
import { Observable } from 'rxjs';
import { doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CertificationsService {
  certificationsCache: any = null

  constructor(private firestore: Firestore) { }

  addCertification(certification: Certification){
      const certificationRef = collection(this.firestore, 'certifications')
      return addDoc(certificationRef, certification)
  }

  updateCertification(certification: any, id: string){
    const certificationRef = doc(this.firestore, '/certifications/'+id )
    return updateDoc(certificationRef, certification)
  }

  getCertifications(uid: undefined|string): Observable<Certification[]>{
    if(this.certificationsCache){
      return this.certificationsCache as Observable<Certification[]>;
    }

    if (uid) {
      const certificationRef = collection(this.firestore, 'certifications')
      const q = query(certificationRef, ('uid', '==', uid))
      const certifications = collectionData(q, {idField: 'id'})
      this.certificationsCache = certifications
      return certifications as Observable<Certification[]>
    }

    const certificationRef = collection(this.firestore, 'certifications')
    this.certificationsCache = collectionData(certificationRef, {idField: 'id'})
    return this.certificationsCache as Observable<Certification[]>
  }
}
