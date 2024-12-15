import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../features/services/auth.service';
import { LoadingService } from '../../../../features/services/loading.service';
import { ProjectService } from '../../../../features/services/project.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { CreateProjectComponent } from '../../components/create-project/create-project.component';
import { ProjectsListComponent } from '../../components/projects-list/projects-list.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectsListComponent, SpinnerComponent, MatIconModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  constructor(
    private loadingService: LoadingService,
    private projectService: ProjectService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  protected get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  protected openCreateProjectDialog(): void {
    this.dialog.open(CreateProjectComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
    });
  }

  private loadProjects(): void {
    const username = this.authService.getLoggedInUsername();

    if (!username) return;

    this.loadingService.loadingOn();
    this.projectService.getProjects().subscribe({
      error: () => {
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }

  public ngOnInit(): void {
    this.loadProjects();
  }
}
