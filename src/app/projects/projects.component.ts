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
  user?: User
  projects?: Project[]
  filteredProjects?: Project[]
  filterText?: string
  types: any = {
    'patent': "Patente",
    'industrial-secret': "Secreto Industrial",
    'copyright-software': "Derechos de Autor /Software",
    'copyright-database': "Derechos de Autor /Base de Datos",
  };

  formProject: FormGroup = new FormGroup({})

  constructor(private projectService: ProjectsService, private loginService: LoginService, protected router: Router){ }

  translateProjectType(type: string): string {
    switch(type) {
      case 'patent':
        return 'Patente';
      case 'copyright-software':
        return 'Derechos de Autor/Software';
      case 'copyright-database':
        return 'Derechos de Autor/Base de datos';
      case 'industrial-secret':
        return 'Secreto industrial';
      default:
        return type;
    }
  }

  getStrokeColor(type: string): string {
    switch (type) {
      case 'patent':
        return '#64B07D';
      case 'copyright-software':
        return '#CED053';
      case 'copyright-database':
        return '#D05353';
      case 'industrial-secret':
        return '#6475B0';
      default:
        return '#000000'
    }
  }

  filterResults(text: string | undefined) {
    if (!this.projects) return
    if (!text) {
      this.filterText = undefined
      this.filteredProjects = this.projects;
      return;
    }

    this.filterText = text
    this.filteredProjects = this.projects.filter(
      project => project?.getName.toLowerCase().includes(text.toLowerCase())
    );
  }

  async addProject(): Promise<void> {
    if (!this.user) return

    this.formProject.setControl('nameAuthor', new FormControl(this.user.name + " " + this.user.lastName, [
      Validators.required, Validators.nullValidator, Validators.pattern(this.user.name + " " + this.user.lastName)
    ]));
    this.formProject.setControl('createDate', new FormControl(Timestamp.now()));
    this.formProject.setControl('numStep', new FormControl(1));

    await this.projectService.addProject(this.formProject.value)

    this.formProject = new FormGroup({
      name: new FormControl<string>('', [Validators.required, Validators.nullValidator]),
      uid: new FormControl(this.loginService.uid),
      nameAuthor: new FormControl({value: this.user.name + " " + this.user.lastName, disabled: true}, [Validators.required, Validators.nullValidator, Validators.pattern(this.user.name + " " + this.user.lastName)]),
      description: new FormControl<string>('', [Validators.required, Validators.nullValidator]),
      createDate: new FormControl(Timestamp.now()),
      type: new FormControl<string>('patent', [Validators.required, Validators.nullValidator]),
      numStep: new FormControl(0),
      status: new FormControl('En Proceso'),
      cellphone: new FormControl('', [Validators.required,  Validators.pattern("^[0-9]{10}$")]),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
    })

    this.openModal = null
  }

  openModalAddProject(): void {
    if (!this.user) return

    this.formProject = new FormGroup({
      name: new FormControl<string>('', [Validators.required, Validators.nullValidator]),
      uid: new FormControl(this.loginService.uid),
      nameAuthor: new FormControl({value: this.user.name + " " + this.user.lastName, disabled: true}, [Validators.required, Validators.nullValidator, Validators.pattern(this.user.name + " " + this.user.lastName)]),
      description: new FormControl<string>('', [Validators.required, Validators.nullValidator]),
      createDate: new FormControl(Timestamp.now()),
      type: new FormControl<string>('patent', [Validators.required, Validators.nullValidator]),
      numStep: new FormControl(0),
      status: new FormControl('En Proceso'),
      cellphone: new FormControl('', [Validators.required,  Validators.pattern("^[0-9]{4,10}")]),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
    })

    this.openModal = true
  }

  approveProject(project: Project): void {
    this.projectService.approveProject(project).then((data) => {
      console.log(data);
    }).catch(err => console.log(err));
  }



  nonApproveProject(project: Project): void {
    this.projectService.nonApproveProject(project).then((data) => {
      console.log(data);
    });
  }

  deleteProject(project: Project): void {
    this.projectService.deleteProject(project).then((data) => {
      console.log(data);
    }).catch(err => console.log(err));
  }

  redirect(project: Project): void {
    if (project.status == "Aprobado") {
      this.router.navigate([`/${project.type}_form/${project.getId}/${project.numStep}`])
    }
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
        return '';
    }
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.loginService.getDataUser(this.loginService.uid)

    if (this.user.rol == "admin") {
      this.projectService.getProjects(undefined).subscribe(projects => {
        this.projects = projects.map(x => Object.assign(new Project("", "", "", "", "", ""), x))
        this.filterResults(this.filterText)
      })
    } else if (this.user.rol == "user") {
      this.projectService.getProjects(this.loginService.uid).subscribe(projects => {
        this.projects = projects.map(x => Object.assign(new Project("", "", "", "", "", ""), x))
        this.filterResults(this.filterText)
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
      cellphone: new FormControl('', [Validators.required,  Validators.pattern("^[0-9]{4,10}")]),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
    })
  }
}
