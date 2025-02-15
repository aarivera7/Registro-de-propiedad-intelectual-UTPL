import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PatentComponent } from './register/patent/patent.component';
import { CopyrightSoftwareComponent } from './register/copyright-software/copyright-software.component';
import { CopyrightDatabaseComponent } from './register/copyright-database/copyright-database.component';
import { IndustrialSecretComponent } from './register/industrial-secret/industrial-secret.component';

import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { hasRoleGuard } from './guards/has-role.guard';

const routes: Routes = [
  {
    path:'', 
    component: LoginComponent,
    ...canActivate(() => redirectLoggedInTo(['/info']))
  },
  {
    path:'login',
    component: LoginComponent,
    ...canActivate(() => redirectLoggedInTo(['/info']))
  },
  {
    path: '',
    loadChildren: () => import('./main-interface/main-interface.module').then(m => m.MainInterfaceModule),
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
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
