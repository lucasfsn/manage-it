import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../features/dto/project.model';
import { LoadingService } from '../../../features/services/loading.service';
import { ProjectService } from '../../../features/services/project.service';
import { TaskService } from '../../../features/services/task.service';

@Component({
  selector: 'app-show-more-members',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './show-more-members.component.html',
  styleUrl: './show-more-members.component.scss',
})
export class ShowMoreMembersComponent {
  protected isOnlyShow = inject<{ isOnlyShow: boolean }>(MAT_DIALOG_DATA)
    .isOnlyShow;
  protected isOnProject = inject<{ isOnProject: boolean }>(MAT_DIALOG_DATA)
    .isOnProject;

  public constructor(
    private dialogRef: MatDialogRef<ShowMoreMembersComponent>,
    private projectService: ProjectService,
    private taskService: TaskService,
    private toastrService: ToastrService,
    private loadingService: LoadingService,
    private router: Router
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

    this.loadingService.loadingOn();
    this.projectService.removeFromProject(user, projectId).subscribe({
      error: (error) => {
        this.loadingService.loadingOff();
        this.toastrService.error(error.message);
      },
      complete: () => {
        this.loadingService.loadingOff();
        this.toastrService.success(
          `${user.firstName} ${user.lastName} has been removed from project`
        );
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
