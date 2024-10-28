import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-add-to-project',
  standalone: true,
  imports: [],
  templateUrl: './add-to-project.component.html',
  styleUrl: './add-to-project.component.css',
})
export class AddToProjectComponent implements OnInit {
  @Input() user: User | undefined;
  projectId: string | null = null;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  handleAdd(): void {
    const loggedInUser = this.authService.getLoggedInUsername();

    if (!this.user || !this.projectId || !loggedInUser) return;

    this.projectService
      .addToProject(this.projectId, this.user, loggedInUser)
      .subscribe();

    this.router.navigate(['/projects', this.projectId]);
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
  }
}
