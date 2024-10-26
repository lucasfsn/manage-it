import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { User } from '../../../../core/models/project.model';
import { InlineSearchComponent } from '../../../../shared/components/inline-search/inline-search.component';

@Component({
  selector: 'app-task-assignees',
  standalone: true,
  imports: [
    MatIconModule,
    MatPaginatorModule,
    RouterLink,
    ReactiveFormsModule,
    InlineSearchComponent,
    CommonModule,
  ],
  templateUrl: './task-assignees.component.html',
  styleUrl: './task-assignees.component.css',
  animations: [
    trigger('toggleDiv', [
      state(
        'show',
        style({
          visibility: 'visible',
          opacity: 1,
          height: '*',
        })
      ),
      state(
        'hide',
        style({
          visibility: 'hidden',
          opacity: 0,
          height: '0px',
        })
      ),
      transition('show <=> hide', [animate('0.5s ease-in-out')]),
    ]),
  ],
})
export class TaskAssigneesComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @Input() allUsers: User[] = [];
  @Input() taskAssigneesNicknames: string[] = [];
  @Input() isTaskAssignee!: boolean;

  public filteredUsers: User[] = [];
  public paginatedUsers: User[] = [];
  public searchControl = new FormControl('');
  public currentPage = 0;
  public pageSize = 5;

  public showAssignees = true;

  toggleShowAssignees(): void {
    this.showAssignees = true;
  }

  toggleShowAddAssignee(): void {
    this.showAssignees = false;
  }

  focusSearchInput(): void {
    this.searchInput.nativeElement.focus();
  }

  filterUsers() {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';

    this.filteredUsers = this.allUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.userName.toLowerCase().includes(searchTerm)
    );
    this.updatePaginatedUsers();
  }

  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedUsers();
  }

  private updatePaginatedUsers(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  ngOnInit(): void {
    this.filteredUsers = this.allUsers;
    this.updatePaginatedUsers();
    this.searchControl.valueChanges.subscribe(() => {
      this.filterUsers();
    });
  }
}
