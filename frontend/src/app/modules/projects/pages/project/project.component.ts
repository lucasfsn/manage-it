import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, Task } from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { EditProjectComponent } from '../../components/edit-project/edit-project.component';
import { ProjectInformationComponent } from '../../components/project-information/project-information.component';
import { TasksComponent } from '../../components/tasks/tasks.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    SpinnerComponent,
    MatIconModule,
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
  public showChat = signal<boolean>(false);

  constructor(
    private projectService: ProjectService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
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

  handleEdit() {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      return;
    }

    this.dialog.open(EditProjectComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
      data: {
        project: this.project,
      },
    });
  }

  handleMoveTask(task: Task) {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      return;
    }

    this.projectService.moveTask(projectId, task).subscribe();
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
