import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';

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

  constructor(private projectService: ProjectsService) { }

  updateProject(): void {
    this.project.keywords = this.step1Form.get('keywords')?.value
    this.project.tentativeTitle = this.step1Form.get('tentativeTitle')?.value
    this.project.setSummary = this.step1Form.get('summary')?.value
    this.project.approveStep1 = false

    this.projectService.updateProject(this.project).then(project => {
      this.project = Object.assign(new Project("", "", "", "", "", ""), project)
    }).catch(err => console.log(err))
  }

  approve(): void {
    this.project.approveStep1 = true
    this.project.numStep = 2
    this.projectService.updateProject(this.project)
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
