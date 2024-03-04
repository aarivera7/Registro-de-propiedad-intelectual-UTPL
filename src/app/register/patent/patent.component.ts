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

      this.nextStepDisabled = false

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
    
    this.projectService.getProject(this.id).subscribe(project => {
      this.project = Object.assign(new Project("", "", "", "", "", ""), project)
    })
  }
}
