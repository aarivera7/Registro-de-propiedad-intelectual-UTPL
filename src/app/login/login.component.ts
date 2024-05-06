import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formLogin: FormGroup;
  isPasswordHidden: boolean = true;

  constructor(private loginService:LoginService, private router: Router){
    this.formLogin = new FormGroup({
      email: new FormControl('', Validators.email),
      password: new FormControl()
    })
  }

  loginAuth(): void {
    if(this.formLogin.invalid) return;

    if (this.formLogin.get('email')?.value == 'mapineda8@utpl.edu.ec'){
      if (this.isPasswordHidden) {
        this.isPasswordHidden = false;
        return;
      }

      this.loginService.login(this.formLogin.value)
      .then(res => {
        this.isPasswordHidden = true;
        this.router.navigate(['/projects'])
      })
      .catch(err => console.log(err))
    } 
    else if(this.formLogin.get('email')?.value.match("^[a-z0-9._%+-]+@utpl.edu.ec$")){
      this.loginAuthMicrosoft(this.formLogin.get('email')?.value);
      return;
    } 
    else if(this.formLogin.get('email')?.value.match("^[a-z0-9._%+-]+@gmail.com$")){
      this.loginAuthGoogle(this.formLogin.get('email')?.value);
      return;
    } 
    else {
      alert("Error al iniciar sesión: El correo no es válido.")
    }
  }

  loginAuthMicrosoft(email: string){
    this.loginService.loginWithMicrosoft(email)
    .then(res => {
      this.router.navigate(['/projects'])
    })
    .catch(err => console.log(err));
  }

  loginAuthGoogle(email: string){
    this.loginService.loginWithGoogle(email)
    .then(res => {
      this.router.navigate(['/projects'])
    })
    .catch(err => {
        console.log(err)
        alert("Error al iniciar sesión con Google: La cuenta no existe o no es válida.")
      }
    );
  }
}