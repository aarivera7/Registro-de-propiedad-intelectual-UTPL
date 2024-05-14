import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ProjectsService } from '../services/projects.service';
import { LoginService } from '../services/login.service';
import { Project } from '../models/project';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin],
    events: [],
    locale: 'es',
    height: 'auto',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay' // user can switch between the two
    }
  };

  constructor(private projectService: ProjectsService, private loginService: LoginService) { }

  async ngOnInit(): Promise<void> {
    const user = await this.loginService.getDataUser(this.loginService.uid)

    const uid = user.rol == "admin" ? undefined : this.loginService.uid

    this.projectService.getProjects(uid).subscribe(projects => {
      this.calendarOptions.events = projects
      .filter(project => project.progressReviewMeeting && project.progressReviewMeeting.assistance)
      .map(project => {
        project = Object.assign(new Project("", "", "", "", "", ""), project)
        return {
          title: project.getName,
          start: project.progressReviewMeeting.timeStart.toDate(),
          end: project.progressReviewMeeting.timeFinish.toDate(),
          display: 'block',
        }
      });

      this.calendarOptions.events = this.calendarOptions.events.concat(projects
        .filter(project => project.finalReviewMeeting && project.finalReviewMeeting.assistance)
        .map(project => {
          project = Object.assign(new Project("", "", "", "", "", ""), project)
          return {
            title: project.getName,
            start: project.finalReviewMeeting.timeStart.toDate(),
            end: project.finalReviewMeeting.timeFinish.toDate(),
            display: 'block',
          }
        })
      )
    });
  }
}
