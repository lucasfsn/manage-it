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
import { UserProfileRouteData } from '../../users.routes';
import { AddToProjectComponent } from '../add-to-project/add-to-project.component';
import { EditProfileFormComponent } from '../edit-profile/edit-profile-form.component';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { UserProjectsListComponent } from '../user-projects-list/user-projects-list.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    MatIconModule,
    AddToProjectComponent,
    TranslateModule,
    UserProjectsListComponent,
    UserHeaderComponent,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit {
  protected addToProject = false;

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

  protected get user(): User | undefined {
    return this.userService.loadedUser();
  }

  protected isLoggedInUser(username: string): boolean {
    return this.authService.getLoggedInUsername() === username;
  }

  protected openEditProfileDialog(): void {
    this.dialog.open(EditProfileFormComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
      data: {
        user: this.user,
      },
    });
  }

  public ngOnInit(): void {
    const { routeType } = this.route.snapshot.data as UserProfileRouteData;

    if (routeType === 'addToProject') this.addToProject = true;

    this.route.paramMap.subscribe((params) => {
      const username = params.get('username');
      if (username) {
        this.titleService.setTitle(`${username} | ManageIt`);
      }
    });
  }
}
