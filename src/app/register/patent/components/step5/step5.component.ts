import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.css']
})
export class Step5Component {
  @Input() 
  project!: Project
  @Input()
  typeDocument?: string

  nameDocuments: string[] = [
    "Copias de cédulas y certificado de votación a color",
    "Certificado docentes y estudiantes",
    "Certificado de autores",
    "Datos de autores",
    "Memorias descriptivas",
  ]
  
  typeDocuments: string[] = [
    "idDocuments",
    "teacherStudentCertificate",
    "authorsCertificate",
    "dataAuthors",
    "descriptiveMemories",
  ]

  constructor(private router: Router) { }

  redirectUpdateDocuments(typeDocument: string){
    this.router.navigate([`/${this.project.type}_form/${this.project.getId}/5/${typeDocument}`])
  }

  getTitle(typeDocument: string): string{
    return this.nameDocuments[this.typeDocuments.indexOf(typeDocument)]
  }

  ngOnInit(): void {
    console.log(this.project)
  }
}
