import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../features/dto/user.model';
import { ProjectService } from '../../../../features/services/project.service';

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
    private toastrService: ToastrService
  ) {}

  handleAdd(): void {
    if (!this.user || !this.projectId) return;

    this.projectService.addToProject(this.projectId, this.user).subscribe({
      error: (error) => {
        this.toastrService.error(error.message);
      },
      complete: () => {
        this.toastrService.success(
          `${this.user?.firstName} ${this.user?.lastName} has been added to project`
        );
        this.router.navigate(['/projects', this.projectId]);
      },
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
  }
}
