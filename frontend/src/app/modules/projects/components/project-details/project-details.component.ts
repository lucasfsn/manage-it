import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MapperService } from '@/app/core/services/mapper.service';
import { Project, ProjectStatus } from '@/app/features/dto/project.model';
import { AuthService } from '@/app/features/services/auth.service';
import { ProjectService } from '@/app/features/services/project.service';
import { ButtonComponent } from '@/app/shared/components/button/button.component';
import { ChatComponent } from '@/app/shared/components/chat/chat.component';
import { ProfileIconComponent } from '@/app/shared/components/profile-icon/profile-icon.component';
import { SearchComponent } from '@/app/shared/components/search/search.component';
import { DatePipe } from '@/app/shared/pipes/date.pipe';
import { ProjectManageMembersComponent } from '@/app/modules/projects/components/project-manage-members/project-manage-members.component';
import { ProjectMenuComponent } from '@/app/modules/projects/components/project-menu/project-menu.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    DatePipe,
    TranslateModule,
    ButtonComponent,
    ProfileIconComponent,
    ChatComponent,
    ProjectMenuComponent,
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent {
  protected showChat: boolean = false;

  public constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private projectService: ProjectService,
    private mapperService: MapperService
  ) {}

  protected get project(): Project | null {
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

  protected toggleChat(): void {
    this.showChat = !this.showChat;
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
      this.project?.status ?? ProjectStatus.IN_PROGRESS
    );
  }
}
