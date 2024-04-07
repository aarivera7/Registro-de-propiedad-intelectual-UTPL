import { Component, Input } from '@angular/core';
import { Project } from 'src/app/models/project';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject, updateMetadata, FullMetadata } from '@angular/fire/storage';
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
  numStep!: number;

  @Input()
  operation!: string;

  observation: string = "";
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
      if (!this.project.documents[this.typeDocument]) 
        this.project.documents[this.typeDocument] = {}

      if (!this.project.documents[this.typeDocument].documents) 
        this.project.documents[this.typeDocument].documents = []

      this.project.documents[this.typeDocument].documents.push(url) 
      this.project.documents[this.typeDocument].date = Timestamp.now() 
      this.project.documents[this.typeDocument].status = "Pendiente"
      this.project.numStep = this.numStep
      this.project.documents[this.typeDocument].observation = this.observation
      this.projectService.updateProject(this.project)
      this.documents = this.project.documents[this.typeDocument].documents
    }).catch()
    input.value = ''
  }

  async deletePDF(url: string){
    const urlParts = url.split('/') 
    const filePath = urlParts[urlParts.length - 1].split('?')[0].replace('%2F', '/')

    const pdfRef = ref(this.storage, filePath);
    await deleteObject(pdfRef).then(() => {
      this.project.documents[this.typeDocument].documents = this.project.documents[this.typeDocument].documents
          .filter((doc: string) => doc !== url)

      this.documents = this.project.documents[this.typeDocument].documents
    }).catch()
  }

  getFileName(url: string): string {
    const urlParts = url.split('/') 
    const filePath = urlParts[urlParts.length - 1].split('?')[0]
    const fileName = filePath.split('%2F')[filePath.split('%2F').length - 1]
    return fileName.replaceAll('%20', ' ')
  }

  ngOnChanges(): void {
    if (this.project.documents) {
      if (!this.project.documents[this.typeDocument]) 
        this.project.documents[this.typeDocument] = {documents: [], observation: ""}
      this.observation = this.project.documents[this.typeDocument].observation
      this.documents = this.project.documents[this.typeDocument].documents
    }
  }
}
