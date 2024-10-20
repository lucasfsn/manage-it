import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { User as ProjectMember } from '../../../../core/models/project.model';

@Component({
  selector: 'app-show-more-members',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './show-more-members.component.html',
  styleUrl: './show-more-members.component.css',
})
export class ShowMoreMembersComponent {
  constructor(
    private dialogRef: MatDialogRef<ShowMoreMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { members: ProjectMember[] }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
