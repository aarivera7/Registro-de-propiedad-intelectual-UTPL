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
  steps: string[]
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
  project!: Project
  user!: User

  constructor(private route: ActivatedRoute, private projectService: ProjectsService, private loginService: LoginService, private router: Router) {
    this.route.params.subscribe(params => {
      this.step = parseInt(params['step'])-1
      this.id = params['id']
    })
    this.steps = [
    "Requisitos de estado",
    "Reunión 2 Memoria descriptiva",
    "Reunión 3 Avances",
    "Reunión 4 Revisión Final",
    "Requisitos",
    "Contrato"
  ]
  }
  redirect(project: Project, numStep: number): void {
    // Se suma 1 porque cuando se muestra el componente se resta 1
    numStep += 1
    this.router.navigate([`/${project.type}_form/${project.getId}/${numStep}`])
  }

  ngOnInit(): void {
    this.projectService.getProject(this.id).then(project => {
      this.project = Object.assign(new Project("", "", "", "", "", ""), project)
    })
    this.loginService.getDataUser(this.loginService.uid).then(user => {
      this.user = Object.assign(new User("", "",  "",   ), user)
    }).catch(err => console.log(err))
  }
}
