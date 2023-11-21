import { Component } from '@angular/core';
import { Certification } from 'src/app/models/certification';
import { LoginService } from '../services/login.service';
import { CertificationsService } from '../services/certifications.service';
import { Auth } from '@angular/fire/auth';
import { User } from '../models/user';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.css']
})
export class CertificationsComponent {
  certifications: Certification[]
  // certifications=[new Certification("Propiedad Intelectual 2.0", "Diana Elizabeth Ramirez Cuenca", "01 de septiembre de 2023", "20 de septiembre de 2023")]
  user: User

  constructor(private certificationService: CertificationsService, private loginService: LoginService){
    this.certifications = []
    this.user = new User("", "", "", )
  }
  
  ngOnInit(): void {
    this.certificationService.getCertifications().subscribe(certifications => {
      console.log(certifications);
      this.certifications = certifications.map(x => Object.assign(new Certification("", "", "", ""), x))
    })
    
    this.loginService.getDataUser(this.loginService.uid).then(user =>{
      console.log(user)
      this.user = user
    })
  }

}
