import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytesResumable, UploadTask } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

  constructor(private storage: Storage) { }

  uploadFile (file: File, url: string):UploadTask{
    const pdfRef = ref(this.storage, url);
    return uploadBytesResumable(pdfRef, file)
  }


}
