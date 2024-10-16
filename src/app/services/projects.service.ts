import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, updateDoc, query, where, docData } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private firestore: Firestore, private functions: Functions) { }

  addProject(project: any) {
    const projectRef = collection(this.firestore, 'projects')
    return addDoc(projectRef, project)
  }

  getProject(id: string): Observable<Project>{
    const projectRef = doc(this.firestore, `projects/${id}`)
    const project = docData(projectRef, {idField: 'id'})
    return project as Observable<Project>
  }

  getProjects(uid: string | undefined): Observable<Project[]>{
    if (uid) {
      const projectRef = collection(this.firestore, 'projects')
      const q = query(projectRef, where('uid', '==', uid))
      const projects = collectionData(q, {idField: 'id'})
      return projects as Observable<Project[]>
    }
    const projectRef = collection(this.firestore, 'projects')
    const projects = collectionData(projectRef, {idField: 'id'})
    return projects as Observable<Project[]>
  }

  updateProject(project: Project) : Promise<void>{
    const projectRef = doc(this.firestore, `projects/${project.getId}`)
    const p = {...project}
    delete p.id 
    return updateDoc(projectRef, p)
  }

  deleteProject(project: Project) : Promise<unknown>{
    return httpsCallable(this.functions, 'deleteProject')({id: project.getId})
  }

  approveProject(project: Project) : Promise<unknown>{
    return httpsCallable(this.functions, 'approveProject')({id: project.getId})
  }

  nonApproveProject(project: Project) : Promise<unknown>{
    return httpsCallable(this.functions, 'nonApproveProject')({id: project.getId})
  }

  publishProject(project: Project) : Promise<unknown>{
    return httpsCallable(this.functions, 'publishProject')({id: project.getId})
  }

  sendEmail(project: Project, type: string) : Promise<unknown>{
    return httpsCallable(this.functions, 'sendEmail')({id: project.getId, typeEmail: type})
  }

  addReviewMeeting(project: Project, meeting: any, type: string) : Promise<unknown>{
    // Se elimina esta referencia que se encuentra almacenada en la base de datos, porque al momento de actualizar el documento, se genera un error de que el objeto enviado es muy grande
    delete meeting.meetingRef
    console.log(meeting)
    return httpsCallable(this.functions, 'addReviewMeeting')({id: project.getId, type: type, ...meeting})
  }

  confirmAssistance(meetingId: string) : Promise<unknown>{
    return httpsCallable(this.functions, 'confirmAssistance')({id: meetingId})
  }

  requestsForAdvice() : Promise<unknown>{
    return httpsCallable(this.functions, 'requestsForAdvice')()
  }
}
