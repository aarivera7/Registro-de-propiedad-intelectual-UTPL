import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { di } from '@fullcalendar/core/internal-common';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';

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

  // Se coloca una instancia sin valores para que no de error ya que a veces tarda mucho en cargar los datos
  @Input()
  user: User = new User("", "",  "",   )

  formStatus!: FormGroup;

  nameDocuments: string[] = [
    "Copias de cédulas y certificado de votación a color",
    "Certificado docentes y estudiantes",
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

  isApprovable(): boolean{
    return this.typeDocuments.filter(typeDocument => this.project.documents[typeDocument].status == "Aceptado").length == this.typeDocuments.length
  }

  constructor(private router: Router, private projectsService: ProjectsService) { }

  changeStatus(): void {
    this.typeDocuments.forEach(typeDocument => {
      if(this.project.documents[typeDocument]){
        this.project.documents[typeDocument].status = this.formStatus.get(typeDocument)?.value
        this.project.documents[typeDocument].observation = this.formStatus.get(`${typeDocument}Observation`)?.value
      }
    });
    this.projectsService.updateProject(this.project);
  }

  redirectUpdateDocuments(typeDocument: string){
    this.router.navigate([`/${this.project.type}_form/${this.project.getId}/5/${typeDocument}`])
  }

  getTitle(typeDocument: string): string{
    return this.nameDocuments[this.typeDocuments.indexOf(typeDocument)]
  }

  approve(): void {
    
    if(this.typeDocuments.filter(typeDocument => this.project.documents[typeDocument].status == "Aceptado").length == this.typeDocuments.length){

      this.project.approveStep5 = true
      this.project.numStep = 6
      this.projectsService.updateProject(this.project);
    }
  }

  ngOnChanges(): void {
    this.formStatus = new FormGroup({})

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
}
