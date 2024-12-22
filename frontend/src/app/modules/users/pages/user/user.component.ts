import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ProjectStatus,
  UserProject,
} from '../../../../features/dto/project.model';
import { User } from '../../../../features/dto/user.model';
import { AuthService } from '../../../../features/services/auth.service';
import { UserService } from '../../../../features/services/user.service';
import { ProfileIconComponent } from '../../../../shared/components/profile-icon/profile-icon.component';
import { DatePipe } from '../../../../shared/pipes/date.pipe';
import { AddToProjectComponent } from '../../components/add-to-project/add-to-project.component';
import { EditProfileFormComponent } from '../../components/edit-profile/edit-profile-form.component';
import { UserProfileRouteData } from '../../users.routes';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    DatePipe,
    AddToProjectComponent,
    TranslateModule,
    ProfileIconComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  protected commonProjects: UserProject[] = [];
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

  private initProjectsInProfile(username: string): void {
    if (!this.user) return;

    this.commonProjects = this.user.projects.filter((project) =>
      project.members.find((member) => member.username === username)
    );
  }

  public ngOnInit(): void {
    const { routeType } = this.route.snapshot.data as UserProfileRouteData;

    if (routeType === 'addToProject') this.addToProject = true;

    this.route.paramMap.subscribe((params) => {
      const username = params.get('username');
      if (username) {
        this.titleService.setTitle(`${username} | ManageIt`);
        this.initProjectsInProfile(username);
      }
    });
  }
}
