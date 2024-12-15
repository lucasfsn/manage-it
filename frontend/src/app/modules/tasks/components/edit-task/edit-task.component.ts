import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import {
  Priority,
  Task,
  TaskData,
  TaskStatus,
} from '../../../../features/dto/project.model';
import { TaskService } from '../../../../features/services/task.service';
import { priorityMapper } from '../../../../shared/utils/priority-mapper';
import { taskStatusMapper } from '../../../../shared/utils/status-mapper';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css',
})
export class EditTaskComponent implements OnInit {
  protected isLoading = false;

  constructor(
    private taskService: TaskService,
    private toastrService: ToastrService,
    private dialogRef: MatDialogRef<EditTaskComponent>
  ) {}

  protected form = new FormGroup({
    description: new FormControl<string>('', [
      Validators.minLength(2),
      Validators.maxLength(120),
      Validators.required,
    ]),
    status: new FormControl<TaskStatus>(TaskStatus.NOT_STARTED, {
      validators: [Validators.required],
    }),
    priority: new FormControl<Priority>(Priority.LOW, {
      validators: [Validators.required],
    }),
    dueDate: new FormControl<string>('', {
      validators: [Validators.required],
    }),
  });

  protected get disabled(): boolean {
    return this.form.invalid || !this.isFormChanged() || this.isLoading;
  }

  protected get task(): Task | undefined {
    return this.taskService.loadedTask();
  }

  protected get Priority(): typeof Priority {
    return Priority;
  }

  protected get TaskStatus(): typeof TaskStatus {
    return TaskStatus;
  }

  protected get priorities(): Priority[] {
    return Object.values(Priority);
  }

  protected get statuses(): TaskStatus[] {
    return Object.values(TaskStatus);
  }

  protected mapTaskStatus(taskStatus: TaskStatus): string {
    return taskStatusMapper(taskStatus);
  }

  protected mapPriority(priority: Priority): string {
    return priorityMapper(priority);
  }

  protected get descriptionIsInvalid(): boolean {
    return (
      this.form.controls['description'].dirty &&
      this.form.controls['description'].touched &&
      this.form.controls['description'].invalid
    );
  }

  protected get dueDateIsInvalid(): boolean {
    return (
      this.form.controls['dueDate'].dirty &&
      this.form.controls['dueDate'].touched &&
      this.form.controls['dueDate'].invalid
    );
  }

  private isFormChanged(): boolean {
    if (!this.task) return false;

    return (
      this.form.value.description !== this.task.description ||
      this.form.value.status !== this.task.status ||
      this.form.value.priority !== this.task.priority ||
      this.form.value.dueDate !== this.task.dueDate
    );
  }

  private fillFormWithDefaultValues(): void {
    if (!this.task) return;

    this.form.patchValue({
      description: this.task.description,
      status: this.task.status,
      priority: this.task.priority,
      dueDate: this.task.dueDate,
    });
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }

  protected onReset(): void {
    this.fillFormWithDefaultValues();
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    const updatedTask: TaskData = {
      description: this.form.value.description!,
      status: this.form.value.status!,
      priority: this.form.value.priority!,
      dueDate: this.form.value.dueDate!,
    };

    if (!this.isFormChanged()) return;

    this.isLoading = true;
    this.taskService.updateTask(updatedTask).subscribe({
      error: (err) => {
        this.toastrService.error(err.message);
        this.isLoading = false;
      },
      complete: () => {
        this.toastrService.success('Task has been updated');
        this.isLoading = false;
        this.closeDialog();
      },
    });
  }

  public ngOnInit(): void {
    this.fillFormWithDefaultValues();
  }
}
