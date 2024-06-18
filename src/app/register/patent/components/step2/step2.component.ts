import { Component, Input } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL, getMetadata, updateMetadata } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  user?: User

  constructor(private storage: Storage, private projectService: ProjectsService) { }

  async uploadPDF (input: HTMLInputElement): Promise<void> {
    if (!input.files) return
    
    const file: File = input.files[0];
    const pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/descriptiveMemories/descriptiveMemories_${this.project.getId}.pdf`);

    await updateMetadata(pdfRef, {customMetadata: {isReplaced: 'true'}}).catch(() => console.log("No se pudo actualizar el archivo"));
    
    const task = await uploadBytesResumable(pdfRef, file)

    this.url = await getDownloadURL(task.ref)

    if(!this.project.documents)
      this.project.documents = {}

    if(!this.project.documents['descriptiveMemories'])
      this.project.documents['descriptiveMemories'] = {}

    if(!this.project.documents['descriptiveMemories'].documents)
      this.project.documents['descriptiveMemories'].documents = []

    const idx = this.project.documents['descriptiveMemories'].documents.findIndex((doc: string) => doc == this.url)
    this.project.documents['descriptiveMemories'].documents[idx == -1 ? 0 : idx] = this.url
    this.project.documents['descriptiveMemories'].status = "Pendiente"
    this.project.documents['descriptiveMemories'].date = Timestamp.now()
    this.project.documents['descriptiveMemories'].observation = ""
    this.projectService.updateProject(this.project)
  }

  async approve(): Promise<void> {
    this.project.documents['descriptiveMemories'].status = "Aceptado"
    this.project.documents['descriptiveMemories'].observation = this.formObservations.get('observations')?.value
    await this.projectService.updateProject(this.project)

    this.projectService.sendEmail(this.project, "approved-step2")
    .then(a => console.log(a))
    .catch(err => console.log(err))
  }

  updateObservations(): void {
    this.project.documents['descriptiveMemories'].observation = this.formObservations.get('observations')?.value
    this.projectService.updateProject(this.project)
  }

  async ngOnChanges(): Promise<void> {
    if(this.project.documents && this.project.documents['descriptiveMemories']){
      this.formObservations.get('observations')?.setValue(this.project.documents['descriptiveMemories'].observation)
      if (this.project.documents['descriptiveMemories'].documents) {
        const pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/descriptiveMemories/descriptiveMemories_${this.project.getId}.pdf`)
        this.url = await getDownloadURL(pdfRef);
      }
    }
    if (this.project.documents && this.project.documents['descriptiveMemories'] && this.project.documents['descriptiveMemories'].status == "Aceptado") {
      this.formObservations.get('observations')?.disable()
    }

  }
}
