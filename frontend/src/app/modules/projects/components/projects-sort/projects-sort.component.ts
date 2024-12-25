import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MapperService } from '../../../../core/services/mapper.service';
import {
  ProjectsSort,
  SortCriteria,
  SortOrder,
} from '../../models/projects-sort.model';

@Component({
  selector: 'app-projects-sort',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './projects-sort.component.html',
  styleUrl: './projects-sort.component.scss',
})
export class ProjectsSortComponent {
  @Input() public sortCriteria: SortCriteria = SortCriteria.NAME;
  @Input() public sortOrder: SortOrder = SortOrder.ASCENDING;
  @Output() public sortChange = new EventEmitter<ProjectsSort>();

  public constructor(private mapperService: MapperService) {}

  protected onSortCriteriaChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortCriteria = selectElement.value as SortCriteria;
    this.emitSortChange();
  }

  protected onSortOrderChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOrder = selectElement.value as SortOrder;
    this.emitSortChange();
  }

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

  private emitSortChange(): void {
    this.sortChange.emit({
      criteria: this.sortCriteria,
      order: this.sortOrder,
    });
  }
}
