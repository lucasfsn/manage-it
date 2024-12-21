import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../../features/services/loading.service';
import { ProjectService } from '../../../../features/services/project.service';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { TasksComponent } from '../../../tasks/components/tasks/tasks.component';
import { ProjectDetailsComponent } from '../../components/project-details/project-details.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    SpinnerComponent,
    MatIconModule,
    TasksComponent,
    ChatComponent,
    ProjectDetailsComponent,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
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
  private destroyRef = inject(DestroyRef);
  protected showChat = signal<boolean>(false);

  public constructor(
    private projectService: ProjectService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  protected get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  protected toggleChat(): void {
    this.showChat.set(!this.showChat());
  }

  private loadProject(projectId: string | null): void {
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

  public ngOnInit(): void {
    const subscription = this.route.paramMap.subscribe((params) => {
      const projectId = params.get('projectId');
      this.loadProject(projectId);
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
