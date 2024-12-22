import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TasksComponent } from '../../../task/components/tasks/tasks.component';
import { ProjectDetailsComponent } from '../../components/project-details/project-details.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [MatIconModule, TasksComponent, ProjectDetailsComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {}
