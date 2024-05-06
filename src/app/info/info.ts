import { Component } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ProjectsService } from '../services/projects.service';
import { LoginService } from '../services/login.service';
import { User } from '../models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './info.html',
  styleUrls: ['./info.css']
})

export class InfoComponent {
  title="Tipos de propiedad intelectual"


  ngOnInit(): void {}
}
