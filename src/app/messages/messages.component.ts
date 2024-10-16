import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from 'src/app/models/message';
import { MessagesService } from '../services/messages.service';
import { User } from '../models/user';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../models/project';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  projects: Project[]
  messages: Message[]
  subscriptionProjects!: Subscription
  subscriptionMessages!: Subscription
  inputMessages: boolean[]
  openModal: boolean | null = null
  user: User = new User("", "",  "",   )

  formNewMessage: FormGroup = new FormGroup({})
  formNewResponse: FormGroup = new FormGroup({
    response: new FormControl('', [Validators.required, Validators.nullValidator, Validators.minLength(1)]),
    messageId: new FormControl('', [Validators.nullValidator]),
  })

  constructor(
    private messagesService: MessagesService, 
    private loginService: LoginService, 
    protected router: Router,
    private projectService: ProjectsService,
    private storage: Storage
  ){
    this.messages = []
    this.projects = []
    this.inputMessages = []
  }

  async newMessage(input: HTMLInputElement): Promise<void> {
    const resultId = (await this.messagesService.newMessage(this.formNewMessage.value)).data;

    this.formNewMessage.reset()

    this.openModal = null;

    if (!input.files) return;
    
    const file: File = input.files[0];
    let pdfRef = ref(this.storage, `messages/${resultId.messageId}/${file.name}`);

    await uploadBytesResumable(pdfRef, file).then(task => {
      pdfRef = task.ref
    }).catch();

    getDownloadURL(pdfRef).then(url => {  
      this.messages[this.messages.length - 1].evidence = url
    }).catch();
  }

  newResponse(messageId: string, i: number): void {
    this.formNewResponse.setControl('messageId', new FormControl(messageId, [Validators.required, Validators.nullValidator]));
    this.inputMessages[i] = false
    console.log(this.formNewResponse.value);
    this.messagesService.newResponse(this.formNewResponse.value).then(response  => {
      console.log(response);
    }).catch(err => console.log(err));

    this.formNewResponse.reset()
  }

  getDate(): Date {
    return new Date()
  }

  async ngOnInit(): Promise<void>{
    
    this.user = Object.assign(new User("", "",  "",   ), await this.loginService.getDataUser(this.loginService.uid))

    if (this.user.rol == "admin") { 
      this.subscriptionMessages = this.messagesService.getMessages(undefined).subscribe(messages => {
        console.log(messages);
        this.messages = messages.map(x => Object.assign(new Message("", "", "", "", ""), x))
      })
    } else {
      this.subscriptionProjects = this.projectService.getProjects(this.loginService.uid).subscribe(projects => {
        this.projects = projects.map(x => Object.assign(new Project("", "", "", "", "", ""), x))
      })
      this.subscriptionMessages = this.messagesService.getMessages(this.loginService.uid).subscribe(messages => {
        console.log(messages);
        this.messages = messages.map(x => Object.assign(new Message("", "", "", "", ""), x))
      })
    }

    this.inputMessages = new Array(this.messages.length).fill(false)

    this.formNewMessage = new FormGroup({
      sender: new FormControl(
        {value: this.user.name + " " + this.user.lastName, disabled: true}, 
        [Validators.required, Validators.nullValidator, Validators.pattern(this.user.name + " " + this.user.lastName)]
      ),
      projectId: new FormControl<string>('', [Validators.required, Validators.nullValidator]),
      date: new FormControl(Timestamp.now()),
      subject: new FormControl<string>('', [Validators.required, Validators.nullValidator, Validators.minLength(1)]),
    })	
  }

  ngOnDestroy(): void {
    if (this.subscriptionMessages) {
      this.subscriptionMessages.unsubscribe();
    }
    if (this.subscriptionProjects) {
      this.subscriptionProjects.unsubscribe();
    }
  }
}
