import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { Project, Status } from '../../../../core/models/project.model';
import { User } from '../../../../core/models/user.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { UserService } from '../../../../core/services/user.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    SpinnerComponent,
    RouterLink,
    CommonModule,
    MatIconModule,
    DatePipe,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  public commonProjects: Project[] = [];

  readonly Status = Status;

  constructor(
    private loadingService: LoadingService,
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  get user(): User | undefined {
    return this.userService.loadedUser();
  }

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  isLoggedInUser(userName: string): boolean {
    return this.userService.getLoggedInUser()?.userName === userName;
  }

  private loadUserData(params: ParamMap): void {
    const username = params.get('username');

    if (!username) return;

    this.loadingService.loadingOn();
    this.userService.getUserByUsername(username).subscribe({
      next: (user) => {
        this.commonProjects =
          user?.projects.filter((project) =>
            project.members.find((member) => member.userName === username)
          ) || [];
      },
      error: () => {
        this.location.back();
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.loadUserData(params);
    });
  }
}
