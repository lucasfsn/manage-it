import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { UserService } from '../../../../core/services/user.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { CreateNewProjectComponent } from '../../components/create-new-project/create-new-project.component';
import { ProjectsListComponent } from '../../components/projects-list/projects-list.component';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [
    ProjectsListComponent,
    SpinnerComponent,
    CreateNewProjectComponent,
    MatIconModule,
  ],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.css',
})
export class ProjectsPageComponent implements OnInit {
  public isLoading = signal<boolean>(false);
  public projects = signal<Project[] | undefined>(undefined);

  constructor(
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private projectService: ProjectService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  openCreateProjectDialog(): void {
    const dialogRef = this.dialog.open(CreateNewProjectComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
    });

    dialogRef.componentInstance.projectAdded.subscribe(() => {
      this.loadProjects();
    });
  }

  loadProjects(): void {
    const username = this.userService.getLoggedInUser()?.userName;

    if (!username) return;

    this.loadingService.loadingOn();
    this.projectService.getProjects(username).subscribe({
      next: (projects) => {
        this.projects.set(projects);
      },
      error: (error: Error) => {
        this.toastrService.error(error.message);
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading.set(loading);
    });

    this.loadProjects();
  }
}
