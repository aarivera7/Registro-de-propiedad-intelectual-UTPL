import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';
import { ShowAlertService } from 'src/app/services/show-alert/show-alert.service';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css']
})
export class Step4Component {
  @Input()
  project!: Project

  @Input()
  user: User = new User("", "",  "",   )

  formFinalMeeting!: FormGroup

  loading: boolean = false

constructor(private projectService: ProjectsService, private alertService: ShowAlertService) { }
  confirmAssistance(): void {
    this.loading = true

    /* this.project.numStep = 5
    this.project.finalReviewMeeting.assistance = true
    this.projectService.updateProject(this.project)
        .then()
        .catch(err => console.log(err))
        .finally(() => this.loading = false)*/

    this.projectService.confirmAssistance(this.project.finalReviewMeeting.meetingId)
        .then(() => this.alertService.showAlert('!Bien, has confirmado tu asistencia!'))
        .catch(err => console.log(err))
        .finally(() => this.loading = false)
  }

  // Create the final review meeting
  createMeeting(): void {
    this.loading = true

    let date = this.formFinalMeeting.get('date')?.value.split('-')

    let timeStart = new Date(
      parseInt(date[0]), 
      parseInt(date[1])-1, 
      parseInt(date[2]), 
      parseInt(this.formFinalMeeting.get('timeStart')?.value.split(':')[0]), 
      parseInt(this.formFinalMeeting.get('timeStart')?.value.split(':')[1])
    )

    let timeFinish = new Date(
      parseInt(date[0]), 
      parseInt(date[1])-1, 
      parseInt(date[2]), 
      parseInt(this.formFinalMeeting.get('timeFinish')?.value.split(':')[0]), 
      parseInt(this.formFinalMeeting.get('timeFinish')?.value.split(':')[1])
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

    if (this.formFinalMeeting.invalid) {
      alert("Por favor, complete los campos")
      this.loading = false
      return
    }

    if (!this.project.finalReviewMeeting)
      this.project.finalReviewMeeting = {}

    this.project.finalReviewMeeting.timeStart = Timestamp.fromDate( 
      timeStart
    )

    this.project.finalReviewMeeting.timeFinish = Timestamp.fromDate(
      timeFinish
    );


    this.project.finalReviewMeeting.assistance = false
    this.project.finalReviewMeeting.place = this.formFinalMeeting.get('place')?.value
    this.project.finalReviewMeeting.modality = this.formFinalMeeting.get('modality')?.value
    this.project.numStep = 4
    // this.projectService.updateProject(this.project)
    //  .catch(err => console.log(err))
    this.projectService.addReviewMeeting(this.project, this.project.finalReviewMeeting, "final-review")
        .then(() => this.alertService.showAlert("¡Reunión creada correctamente!"))
        .catch(err => console.log(err))
        .finally(() => this.loading = false)
  }

  ngOnChanges(): void {
    let dStart: Date
    let dFinish: Date

    if (this.project.finalReviewMeeting) {
      dStart = this.project.finalReviewMeeting.timeStart.toDate()
      dFinish = this.project.finalReviewMeeting.timeFinish.toDate()
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

    let timeStart = dStart.getHours().toString().padStart(2, '0') + ":" + dStart.getMinutes().toString().padStart(2, '0')

    let timeFinish = dFinish.getHours().toString().padStart(2, '0') + ":" + dFinish.getMinutes().toString().padStart(2, '0')

    this.formFinalMeeting = new FormGroup({
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
          this.project.finalReviewMeeting?.place, [Validators.required, Validators.nullValidator]
        ),
      modality: new FormControl(
          this.project.finalReviewMeeting?.modality , [Validators.required, Validators.nullValidator]
        ),
    })

    if (this.project.finalReviewMeeting && this.project.finalReviewMeeting.assistance) {
      this.formFinalMeeting.disable()
    }
  }
}
