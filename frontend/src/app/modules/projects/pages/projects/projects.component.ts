import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ProjectsListComponent } from '../../components/projects-list/projects-list.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectsListComponent, MatIconModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {}
