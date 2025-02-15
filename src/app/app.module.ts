import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import localePy from '@angular/common/locales/es-EC'
import { registerLocaleData } from '@angular/common';

registerLocaleData(localePy, 'es')

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideStorage,getStorage } from '@angular/fire/storage';

// Date import
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProjectsComponent } from './projects/projects.component';
import { RequerimentsComponent } from './requeriments/requeriments.component';
import { CertificationsComponent } from './certifications/certifications.component';
import { MessagesComponent } from './messages/messages.component';
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
import { AlertComponent } from './alert/alert.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { AppRoutingModule } from './app-routing.module';

import { LoginService } from './services/login.service';
import { ShortAlertComponent } from './short-alert/short-alert.component';
import { MeetingComponent } from './register/components/meeting/meeting.component';

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
    AlertComponent,
    NopagefoundComponent,
    ShortAlertComponent,
    MeetingComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    FullCalendarModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [LoginService, {provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
