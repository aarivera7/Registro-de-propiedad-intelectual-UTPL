import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';
import { ShowAlertService } from 'src/app/services/show-alert/show-alert.service';

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

  loading: boolean = false
  showAlert = false;

  constructor(private projectService: ProjectsService, private alertService: ShowAlertService) {}

  // Method to show the alert
  showSuccessAlert() {
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 3000); // Hide alert after 3 seconds
  }

  // Method to manually close the alert
  closeAlert() {
    this.showAlert = false;
  }

  confirmAssistance(): void {
    this.loading = true

    /*this.project.numStep = 3
    this.project.finalReviewMeeting.assistance = true
    this.projectService.updateProject(this.project)
      .then(project => {
        this.project = Object.assign(new Project("", "", "", "", "", ""), project)
      })
      .catch(err => console.log(err))
      .finally(() => this.loading = false)*/

    this.projectService.confirmAssistance(this.project.finalReviewMeeting.meetingId)
        .then(() => this.alertService.showAlert('¡Asistencia confirmada exitosamente!'))
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

    if (!this.project.finalReviewMeeting)
      this.project.finalReviewMeeting = {}

    this.project.finalReviewMeeting.timeStart = Timestamp.fromDate(
      timeStart
    )

    this.project.finalReviewMeeting.timeFinish = Timestamp.fromDate(
      timeFinish
    )

    this.project.finalReviewMeeting.assistance = false
    this.project.finalReviewMeeting.place = this.formReviewMeeting.get('place')?.value
    this.project.finalReviewMeeting.modality = this.formReviewMeeting.get('modality')?.value
    /*this.projectService.updateProject(this.project)
      .catch(err => console.log(err))
      .finally(() => this.loading = false)*/

    this.projectService.addReviewMeeting(this.project, this.project.finalReviewMeeting, "final-review")
        .then(() => this.alertService.showAlert('¡Reunión de revisión final creada exitosamente!'))
        .catch(err => console.log(err))
        .finally(() => this.loading = false)
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
          this.project.finalReviewMeeting?.place,
          [Validators.required, Validators.nullValidator]
        ),
      modality: new FormControl(
          this.project.finalReviewMeeting?.modality, 
          [Validators.required, Validators.nullValidator]
        ),
    })

    if (this.project.finalReviewMeeting && this.project.finalReviewMeeting.assistance) {
      this.formReviewMeeting.disable()
    }
  }
}
