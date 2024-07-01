import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';

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

  constructor(private router: Router, private projectsService: ProjectsService) { }

  isApprovable(): boolean{
    return this.typeDocuments.filter(typeDocument =>
      this.project.documents[typeDocument] && this.project.documents[typeDocument].status == "Aceptado").length == this.typeDocuments.length
  }

  changeStatus(): void {
    this.typeDocuments.forEach(typeDocument => {
      if(this.project.documents[typeDocument]){
        this.project.documents[typeDocument].status = this.formStatus.get(typeDocument)?.value
        this.project.documents[typeDocument].observation = this.formStatus.get(`${typeDocument}Observation`)?.value
        if (this.project.documents[typeDocument].status == "Aceptado"  && typeDocument == "sourceCode"){
          this.project.documents[typeDocument].date = Timestamp.now()
        }
      }
    });
    this.projectsService.updateProject(this.project);
  }

  redirectUpdateDocuments(typeDocument: string, operation: string){
    this.router.navigate([`/${this.project.type}_form/${this.project.getId}/1/${typeDocument}/${operation}`])
  }

  getTitle(typeDocument: string): string{
    return this.nameDocuments[this.typeDocuments.indexOf(typeDocument)]
  }

  async approve(): Promise<void> {
    if(this.isApprovable()){
      this.project.approveStep1 = true
      this.project.numStep = 2
      await this.projectsService.updateProject(this.project);

      this.projectsService.sendEmail(this.project, "approved-step1")
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

    if (this.project.approveStep1) {
      this.formStatus.disable()
    }
  }
}
