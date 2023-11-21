import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, updateDoc, query, where, getDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  projectCache: any = null

  constructor(private firestore: Firestore) { }

  addProject(project: any) {
    const projectRef = collection(this.firestore, 'patents')
    return addDoc(projectRef, project)
  }

  async getProject(id: string){
    /*const projectRef = collection(this.firestore, 'patents')
    let q = query(projectRef, where('id', '==', id))
    return collectionData(q) as Observable<Project[]>;*/

    const projectRef = doc(this.firestore, `patents/${id}`)
    const project = (await getDoc(projectRef)).data() as Project
    project['id'] = id
    return project
  }

  getProjects(): Observable<Project[]>{
    if(this.projectCache){
      return this.projectCache as Observable<Project[]>
    }
    
    const projectRef = collection(this.firestore, 'patents')
    const projects = collectionData(projectRef, {idField: 'id'})
    this.projectCache = projects
    return projects as Observable<Project[]>
  }

  deleteProject(project: Project) : Promise<void>{
    const projectRef = doc(this.firestore, `patents/${project.getId}`)
    return deleteDoc(projectRef)
  }

  updateProject(project: Project) : Promise<void>{
    const projectRef = doc(this.firestore, `patents/${project.getId}`)
    return updateDoc(projectRef, {...project})
  }
}
