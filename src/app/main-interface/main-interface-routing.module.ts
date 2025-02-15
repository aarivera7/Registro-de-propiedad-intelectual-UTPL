import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InfoComponent } from './info/info';
import { CertificationsComponent } from './certifications/certifications.component';
import { ProjectsComponent } from './projects/projects.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { CalendarComponent } from './calendar/calendar.component';
import { MessagesComponent } from './messages/messages.component';


const routes = [
  {
    path:'info', component:InfoComponent, 
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
    // canMatch: [hasRoleGuard],
    data: {allowedRoles: ['user']}
  },
  {
    path:'projects',
    component:ProjectsComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path:'certifications',
    component:CertificationsComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path: 'messages', component: MessagesComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainInterfaceRoutingModule { }

