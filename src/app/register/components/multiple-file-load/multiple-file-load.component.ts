import { Component, Input } from '@angular/core';
import { Project } from 'src/app/models/project';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from '@angular/fire/storage';
import { ProjectsService } from 'src/app/services/projects.service';
import { Timestamp } from 'firebase/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectDocumentsService } from 'src/app/services/project-documents/project-documents.service';
import { ProjectDocument } from 'src/app/models/document';
import { ShowAlertService } from 'src/app/services/show-alert/show-alert.service';

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

  // Tipo de archivo
  @Input()
  typeFile?: string;

  // Tipo de operación que se va a hacer con el archivo
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

  @Input()
  projectDocument?: ProjectDocument;

  observation: string = "";
  documents!: string[];
  formObservations: FormGroup = new FormGroup({
    observations: new FormControl('', Validators.nullValidator)
  })

  newDocument: boolean = false
  loading: boolean = false
  oldMethod: boolean = false

  constructor(private storage: Storage, private projectService: ProjectsService, private documentService: ProjectDocumentsService, private alertService: ShowAlertService) { }

  updateObservation(): void {
    this.loading = true

    if (this.oldMethod) {
      if (!this.project.documents[this.typeDocument]) 
        return
      
      this.project.documents[this.typeDocument].observation = this.formObservations.get('observations')?.value
      this.projectService.updateProject(this.project)
          .then(() => this.alertService.showAlert('!Se ha solicitado correcciones!'))
          .finally(() => this.loading = false)
    }

    else {
      if (!this.projectDocument) 
        return

      this.projectDocument.observation = this.formObservations.get('observations')?.value
      this.documentService.updateProjectDocument(this.projectDocument, this.project.getId)
          .then(() => this.alertService.showAlert('!Se ha solicitado correcciones!'))
          .finally(() => this.loading = false)
    }
  }

  async uploadPDF (event: Event){
    this.loading = true

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

    getDownloadURL(pdfRef)
      .then(url => {  
        if (this.oldMethod) {
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
        }
        else {
          
          
          if (!this.projectDocument) {
            this.projectDocument = new ProjectDocument(
              "Pendiente", this.observation, [url], Timestamp.now(), this.typeDocument, this.project.uid
            )
            
            this.documentService.addProjectDocument(this.projectDocument, this.project.getId)
              .catch(e => console.log(e));
          }

          else {
            this.projectDocument.documents.push(url)
            this.projectDocument.setDateNow = Timestamp.now()
            this.projectDocument.status = "Pendiente"
            this.projectDocument.observation = this.observation

            if (this.newDocument){
              this.documentService.addProjectDocument(this.projectDocument, this.project.getId)
                  .then(() => this.alertService.showAlert('¡Documento subido correctamente!'))
              this.newDocument = false
            } else {
              this.documentService.updateProjectDocument(this.projectDocument, this.project.getId)
                  .then(() => this.alertService.showAlert('¡Documento subido correctamente!'))
            }
            this.documents = this.projectDocument.documents
          }
        }
      })
      .catch()
      .finally(() => this.loading = false)

    input.value = ''
  }

  async deletePDF(url: string){
    this.loading = true

    const urlParts = url.split('/') 
    const filePath = urlParts[urlParts.length - 1].split('?')[0].replaceAll('%2F', '/')

    const pdfRef = ref(this.storage, filePath);
    await deleteObject(pdfRef)
        
        .finally(() => this.loading = false)
  }

  getFileName(url: string): string {
    const urlParts = url.split('/') 
    const filePath = urlParts[urlParts.length - 1].split('?')[0]
    const fileName = filePath.split('%2F')[filePath.split('%2F').length - 1]
    return fileName.replaceAll('%20', ' ')
  }

  ngOnChanges(): void {
    if (this.oldMethod && this.project.documents) {
      if (!this.project.documents[this.typeDocument]) 
        this.project.documents[this.typeDocument] = {documents: [], observation: ""}

      this.observation = this.project.documents[this.typeDocument].observation
      this.formObservations.get('observations')?.setValue(this.observation)
      this.documents = this.project.documents[this.typeDocument].documents

      if(this.project.documents[this.typeDocument]. status == 'Aceptado') {
        this.formObservations.disable()
      }
    }
    else {
      if (this.projectDocument) {
        console.log(this.projectDocument);
        
        this.observation = this.projectDocument.observation
        this.formObservations.get('observations')?.setValue(this.observation)
        this.documents = this.projectDocument.documents

        if(this.projectDocument.status == 'Aceptado') {
          this.formObservations.disable()
        }
      } else if (this.operation == "upload"){
        this.newDocument = true

        this.projectDocument = new ProjectDocument(
          "Pendiente",
          "",
          [],
          Timestamp.now(),
          this.typeDocument,
          this.project.uid
        )
      }
    }
  }
}
