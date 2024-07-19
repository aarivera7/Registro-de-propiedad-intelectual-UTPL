import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ProjectsComponent } from './projects/projects.component';
import { CertificationsComponent } from './certifications/certifications.component';
import { MessagesComponent } from './messages/messages.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PatentComponent } from './register/patent/patent.component';
import { CopyrightSoftwareComponent } from './register/copyright-software/copyright-software.component';
import { CopyrightDatabaseComponent } from './register/copyright-database/copyright-database.component';
import { IndustrialSecretComponent } from './register/industrial-secret/industrial-secret.component';
import {InfoComponent} from "./info/info";

import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { hasRoleGuard } from './guards/has-role.guard';

const routes: Routes = [
  {
    path:'', 
    component: LoginComponent,
    ...canActivate(() => redirectLoggedInTo(['/info']))
  },
  {path:'login', component: LoginComponent, ...canActivate(() => redirectLoggedInTo(['/info']))},
  {
    path:'info', component:InfoComponent, ...canActivate(() => redirectUnauthorizedTo(['/login'])),
    // canMatch: [hasRoleGuard],
    data: {allowedRoles: ['user']}
  },
  {path:'projects', component:ProjectsComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path:'certifications', component:CertificationsComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'messages', component: MessagesComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'calendar', component: CalendarComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'patent_form/:id/:step', component: PatentComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'patent_form/:id/:step/:typeDocument/:operation', component: PatentComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'copyright-software_form/:id/:step', component: CopyrightSoftwareComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'copyright-software_form/:id/:step/:typeDocument/:operation', component: CopyrightSoftwareComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'copyright-database_form/:id/:step', component: CopyrightDatabaseComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'copyright-database_form/:id/:step/:typeDocument/:operation', component: CopyrightDatabaseComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'industrial-secret_form/:id/:step', component: IndustrialSecretComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: 'industrial-secret_form/:id/:step/:typeDocument/:operation', component: IndustrialSecretComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
  {path: '**', component: NopagefoundComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
