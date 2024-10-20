import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Project, Status } from '../../../../core/models/project.model';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { ShowMoreMembersComponent } from '../show-more-members/show-more-members.component';

@Component({
  selector: 'app-project-information',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './project-information.component.html',
  styleUrl: './project-information.component.css',
})
export class ProjectInformationComponent {
  @Input() project!: Project;
  @Input() handleDelete!: () => void;
  Status = Status;

  constructor(private dialog: MatDialog) {}

  showMoreMembers(): void {
    const members = this.project.members;
    if (members) {
      this.dialog.open(ShowMoreMembersComponent, {
        data: { members },
        width: '400px',
        backdropClass: 'dialog-backdrop',
      });
    }
  }

  openSearchDialog(): void {
    this.dialog.open(SearchComponent, {
      width: '600px',
      panelClass: 'search-dialog',
      backdropClass: 'dialog-backdrop',
    });
  }
}
