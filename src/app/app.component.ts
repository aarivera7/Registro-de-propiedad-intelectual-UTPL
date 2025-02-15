import { Component } from '@angular/core';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';
import { User } from './models/user';
import { Auth, user } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  user: User = new User('', '', '');
  user$;
  title: string = "";
  aside: boolean = true;
  subscriptionUser?: Subscription;

  constructor(protected loginService: LoginService, protected router: Router, private auth: Auth){
    this.user$ = user(this.auth);
  }

  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }

  logout(): void{
    this.loginService.logout()
    .then(() => {
      this.router.navigate(['/login'])
      this.user = new User('', '', '')
    })
    .catch(err => console.log(err));
  }

  ngOnInit(): void {
    this.subscriptionUser = this.user$.subscribe(async aUser => {
      if (!aUser) return
      this.user = await this.loginService.getDataUser(aUser.uid)
      this.ngOnChanges()
    })
  }

  ngOnChanges(): void {
    if (['', '/info'].includes(this.router.url) && this.user.rol == 'admin') {
      this.router.navigate(['/projects'])
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptionUser) {
      this.subscriptionUser.unsubscribe()
    }
  }
}
