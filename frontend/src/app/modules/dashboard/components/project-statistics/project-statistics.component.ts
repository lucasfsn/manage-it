import { Component, Input } from '@angular/core';
import { Project } from '../../../../core/models/project.model';

@Component({
  selector: 'app-project-statistics',
  standalone: true,
  imports: [],
  templateUrl: './project-statistics.component.html',
  styleUrl: './project-statistics.component.css',
})
export class ProjectStatisticsComponent {
  @Input() projects: Project[] | undefined;
}
