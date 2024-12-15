import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project, ProjectStatus } from '../../../../features/dto/project.model';
import { AuthService } from '../../../../features/services/auth.service';
import { ProjectService } from '../../../../features/services/project.service';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { ShowMoreMembersComponent } from '../../../../shared/components/show-more-members/show-more-members.component';
import { projectStatusMapper } from '../../../../shared/utils/status-mapper';
import { EditProjectComponent } from '../edit-project/edit-project.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css',
})
export class ProjectDetailsComponent {
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private projectService: ProjectService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  protected get project(): Project | undefined {
    return this.projectService.loadedProject();
  }

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  protected get isOwner(): boolean {
    return (
      this.project?.owner.username === this.authService.getLoggedInUsername()
    );
  }

  protected handleGoBack(): void {
    if (!this.project) return;

    this.router.navigate(['/projects']);
  }

  protected handleDelete(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      return;
    }

    const confirmDelete = confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmDelete) return;

    this.projectService.deleteProject(projectId).subscribe({
      error: (err) => {
        this.toastrService.error(err.message);
      },
      complete: () => {
        this.toastrService.success('Project has been deleted');
        this.router.navigate(['/projects']);
      },
    });
  }

  protected handleComplete(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      return;
    }

    const confirmComplete = confirm(
      'Are you sure you want to mark this project as completed?'
    );

    if (!confirmComplete) {
      return;
    }

    this.projectService.completeProject().subscribe({
      error: (err) => {
        this.toastrService.error(err.message);
      },
    });
  }

  protected handleEdit(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      return;
    }

    this.dialog.open(EditProjectComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
      data: {
        project: this.project,
      },
    });
  }

  protected showAllMembers(isOnlyShow: boolean): void {
    this.dialog.open(ShowMoreMembersComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
      data: {
        isOnlyShow,
        isOnProject: true,
      },
    });
  }

  protected openSearchDialog(): void {
    if (!this.project) return;

    this.dialog.open(SearchComponent, {
      width: '600px',
      panelClass: 'search-dialog',
      backdropClass: 'dialog-backdrop',
      data: {
        projectId: this.project.id,
      },
    });
  }

  protected mapProjectStatus(): string {
    return projectStatusMapper(
      this.project?.status ?? ProjectStatus.IN_PROGRESS
    );
  }
}
