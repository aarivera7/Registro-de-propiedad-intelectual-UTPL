import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultipleFileLoadComponent } from './components/multiple-file-load/multiple-file-load.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { CopyrightDatabaseComponent } from './copyright-database/copyright-database.component';
import { CopyrightSoftwareComponent } from './copyright-software/copyright-software.component';
import { Step1DuSComponent } from './general-steps/step1-du-s/step1-du-s.component';
import { Step2DuSComponent } from './general-steps/step2-du-s/step2-du-scomponent';
import { Step3DuSComponent } from './general-steps/step3-du-s/step3-du-s.component';
import { IndustrialSecretComponent } from './industrial-secret/industrial-secret.component';
import { Step1Component } from './patent/components/step1/step1.component';
import { Step2Component } from './patent/components/step2/step2.component';
import { Step3Component } from './patent/components/step3/step3.component';
import { Step4Component } from './patent/components/step4/step4.component';
import { Step5Component } from './patent/components/step5/step5.component';
import { Step6Component } from './patent/components/step6/step6.component';
import { PatentComponent } from './patent/patent.component';
import { RegisterRoutingModule } from './register-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
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
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class RegisterModule { }
