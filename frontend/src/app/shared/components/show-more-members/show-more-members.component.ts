import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { User } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-show-more-members',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './show-more-members.component.html',
  styleUrl: './show-more-members.component.css',
})
export class ShowMoreMembersComponent {
  isOnlyShow = inject<{ isOnlyShow: boolean }>(MAT_DIALOG_DATA).isOnlyShow;

  constructor(
    private dialogRef: MatDialogRef<ShowMoreMembersComponent>,
    private projectService: ProjectService
  ) {}

  get members() {
    return this.projectService.loadedProject()?.members;
  }

  handleRemove(user: User): void {
    this.projectService.removeFromProject(user).subscribe();
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
