import { Component, Input } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Timestamp } from 'firebase/firestore';
import { Project } from 'src/app/models/project';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component {
  @Input() 
  project!: Project

  constructor(private storage: Storage, private projectService: ProjectsService) { }

  uploadPDF (input: HTMLInputElement){
    if (!input.files) return
    
    const file: File = input.files[0];
    const pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/descriptiveMemories/${file.name}`);
    
    getDownloadURL(uploadBytesResumable(pdfRef, file).snapshot.ref).then(url => {  
      this.project.documents['descriptiveMemories'].documents.push(url)
    }).catch();
    this.project.numStep = 3
    this.project.documents['descriptiveMemories'].status = "Pendiente"
    this.project.documents['descriptiveMemories'].date = Timestamp.now()
    this.projectService.updateProject(this.project)
  }
}
