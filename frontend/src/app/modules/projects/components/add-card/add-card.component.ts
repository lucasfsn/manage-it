import { Component, Inject, inject } from '@angular/core';
import {
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
  User,
} from '../../../../core/models/project.model';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.css',
})
export class AddCardComponent {
  private dialog = inject(MatDialog);

  readonly TaskStatus = TaskStatus;
  readonly priorities = Object.values(Priority);
  public selectedStatus: TaskStatus;

  constructor(
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA)
    public data: { selectedStatus: TaskStatus }
  ) {
    this.selectedStatus = data.selectedStatus;
  }

  form = new FormGroup({
    description: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(120),
      ],
    }),
    dueDate: new FormControl('', {
      validators: [Validators.required],
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

  closeDialog(): void {
    this.dialog.closeAll();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const taskData: TaskCreate = {
      projectId: 'some-project-id',
      users: this.form.value.users as User[],
      description: this.form.value.description as string,
      priority: this.form.value.priority as Priority,
      dueDate: this.form.value.dueDate as string,
    };

    // this.projectService.addTask(selectedStatus, taskData).subscribe(() => {
    //   this.closeDialog();
    // });
  }
}
