import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '../../../../core/models/project.model';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { UserService } from '../../../../core/services/user.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { CreateNewProjectComponent } from '../../components/create-new-project/create-new-project.component';
import { ProjectsListComponent } from '../../components/projects-list/projects-list.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    ProjectsListComponent,
    SpinnerComponent,
    CreateNewProjectComponent,
    MatIconModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  constructor(
    private loadingService: LoadingService,
    private projectService: ProjectService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  get projects(): Project[] | undefined {
    return this.projectService.loadedProjects();
  }

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  openCreateProjectDialog(): void {
    this.dialog.open(CreateNewProjectComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
    });
  }

  private loadProjects(): void {
    const username = this.authService.getLoggedInUsername();

    if (!username) return;

    this.loadingService.loadingOn();
    this.projectService.getProjects(username).subscribe({
      error: () => {
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }
}
