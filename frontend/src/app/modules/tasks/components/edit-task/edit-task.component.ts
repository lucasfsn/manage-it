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
  TaskData,
  TaskStatus,
} from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { TaskService } from '../../../../core/services/task.service';
import { taskStatusMapper } from '../../../../shared/utils/status-mapper';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css',
})
export class EditTaskComponent implements OnInit {
  constructor(
    private loadingService: LoadingService,
    private taskService: TaskService
  ) {}

  form = new FormGroup({
    description: new FormControl<string>('', [
      Validators.minLength(2),
      Validators.maxLength(120),
    ]),
    status: new FormControl<TaskStatus>(TaskStatus.NotStarted, {
      validators: [Validators.required],
    }),
    priority: new FormControl<Priority>(Priority.Low, {
      validators: [Validators.required],
    }),
    dueDate: new FormControl<string>('', {
      validators: [Validators.required],
    }),
  });

  get task(): Task | undefined {
    return this.taskService.loadedTask();
  }

  get Priority(): typeof Priority {
    return Priority;
  }

  get TaskStatus(): typeof TaskStatus {
    return TaskStatus;
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

  private fillFormWithDefaultValues() {
    if (!this.task) return;

    this.form.patchValue({
      description: this.task.description,
      status: this.task.status,
      priority: this.task.priority,
      dueDate: this.task.dueDate,
    });
  }

  onReset(): void {
    this.fillFormWithDefaultValues();
  }

  onSubmit() {
    if (this.form.invalid || !this.task) return;

    const updatedTask: TaskData = {
      description: this.form.value.description!,
      status: this.form.value.status!,
      priority: this.form.value.priority!,
      dueDate: this.form.value.dueDate!,
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
    this.taskService.updateTask(updatedTask).subscribe({
      error: () => {
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      },
    });
  }

  ngOnInit(): void {
    this.fillFormWithDefaultValues();
  }
}
