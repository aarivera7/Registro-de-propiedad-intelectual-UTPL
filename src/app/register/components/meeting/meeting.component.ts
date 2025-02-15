import { Component, Input } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';
import { ShowAlertService } from 'src/app/services/show-alert/show-alert.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent {
  @Input()
  project!: Project

  @Input()
  user: User = new User("", "",  "",   )

  @Input()
  typeMeeting!: string

  formReviewMeeting!: FormGroup

  loading: boolean = false

  constructor(private projectService: ProjectsService, private alertService: ShowAlertService) {}

  confirmAssistance(): void {
    this.loading = true
    this.projectService.confirmAssistance(this.project.progressReviewMeeting.meetingId)
        .then(() => this.alertService.showAlert('!Bien, has confirmado tu asistencia!'))
        .catch(err => console.log(err))
        .finally(() => this.loading = false)
  }

  createMeeting(): void {
    this.loading = true

    let date = this.formReviewMeeting.get('date')?.value.split('-')

    let timeStart = new Date(
      parseInt(date[0]), 
      parseInt(date[1])-1, 
      parseInt(date[2]), 
      parseInt(this.formReviewMeeting.get('timeStart')?.value.split(':')[0]), 
      parseInt(this.formReviewMeeting.get('timeStart')?.value.split(':')[1])
    )

    let timeFinish = new Date(
      parseInt(date[0]), 
      parseInt(date[1])-1, 
      parseInt(date[2]), 
      parseInt(this.formReviewMeeting.get('timeFinish')?.value.split(':')[0]), 
      parseInt(this.formReviewMeeting.get('timeFinish')?.value.split(':')[1])
    )

    if (timeStart < new Date()) {
      alert("La fecha de inicio no puede ser menor a la fecha actual")
      this.loading = false
      return
    }

    if (timeFinish < timeStart) {
      alert("La fecha de fin no puede ser menor a la fecha de inicio")
      this.loading = false
      return
    }

    if (this.formReviewMeeting.invalid) {
      alert("Por favor, complete los campos")
      this.loading = false
      return
    }

    if (!this.project.progressReviewMeeting)
      this.project.progressReviewMeeting = {}

    this.project.progressReviewMeeting.timeStart = Timestamp.fromDate(
      timeStart
    )

    this.project.progressReviewMeeting.timeFinish = Timestamp.fromDate( 
      timeFinish
    );

    this.project.progressReviewMeeting.assistance = false
    this.project.progressReviewMeeting.place = this.formReviewMeeting.get('place')?.value
    this.project.progressReviewMeeting.modality = this.formReviewMeeting.get('modality')?.value
    this.project.numStep = 3
    // this.projectService.updateProject(this.project)
    // .catch(err => console.log(err))

    this.projectService.addReviewMeeting(this.project, this.project.progressReviewMeeting, "progress-review")
        .then(() => this.alertService.showAlert("¡Reunión creada correctamente!"))
        .catch(err => console.log(err))
        .finally(() => this.loading = false);
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

      // 1 hour meeting
      dStart.setHours(dStart.getHours() + 1)
      dFinish.setHours(dStart.getHours() + 1)
    }

    let date = dStart.getFullYear() + "-" + 
        (dStart.getMonth() + 1).toString().padStart(2, '0') + "-" + 
        dStart.getDate().toString().padStart(2, '0')

    let timeStart = dStart.getHours().toString().padStart(2, '0') + ":" +
        dStart.getMinutes().toString().padStart(2, '0')

    let timeFinish = dFinish.getHours().toString().padStart(2, '0') + ":" +
        dFinish.getMinutes().toString().padStart(2, '0')

    this.formReviewMeeting = new FormGroup({
      date: new FormControl(
          date,
          [Validators.required, Validators.nullValidator]
        ),
      timeStart: new FormControl(
          timeStart,
          [Validators.required, Validators.nullValidator]
        ),
      timeFinish: new FormControl(
          timeFinish,
          [Validators.required, Validators.nullValidator]
        ),
      place: new FormControl(
          this.project.progressReviewMeeting?.place,
          [Validators.required, Validators.nullValidator]
        ),
      modality: new FormControl(
          this.project.progressReviewMeeting?.modality, 
          [Validators.required, Validators.nullValidator]
        ),
    })

    if (this.project.progressReviewMeeting && this.project.progressReviewMeeting.assistance) {
      this.formReviewMeeting.disable()
    }
  }
}
