import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Project, Status, Task } from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ProjectInformationComponent } from '../../components/project-information/project-information.component';
import { TasksComponent } from '../../components/tasks/tasks.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    SpinnerComponent,
    MatIconModule,
    RouterLink,
    TasksComponent,
    ProjectInformationComponent,
    CommonModule,
    ChatComponent,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
  animations: [
    trigger('chatAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateY(20px)',
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ProjectComponent implements OnInit {
  readonly Status = Status;
  public showChat = signal<boolean>(false);

  constructor(
    private projectService: ProjectService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get project(): Project | undefined {
    return this.projectService.loadedProject();
  }

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  toggleChat() {
    this.showChat.set(!this.showChat());
  }

  handleDelete() {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      return;
    }

    const confirmDelete = confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmDelete) {
      return;
    }

    this.projectService.deleteProject(projectId).subscribe({
      next: () => {
        this.router.navigate(['/projects']);
      },
    });
  }

  handleComplete() {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      return;
    }

    const confirmComplete = confirm(
      'Are you sure you want to mark this project as completed?'
    );

    if (!confirmComplete) {
      return;
    }

    this.projectService.completeProject(projectId).subscribe();
  }

  handleUpdate(task: Task) {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      return;
    }

    this.projectService.updateTask(projectId, task).subscribe();
  }

  private loadProject(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      this.router.navigate(['/projects']);
      return;
    }

    this.loadingService.loadingOn();
    this.projectService.getProject(projectId).subscribe({
      error: () => {
        this.loadingService.loadingOff();
        this.router.navigate(['/projects']);
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }

  ngOnInit(): void {
    this.loadProject();
  }
}
