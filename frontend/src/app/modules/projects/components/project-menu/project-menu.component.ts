import { ConfirmModalService } from '@/app/core/services/confirm-modal.service';
import { LoadingService } from '@/app/core/services/loading.service';
import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { ProjectDto } from '@/app/features/dto/project.dto';
import { AuthService } from '@/app/features/services/auth.service';
import { ProjectService } from '@/app/features/services/project.service';
import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import { ButtonComponent } from '@/app/shared/components/ui/button/button.component';
import { ErrorResponse } from '@/app/shared/types/error-response.type';
import { Component, DestroyRef, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-menu',
  imports: [ButtonComponent, MatIconModule],
  templateUrl: './project-menu.component.html',
  styleUrl: './project-menu.component.scss',
})
export class ProjectMenuComponent {
  private destroyRef = inject(DestroyRef);

  public constructor(
    private projectService: ProjectService,
    private confirmModalService: ConfirmModalService,
    private translationService: TranslationService,
    private toastrService: ToastrService,
    private loadingService: LoadingService,
    private mapperService: MapperService,
    private authService: AuthService,
    private router: Router,
  ) {}

  protected get project(): ProjectDto | null {
    return this.projectService.loadedProject();
  }

  protected get isOwner(): boolean {
    return (
      this.project?.owner.username === this.authService.getLoggedInUsername()
    );
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
      this.translationService.translate('project.details.message.DELETE'),
    );

    const subscription = confirmation$.subscribe((confirmed) => {
      if (!confirmed) return;

      this.loadingService.loadingOn();
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.toastrService.success(
            this.translationService.translate('toast.success.project.DELETE'),
          );
          this.router.navigate(['/projects']);
        },
        error: (error: ErrorResponse) => {
          const localeMessage = this.mapperService.errorToastMapper(
            error.code,
            'project',
          );
          this.toastrService.error(localeMessage);
          this.loadingService.loadingOff();
        },
        complete: () => {
          this.loadingService.loadingOff();
        },
      });
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  protected handleComplete(): void {
    const project = this.project;

    if (!project) return;

    const confirmation$ = this.confirmModalService.confirm(
      this.translationService.translate('project.details.message.COMPLETE'),
    );

    const subscription = confirmation$.subscribe((confirmed) => {
      if (!confirmed) return;

      this.loadingService.loadingOn();
      this.projectService.completeProject(project).subscribe({
        next: () => {
          this.toastrService.success(
            this.translationService.translate('toast.success.project.COMPLETE'),
          );
        },
        error: (error: ErrorResponse) => {
          const localeMessage = this.mapperService.errorToastMapper(
            error.code,
            'project',
          );
          this.toastrService.error(localeMessage);
          this.loadingService.loadingOff();
        },
        complete: () => {
          this.loadingService.loadingOff();
        },
      });
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
