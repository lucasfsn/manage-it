import { ProjectsListComponent } from '@/app/modules/projects/components/projects-list/projects-list.component';
import { ButtonComponent } from '@/app/shared/components/ui/button/button.component';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects',
  imports: [ProjectsListComponent, MatIconModule, RouterLink, ButtonComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {}
