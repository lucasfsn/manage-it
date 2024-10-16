import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../../../core/models/project.model';

@Component({
  selector: 'app-project-statistics',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-statistics.component.html',
  styleUrl: './project-statistics.component.css',
})
export class ProjectStatisticsComponent {
  @Input() projects: Project[] | undefined;
}
