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
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { ChatComponent } from '../../../../shared/components/chat/chat.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { TasksComponent } from '../../../tasks/components/tasks/tasks.component';
import { ProjectInformationComponent } from '../../components/project-information/project-information.component';

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
    private router: Router
  ) {}

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  toggleChat() {
    this.showChat.set(!this.showChat());
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
