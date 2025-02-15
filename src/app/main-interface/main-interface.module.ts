import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationsComponent } from './certifications/certifications.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MessagesComponent } from './messages/messages.component';
import { ProjectsComponent } from './projects/projects.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { InfoComponent } from './info/info';
import { AlertComponent } from './alert/alert.component';



@NgModule({
  declarations: [
    CertificationsComponent,
    CalendarComponent,
    MessagesComponent,
    ProjectsComponent,
    InfoComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FullCalendarModule,
  ]
})
export class MainInterfaceModule { }
