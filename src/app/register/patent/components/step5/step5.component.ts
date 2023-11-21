import { Component, Input } from '@angular/core';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.css']
})
export class Step5Component {
  @Input() 
  project!: Project
  typeDocuments: string[] = [
    "Copias de cédulas y certificado de votación a color",
    "Certificado docentes y estudiantes",
    "Certificado de autores",
    "Datos de autores",
    "Memores descriptiva",
  ]

  updateDocuments(i: number, events: any){
    this.project.documents[i] = events[i].target.value
  }
}
