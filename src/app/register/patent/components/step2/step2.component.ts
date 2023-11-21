import { Component, Input } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
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
  urlFile!: string

  constructor(private storage: Storage, private projectService: ProjectsService) { }

  uploadPDF (input: HTMLInputElement){
    if (!input.files) return
    
    const file: File = input.files[0];
    const pdfRef = ref(this.storage, `projects/${this.project.getId}/${this.project.type}_2_descriptive_memory.pdf`);
    uploadBytesResumable(pdfRef, file)
    getDownloadURL(ref(this.storage, `projects/${this.project.getId}/${this.project.type}_2_descriptive_memory.pdf`)).then(url => {  
      this.urlFile = url
    }).catch();
    this.project.numStep = 3
    this.projectService.updateProject(this.project)
  }

  ngOnInit(): void {
    getDownloadURL(ref(this.storage, `projects/${this.project.getId}/${this.project.type}_2_descriptive_memory.pdf`)).then(url => {  
      this.urlFile = url
    }).catch();
  }
}
