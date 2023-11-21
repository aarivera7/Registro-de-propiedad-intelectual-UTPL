import { Component } from '@angular/core';
import { Message } from 'src/app/models/message';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  messages: Message[]
  //messages=[new Message("Diana Elizabeth Ramirez Cuenca", "Propiedad Intelectual 2.0", "Los lideres colocaran todas las actividades a realizar en el planner", "Prueba xd", "11/10/2023")]

  constructor(private messagesService: MessagesService){
    this.messages = []
  }

  ngOnInit(): void{
    this.messagesService.getMessages().subscribe(messages => {
      console.log(messages);
      this.messages = messages.map(x => Object.assign(new Message("", "", "", "", ""), x))
    })
  }
}
