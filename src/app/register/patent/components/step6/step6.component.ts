import { Component, Input } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';

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

  constructor(private storage: Storage, private projectService: ProjectsService) { }

  uploadLegalizedContract (input: HTMLInputElement){
    if (!input.files) return

    if(!this.project.legalizedContract)
      this.project.legalizedContract = {}
    
    const file: File = input.files[0];
    const pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/legalizedContract.pdf`);
    
    uploadBytesResumable(pdfRef, file).then(task => {
      getDownloadURL(task.ref).then(url => {  
        this.project.legalizedContract.document = url
        this.project.numStep = 6
        this.project.legalizedContract.date = Timestamp.now()
        this.projectService.updateProject(this.project)
      }).catch();
    });

    input.value = ''
  }

  uploadContract (input: HTMLInputElement){
    if (!input.files) return

    if(!this.project.contract)
      this.project.contract = {}
    
    const file: File = input.files[0];
    const pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/contract.pdf`);
    
    uploadBytesResumable(pdfRef, file).then(task => {
      getDownloadURL(task.ref).then(url => {  
        this.project.contract.document = url
        this.project.numStep = 6
        this.project.contract.date = Timestamp.now()
        this.projectService.updateProject(this.project)
      }).catch();
    });

    input.value = ''
  }

  uploadApplication (input: HTMLInputElement){
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
      }).catch();
    });

    input.value = ''
  }

  publishProject(): void {
  this.projectService.publishProject(this.project).then((data) => {
      console.log(data);
    }).catch(err => console.log(err));
  }

  ngOnChanges(): void {
    if(!this.project.contract){
      this.project.contract = {}
    }
  }
}
