import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { dummyProjects } from '../../dummy-data';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  getProjects(userId: string): Observable<Project[]> {
    return of(dummyProjects).pipe(delay(1000));
  }
}
