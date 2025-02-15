import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore, updateDoc, setDoc, writeBatch } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ProjectDocument } from 'src/app/models/document';
import { Project } from 'src/app/models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectDocumentsService {

  constructor(private firestore: Firestore) { }

  addProjectDocument(projectDocument: ProjectDocument, id: string) {
    const projectDocumentRef = doc(this.firestore, `projects/${id}/documents/${projectDocument.type}`)
    
    const p = {...projectDocument}
    delete p.type
    
    return setDoc(projectDocumentRef, p)
  }

  getProjectDocument(id: string, type: string){
    const projectDocumentRef = doc(this.firestore, `projects/${id}/documents/${type}`)
    return docData(projectDocumentRef, {idField: 'type'}) as Observable<ProjectDocument>
  }

  getProjectsDocuments(id: string) {
    const documentRef = collection(this.firestore, `projects/${id}/documents`)
    const documents = collectionData(documentRef, {idField: 'type'})

    return documents as Observable<ProjectDocument[]>
  }

  // Only update the status of the document
  updateProjectDocument(
    projectDocument: ProjectDocument | {type: string, status?: string, observation?: string},
    id: string) : Promise<void>{
    const projectDocumentRef = doc(this.firestore, `projects/${id}/documents/${projectDocument.type}`)
    const p = {...projectDocument};
    delete p.type;

    
    return updateDoc(projectDocumentRef, p)
  }

  updateProjectAndDocument(
    projectDocument: ProjectDocument | {type: string, status?: string, observation?: string},
    project: Project) {
    const batch = writeBatch(this.firestore)

    const projectRef = doc(this.firestore, `projects/${project.getId}`)
    const p = {...project}
    delete p.id
    batch.update(projectRef, p)

    const projectDocumentRef = doc(this.firestore, `projects/${project.getId}/documents/${projectDocument.type}`)
    const pd = {...projectDocument}
    delete pd.type
    batch.update(projectDocumentRef, pd)

    return batch.commit()
  }

  updateDocuments(projectDocument: ProjectDocument[], id: string) : Promise<void>{
    projectDocument.forEach(doc => {
      this.updateProjectDocument(doc, id)
    })
    return Promise.resolve()
  }
}
