import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  ProjectStatus,
  UserProject,
} from '../../../../core/models/project.model';
import { User } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { UserService } from '../../../../core/services/user.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { AddToProjectComponent } from '../../components/add-to-project/add-to-project.component';
import { EditProfileFormComponent } from '../../components/edit-profile/edit-profile-form.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    SpinnerComponent,
    RouterLink,
    CommonModule,
    MatIconModule,
    DatePipe,
    AddToProjectComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  commonProjects: UserProject[] = [];
  addToProject: boolean = false;

  constructor(
    private loadingService: LoadingService,
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}

  get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  get user(): User | undefined {
    return this.userService.loadedUser();
  }

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  isLoggedInUser(username: string): boolean {
    return this.authService.getLoggedInUsername() === username;
  }

  openEditProfileDialog(): void {
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
        this.commonProjects =
          user?.projects.filter((project) =>
            project.members.find((member) => member.username === username)
          ) || [];
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

  ngOnInit(): void {
    const routeType = this.route.snapshot.data['routeType'];

    if (routeType === 'addToProject') this.addToProject = true;

    this.route.paramMap.subscribe((params) => {
      this.loadUserData(params);
    });
  }
}
