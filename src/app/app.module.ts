import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router'
import { FullCalendarModule } from '@fullcalendar/angular';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { LoginService } from './services/login.service';
import { ProjectsComponent } from './projects/projects.component';
import { RequerimentsComponent } from './requeriments/requeriments.component';
import { CertificationsComponent } from './certifications/certifications.component';
import { MessagesComponent } from './messages/messages.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard'

// Date import
import localePy from '@angular/common/locales/es-EC'
import { registerLocaleData } from '@angular/common';
import { CalendarComponent } from './calendar/calendar.component';
import { PatentComponent } from './register/patent/patent.component';
import { ProgressBarComponent } from './register/components/progress-bar/progress-bar.component';
import { Step1Component } from './register/patent/components/step1/step1.component';
import { Step2Component } from './register/patent/components/step2/step2.component';
import { Step3Component } from './register/patent/components/step3/step3.component';
import { Step4Component } from './register/patent/components/step4/step4.component';
import { Step5Component } from './register/patent/components/step5/step5.component';
import { MultipleFileLoadComponent } from './register/components/multiple-file-load/multiple-file-load.component';
import { Step6Component } from './register/patent/components/step6/step6.component';
import { CopyrightSoftwareComponent } from './register/copyright-software/copyright-software.component';
import { Step1DuSComponent } from './register/general-steps/step1-du-s/step1-du-s.component';
import { Step2DuSComponent } from './register/general-steps/step2-du-s/step2-du-scomponent';
import { Step3DuSComponent } from './register/general-steps/step3-du-s/step3-du-s.component';
import { CopyrightDatabaseComponent } from './register/copyright-database/copyright-database.component';
import { IndustrialSecretComponent } from './register/industrial-secret/industrial-secret.component';
import {InfoComponent} from "./info/info";
registerLocaleData(localePy, 'es')

const appRoutes:Routes=[
  {path:'', component:LoginComponent, ...canActivate(() => redirectLoggedInTo(['/info']))},
  {path:'login', component: LoginComponent, ...canActivate(() => redirectLoggedInTo(['/info']))},
  {path:'info', component:InfoComponent, ...canActivate(() => redirectUnauthorizedTo(['/login']))},
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
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProjectsComponent,
    RequerimentsComponent,
    CertificationsComponent,
    MessagesComponent,
    CalendarComponent,
    PatentComponent,
    ProgressBarComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    MultipleFileLoadComponent,
    Step6Component,
    CopyrightSoftwareComponent,
    Step1DuSComponent,
    Step2DuSComponent,
    Step3DuSComponent,
    CopyrightDatabaseComponent,
    IndustrialSecretComponent,
    InfoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    FullCalendarModule,
    ReactiveFormsModule,
  ],
  providers: [LoginService, {provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
