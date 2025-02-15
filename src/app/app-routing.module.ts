import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';

import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

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
  {
    path: 'register-pi',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: '**', component: NopagefoundComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
