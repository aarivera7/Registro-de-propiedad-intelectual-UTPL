import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';


@Component({
  selector: 'app-patent',
  templateUrl: './patent.component.html',
  styleUrls: ['./patent.component.css']
})
export class PatentComponent {
  steps: string[] = [
    "Requisitos de estado",
    "Reunión 2 Memoria descriptiva",
    "Reunión 3 Avances",
    "Reunión 4 Revisión Final",
    "Requisitos",
    "Contrato"
    ]
  longTitleSteps: string[] = [
    "Requisitos para revisión estado de la técnica",
    "Reunión 2 Elaboración de memoria descriptiva",
    "Reunión 3 Avances",
    "Reunión 4 Revisión Final",
    "Requisitos",
    "Contrato"
  ]
  step: number = -1
  id!: string
  project?: Project
  user?: User
  typeDocument?: string
  nextStepDisabled: boolean = false
  operation?: string

  constructor(private route: ActivatedRoute, private projectService: ProjectsService, private loginService: LoginService, private router: Router) {}

  redirect(project: Project, numStep: number): void {
    // Se suma 1 porque cuando se muestra el componente se resta 1
    numStep += 1
    this.router.navigate([`/${project.type}_form/${project.getId}/${numStep}`])
  }

  async ngOnInit(): Promise<void> {

    this.user = await this.loginService.getDataUser(this.loginService.uid)

    this.route.params.subscribe(params => {
      this.step = parseInt(params['step'])-1
      this.id = params['id']
      this.typeDocument = params['typeDocument']
      this.operation = params['operation']

      this.controlStep()
    })

    this.projectService.getProject(this.id).subscribe(project => {
      this.project = Object.assign(new Project("", "", "", "", "", ""), project)

      this.controlStep()

      if (this.project.status != "Aprobado"){
        this.router.navigate(['/not_found'])
      }
    })
  }

  controlStep()  {
    if (this.project && this.user)
    if (this.user.rol == "admin") {
      if (this.step == 1 && (!this.project.documents || (this.project.documents && !this.project.documents['descriptiveMemories']))) {
        this.step -= 1
      }

      if (this.step == 0 && (!this.project.documents || (this.project.documents && !this.project.documents['descriptiveMemories']))) {
        this.nextStepDisabled = true
      } else if (this.step == 1 && this.project.documents && this.project.documents['descriptiveMemories'].status != "Aceptado") {
        this.nextStepDisabled = true
      } else if (this.step == 1 && !this.project.documents) {
        this.nextStepDisabled = true
      } else if (this.step == 2 && this.project.finalReviewMeeting && !this.project.finalReviewMeeting.assistance) {
        this.nextStepDisabled = true
      } else if (this.step == 2 && !this.project.finalReviewMeeting) {
        this.nextStepDisabled = true
      } else if (this.step == 3 && this.project.finalReviewMeeting && !this.project.finalReviewMeeting.assistance) {
        this.nextStepDisabled = true
      } else if (this.step == 3 && !this.project.finalReviewMeeting) {
        this.nextStepDisabled = true
      } else if (this.step == 4 && !this.project.approveStep5) {
        this.nextStepDisabled = true
      } else {
        this.nextStepDisabled = false
      }
    } else if (this.user.rol == "user") {
      if (this.step == 2 && !this.project.finalReviewMeeting) {
        this.step -= 1
      } else if (this.step == 3 && !this.project.finalReviewMeeting) {
        this.step -= 1
      }

      if (this.step == 0 && !this.project.approveStep1) {
        this.nextStepDisabled = true
      } else if (this.step == 1 && this.project.documents && this.project.documents['descriptiveMemories'] && this.project.documents['descriptiveMemories'].status != "Aceptado") {
        this.nextStepDisabled = true
      } else if (this.step == 1 && !this.project.documents) {
        this.nextStepDisabled = true
      } else if (this.step == 1 && !this.project.finalReviewMeeting) {
        this.nextStepDisabled = true
      } else if (this.step == 2 && this.project.finalReviewMeeting && !this.project.finalReviewMeeting.assistance) {
        this.nextStepDisabled = true
      } else if (this.step == 2 && !this.project.finalReviewMeeting) {
        this.nextStepDisabled = true
      } else if (this.step == 3 && this.project.finalReviewMeeting && !this.project.finalReviewMeeting.assistance) {
        this.nextStepDisabled = true
      } else if (this.step == 4 && !this.project.approveStep5) {
        this.nextStepDisabled = true
      } else {
        this.nextStepDisabled = false
      }
    }
  }
}
