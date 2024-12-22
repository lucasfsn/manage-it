import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../features/dto/project.model';
import { LoadingService } from '../../../features/services/loading.service';
import { MapperService } from '../../../features/services/mapper.service';
import { ProjectService } from '../../../features/services/project.service';
import { TaskService } from '../../../features/services/task.service';
import { TranslationService } from '../../../features/services/translation.service';
import { ProfileIconComponent } from '../profile-icon/profile-icon.component';

@Component({
  selector: 'app-show-more-members',
  standalone: true,
  imports: [MatIconModule, TranslateModule, ProfileIconComponent],
  templateUrl: './show-more-members.component.html',
  styleUrl: './show-more-members.component.scss',
})
export class ShowMoreMembersComponent {
  protected isOnlyShow = inject<{ isOnlyShow: boolean }>(MAT_DIALOG_DATA)
    .isOnlyShow;
  protected isOnProject = inject<{ isOnProject: boolean }>(MAT_DIALOG_DATA)
    .isOnProject;
  protected loading: boolean = false;

  public constructor(
    private dialogRef: MatDialogRef<ShowMoreMembersComponent>,
    private projectService: ProjectService,
    private taskService: TaskService,
    private toastrService: ToastrService,
    private loadingService: LoadingService,
    private router: Router,
    private translationService: TranslationService,
    private mapperService: MapperService
  ) {}

  protected get members(): User[] | undefined {
    return this.isOnProject
      ? this.projectService.loadedProject()?.members
      : this.taskService.loadedTask()?.members;
  }

  protected get projectOwner(): User | undefined {
    return this.projectService.loadedProject()?.owner;
  }

  protected handleRemove(user: User): void {
    const projectId = this.projectService.loadedProject()?.id;
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

  protected onClose(): void {
    this.dialogRef.close();
  }

  protected handleNavigateToProfile(user: User): void {
    this.router.navigate(['/users', user.username]);
    this.dialogRef.close();
  }
}
