import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import {
  Priority,
  TaskData,
  TaskStatus,
} from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { TaskService } from '../../../../core/services/task.service';

function dueDateValidator(control: AbstractControl) {
  const selectedDate = new Date(control.value);
  const today = new Date();
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (selectedDate >= today) return null;

  return {
    invalidDate: true,
  };
}

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css',
})
export class CreateTaskComponent {
  readonly TaskStatus = TaskStatus;
  readonly priorities = Object.values(Priority);
  public selectedStatus: TaskStatus;
  public projectId: string;

  constructor(
    private loadingService: LoadingService,
    private taskService: TaskService,
    private toastrService: ToastrService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: { selectedStatus: TaskStatus; projectId: string }
  ) {
    this.selectedStatus = data.selectedStatus;
    this.projectId = data.projectId;
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  form = new FormGroup({
    description: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(120),
      ],
    }),
    dueDate: new FormControl(this.getToday(), {
      validators: [Validators.required, dueDateValidator],
    }),
    priority: new FormControl('', {
      validators: [Validators.required],
    }),
    users: new FormControl([]),
  });

  get descriptionIsInvalid() {
    return (
      this.form.controls.description.dirty &&
      this.form.controls.description.touched &&
      this.form.controls.description.invalid
    );
  }

  get dueDateIsInvalid() {
    return (
      this.form.controls.dueDate.dirty &&
      this.form.controls.dueDate.touched &&
      this.form.controls.dueDate.invalid
    );
  }

  get priorityIsInvalid() {
    return (
      this.form.controls.priority.dirty &&
      this.form.controls.priority.touched &&
      this.form.controls.priority.invalid
    );
  }

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  onReset(): void {
    this.form.reset({
      priority: '',
      dueDate: this.getToday(),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const newTask: TaskData = {
      status: this.selectedStatus,
      description: this.form.value.description!,
      priority: this.form.value.priority as Priority,
      dueDate: this.form.value.dueDate!,
    };

    this.loadingService.loadingOn();
    this.taskService.createTask(newTask).subscribe({
      error: (err) => {
        this.loadingService.loadingOff();
        this.toastrService.error(err.message);
      },
      complete: () => {
        this.closeDialog();
        this.loadingService.loadingOff();
      },
    });
  }
}
