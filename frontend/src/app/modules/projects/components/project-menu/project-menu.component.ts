import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalService } from '../../../../core/services/confirm-modal.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { MapperService } from '../../../../core/services/mapper.service';
import { TranslationService } from '../../../../core/services/translation.service';
import { Project, ProjectStatus } from '../../../../features/dto/project.model';
import { AuthService } from '../../../../features/services/auth.service';
import { ProjectService } from '../../../../features/services/project.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-project-menu',
  standalone: true,
  imports: [ButtonComponent, MatIconModule, ConfirmModalComponent],
  templateUrl: './project-menu.component.html',
  styleUrl: './project-menu.component.scss',
})
export class ProjectMenuComponent {
  public constructor(
    private projectService: ProjectService,
    private confirmModalService: ConfirmModalService,
    private translationService: TranslationService,
    private toastrService: ToastrService,
    private loadingService: LoadingService,
    private mapperService: MapperService,
    private authService: AuthService,
    private router: Router
  ) {}

  protected get project(): Project | null {
    return this.projectService.loadedProject();
  }

  protected get isOwner(): boolean {
    return (
      this.project?.owner.username === this.authService.getLoggedInUsername()
    );
  }

  protected get isModalOpen(): boolean {
    return this.confirmModalService.isModalOpen;
  }

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
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

      this.loadingService.loadingOn();
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.toastrService.success(
            this.translationService.translate('toast.success.PROJECT_DELETED')
          );
          this.router.navigate(['/projects']);
        },
        error: () => {
          const localeMessage = this.mapperService.errorToastMapper();
          this.toastrService.error(localeMessage);
          this.loadingService.loadingOff();
        },
        complete: () => {
          this.loadingService.loadingOff();
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
        next: () => {
          this.toastrService.success(
            this.translationService.translate('toast.success.PROJECT_COMPLETED')
          );
        },
        error: () => {
          const localeMessage = this.mapperService.errorToastMapper();
          this.toastrService.error(localeMessage);
          this.loadingService.loadingOff();
        },
        complete: () => {
          this.loadingService.loadingOff();
        },
      });
    });
  }
}
