import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InfoComponent } from './info/info';
import { CertificationsComponent } from './certifications/certifications.component';
import { ProjectsComponent } from './projects/projects.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MessagesComponent } from './messages/messages.component';

import { hasRoleGuard } from '../guards/has-role.guard';

const routes = [
  {
    path:'info', component:InfoComponent, 
    canMatch: [hasRoleGuard],
    data: {allowedRoles: ['user']}
  },
  {
    path:'projects',
    component:ProjectsComponent,
  },
  {
    path:'certifications',
    component:CertificationsComponent,
  },
  {
    path: 'messages',
    component: MessagesComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainInterfaceRoutingModule { }

