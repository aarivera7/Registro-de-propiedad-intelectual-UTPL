import { Component, OnDestroy, OnInit } from '@angular/core';
import { Certification } from 'src/app/models/certification';
import { LoginService } from '../services/login.service';
import { CertificationsService } from '../services/certifications.service';
import { User } from '../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.css']
})
export class CertificationsComponent implements OnInit, OnDestroy {
  certifications?: Certification[]
  filteredCertifications?: Certification[]
  subscriptionCertifications!: Subscription
  filterText?: string
  user?: User
  filter1: any

  constructor(private certificationService: CertificationsService, private loginService: LoginService){}

  filterResults(text: string | undefined) {
    if (!this.certifications) return
    if (!text) {
      this.filterText = undefined
      this.filteredCertifications = this.certifications;
      return;
    }

    this.filterText = text
    this.filteredCertifications = this.certifications.filter(
      certification => certification?.name.toLowerCase().includes(text.toLowerCase())
    );
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.loginService.getDataUser(this.loginService.uid)

    if (this.user.rol == "admin") {
      this.subscriptionCertifications = this.certificationService.getCertifications(undefined).subscribe(certifications => {
        this.certifications = certifications.map(x => Object.assign(new Certification("", "", "", ""), x))
        this.filterResults(this.filterText)
      })
    } else if (this.user.rol == "user") {
      this.subscriptionCertifications = this.certificationService.getCertifications(this.loginService.uid).subscribe(certifications => {
        this.certifications = certifications.map(x => Object.assign(new Certification("", "", "", ""), x))
        this.filterResults(this.filterText)
      })
    }
  }

  ngOnDestroy(): void {
    this.subscriptionCertifications.unsubscribe()
  }
}
