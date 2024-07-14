import { Component } from '@angular/core';
import { ProjectsService } from '../services/projects.service';

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
      console.log(data);
      this.alertMessage = "Solicitud enviada";
      this.loading = false; // Ocultar el ícono de carga
    }).catch(() => {
      this.loading = false; // Ocultar el ícono de carga en caso de error
    });
  }

  ngOnInit(): void {}
}
