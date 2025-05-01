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
import { TranslateModule } from '@ngx-translate/core';
import { MapperService } from '@/app/core/services/mapper.service';
import {
  ProjectsSort,
  SortCriteria,
  SortOrder,
} from '@/app/modules/projects/models/projects-sort.model';

interface ProjectsSortForm {
  readonly criteria: FormControl<SortCriteria | null>;
  readonly order: FormControl<SortOrder | null>;
}

@Component({
    selector: 'app-projects-sort',
    imports: [ReactiveFormsModule, TranslateModule],
    templateUrl: './projects-sort.component.html',
    styleUrl: './projects-sort.component.scss'
})
export class ProjectsSortComponent implements OnInit {
  @Input({ required: true }) public sortCriteria!: SortCriteria;
  @Input({ required: true }) public sortOrder!: SortOrder;
  @Output() public sortChange = new EventEmitter<ProjectsSort>();
  private destroyRef = inject(DestroyRef);

  public constructor(private mapperService: MapperService) {}

  protected form = new FormGroup<ProjectsSortForm>({
    criteria: new FormControl<SortCriteria>(SortCriteria.NAME),
    order: new FormControl<SortOrder>(SortOrder.ASCENDING),
  });

  protected get sortCriterias(): SortCriteria[] {
    return Object.values(SortCriteria);
  }

  protected get sortOrders(): SortOrder[] {
    return Object.values(SortOrder);
  }

  protected mapOrder(order: SortOrder): string {
    return this.mapperService.sortOrderMapper(order);
  }

  protected mapCriteria(criteria: SortCriteria): string {
    return this.mapperService.sortCriteriaMapper(criteria);
  }

  public ngOnInit(): void {
    this.form.patchValue({
      criteria: this.sortCriteria,
      order: this.sortOrder,
    });

    const subscription = this.form.valueChanges.subscribe((value) => {
      const criteria = value.criteria ?? SortCriteria.NAME;
      const order = value.order ?? SortOrder.ASCENDING;
      this.sortChange.emit({
        criteria,
        order,
      });
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
