import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { ProjectStatus } from '../../../../features/dto/project.model';
import { projectStatusMapper } from '../../../../shared/utils/status-mapper';
import { ProjectFilters } from '../../models/project-filter.model';

@Component({
  selector: 'app-filter-projects',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MatDialogModule,
    MatRadioModule,
    MatMenuModule,
    MatCheckboxModule,
  ],
  templateUrl: './filter-projects.component.html',
  styleUrl: './filter-projects.component.css',
})
export class FilterProjectsComponent {
  @Output() public filterChange = new EventEmitter<ProjectFilters>();

  protected filterProjectName = '';
  protected filterStatus: ProjectStatus | undefined;
  protected filterOwnedByCurrentUser = false;

  protected get ProjectStatus(): typeof ProjectStatus {
    return ProjectStatus;
  }

  private applyFilters(): void {
    this.filterChange.emit({
      name: this.filterProjectName,
      status: this.filterStatus,
      ownedByCurrentUser: this.filterOwnedByCurrentUser,
    });
  }

  protected handleClear(): void {
    this.filterStatus = undefined;
    this.filterOwnedByCurrentUser = false;
    this.applyFilters();
  }

  protected handleChange(): void {
    this.applyFilters();
  }

  protected mapStatus(status: ProjectStatus): string {
    return projectStatusMapper(status);
  }

  protected get projectStatuses(): ProjectStatus[] {
    return Object.values(ProjectStatus);
  }
}
