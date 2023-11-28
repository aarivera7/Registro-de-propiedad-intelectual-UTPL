import { Component, Input } from '@angular/core';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css']
})
export class Step3Component {
  @Input()
  project!: Project

  @Input()
  user!: User

  constructor(private projectService: ProjectsService) { }

  confirmAssistance(): void {
    this.project.numStep = 4
    this.project.progressReviewMeeting.assistance = true
    this.projectService.updateProject(this.project).then(project => {
      this.project = Object.assign(new Project("", "", "", "", "", ""), project)
    }).catch(err => console.log(err))
  }
}
