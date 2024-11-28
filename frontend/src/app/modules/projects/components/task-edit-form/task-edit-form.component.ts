import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Priority,
  Task,
  TaskStatus,
  TaskUpdate,
} from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';
import { taskStatusMapper } from '../../../../shared/utils/status-mapper';

@Component({
  selector: 'app-task-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-edit-form.component.html',
  styleUrl: './task-edit-form.component.css',
})
export class TaskEditFormComponent implements OnInit {
  readonly TaskStatus = TaskStatus;
  readonly Priority = Priority;
  public form: FormGroup = new FormGroup({});

  constructor(
    private loadingService: LoadingService,
    private projectService: ProjectService
  ) {}

  get task(): Task | undefined {
    return this.projectService.loadedTask();
  }

  get priorities(): Priority[] {
    return Object.values(Priority);
  }

  get statuses(): TaskStatus[] {
    return Object.values(TaskStatus);
  }

  mapTaskStatus(taskStatus: TaskStatus): string {
    return taskStatusMapper(taskStatus);
  }

  get descriptionIsInvalid() {
    return (
      this.form.controls['description'].dirty &&
      this.form.controls['description'].touched &&
      this.form.controls['description'].invalid
    );
  }

  private initializeForm(task: Task): void {
    this.form = new FormGroup({
      description: new FormControl(task.description, {
        validators: [Validators.minLength(2), Validators.maxLength(120)],
      }),
      status: new FormControl(task.status),
      priority: new FormControl(task.priority),
      dueDate: new FormControl(task.dueDate),
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.task) return;

    const updatedTask: TaskUpdate = {
      description: this.form.value.description,
      dueDate: this.form.value.dueDate,
      status: this.form.value.status,
      priority: this.form.value.priority,
    };

    if (
      updatedTask.description === this.task.description &&
      updatedTask.dueDate === this.task.dueDate &&
      updatedTask.status === this.task.status &&
      updatedTask.priority === this.task.priority
    ) {
      return;
    }

    this.loadingService.loadingOn();
    this.projectService.updateTask(updatedTask).subscribe({
      error: () => {
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }

  onReset(): void {
    if (!this.task) return;

    this.form.reset({
      description: this.task.description,
      status: this.task.status,
      priority: this.task.priority,
      dueDate: this.task.dueDate,
    });
  }

  ngOnInit(): void {
    if (!this.task) return;

    this.initializeForm(this.task);
  }
}
