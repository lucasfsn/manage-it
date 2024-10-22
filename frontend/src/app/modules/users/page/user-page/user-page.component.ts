import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { Project, Status } from '../../../../core/models/project.model';
import { User } from '../../../../core/models/user.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { UserService } from '../../../../core/services/user.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [SpinnerComponent, RouterLink, CommonModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
})
export class UserPageComponent implements OnInit {
  public user = signal<User | undefined>(undefined);
  public isLoading = signal<boolean>(false);
  public commonProjects: Project[] = [];

  readonly Status = Status;

  constructor(
    private loadingService: LoadingService,
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  isLoggedInUser(userName: string): boolean {
    return this.userService.getLoggedInUser()?.userName === userName;
  }

  loadUserData(params: ParamMap): void {
    const username = params.get('username');

    if (!username) return;

    this.loadingService.loadingOn();
    this.userService.getUserByUsername(username).subscribe({
      next: (user) => {
        this.user.set(user);

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
      this.loadingService.loading$.subscribe((loading) => {
        this.isLoading.set(loading);
      });

      this.loadUserData(params);
    });
  }
}
