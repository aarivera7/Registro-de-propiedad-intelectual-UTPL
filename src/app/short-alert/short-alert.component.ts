import { Component, OnInit } from '@angular/core';
import { ShowAlertService } from '../services/show-alert/show-alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-short-alert',
  templateUrl: './short-alert.component.html',
  styleUrls: ['./short-alert.component.css']
})
export class ShortAlertComponent implements OnInit {
  showAlert = false;
  alertMessage = '';
  isInnerHtml = false;
  subscriptionAlert!: Subscription

  constructor(private alertService: ShowAlertService) {}

  ngOnInit() {
    this.subscriptionAlert = this.alertService.alertState$.subscribe(state => {
      this.showAlert = state.show;
      this.alertMessage = state.message;
      this.isInnerHtml = state.isInnerHtml;
    });
  }

  ngOnDestroy() {
    this.subscriptionAlert.unsubscribe();
  }

  closeAlert() {
    this.alertService.closeAlert();
  }

  
}
