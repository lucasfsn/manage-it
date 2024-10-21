import { CommonModule, DatePipe, DecimalPipe, Location } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Project, Status } from '../../../../core/models/project.model';
import { User } from '../../../../core/models/user.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { UserService } from '../../../../core/services/user.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [SpinnerComponent, RouterLink, DecimalPipe, DatePipe, CommonModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
})
export class UserPageComponent implements OnInit {
  public user: Signal<User | null>;
  public isLoading: boolean = false;
  public commonProjects: Project[] = [];

  readonly Status = Status;

  constructor(
    private loadingService: LoadingService,
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.user = this.userService.loadedUser;
  }

  isLoggedInUser(userName: string): boolean {
    return this.userService.getLoggedInUser()?.userName === userName;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const username = params.get('username');

      if (!username) {
        return;
      }

      this.loadingService.loading$.subscribe((loading) => {
        this.isLoading = loading;
      });

      this.loadingService.loadingOn();
      this.userService.getUserByUsername(username).subscribe({
        next: (user) => {
          if (user) {
            const currentLogInUser =
              this.userService.getLoggedInUser()?.userName;
            this.commonProjects = user.projects.filter((project) =>
              project.members.find(
                (member) => member.userName === currentLogInUser
              )
            );
          }
        },
        error: (error) => {
          this.loadingService.loadingOff();
          this.location.back();
        },
        complete: () => {
          this.loadingService.loadingOff();
        },
      });
    });
  }
}
