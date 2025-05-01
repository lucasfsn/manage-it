import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ProjectsListComponent } from '@/app/modules/projects/components/projects-list/projects-list.component';
import { ButtonComponent } from '@/app/shared/components/button/button.component';

@Component({
    selector: 'app-projects',
    imports: [ProjectsListComponent, MatIconModule, RouterLink, ButtonComponent],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.scss'
})
export class ProjectsComponent {}
