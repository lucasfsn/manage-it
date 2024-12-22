import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Project, ProjectStatus } from '../../../../features/dto/project.model';
import { AuthService } from '../../../../features/services/auth.service';
import { ConfirmModalService } from '../../../../features/services/confirm-modal.service';
import { MapperService } from '../../../../features/services/mapper.service';
import { ProjectService } from '../../../../features/services/project.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { ProfileIconComponent } from '../../../../shared/components/profile-icon/profile-icon.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { ShowMoreMembersComponent } from '../../../../shared/components/show-more-members/show-more-members.component';
import { DatePipe } from '../../../../shared/pipes/date.pipe';
import { ProjectMenuComponent } from '../project-menu/project-menu.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    ConfirmModalComponent,
    DatePipe,
    TranslateModule,
    ButtonComponent,
    ProfileIconComponent,
    ChatComponent,
    ProjectMenuComponent,
  ],
  animations: [
    trigger('chatAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateY(20px)',
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
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
    private confirmModalService: ConfirmModalService,
    private mapperService: MapperService
  ) {}

  protected get isModalOpen(): boolean {
    return this.confirmModalService.isOpen();
  }

  protected get project(): Project | undefined {
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

  protected showAllMembers(isOnlyShow: boolean): void {
    this.dialog.open(ShowMoreMembersComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
      data: {
        isOnlyShow,
        isOnProject: true,
      },
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
