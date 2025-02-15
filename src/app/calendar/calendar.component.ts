import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ProjectsService } from '../services/projects.service';
import { LoginService } from '../services/login.service';
import { Project } from '../models/project';
import esLocate from '@fullcalendar/core/locales/es';
import { Meeting } from '../models/meeting';
import { MeetingsService } from '../services/meetings/meetings.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin],
    events: [],
    locales: [esLocate],
    locale: 'es',
    height: 'auto',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay' // user can switch between the two
    }
  };

  constructor(
    private projectService: ProjectsService,
    private meetingService: MeetingsService,
    private loginService: LoginService
  ) { }

  async ngOnInit(): Promise<void> {
    const user = await this.loginService.getDataUser(this.loginService.uid)

    const uid = user.rol == "admin" ? undefined : this.loginService.uid
    
    this.meetingService.getMeetings(uid).subscribe(meetings => {
      this.calendarOptions.events = meetings.map(meeting => {
        meeting = Object.assign(new Meeting(), meeting)
        return {
          title: meeting.projectName,
          start: meeting.timeStart.toDate(),
          end: meeting.timeFinish.toDate(),
          display: 'block',
        }
      });
    });

    /*this.projectService.getProjects(uid).subscribe(projects => {
      this.calendarOptions.events = projects
      .filter(project => project.finalReviewMeeting && project.finalReviewMeeting.assistance)
      .map(project => {
        project = Object.assign(new Project("", "", "", "", "", ""), project)
        return {
          title: project.getName,
          start: project.finalReviewMeeting.timeStart.toDate(),
          end: project.finalReviewMeeting.timeFinish.toDate(),
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
    });*/
  }
}
