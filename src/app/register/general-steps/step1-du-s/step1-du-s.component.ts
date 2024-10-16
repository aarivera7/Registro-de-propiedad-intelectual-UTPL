import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { ProjectDocument } from 'src/app/models/document';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectDocumentsService } from 'src/app/services/project-documents/project-documents.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { ShowAlertService } from 'src/app/services/show-alert/show-alert.service';

@Component({
  selector: 'app-step1-du-s',
  templateUrl: './step1-du-s.component.html',
  styleUrls: ['./step1-du-s.component.css']
})
export class Step1DuSComponent {
  @Input()
  project!: Project

  @Input()
  typeDocument?: string

  @Input()
  operation?: string

  // Se coloca una instancia sin valores para que no de error ya que a veces tarda mucho en cargar los datos
  @Input()
  user: User = new User("", "",  "",   )

  formStatus!: FormGroup;

  @Input()
  nameDocuments!: string[]

  @Input()
  typeDocuments!: string[]

  loading: boolean = false
  oldMethod: boolean = false

  document!: ProjectDocument
  documents: ProjectDocument[] = []
  documentsView: any = {}
  showAlert = false;

  constructor(private router: Router,
      private projectsService: ProjectsService,
      private documentsService: ProjectDocumentsService,
      private alertService: ShowAlertService) { }


  isApprovable(): boolean{
    if (this.oldMethod) {
      return this.typeDocuments.filter(typeDocument =>
        this.project.documents[typeDocument] && this.project.documents[typeDocument].status == "Aceptado").length == this.typeDocuments.length
    }
    else {
      return this.documents.filter(doc => doc.status == "Aceptado").length == this.typeDocuments.length
    }
  }

  changeStatus(): void {
    this.loading = true

    if (this.oldMethod) {
      this.typeDocuments.forEach(typeDocument => {
        if(this.project.documents[typeDocument]){
          this.project.documents[typeDocument].status = this.formStatus.get(typeDocument)?.value
          this.project.documents[typeDocument].observation = this.formStatus.get(`${typeDocument}Observation`)?.value
          if (this.project.documents[typeDocument].status == "Aceptado"  && typeDocument == "sourceCode"){
            this.project.documents[typeDocument].date = Timestamp.now()
          }
        }
      });
      this.projectsService.updateProject(this.project)
        .then(() => this.alertService.showAlert('¡Documentos actualizados exitosamente!'))
        .finally(() => this.loading = false);
    }
    else {
      let updateDocuments: ProjectDocument[] = [];

      this.documents.forEach(document => {
        const status = this.formStatus.get(document.type!)?.value
        const observation = this.formStatus.get(`${document.type}Observation`)?.value

        if (document.status != status || document.observation != observation){
          document.status = status
          document.observation = observation

          if (document.status == "Aceptado" && document.type == "sourceCode"){
            document.setDateNow = Timestamp.now()
          }
          
          updateDocuments.push(document)
        }
        
      })
      this.documentsService.updateDocuments(updateDocuments, this.project.getId)
        .then(() => this.alertService.showAlert('¡Documentos actualizados exitosamente!'))
        .finally(() => this.loading = false)
    }
  }

  redirectUpdateDocuments(typeDocument: string, operation: string){
    this.router.navigate([`/${this.project.type}_form/${this.project.getId}/1/${typeDocument}/${operation}`])
  }

  getTitle(typeDocument: string): string{
    return this.nameDocuments[this.typeDocuments.indexOf(typeDocument)]
  }

  async approve(): Promise<void> {
    this.loading = true

    if(this.isApprovable()){
      this.project.approveStep1 = true
      this.project.numStep = 2
      await this.projectsService.updateProject(this.project);

      this.projectsService.sendEmail(this.project, "approved-step1")
          .then(() => this.alertService.showAlert('¡Documentos aprobados exitosamente!'))
          .catch(err => console.log(err))
          .finally(() => this.loading = false)
    }
  }

  ngOnChanges(): void {
    this.formStatus = new FormGroup({})

    if (this.oldMethod) {
      this.typeDocuments.forEach(typeDocument => {
        if (this.project.documents){
          if (this.project.documents[typeDocument]){
            this.formStatus.addControl(typeDocument, new FormControl(this.project.documents[typeDocument].status))
            this.formStatus.addControl(`${typeDocument}Observation`, new FormControl(this.project.documents[typeDocument].observation))
          } else {
            this.formStatus.addControl(typeDocument, new FormControl("Pendiente"))
            this.formStatus.addControl(`${typeDocument}Observation`, new FormControl({value: "", disabled: true}))
          }
        }
      })
    }
    
    else {
      this.documentsService.getProjectsDocuments(this.project.getId).subscribe(documents => {
        if (this.typeDocument){
          this.document = documents.find(doc => doc.type == this.typeDocument)!
        }
        
        this.documents = documents
        
        this.typeDocuments.forEach(typeDocument => {
          let document = documents.find(doc => doc.type == typeDocument)
          
          if (document){
            this.formStatus.addControl(typeDocument, new FormControl(document.status))
            this.formStatus.addControl(`${typeDocument}Observation`, new FormControl({value: document.observation, disabled: document.status == "Aceptado"}))
            this.documentsView[typeDocument] = document
          } else {
            this.formStatus.addControl(typeDocument, new FormControl("Pendiente"))
            this.formStatus.addControl(`${typeDocument}Observation`, new FormControl({value: "", disabled: true}))
          }
        })
      })
      
    }
    

    if (this.project.approveStep1) {
      this.formStatus.disable()
    }
  }
}
