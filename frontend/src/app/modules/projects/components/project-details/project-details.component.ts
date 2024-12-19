import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalService } from '../../../../core/services/confirm-modal.service';
import { Project, ProjectStatus } from '../../../../features/dto/project.model';
import { AuthService } from '../../../../features/services/auth.service';
import { LoadingService } from '../../../../features/services/loading.service';
import { MappersService } from '../../../../features/services/mappers.service';
import { ProjectService } from '../../../../features/services/project.service';
import { TranslationService } from '../../../../features/services/translation.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { ShowMoreMembersComponent } from '../../../../shared/components/show-more-members/show-more-members.component';
import { CustomDatePipe } from '../../../../shared/pipes/custom-date.pipe';
import { EditProjectComponent } from '../edit-project/edit-project.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    ConfirmModalComponent,
    CustomDatePipe,
    TranslateModule,
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent {
  public constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private projectService: ProjectService,
    private toastrService: ToastrService,
    private router: Router,
    private confirmModalService: ConfirmModalService,
    private loadingService: LoadingService,
    private translationService: TranslationService,
    private mappersService: MappersService
  ) {}

  protected get isModalOpen(): boolean {
    return this.confirmModalService.isOpen();
  }

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
    const projectId = this.project?.id;

    if (!projectId) return;

    const confirmation$ = this.confirmModalService.confirm(
      this.translationService.translate('project.details.DELETE_MESSAGE')
    );

    confirmation$.subscribe((confirmed) => {
      if (!confirmed) return;

      this.projectService.deleteProject(projectId).subscribe({
        error: (err) => {
          this.toastrService.error(err.message);
        },
        complete: () => {
          this.toastrService.success(
            this.translationService.translate('project.details.PROJECT_DELETED')
          );
          this.router.navigate(['/projects']);
        },
      });
    });
  }

  protected handleComplete(): void {
    const project = this.project;

    if (!project) return;

    const confirmation$ = this.confirmModalService.confirm(
      this.translationService.translate('project.details.COMPLETE_MESSAGE')
    );

    confirmation$.subscribe((confirmed) => {
      if (!confirmed) return;

      this.loadingService.loadingOn();
      this.projectService.completeProject(project).subscribe({
        error: (err) => {
          this.toastrService.error(err.message);
          this.loadingService.loadingOff();
        },
        complete: () => {
          this.toastrService.success(
            this.translationService.translate(
              'project.details.PROJECT_COMPLETED'
            )
          );
          this.loadingService.loadingOff();
        },
      });
    });
  }

  protected handleEdit(): void {
    const projectId = this.project?.id;

    if (!projectId) return;

    this.dialog.open(EditProjectComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
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
    return this.mappersService.projectStatusMapper(
      this.project?.status ?? ProjectStatus.IN_PROGRESS
    );
  }
}
