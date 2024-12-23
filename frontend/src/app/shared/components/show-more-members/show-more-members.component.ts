import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Project, User } from '../../../features/dto/project.model';
import { MapperService } from '../../../features/services/mapper.service';
import { ProjectService } from '../../../features/services/project.service';
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
  protected loading: boolean = false;

  public constructor(
    private dialogRef: MatDialogRef<ShowMoreMembersComponent>,
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
