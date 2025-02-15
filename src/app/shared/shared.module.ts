import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { ShortAlertComponent } from './short-alert/short-alert.component';



@NgModule({
  declarations: [
    AlertComponent,
    ShortAlertComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    ShortAlertComponent
  ]
})
export class SharedModule { }
