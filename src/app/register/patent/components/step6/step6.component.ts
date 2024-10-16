import { Component, Input } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';
import { ShowAlertService } from 'src/app/services/show-alert/show-alert.service';

@Component({
  selector: 'app-step6',
  templateUrl: './step6.component.html',
  styleUrls: ['./step6.component.css']
})
export class Step6Component {
  @Input() 
  project!: Project

  @Input()
  user: User = new User("", "",  "",   )

  loading: boolean = false
  loadingLegalizedContract: boolean = false
  loadingContract: boolean = false
  loadingApplication: boolean = false

  constructor(private storage: Storage, 
      private projectService: ProjectsService, 
      private alertService: ShowAlertService) { }

  uploadLegalizedContract (event: Event){
    this.loadingLegalizedContract = true

    const input: HTMLInputElement = event.target as HTMLInputElement

    if (!input.files) return

    if(!this.project.legalizedContract)
      this.project.legalizedContract = {}
    
    const file: File = input.files[0];
    const pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/legalizedContract.pdf`);
    
    uploadBytesResumable(pdfRef, file).then(task => {
      getDownloadURL(task.ref).then(url => {  
          this.project.legalizedContract.document = url
          this.project.legalizedContract.date = Timestamp.now()
          this.projectService.updateProject(this.project)
              .then(() => {
                this.alertService.showAlert("Contrato legalizado subido correctamente")
              });
        }).catch();
      })
        .finally(() => this.loadingLegalizedContract = false);

    input.value = ''
  }

  uploadContract (event: Event){
    this.loadingContract = true

    const input: HTMLInputElement = event.target as HTMLInputElement

    if (!input.files) return

    if(!this.project.contract)
      this.project.contract = {}
    
    const file: File = input.files[0];
    const pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/contract.pdf`);
    
    uploadBytesResumable(pdfRef, file).then(task => {

      getDownloadURL(task.ref).then(async url => {  
          this.project.contract.document = url
          this.project.numStep = 6
          this.project.contract.date = Timestamp.now()
          this.projectService.updateProject(this.project)
              .then(() => {
                this.alertService.showAlert("Contrato subido correctamente")
              });

          this.projectService.sendEmail(this.project, "contract")
              .then(a => console.log(a))
              .catch(err => console.log(err))
        }).catch();
      })
        .finally(() => this.loadingContract = false);

    input.value = ''
  }

  uploadApplication (event: Event){
    this.loadingApplication = true

    const input: HTMLInputElement = event.target as HTMLInputElement

    if (!input.files) return

    if(!this.project.application)
      this.project.application = {}
    
    const file: File = input.files[0];
    const pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/application.pdf`);
    
    uploadBytesResumable(pdfRef, file).then(task => {
      getDownloadURL(task.ref).then(url => {  
        this.project.application.document = url
        this.project.numStep = 6
        this.project.application.date = Timestamp.now()
        this.projectService.updateProject(this.project)
            .then(() => {
              this.alertService.showAlert("Solicitud subida correctamente")
            });
      }).catch();
    })
      .finally(() => this.loadingApplication = false);

    input.value = ''
  }

  publishProject(): void {
  this.loading = true
  this.projectService.publishProject(this.project)
      .then((data) => {
        console.log(data);
        this.alertService.showAlert("Certificado emitido correctamente")
      })
      .catch(err => console.log(err))
      .finally(() => this.loading = false);
  }

  ngOnChanges(): void {
    if(!this.project.contract){
      this.project.contract = {}
    }
  }
}
