import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-step2-du-s',
  templateUrl: './step2-du-s.component.html',
  styleUrls: ['./step2-du-s.component.css']
})
export class Step2DuSComponent {
  @Input()
  project!: Project

  @Input()
  user: User = new User("", "",  "",   )

  formReviewMeeting!: FormGroup

  constructor(private projectService: ProjectsService) {}

  confirmAssistance(): void {
    this.project.numStep = 3
    this.project.finalReviewMeeting.assistance = true
    this.projectService.updateProject(this.project).then(project => {
      this.project = Object.assign(new Project("", "", "", "", "", ""), project)
    }).catch(err => console.log(err))
  }

  createMeeting(): void {
    let date = this.formReviewMeeting.get('date')?.value.split('-')

    if (!this.project.finalReviewMeeting)
      this.project.finalReviewMeeting = {}

    this.project.finalReviewMeeting.timeStart = Timestamp.fromDate(
      new Date(
        parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]),
        parseInt(this.formReviewMeeting.get('timeStart')?.value.split(':')[0]), parseInt(this.formReviewMeeting.get('timeStart')?.value.split(':')[1])
      )
    )

    this.project.finalReviewMeeting.timeFinish = new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]), parseInt(this.formReviewMeeting.get('timeFinish')?.value.split(':')[0]), parseInt(this.formReviewMeeting.get('timeFinish')?.value.split(':')[1]))

    this.project.finalReviewMeeting.assistance = false
    this.project.finalReviewMeeting.place = this.formReviewMeeting.get('place')?.value
    this.project.finalReviewMeeting.modality = this.formReviewMeeting.get('modality')?.value
    this.projectService.updateProject(this.project).catch(err => console.log(err))
  }

  ngOnChanges(): void {
    let dStart: Date
    let dFinish: Date

    if (this.project.finalReviewMeeting) {
      dStart = this.project.finalReviewMeeting.timeStart.toDate();
      dFinish = this.project.finalReviewMeeting.timeFinish.toDate();
    } else {
      dStart = new Date()
      dFinish = new Date()
    }

    this.formReviewMeeting = new FormGroup({
      date: new FormControl(dStart.getFullYear() + "-" + (dStart.getMonth() + 1).toString().padStart(2, '0') + "-" + dStart.getDate().toString().padStart(2, '0'),
          [Validators.required, Validators.nullValidator]),
      timeStart: new FormControl(dStart.getHours().toString().padStart(2, '0') + ":" + dStart.getMinutes().toString().padStart(2, '0'),
          [Validators.required, Validators.nullValidator]),
      timeFinish: new FormControl(dFinish.getHours().toString().padStart(2, '0') + ":" + dFinish.getMinutes().toString().padStart(2, '0'),
          [Validators.required, Validators.nullValidator]),
      place: new FormControl(this.project.finalReviewMeeting?.place),
      modality: new FormControl(this.project.finalReviewMeeting?.modality, [Validators.required, Validators.nullValidator]),
    })

    if (this.project.finalReviewMeeting && this.project.finalReviewMeeting.assistance) {
      this.formReviewMeeting.disable()
    }
  }
}
