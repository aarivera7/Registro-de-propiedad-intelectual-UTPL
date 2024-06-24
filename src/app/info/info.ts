import { Component } from '@angular/core';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.html',
  styleUrls: ['./info.css']
})

export class InfoComponent {
  title="Tipos de propiedad intelectual"

  constructor(private projectService: ProjectsService) {}

  requestForAdvice(): void {
    this.projectService.requestsForAdvice().then((data) => {
      console.log(data);
      alert('Solicitud enviada');
    });
  }

  ngOnInit(): void {}
}
