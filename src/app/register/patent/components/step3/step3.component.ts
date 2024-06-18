import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
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
  user: User = new User("", "",  "",   )

  formReviewMeeting!: FormGroup

  constructor(private projectService: ProjectsService) {}

  confirmAssistance(): void {
    this.project.progressReviewMeeting.assistance = true
    this.projectService.updateProject(this.project).then(project => {
      this.project = Object.assign(new Project("", "", "", "", "", ""), project)
    }).catch(err => console.log(err))
  }

  createMeeting(): void {
    let date = this.formReviewMeeting.get('date')?.value.split('-')

    if (!this.project.progressReviewMeeting)
      this.project.progressReviewMeeting = {}

    this.project.progressReviewMeeting.timeStart = Timestamp.fromDate( 
      new Date(
        parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]), 
        parseInt(this.formReviewMeeting.get('timeStart')?.value.split(':')[0]), parseInt(this.formReviewMeeting.get('timeStart')?.value.split(':')[1])
      )
    )

    this.project.progressReviewMeeting.timeFinish = Timestamp.fromDate( 
      new Date(
        parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]), 
        parseInt(this.formReviewMeeting.get('timeFinish')?.value.split(':')[0]), 
        parseInt(this.formReviewMeeting.get('timeFinish')?.value.split(':')[1])
      )
    );

    this.project.progressReviewMeeting.assistance = false
    this.project.progressReviewMeeting.place = this.formReviewMeeting.get('place')?.value
    this.project.progressReviewMeeting.modality = this.formReviewMeeting.get('modality')?.value
    this.project.numStep = 3
    // this.projectService.updateProject(this.project).catch(err => console.log(err))

    this.projectService.addReviewMeeting(this.project, this.project.progressReviewMeeting, "progress-review").catch(err => console.log(err))
  }

  ngOnChanges(): void {
    let dStart: Date
    let dFinish: Date

    if (this.project.progressReviewMeeting) {
      dStart = this.project.progressReviewMeeting.timeStart.toDate();
      dFinish = this.project.progressReviewMeeting.timeFinish.toDate();
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
      place: new FormControl(this.project.progressReviewMeeting?.place),
      modality: new FormControl(this.project.progressReviewMeeting?.modality, [Validators.required, Validators.nullValidator]),
    })

    if (this.project.progressReviewMeeting && this.project.progressReviewMeeting.assistance) {
      this.formReviewMeeting.disable()
    }
  }
}
