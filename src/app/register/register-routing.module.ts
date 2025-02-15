import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CopyrightDatabaseComponent } from './copyright-database/copyright-database.component';
import { CopyrightSoftwareComponent } from './copyright-software/copyright-software.component';
import { IndustrialSecretComponent } from './industrial-secret/industrial-secret.component';
import { PatentComponent } from './patent/patent.component';


const routes: Routes = [
  {
    path: 'patent_form/:id/:step',
    component: PatentComponent,
  },
  {
    path: 'patent_form/:id/:step/:typeDocument/:operation',
    component: PatentComponent,
  },
  {
    path: 'copyright-software_form/:id/:step',
    component: CopyrightSoftwareComponent,
  },
  {
    path: 'copyright-software_form/:id/:step/:typeDocument/:operation',
    component: CopyrightSoftwareComponent,
  },
  {
    path: 'copyright-database_form/:id/:step',
    component: CopyrightDatabaseComponent,
  },
  {
    path: 'copyright-database_form/:id/:step/:typeDocument/:operation',
    component: CopyrightDatabaseComponent,
  },
  {
    path: 'industrial-secret_form/:id/:step',
    component: IndustrialSecretComponent,
  },
  {
    path: 'industrial-secret_form/:id/:step/:typeDocument/:operation',
    component: IndustrialSecretComponent,
  },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
