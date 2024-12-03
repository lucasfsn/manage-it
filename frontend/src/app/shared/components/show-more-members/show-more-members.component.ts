import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../features/dto/project.model';
import { ProjectService } from '../../../features/services/project.service';
import { TaskService } from '../../../features/services/task.service';

@Component({
  selector: 'app-show-more-members',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './show-more-members.component.html',
  styleUrl: './show-more-members.component.css',
})
export class ShowMoreMembersComponent {
  isOnlyShow = inject<{ isOnlyShow: boolean }>(MAT_DIALOG_DATA).isOnlyShow;
  isOnProject = inject<{ isOnProject: boolean }>(MAT_DIALOG_DATA).isOnProject;

  constructor(
    private dialogRef: MatDialogRef<ShowMoreMembersComponent>,
    private projectService: ProjectService,
    private taskService: TaskService,
    private toastrService: ToastrService
  ) {}

  get members(): User[] | undefined {
    return this.isOnProject
      ? this.projectService.loadedProject()?.members
      : this.taskService.loadedTask()?.members;
  }

  get projectOwner() {
    return this.projectService.loadedProject()?.owner;
  }

  handleRemove(user: User): void {
    this.projectService.removeFromProject(user).subscribe({
      error: (error) => {
        this.toastrService.error(error.message);
      },
      complete: () => {
        this.toastrService.success(
          `${user.firstName} ${user.lastName} has been removed from project`
        );
      },
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
