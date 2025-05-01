import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DragDropListComponent } from '@/app/modules/projects/components/drag-drop-list/drag-drop-list.component';
import { ProjectDetailsComponent } from '@/app/modules/projects/components/project-details/project-details.component';

@Component({
  selector: 'app-project',
  imports: [MatIconModule, ProjectDetailsComponent, DragDropListComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {}
