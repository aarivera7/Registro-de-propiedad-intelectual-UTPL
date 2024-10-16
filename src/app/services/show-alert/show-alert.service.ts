import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowAlertService {
  private alertSubject = new Subject<{ show: boolean, message: string, isInnerHtml: boolean }>();
  alertState$ = this.alertSubject.asObservable();

  showAlert(message: string, isInnerHtml: boolean = false) {
    this.alertSubject.next({ show: true, message, isInnerHtml });
    setTimeout(() => {
      this.alertSubject.next({ show: false, message: '', isInnerHtml: false });
    }, 3000); // Hide alert after 3 seconds
  }

  closeAlert() {
    this.alertSubject.next({ show: false, message: '', isInnerHtml: false });
  }
}
