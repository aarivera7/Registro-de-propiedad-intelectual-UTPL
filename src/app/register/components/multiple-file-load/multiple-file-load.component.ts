import { Component, Input } from '@angular/core';
import { Project } from 'src/app/models/project';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { ProjectsService } from 'src/app/services/projects.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-multiple-file-load',
  templateUrl: './multiple-file-load.component.html',
  styleUrls: ['./multiple-file-load.component.css']
})
export class MultipleFileLoadComponent {
  @Input()
  title?: string;

  @Input()
  description?: string;

  @Input()
  type?: string;

  @Input()
  typeDocument!: string;

  @Input()
  project!: Project;

  @Input()
  observation?: string;
  documents!: string[];

  constructor(private storage: Storage, private projectService: ProjectsService) { }

  async uploadPDF (input: HTMLInputElement){
    if (!input.files) return
    
    const file: File = input.files[0];
    let pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/${this.typeDocument}/${file.name}`);

    await uploadBytesResumable(pdfRef, file).then(task => {
      pdfRef = task.ref
    }).catch();

    getDownloadURL(pdfRef).then(url => {  
      console.log(url)
      this.project.documents[this.typeDocument].documents.push(url) 
      this.project.documents[this.typeDocument].date = Timestamp.now() 
      this.project.documents[this.typeDocument].status = "Pendiente"
      this.project.numStep = 5
      this.projectService.updateProject(this.project)
      this.documents = this.project.documents[this.typeDocument].documents
    }).catch()
  }

  ngOnInit(): void {
    if (this.project.documents[this.typeDocument] == undefined) 
      this.project.documents[this.typeDocument] = {date: null, documents: [], status: "", observation: this.observation}
    this.documents = this.project.documents[this.typeDocument].documents
  }
}
