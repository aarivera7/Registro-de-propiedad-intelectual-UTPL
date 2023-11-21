import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { LoginService } from '../services/login.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formLogin: FormGroup;
  constructor(private loginService:LoginService, private router: Router){
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  ngOnInit(): void {
    
  }

  loginAuth(form: NgForm) {
    this.loginService.login(form.value)
    .then(res => {
      console.log(res);
      this.router.navigate(['/projects'])
    })
    .catch(err => console.log(err))
  }

  /*loginAuth(form:NgForm){
    const email = form.value.email
    const password = form.value.password

    this.loginService.login(email, password);
  }*/
}