import { Component, Input } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL} from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { ProjectDocument } from 'src/app/models/document';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectDocumentsService } from 'src/app/services/project-documents/project-documents.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { ShowAlertService } from 'src/app/services/show-alert/show-alert.service';

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
  formReviewMeeting!: FormGroup;

  projectDocument?: ProjectDocument
  subscriptionDocument!: Subscription

  loading: boolean = false;
  loadingMemory: boolean = false;
  oldMethod: boolean = false

  selectedFileName: string | null = null;

  @Input()
  user?: User

  constructor(private storage: Storage, private projectService: ProjectsService, private documentService: ProjectDocumentsService, private alertService: ShowAlertService) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
    }
  }

  async uploadPDF (input: HTMLInputElement): Promise<void> {
    if (!input.files) return

    this.loadingMemory = true
    
    const file: File = input.files[0];
    const pdfRef = ref(this.storage, `projects/${this.project.type}/${this.project.getId}/descriptiveMemories/descriptiveMemories_${this.project.getId}.pdf`);
      
    const task = await uploadBytesResumable(pdfRef, file, {customMetadata: {isReplaced: 'true'}})

    this.url = await getDownloadURL(task.ref)

    if (!this.projectDocument) {
      this.projectDocument = new ProjectDocument(
        "Pendiente",
        "",
        [this.url],
        Timestamp.now(),
        "descriptiveMemories", 
        this.project.uid
      )
    }
    else {
      const idx = this.projectDocument!.documents.findIndex((doc: string) => doc == this.url)
      
      this.projectDocument.documents[idx == -1 ? 0 : idx] = this.url
      this.projectDocument.setDateNow = Timestamp.now()
    }
    this.documentService.addProjectDocument(this.projectDocument, this.project.getId)
        .then(() => this.alertService.showAlert("¡Documento subido correctamente!"))
        .catch(err => console.log(err))
        .finally(() => this.loadingMemory = false)
        
    input.value = ''
    this.selectedFileName = null
  }

  async approve(): Promise<void> {
    this.loadingMemory = true
    if (this.oldMethod) {
      this.project.documents['descriptiveMemories'].status = "Aceptado"
      this.project.documents['descriptiveMemories'].observation = this.formObservations.get('observations')?.value
      await this.projectService.updateProject(this.project)
    }
    else {
      const projectDocument = {
        type: "descriptiveMemories",
        status: "Aceptado",
        observation: this.formObservations.get('observations')?.value
      }

      this.project.approveStep2 = true

      await this.documentService.updateProjectAndDocument(projectDocument, this.project)
    }
    this.projectService.sendEmail(this.project, "approved-step2")
        .then(() => this.alertService.showAlert('¡Documentos aprobados exitosamente!'))
        .catch(err => console.log(err))
        .finally(() => this.loadingMemory = false)
  }

  updateObservations(): void {
    this.loadingMemory = true
    if (this.oldMethod) {
      this.project.documents['descriptiveMemories'].observation = this.formObservations.get('observations')?.value
      this.projectService.updateProject(this.project).finally(() => this.loading = false)
    } else {
      this.documentService.updateProjectDocument(
        {
          type: "descriptiveMemories",
          observation: this.formObservations.get('observations')?.value
        }, 
        this.project.getId
      )   .then(() => this.alertService.showAlert('¡Observaciones actualizadas exitosamente!'))
          .finally(() => this.loadingMemory = false);
    }
  }



  confirmAssistance(): void {
    this.loading = true

    this.projectService.confirmAssistance(this.project.memoryReviewMeeting.meetingId)
        .then(() => this.alertService.showAlert('!Bien, has confirmado tu asistencia!'))
        .catch(err => console.log(err))
        .finally(() => this.loading = false)
  }

  createMeeting(): void {
    this.loading = true

    let date = this.formReviewMeeting.get('date')?.value.split('-')

    let timeStart = new Date(
      parseInt(date[0]), 
      parseInt(date[1])-1, 
      parseInt(date[2]), 
      parseInt(this.formReviewMeeting.get('timeStart')?.value.split(':')[0]), 
      parseInt(this.formReviewMeeting.get('timeStart')?.value.split(':')[1])
    )

    let timeFinish = new Date(
      parseInt(date[0]), 
      parseInt(date[1])-1, 
      parseInt(date[2]), 
      parseInt(this.formReviewMeeting.get('timeFinish')?.value.split(':')[0]), 
      parseInt(this.formReviewMeeting.get('timeFinish')?.value.split(':')[1])
    )

    if (timeStart < new Date()) {
      alert("La fecha de inicio no puede ser menor a la fecha actual")
      this.loading = false
      return
    }

    if (timeFinish < timeStart) {
      alert("La fecha de fin no puede ser menor a la fecha de inicio")
      this.loading = false
      return
    }

    if (this.formReviewMeeting.invalid) {
      alert("Por favor, complete los campos")
      this.loading = false
      return
    }

    if (!this.project.memoryReviewMeeting)
      this.project.memoryReviewMeeting = {}

    this.project.memoryReviewMeeting.timeStart = Timestamp.fromDate(
      timeStart
    )

    this.project.memoryReviewMeeting.timeFinish = Timestamp.fromDate( 
      timeFinish
    );

    this.project.memoryReviewMeeting.assistance = false
    this.project.memoryReviewMeeting.place = this.formReviewMeeting.get('place')?.value
    this.project.memoryReviewMeeting.modality = this.formReviewMeeting.get('modality')?.value
    this.project.numStep = 3
    // this.projectService.updateProject(this.project)
    // .catch(err => console.log(err))

    this.projectService.addReviewMeeting(this.project, this.project.memoryReviewMeeting, "memory")
        .then(() => this.alertService.showAlert("¡Reunión creada correctamente!"))
        .catch(err => console.log(err))
        .finally(() => this.loading = false);
  }


  async ngOnChanges(): Promise<void> {
    this.subscriptionDocument = this.documentService.getProjectDocument(this.project.getId, "descriptiveMemories")
        .subscribe((projectDocument) => {
          if (projectDocument) {
            this.formObservations.get('observations')?.setValue(projectDocument.observation)
            if (projectDocument.documents) {
              this.url = projectDocument.documents[0]
            }

            this.projectDocument = projectDocument
          }
          if (projectDocument && projectDocument.status == "Aceptado") {
            this.formObservations.get('observations')?.disable()
          }
        });


        // Memory Review Meeting
        let dStart: Date
        let dFinish: Date
    
        if (this.project.memoryReviewMeeting) {
          dStart = this.project.memoryReviewMeeting.timeStart.toDate();
          dFinish = this.project.memoryReviewMeeting.timeFinish.toDate();
        } else {
          dStart = new Date()
          dFinish = new Date()
    
          // 1 hour meeting
          dStart.setHours(dStart.getHours() + 1)
          dFinish.setHours(dStart.getHours() + 1)
        }
    
        let date = dStart.getFullYear() + "-" + 
            (dStart.getMonth() + 1).toString().padStart(2, '0') + "-" + 
            dStart.getDate().toString().padStart(2, '0')
    
        let timeStart = dStart.getHours().toString().padStart(2, '0') + ":" +
            dStart.getMinutes().toString().padStart(2, '0')
    
        let timeFinish = dFinish.getHours().toString().padStart(2, '0') + ":" +
            dFinish.getMinutes().toString().padStart(2, '0')
    
        this.formReviewMeeting = new FormGroup({
          date: new FormControl(
              date,
              [Validators.required, Validators.nullValidator]
            ),
          timeStart: new FormControl(
              timeStart,
              [Validators.required, Validators.nullValidator]
            ),
          timeFinish: new FormControl(
              timeFinish,
              [Validators.required, Validators.nullValidator]
            ),
          place: new FormControl(
              this.project.memoryReviewMeeting?.place,
              [Validators.required, Validators.nullValidator]
            ),
          modality: new FormControl(
              this.project.memoryReviewMeeting?.modality, 
              [Validators.required, Validators.nullValidator]
            ),
        })
    
        if (this.project.memoryReviewMeeting && this.project.memoryReviewMeeting.assistance || this.project.approveStep2) {
          this.formReviewMeeting.disable()
        }
  }

  ngOnDestroy(): void {
    this.subscriptionDocument.unsubscribe()
  }
}
