import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-copyright-database',
  templateUrl: './copyright-database.component.html',
  styleUrls: ['./copyright-database.component.css']
})
export class CopyrightDatabaseComponent {
  steps: string[] = [
    "Requisitos de estado",
    "Reunión 2 Revisión",
    "Reunión 3 Contrato",
  ]

  longTitleSteps: string[] = [
    "Requisitos",
    "Reunión 2 Revisión",
    "Contrato"
  ]

  nameDocuments: string[] = [
    "Copias de cédulas y certificado de votación a color",
    "Certificado docentes y estudiantes UTPL",
    "Datos de autores",
    "Certificado de autores",
    "Ficha Técnica",	
    "Manual de usuario",
    "Resumen de las funcionalidades del programa",
    "Conocer si la obra, esta publicada o es inédita",
    "CD con codigo fuente",
  ]

  typeDocuments: string[] = [
    "idDocuments",
    "teacherStudentCertificate",
    "dataAuthors",
    "authorsCertificate",
    "technicalSheet",
    "userManual",
    "softwareFeatures",
    "publishedOrUnpublished",
    "sourceCode",
  ]

  step: number = -1
  id!: string
  project: Project = new Project("", "", "", "", "", "")
  user: User = new User("", "",  "",   )
  typeDocument?: string
  nextStepDisabled: boolean = false

  constructor(private route: ActivatedRoute, private projectService: ProjectsService, private loginService: LoginService, private router: Router) {}

  redirect(project: Project, numStep: number): void {
    // Se suma 1 porque cuando se muestra el componente se resta 1
    numStep += 1
    this.router.navigate([`/${project.type}_form/${project.getId}/${numStep}`])
  }

  ngOnInit(): void {
    this.loginService.getDataUser(this.loginService.uid).then(user => {
      this.user = Object.assign(new User("", "",  ""), user)
    }).catch(err => console.log(err))

    this.route.params.subscribe(params => {
      this.step = parseInt(params['step'])-1
      this.id = params['id']
      this.typeDocument = params['typeDocument']
      

      // this.nextStepDisabled = false

      // if (this.user.rol == "admin") {
      //   if (this.step == 0 && !this.project.documents) {
      //     this.nextStepDisabled = true
      //   }
      // } else if (this.user.rol == "user") {
      //   if (this.step == 0 && !this.project.approveStep1) {
      //     this.nextStepDisabled = true
      //   } else if (this.step == 1 && this.project.documents['descriptiveMemories'].status != "Aceptado") {
      //     this.nextStepDisabled = true
      //   }
      // }
    })
    
    this.projectService.getProject(this.id).then(project => {
      this.project = Object.assign(new Project("", "", "", "", "", ""), project.data())
      this.project['id'] = project.id
    })
  }
}
