import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Certification } from '../models/certification';
import { Observable } from 'rxjs';

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

  getCertifications(): Observable<Certification[]>{
    if(this.certificationsCache){
      return this.certificationsCache as Observable<Certification[]>;
    } else{
      const certificationRef = collection(this.firestore, 'certifications')
      this.certificationsCache = collectionData(certificationRef)
      return this.certificationsCache as Observable<Certification[]>
    }
  }
}
