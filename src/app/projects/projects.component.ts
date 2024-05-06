import { Component } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ProjectsService } from '../services/projects.service';
import { LoginService } from '../services/login.service';
import { User } from '../models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent {
  title = "Tus registros"
  openModal: boolean | null = null
  user: User = new User("", "",  "",   )
  projects!: Project[]

  formProject: FormGroup = new FormGroup({})

  constructor(private projectService: ProjectsService, private loginService: LoginService, protected router: Router){ }

  addProject(): void {
    let id: string = ""
    this.formProject.setControl('nameAuthor', new FormControl(this.user.name + " " + this.user.lastName, [
      Validators.required, Validators.nullValidator, Validators.pattern(this.user.name + " " + this.user.lastName)
    ]));
    this.formProject.setControl('createDate', new FormControl(Timestamp.now()));
    this.formProject.setControl('numStep', new FormControl(1));
    this.projectService.addProject(this.formProject.value).then ( doc => {
      id = doc.id

      if(this.formProject.get('type')?.value == "patent"){
        this.router.navigate([`/patent_form/${id}/1`])
      } else if (this.formProject.get('type')?.value == "copyright-software"){
        this.router.navigate([`/copyright-software_form/${id}/1`])
      }
    })
  }

  redirect(project: Project): void {
    this.router.navigate([`/${project.type}_form/${project.getId}/${project.numStep}`])
  }

  getDate(): Date {
    return new Date()
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'aprobado':
        return 'aprobado';
      case 'no aprobado':
        return 'no-aprobado';
      case 'en proceso':
        return 'en-proceso';
      default:
        return ''; // Puedes agregar un estilo predeterminado aquí si es necesario
    }
  }

  ngOnInit(): void {
    this.loginService.getDataUser(this.loginService.uid).then(user => {
      this.user = Object.assign(new User("", "",  "",   ), user)

      if (this.user.rol == "admin") {
        this.projectService.getProjects(undefined).subscribe(projects => {
          this.projects = projects.map(x => Object.assign(new Project("", "", "", "", "", ""), x))
        })
      } else {
        this.projectService.getProjects(this.loginService.uid).subscribe(projects => {
          this.projects = projects.map(x => Object.assign(new Project("", "", "", "", "", ""), x))
        })
      }
      this.formProject = new FormGroup({
        name: new FormControl<string>('', [Validators.required, Validators.nullValidator]),
        uid: new FormControl(this.loginService.uid),
        nameAuthor: new FormControl({value: this.user.name + " " + this.user.lastName, disabled: true}, [Validators.required, Validators.nullValidator, Validators.pattern(this.user.name + " " + this.user.lastName)]),
        description: new FormControl<string>('', [Validators.required, Validators.nullValidator]),
        createDate: new FormControl(Timestamp.now()),
        type: new FormControl<string>('patent', [Validators.required, Validators.nullValidator]),
        numStep: new FormControl(0),
        status: new FormControl('En Proceso'),
        //cellphone: new FormControl('', [Validators.required,  Validators.pattern("[0-9]{10}")]),
      })
    }).catch(err => console.log(err))
  }
}
