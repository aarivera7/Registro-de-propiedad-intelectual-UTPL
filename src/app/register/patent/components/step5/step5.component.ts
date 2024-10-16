import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectDocument } from 'src/app/models/document';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectDocumentsService } from 'src/app/services/project-documents/project-documents.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { ShowAlertService } from 'src/app/services/show-alert/show-alert.service';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.css']
})
export class Step5Component {
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

  nameDocuments: string[] = [
    "Copias de cédulas y certificado de votación a color",
    "Certificado docentes y estudiantes UTPL",
    "Certificado de autores",
    "Datos de autores",
    "Memorias descriptivas",
  ]
  
  typeDocuments: string[] = [
    "idDocuments",
    "teacherStudentCertificate",
    "authorsCertificate",
    "dataAuthors",
    "descriptiveMemories",
  ]

  subscriptionDocuments!: Subscription;

  loading: boolean = false
  oldMethod: boolean = false
  
  document!: ProjectDocument
  documents: ProjectDocument[] = []
  documentsView: any = {}

  constructor(private router: Router,
    private projectService: ProjectsService,
    private documentsService: ProjectDocumentsService, 
    private alertService: ShowAlertService) { }

  isApprovable(): boolean {
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
        }
      });
      this.projectService.updateProject(this.project)
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
          
          updateDocuments.push(document)
        }
        
      })
      this.documentsService.updateDocuments(updateDocuments, this.project.getId)
          .then(() => this.alertService.showAlert('!Se ha actualizado los cambios!'))
          .finally(() => this.loading = false)
    }

  }

  redirectUpdateDocuments(typeDocument: string, operation: string){
    this.router.navigate([`/${this.project.type}_form/${this.project.getId}/5/${typeDocument}/${operation}`])
  }

  getTitle(typeDocument: string): string{
    return this.nameDocuments[this.typeDocuments.indexOf(typeDocument)]
  }

  async approve(): Promise<void> {
    this.loading = true

    if(this.isApprovable()){
      this.project.approveStep5 = true
      this.project.numStep = 6
      await this.projectService.updateProject(this.project);

      this.projectService.sendEmail(this.project, "approved-step5")
          .then(() => this.alertService.showAlert('!Bien, se puede continuar al siguiente paso!'))
          .catch(err => console.log(err))
    }

    this.loading = false
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
      this.subscriptionDocuments = this.documentsService.getProjectsDocuments(this.project.getId).subscribe(documents => {
     
        if (this.typeDocument){
          this.document = documents.find(doc => doc.type == this.typeDocument)!
        }

        this.documents = documents
        
        this.typeDocuments.forEach(typeDocument => {
          let document = documents.find(doc => doc.type == typeDocument)
          
          if (document){
            this.formStatus.addControl(typeDocument, new FormControl(document.status))
            this.formStatus.addControl(`${typeDocument}Observation`, new FormControl({value: document.observation, disabled: document.status == "Aceptado"}))
            if (document.status != "Aceptado"){
              this.formStatus.get(`${typeDocument}Observation`)?.enable()
            }

            this.documentsView[typeDocument] = document
            
          } else {
            this.formStatus.addControl(typeDocument, new FormControl("Pendiente"))
            this.formStatus.addControl(`${typeDocument}Observation`, new FormControl({value: "", disabled: true}))
            this.documentsView[typeDocument] = null
          }
        })        
      })
    }

    if (this.project.approveStep5) {
      this.formStatus.disable()
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptionDocuments) {
      this.subscriptionDocuments.unsubscribe()
    }
  }
}
