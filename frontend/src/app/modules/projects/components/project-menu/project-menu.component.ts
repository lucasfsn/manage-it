import { Component, DestroyRef, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalService } from '@/app/core/services/confirm-modal.service';
import { LoadingService } from '@/app/core/services/loading.service';
import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { Project, ProjectStatus } from '@/app/features/dto/project.model';
import { AuthService } from '@/app/features/services/auth.service';
import { ProjectService } from '@/app/features/services/project.service';
import { ButtonComponent } from '@/app/shared/components/button/button.component';

@Component({
  selector: 'app-project-menu',
  standalone: true,
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

  protected get project(): Project | null {
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
      this.translationService.translate('project.details.DELETE_MESSAGE'),
    );

    const subscription = confirmation$.subscribe((confirmed) => {
      if (!confirmed) return;

      this.loadingService.loadingOn();
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.toastrService.success(
            this.translationService.translate('toast.success.PROJECT_DELETED'),
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

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  protected handleComplete(): void {
    const project = this.project;

    if (!project) return;

    const confirmation$ = this.confirmModalService.confirm(
      this.translationService.translate('project.details.COMPLETE_MESSAGE'),
    );

    const subscription = confirmation$.subscribe((confirmed) => {
      if (!confirmed) return;

      this.loadingService.loadingOn();
      this.projectService.completeProject(project).subscribe({
        next: () => {
          this.toastrService.success(
            this.translationService.translate(
              'toast.success.PROJECT_COMPLETED',
            ),
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

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
