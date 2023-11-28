import { Component, Input } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Project } from 'src/app/models/project';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-step6',
  templateUrl: './step6.component.html',
  styleUrls: ['./step6.component.css']
})
export class Step6Component {
  @Input() 
  project!: Project

  constructor(private storage: Storage, private projectService: ProjectsService) { }

  uploadPDF (input: HTMLInputElement){
    if (!input.files) return
    
    const file: File = input.files[0];
    const pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/contract/${file.name}`);
    
    uploadBytesResumable(pdfRef, file).then(task => {
      getDownloadURL(task.ref).then(url => {  
        this.project.contract.document = url
        this.project.numStep = 6
        this.project.contract.status = "Pendiente"
        this.project.contract.date = Timestamp.now()
        this.projectService.updateProject(this.project)
      }).catch();
    });
  }
}
