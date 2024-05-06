import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, updateDoc, query, where, docData } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  projectCache: any = null

  constructor(private firestore: Firestore, private functions: Functions) { }

  addProject(project: any) {
    const projectRef = collection(this.firestore, 'patents')
    return addDoc(projectRef, project)
  }

  getProject(id: string): Observable<Project>{
    const projectRef = doc(this.firestore, `patents/${id}`)
    const project = docData(projectRef, {idField: 'id'})
    return project as Observable<Project>
  }

  getProjects(uid: string | undefined): Observable<Project[]>{
    if(this.projectCache){
      return this.projectCache as Observable<Project[]>
    }
    
    if (uid) {
      const projectRef = collection(this.firestore, 'patents')
      const q = query(projectRef, where('uid', '==', uid))
      const projects = collectionData(q, {idField: 'id'})
      this.projectCache = projects
      return projects as Observable<Project[]>
    }
    const projectRef = collection(this.firestore, 'patents')
    const projects = collectionData(projectRef, {idField: 'id'})
    this.projectCache = projects
    return projects as Observable<Project[]>
  }

  updateProject(project: Project) : Promise<void>{
    const projectRef = doc(this.firestore, `patents/${project.getId}`)
    const p = {...project}
    delete p.id 
    console.log(p)
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
}
