import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-copyright-software',
  templateUrl: './copyright-software.component.html',
  styleUrls: ['./copyright-software.component.css']
})
export class CopyrightSoftwareComponent {
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
  project?: Project
  subscriptionProject!: Subscription
  subscriptionRoute!: Subscription
  user?: User
  typeDocument?: string
  nextStepDisabled: boolean = false
  operation?: string

  constructor(private route: ActivatedRoute, private projectService: ProjectsService, private loginService: LoginService, private router: Router) {}

  redirect(project: Project, numStep: number): void {
    if (numStep <= 0 || numStep > this.steps.length) {
      this.router.navigate([`/register-pi/${project.type}_form/${project.getId}/1`])
      return
    } 

    // Se suma 1 porque cuando se muestra el componente se resta 1
    numStep += 1
    this.router.navigate([`/register-pi/${project.type}_form/${project.getId}/${numStep}`])
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.loginService.getDataUser(this.loginService.uid)

    this.subscriptionRoute = this.route.params.subscribe(params => {
      this.step = parseInt(params['step'])-1
      this.id = params['id']
      this.typeDocument = params['typeDocument']
      this.operation = params['operation']

      this.controlStep()
    })

    this.subscriptionProject = this.projectService.getProject(this.id).subscribe(project => {
      this.project = Object.assign(new Project("", "", "", "", "", ""), project)

      if (this.project.status != "Aprobado"){
        this.router.navigate(['/not_found'])
      }

      this.controlStep()

      /*if (!this.project.documents){
        this.project.documents = {}
      }*/
    })
  }

  ngOnDestroy(): void {
    if (this.subscriptionProject)
      this.subscriptionProject.unsubscribe()
    if (this.subscriptionRoute)
      this.subscriptionRoute.unsubscribe()
  }

  controlStep()  {
    if (!(this.project && this.user)) return;

    if (this.project.numStep! < this.step ) {
      this.step = this.project.numStep! 
      this.redirect(this.project, this.step -1)
    }

    if (this.user.rol == "admin") {
      if (this.step == 0 && !this.project.approveStep1) {
        this.nextStepDisabled = true
      } else if (this.step == 1 && !this.project.finalReviewMeeting) {
        this.nextStepDisabled = true
      } else if (this.step == 1 && this.project.finalReviewMeeting && !this.project.finalReviewMeeting.assistance) {
        this.nextStepDisabled = true
      } else {
        this.nextStepDisabled = false
      }
    } else if (this.user.rol == "user") {
      if (this.step == 1 &&  !this.project.finalReviewMeeting) {
        this.step -= 1
      }

      if (this.step == 0 && !this.project.approveStep1) {
        this.nextStepDisabled = true
      } if (this.step == 0 && !this.project.finalReviewMeeting) {
        this.nextStepDisabled = true
      } else if (this.step == 1 && this.project.finalReviewMeeting && !this.project.finalReviewMeeting.assistance) {
        this.nextStepDisabled = true
      } else {
        this.nextStepDisabled = false
      }
    }
  }
}
