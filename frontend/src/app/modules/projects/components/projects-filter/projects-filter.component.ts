import { MapperService } from '@/app/core/services/mapper.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { ProjectStatus } from '@/app/features/dto/project.model';
import { ProjectsFilters } from '@/app/modules/projects/models/projects-filter.model';
import { FormCheckboxControlComponent } from '@/app/shared/components/form-controls/form-checkbox-control/form-checkbox-control.component';
import {
  FormRadioControlComponent,
  RadioOption,
} from '@/app/shared/components/form-controls/form-radio-control/form-radio-control.component';
import { FormTextInputControlComponent } from '@/app/shared/components/form-controls/form-text-input-control-control/form-text-input-control.component';
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
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

interface ProjectsFilterForm {
  readonly name: FormControl<string | null>;
  readonly status: FormControl<ProjectStatus | null>;
  readonly onlyOwnedByMe: FormControl<boolean | null>;
}

@Component({
  selector: 'app-projects-filter',
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatMenuModule,
    TranslateModule,
    FormTextInputControlComponent,
    FormCheckboxControlComponent,
    FormRadioControlComponent,
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

  public constructor(
    private mapperService: MapperService,
    private translationService: TranslationService,
  ) {}

  protected form = new FormGroup<ProjectsFilterForm>({
    name: new FormControl<string>(''),
    status: new FormControl<ProjectStatus | null>(null),
    onlyOwnedByMe: new FormControl<boolean>(false),
  });

  protected get statuses(): RadioOption[] {
    return [
      {
        value: null,
        label: this.translationService.translate('projects.filter.ALL_FILTER'),
      },
      ...Object.values(ProjectStatus).map((status) => ({
        value: status,
        label: this.mapperService.projectStatusMapper(status),
      })),
    ];
  }

  protected onReset(): void {
    this.form.reset({
      name: '',
      status: null,
      onlyOwnedByMe: false,
    });
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
