import { MapperService } from '@/app/core/services/mapper.service';
import { ProjectDto } from '@/app/features/dto/project.dto';
import { AuthService } from '@/app/features/services/auth.service';
import { ProjectService } from '@/app/features/services/project.service';
import { ProjectManageMembersComponent } from '@/app/modules/projects/components/project-manage-members/project-manage-members.component';
import { ProjectMenuComponent } from '@/app/modules/projects/components/project-menu/project-menu.component';
import { ProjectStatus } from '@/app/modules/projects/types/project-status.type';
import { ChatToggleComponent } from '@/app/shared/components/chat-toggle/chat-toggle.component';
import { SearchComponent } from '@/app/shared/components/search/search.component';
import { ProfileIconComponent } from '@/app/shared/components/ui/profile-icon/profile-icon.component';
import { DatePipe } from '@/app/shared/pipes/date.pipe';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-project-details',
  imports: [
    RouterLink,
    MatIconModule,
    DatePipe,
    TranslateModule,
    ProfileIconComponent,
    ProjectMenuComponent,
    ChatToggleComponent,
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent {
  public constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private projectService: ProjectService,
    private mapperService: MapperService,
  ) {}

  protected get project(): ProjectDto | null {
    return this.projectService.loadedProject();
  }

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  protected get isOwner(): boolean {
    return (
      this.project?.owner.username === this.authService.getLoggedInUsername()
    );
  }

  protected showAllMembers(): void {
    this.dialog.open(ProjectManageMembersComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
    });
  }

  protected openSearchDialog(): void {
    if (!this.project) return;

    this.dialog.open(SearchComponent, {
      width: '600px',
      panelClass: 'search-dialog',
      backdropClass: 'dialog-backdrop',
      data: {
        projectId: this.project.id,
      },
    });
  }

  protected mapProjectStatus(): string {
    return this.mapperService.projectStatusMapper(
      this.project?.status ?? ProjectStatus.IN_PROGRESS,
    );
  }
}
