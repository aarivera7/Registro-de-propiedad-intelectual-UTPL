import { Component } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.html',
  styleUrls: ['./info.css']
})

export class InfoComponent {
  title = "Tipos de propiedad intelectual"
  alertMessage?: string
  loading = false; // Nueva propiedad para manejar el estado de carga

  constructor(private projectService: ProjectsService) {}

  requestForAdvice(): void {
    this.loading = true; // Mostrar el ícono de carga
    this.projectService.requestsForAdvice().then((data) => {
      this.alertMessage = "Solicitud enviada";
    }).catch(() => {}).finally(() => {
      this.loading = false; // Ocultar el ícono de carga
    });
  }

  ngOnInit(): void {}
}
