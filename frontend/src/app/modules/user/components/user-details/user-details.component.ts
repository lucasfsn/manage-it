import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectStatus } from '../../../../features/dto/project.model';
import { User } from '../../../../features/dto/user.model';
import { AuthService } from '../../../../features/services/auth.service';
import { UserService } from '../../../../features/services/user.service';
import { UserEditFormComponent } from '../user-edit-form/user-edit-form.component';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { UserProjectAddButtonComponent } from '../user-project-add-button/user-project-add-button.component';
import { UserProjectsListComponent } from '../user-projects-list/user-projects-list.component';

interface ParamsData {
  readonly username: string;
  readonly projectId?: string;
}

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    MatIconModule,
    TranslateModule,
    UserProjectsListComponent,
    UserHeaderComponent,
    UserProjectAddButtonComponent,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit {
  protected showAddToProjectButton = false;

  public constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService,
    private titleService: Title
  ) {}

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  protected get user(): User | null {
    return this.userService.loadedUser();
  }

  protected isLoggedInUser(username: string): boolean {
    return this.authService.getLoggedInUsername() === username;
  }

  protected openEditProfileDialog(): void {
    this.dialog.open(UserEditFormComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
      data: {
        user: this.user,
      },
    });
  }

  public ngOnInit(): void {
    const { username, projectId } = this.route.snapshot.params as ParamsData;

    if (username) this.titleService.setTitle(`${username} | ManageIt`);

    if (projectId) this.showAddToProjectButton = true;
  }
}
