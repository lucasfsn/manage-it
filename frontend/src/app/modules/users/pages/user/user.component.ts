import { Location } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {
  ProjectStatus,
  UserProject,
} from '../../../../features/dto/project.model';
import { User } from '../../../../features/dto/user.model';
import { AuthService } from '../../../../features/services/auth.service';
import { LoadingService } from '../../../../features/services/loading.service';
import { UserService } from '../../../../features/services/user.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { DatePipe } from '../../../../shared/pipes/date.pipe';
import { AddToProjectComponent } from '../../components/add-to-project/add-to-project.component';
import { EditProfileFormComponent } from '../../components/edit-profile/edit-profile-form.component';
import { UserProfileRouteData } from '../../users.routes';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    SpinnerComponent,
    RouterLink,
    MatIconModule,
    DatePipe,
    AddToProjectComponent,
    TranslateModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  protected commonProjects: UserProject[] = [];
  protected addToProject = false;

  public constructor(
    private loadingService: LoadingService,
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog,
    private authService: AuthService,
    private toastrService: ToastrService,
    private titleService: Title
  ) {}

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  protected get user(): User | undefined {
    return this.userService.loadedUser();
  }

  protected get isLoading(): boolean {
    return this.loadingService.isLoading();
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

  private loadUserData(params: ParamMap): void {
    const username = params.get('username');

    if (!username) return;

    this.loadingService.loadingOn();
    this.userService.getUserByUsername(username).subscribe({
      next: (user) => {
        this.commonProjects = user.projects.filter((project) =>
          project.members.find((member) => member.username === username)
        );
      },
      error: (error) => {
        this.toastrService.error(error.message);
        this.location.back();
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }

  public ngOnInit(): void {
    const { routeType } = this.route.snapshot.data as UserProfileRouteData;

    if (routeType === 'addToProject') this.addToProject = true;

    const subscription = this.route.paramMap.subscribe((params) => {
      const username = params.get('username');
      if (username) this.titleService.setTitle(`${username} | ManageIt`);

      this.loadUserData(params);
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
