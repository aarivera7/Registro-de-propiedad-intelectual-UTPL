import { Component, Input } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css']
})
export class Step4Component {
  @Input()
  project!: Project

  constructor(private projectService: ProjectsService) { }

  confirmAssistance(): void {
    this.project.numStep = 5
    this.project.finalReviewMeeting.assistance = true
    this.projectService.updateProject(this.project).then(project => {
      console.log("Project updated")
      this.project = Object.assign(new Project("", "", "", "", "", ""), project)
    }).catch(err => console.log(err))
  }
}
