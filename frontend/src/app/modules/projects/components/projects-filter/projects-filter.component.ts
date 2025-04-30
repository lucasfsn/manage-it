import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { MapperService } from '@/app/core/services/mapper.service';
import { ProjectStatus } from '@/app/features/dto/project.model';
import { ProjectsFilters } from '@/app/modules/projects/models/projects-filter.model';

interface ProjectsFilterForm {
  readonly name: FormControl<string | null>;
  readonly status: FormControl<ProjectStatus | null>;
  readonly onlyOwnedByMe: FormControl<boolean | null>;
}

@Component({
  selector: 'app-projects-filter',
  standalone: true,
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatRadioModule,
    MatMenuModule,
    MatCheckboxModule,
    TranslateModule,
  ],
  templateUrl: './projects-filter.component.html',
  styleUrl: './projects-filter.component.scss',
})
export class ProjectsFilterComponent implements OnInit {
  @Input({ required: true }) public filterName!: string;
  @Input({ required: true }) public filterStatus!: ProjectStatus | null;
  @Input({ required: true }) public filterOnlyOwnedByMe!: boolean;
  @Output() public filterChange = new EventEmitter<ProjectsFilters>();
  private destroyRef = inject(DestroyRef);

  public constructor(private mapperService: MapperService) {}

  protected form = new FormGroup<ProjectsFilterForm>({
    name: new FormControl<string>(''),
    status: new FormControl<ProjectStatus | null>(null),
    onlyOwnedByMe: new FormControl<boolean>(false),
  });

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  protected onReset(): void {
    this.form.reset({
      name: '',
      status: null,
      onlyOwnedByMe: false,
    });
  }

  protected mapStatus(status: ProjectStatus): string {
    return this.mapperService.projectStatusMapper(status);
  }

  protected get projectStatuses(): ProjectStatus[] {
    return Object.values(ProjectStatus);
  }

  public ngOnInit(): void {
    this.form.patchValue({
      name: this.filterName,
      status: this.filterStatus,
      onlyOwnedByMe: this.filterOnlyOwnedByMe,
    });

    const subscription = this.form.valueChanges.subscribe((value) => {
      this.filterChange.emit({
        name: value.name?.trim() || '',
        status: value.status || null,
        onlyOwnedByMe: value.onlyOwnedByMe ?? false,
      });
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
