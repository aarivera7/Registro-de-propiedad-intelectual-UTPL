import { Component, Input } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component {
  @Input() 
  project!: Project
  url: string = ""
  formObservations: FormGroup = new FormGroup({
    observations: new FormControl('', Validators.nullValidator)
  })

  @Input()
  user: User = new User("", "",  "",   )

  constructor(private storage: Storage, private projectService: ProjectsService) { }

  uploadPDF (input: HTMLInputElement){
    if (!input.files) return
    
    const file: File = input.files[0];
    const pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/descriptiveMemories/${file.name}`);
    
    uploadBytesResumable(pdfRef, file).then(task => {
      getDownloadURL(task.ref).then(url => {  
        if(this.project.documents == undefined)
          console.log("Error")

        if(this.project.documents['descriptiveMemories'] == undefined)
          this.project.documents['descriptiveMemories'] = {}

        if(this.project.documents['descriptiveMemories'].documents == undefined)
          this.project.documents['descriptiveMemories'].documents = []

        this.project.documents['descriptiveMemories'].documents.push(url)
        this.project.numStep = 3
        this.project.documents['descriptiveMemories'].status = "Pendiente"
        this.project.documents['descriptiveMemories'].date = Timestamp.now()
        this.project.documents['descriptiveMemories'].observation = ""
        this.projectService.updateProject(this.project)
        this.url = url
      }).catch();
    });
  }

  approve(): void {
    this.project.documents['descriptiveMemories'].status = "Aprobado"
    this.projectService.updateProject(this.project)
  }

  updateObservations(): void {
    this.project.documents['descriptiveMemories'].observation = this.formObservations.get('observations')?.value
    this.projectService.updateProject(this.project)
  }

  ngOnChanges(): void {
    if(this.project.documents == undefined)
      this.project.documents = {}
    else
      this.url = this.project.documents['descriptiveMemories'].documents[0]
  }

}
