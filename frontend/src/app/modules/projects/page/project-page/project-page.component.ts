import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project, Status } from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    DatePipe,
    SpinnerComponent,
    MatIconModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.css',
})
export class ProjectPageComponent implements OnInit {
  Status = Status;
  isLoading = signal(false);
  private projectService = inject(ProjectService);

  project: Signal<Project | null> = this.projectService.loadedProject;

  constructor(
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      this.toastrService.error('Project ID is missing');
      this.router.navigate(['/projects']);
      return;
    }

    this.loadingService.loadingOn();
    this.projectService.getProject(projectId).subscribe({
      error: (error: Error) => {
        this.toastrService.error(error.message);
        this.loadingService.loadingOff();
        this.router.navigate(['/projects']);
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }
}
