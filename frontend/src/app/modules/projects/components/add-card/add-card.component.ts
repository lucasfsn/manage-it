import { Component, Inject, inject } from '@angular/core';
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
import {
  Priority,
  TaskCreate,
  TaskStatus,
} from '../../../../core/models/project.model';
import { LoadingService } from '../../../../core/services/loading.service';
import { ProjectService } from '../../../../core/services/project.service';

function dueDateValidator(control: AbstractControl) {
  const selectedDate = new Date(control.value);
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  selectedDate.setHours(0, 0, 0, 0);
  nextDay.setHours(0, 0, 0, 0);

  if (selectedDate >= nextDay) return null;

  return {
    invalidDate: true,
  };
}

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.css',
})
export class AddCardComponent {
  readonly TaskStatus = TaskStatus;
  readonly priorities = Object.values(Priority);
  public selectedStatus: TaskStatus;
  public projectId: string;

  constructor(
    private loadingService: LoadingService,
    private projectService: ProjectService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: { selectedStatus: TaskStatus; projectId: string }
  ) {
    this.selectedStatus = data.selectedStatus;
    this.projectId = data.projectId;
  }

  public getNextDay(): string {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
  }

  form = new FormGroup({
    description: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(120),
      ],
    }),
    dueDate: new FormControl(this.getNextDay(), {
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

  get dueDateErrors() {
    const control = this.form.controls.dueDate;
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Due date is required.';
      }
      if (control.errors['invalidDate']) {
        return 'Due date must be at least tomorrow.';
      }
    }
    return null;
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
      dueDate: this.getNextDay(),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const newTask: TaskCreate = {
      projectId: this.projectId,
      users: [],
      status: this.selectedStatus,
      description: this.form.value.description!,
      priority: this.form.value.priority as Priority,
      dueDate: this.form.value.dueDate!,
    };

    this.loadingService.loadingOn();
    this.projectService.addTask(newTask).subscribe({
      next: () => {
        this.loadingService.loadingOff();
        this.closeDialog();
      },
      error: () => {
        this.loadingService.loadingOff();
      },
    });
  }
}
