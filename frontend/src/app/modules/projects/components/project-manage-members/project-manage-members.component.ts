import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MapperService } from '../../../../core/services/mapper.service';
import { TranslationService } from '../../../../core/services/translation.service';
import { Project, User } from '../../../../features/dto/project.model';
import { ProjectService } from '../../../../features/services/project.service';
import { ProfileIconComponent } from '../../../../shared/components/profile-icon/profile-icon.component';

@Component({
  selector: 'app-project-manage-members',
  standalone: true,
  imports: [MatIconModule, TranslateModule, ProfileIconComponent],
  templateUrl: './project-manage-members.component.html',
  styleUrl: './project-manage-members.component.scss',
})
export class ProjectManageMembersComponent {
  protected loading: boolean = false;

  public constructor(
    private dialogRef: MatDialogRef<ProjectManageMembersComponent>,
    private projectService: ProjectService,
    private toastrService: ToastrService,
    private router: Router,
    private translationService: TranslationService,
    private mapperService: MapperService
  ) {}

  protected get project(): Project | null {
    return this.projectService.loadedProject();
  }

  protected get members(): User[] {
    return this.project?.members || [];
  }

  protected handleRemove(user: User): void {
    const projectId = this.project?.id;
    if (!projectId) return;

    this.loading = true;
    this.projectService.removeFromProject(user, projectId).subscribe({
      next: () => {
        this.toastrService.success(
          `${user.firstName} ${
            user.lastName
          } ${this.translationService.translate(
            'toast.success.MEMBER_REMOVED_FROM_PROJECT'
          )}`
        );
      },
      error: () => {
        const localeMessage = this.mapperService.errorToastMapper();
        this.toastrService.error(localeMessage);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  protected handleClose(): void {
    this.dialogRef.close();
  }

  protected handleNavigateToProfile(user: User): void {
    this.router.navigate(['/users', user.username]);
    this.dialogRef.close();
  }
}
