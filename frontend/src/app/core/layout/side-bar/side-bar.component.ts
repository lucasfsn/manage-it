import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SearchComponent } from '../../../shared/components/search/search.component';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    SearchComponent,
  ],
  animations: [
    trigger('toggleMenu', [
      state(
        'collapsed',
        style({
          minWidth: '60px',
        })
      ),
      state(
        'expanded',
        style({
          width: '175px',
        })
      ),
      transition('collapsed <=> expanded', [animate('300ms ease-in-out')]),
    ]),
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent implements OnInit {
  isCollapsed = false;
  constructor(public dialog: MatDialog) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  openSearchDialog(): void {
    this.dialog.open(SearchComponent, {
      width: '600px',
      panelClass: 'search-dialog',
      backdropClass: 'search-dialog-backdrop',
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 1024) {
      this.isCollapsed = true;
    } else {
      this.isCollapsed = false;
    }
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }
}
