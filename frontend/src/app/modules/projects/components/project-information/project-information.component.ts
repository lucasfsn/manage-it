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
  selector: 'app-project-information',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './project-information.component.html',
  styleUrl: './project-information.component.css',
})
export class ProjectInformationComponent {
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private projectService: ProjectService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get project(): Project | undefined {
    return this.projectService.loadedProject();
  }

  get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  get isOwner(): boolean {
    return (
      this.project?.owner.username === this.authService.getLoggedInUsername()
    );
  }

  handleDelete() {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      return;
    }

    const confirmDelete = confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmDelete) {
      return;
    }

    this.projectService.deleteProject(projectId).subscribe({
      next: () => {
        this.router.navigate(['/projects']);
        this.toastrService.success('Project has been deleted');
      },
      error: (err) => {
        this.toastrService.error(err.message || 'Failed to delete project');
      },
    });
  }

  handleComplete() {
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

  handleEdit() {
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

  showAllMembers(isOnlyShow: boolean): void {
    this.dialog.open(ShowMoreMembersComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
      data: {
        isOnlyShow,
      },
    });
  }

  openSearchDialog(): void {
    this.dialog.open(SearchComponent, {
      width: '600px',
      panelClass: 'search-dialog',
      backdropClass: 'dialog-backdrop',
      data: {
        projectId: this.project?.id,
      },
    });
  }

  mapProjectStatus(): string {
    return projectStatusMapper(
      this.project?.status ?? ProjectStatus.InProgress
    );
  }
}
