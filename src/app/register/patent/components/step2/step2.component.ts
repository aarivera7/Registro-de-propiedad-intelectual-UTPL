import { Component, Input } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL, updateMetadata } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { ProjectDocument } from 'src/app/models/document';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectDocumentsService } from 'src/app/services/project-documents/project-documents.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { ShowAlertService } from 'src/app/services/show-alert/show-alert.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component {
  @Input() 
  project!: Project
  url: string = ""
  formObservations: FormGroup = new FormGroup({
    observations: new FormControl('', Validators.nullValidator)
  })

  projectDocument?: ProjectDocument
  subscriptionDocument!: Subscription

  loading: boolean = false
  oldMethod: boolean = false

  @Input()
  user?: User

  constructor(private storage: Storage, private projectService: ProjectsService, private documentService: ProjectDocumentsService, private alertService: ShowAlertService) { }

  async uploadPDF (input: HTMLInputElement): Promise<void> {
    if (!input.files) return

    this.loading = true
    
    const file: File = input.files[0];
    const pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/descriptiveMemories/descriptiveMemories_${this.project.getId}.pdf`);

    await updateMetadata(pdfRef, {customMetadata: {isReplaced: 'true'}});
    
    const task = await uploadBytesResumable(pdfRef, file)

    this.url = await getDownloadURL(task.ref)

    if (this.oldMethod) {

      if(!this.project.documents)
        this.project.documents = {}

      if(!this.project.documents['descriptiveMemories'])
        this.project.documents['descriptiveMemories'] = {}

      if(!this.project.documents['descriptiveMemories'].documents)
        this.project.documents['descriptiveMemories'].documents = []

      const idx = this.project.documents['descriptiveMemories'].documents.findIndex((doc: string) => doc == this.url)
      this.project.documents['descriptiveMemories'].documents[idx == -1 ? 0 : idx] = this.url
      this.project.documents['descriptiveMemories'].status = "Pendiente"
      this.project.documents['descriptiveMemories'].date = Timestamp.now()
      this.project.documents['descriptiveMemories'].observation = ""
      this.projectService.updateProject(this.project)
          .finally(() => this.loading = false)
    } else {

      if (!this.projectDocument) {
        this.projectDocument = new ProjectDocument(
          "Pendiente",
          "",
          [this.url],
          Timestamp.now(),
          "descriptiveMemories", 
          this.project.uid
        )
      }
      else {
        const idx = this.projectDocument!.documents.findIndex((doc: string) => doc == this.url)
        
        this.projectDocument.documents[idx == -1 ? 0 : idx] = this.url
        this.projectDocument.setDateNow = Timestamp.now()
      }
      this.documentService.addProjectDocument(this.projectDocument, this.project.getId)
          .then(() => this.alertService.showAlert("¡Documento subido correctamente!"))
          .catch(err => console.log(err))
          .finally(() => this.loading = false)
    }
  }

  async approve(): Promise<void> {
    this.loading = true
    if (this.oldMethod) {
      this.project.documents['descriptiveMemories'].status = "Aceptado"
      this.project.documents['descriptiveMemories'].observation = this.formObservations.get('observations')?.value
      await this.projectService.updateProject(this.project)
    }
    else {
      const projectDocument = {
        type: "descriptiveMemories",
        status: "Aceptado",
        observation: this.formObservations.get('observations')?.value
      }

      this.project.approveStep2 = true

      await this.documentService.updateProjectAndDocument(projectDocument, this.project)
    }
    this.projectService.sendEmail(this.project, "approved-step2")
        .then(() => this.alertService.showAlert('¡Documentos aprobados exitosamente!'))
        .catch(err => console.log(err))
        .finally(() => this.loading = false)
  }

  updateObservations(): void {
    this.loading = true
    if (this.oldMethod) {
      this.project.documents['descriptiveMemories'].observation = this.formObservations.get('observations')?.value
      this.projectService.updateProject(this.project).finally(() => this.loading = false)
    } else {
      this.documentService.updateProjectDocument(
        {
          type: "descriptiveMemories",
          observation: this.formObservations.get('observations')?.value
        }, 
        this.project.getId
      )   .then(() => this.alertService.showAlert('¡Observaciones actualizadas exitosamente!'))
          .finally(() => this.loading = false);
    }
  }

  async ngOnChanges(): Promise<void> {
    if (this.oldMethod) {
      if(this.project.documents && this.project.documents['descriptiveMemories']){
        this.formObservations.get('observations')?.setValue(this.project.documents['descriptiveMemories'].observation)
        if (this.project.documents['descriptiveMemories'].documents) {
          const pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/descriptiveMemories/descriptiveMemories_${this.project.getId}.pdf`)
          this.url = await getDownloadURL(pdfRef);
        }
      }
      if (this.project.documents && this.project.documents['descriptiveMemories'] && this.project.documents['descriptiveMemories'].status == "Aceptado") {
        this.formObservations.get('observations')?.disable()
      }
    }
    else {
      this.subscriptionDocument = this.documentService.getProjectDocument(this.project.getId, "descriptiveMemories")
          .subscribe((projectDocument) => {
            if (projectDocument) {
              this.formObservations.get('observations')?.setValue(projectDocument.observation)
              if (projectDocument.documents) {
                this.url = projectDocument.documents[0]
              }

              this.projectDocument = projectDocument
            }
            if (projectDocument && projectDocument.status == "Aceptado") {
              this.formObservations.get('observations')?.disable()
            }
          });
    }
  }

  ngOnDestroy(): void {
    this.subscriptionDocument.unsubscribe()
  }
}
