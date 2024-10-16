import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';
import { ShowAlertService } from 'src/app/services/show-alert/show-alert.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css']
})
export class Step1Component {
  @Input() 
  project!: Project

  @Input()
  user: User = new User("", "",  "",   )

  step1Form!: FormGroup

  loading: boolean = false

  constructor(private projectService: ProjectsService, private alertService: ShowAlertService) { }

  updateProject(): void {
    this.loading = true

    this.project.keywords = this.step1Form.get('keywords')?.value
    this.project.tentativeTitle = this.step1Form.get('tentativeTitle')?.value
    this.project.setSummary = this.step1Form.get('summary')?.value
    this.project.approveStep1 = false

    this.projectService.updateProject(this.project)
        .then(project => {
          this.project = Object.assign(new Project("", "", "", "", "", ""), project)
          this.alertService.showAlert(`<b>!Se ha enviado exitosamente!</b> <br>
              Tu proceso se encuentra en revisión <br>
              <b>Una vez revisada se habilitará el siguiente paso</b>`, true)
        })
        .catch(err => console.log(err))
        .finally(() => this.loading = false)
  }

  async approve(): Promise<void> {
    this.loading = true
    this.project.approveStep1 = true
    this.project.numStep = 2
    await this.projectService.updateProject(this.project)

    this.projectService.sendEmail(this.project, "approved-step1")
        .then(() => this.alertService.showAlert('!Bien, se puede continuar al siguiente paso!'))
        .catch(err => console.log(err))
        .finally(() => this.loading = false)
  }

  sendEmail(): void {
    this.loading = true
    
    this.projectService.sendEmail(this.project, "sendEmail-step1")
        .then(() => this.alertService.showAlert('!Se ha enviado el correo exitosamente!'))
        .catch(err => console.log(err))
        .finally(() => this.loading = false)
  }

  ngOnChanges(): void {
    this.step1Form  = new FormGroup({
      keywords: new FormControl(this.project?.keywords, [Validators.required, Validators.nullValidator]),
      tentativeTitle: new FormControl(this.project?.tentativeTitle, [Validators.required, Validators.nullValidator]),
      summary: new FormControl(this.project?.summary, [Validators.required, Validators.nullValidator]),
    })

    if (this.user.rol == "admin" || this.project.approveStep1) {
      this.step1Form.get('keywords')?.disable()
      this.step1Form.get('tentativeTitle')?.disable() 
      this.step1Form.get('summary')?.disable()
    }
  }
}
