import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DragDropListComponent } from '../../components/drag-drop-list/drag-drop-list.component';
import { ProjectDetailsComponent } from '../../components/project-details/project-details.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [MatIconModule, ProjectDetailsComponent, DragDropListComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {}
