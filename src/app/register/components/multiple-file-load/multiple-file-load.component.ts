import { Component, Input } from '@angular/core';
import { Project } from 'src/app/models/project';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from '@angular/fire/storage';
import { ProjectsService } from 'src/app/services/projects.service';
import { Timestamp } from 'firebase/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { list } from 'firebase/storage';

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

  @Input()
  rol: string = "user";

  observation: string = "";
  documents!: string[];
  formObservations: FormGroup = new FormGroup({
    observations: new FormControl('', Validators.nullValidator)
  })

  constructor(private storage: Storage, private projectService: ProjectsService) { }

  updateObservation(): void {
    if (!this.project.documents[this.typeDocument]) 
      return
    
    this.project.documents[this.typeDocument].observation = this.formObservations.get('observations')?.value
    this.projectService.updateProject(this.project)
  }

  async uploadPDF (event: Event){
    const input: HTMLInputElement = event.target as HTMLInputElement

    if (!input.files) return
    
    const listFiles = await listAll(ref(this.storage, `projects/${this.project.type}/${this.project.getId}/${this.typeDocument}`))

    const file: File = input.files[0];

    let addName = ""
    while (listFiles.items.filter((fileRef) => fileRef.name === (file.name + addName)).length > 0) {
      addName += "1"
    }
    const fileNameSplit = file.name.split('.')

    const idxStart = fileNameSplit.length - 2
    const idxEnd = fileNameSplit.length - 1

    let fileName = fileNameSplit[idxStart] + addName + '.' + fileNameSplit[idxEnd]

    const pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/${this.typeDocument}/${fileName}`);

    await uploadBytesResumable(pdfRef, file);

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
    const filePath = urlParts[urlParts.length - 1].split('?')[0].replaceAll('%2F', '/')

    const pdfRef = ref(this.storage, filePath);
    await deleteObject(pdfRef)
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
      this.formObservations.get('observations')?.setValue(this.observation)
      this.documents = this.project.documents[this.typeDocument].documents
    }
  }
}
