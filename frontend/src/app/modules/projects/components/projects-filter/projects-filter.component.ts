import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectStatus } from '../../../../features/dto/project.model';
import { MapperService } from '../../../../features/services/mapper.service';
import { ProjectFilters } from '../../models/project-filter.model';

@Component({
  selector: 'app-projects-filter',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MatDialogModule,
    MatRadioModule,
    MatMenuModule,
    MatCheckboxModule,
    TranslateModule,
  ],
  templateUrl: './projects-filter.component.html',
  styleUrl: './projects-filter.component.scss',
})
export class ProjectsFilterComponent {
  @Output() public filterChange = new EventEmitter<ProjectFilters>();

  public constructor(private mapperService: MapperService) {}

  protected filterProjectName?: string;
  protected filterStatus?: ProjectStatus;
  protected filterOnlyOwnedByMe = false;

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  private applyFilters(): void {
    this.filterChange.emit({
      name: this.filterProjectName?.trim() || undefined,
      status: this.filterStatus,
      onlyOwnedByMe: this.filterOnlyOwnedByMe,
    });
  }

  protected handleClear(): void {
    this.filterStatus = undefined;
    this.filterOnlyOwnedByMe = false;
    this.filterProjectName = undefined;
    this.applyFilters();
  }

  protected handleChange(): void {
    this.applyFilters();
  }

  protected mapStatus(status: ProjectStatus): string {
    return this.mapperService.projectStatusMapper(status);
  }

  protected get projectStatuses(): ProjectStatus[] {
    return Object.values(ProjectStatus);
  }
}
