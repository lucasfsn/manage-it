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
import { AuthService } from '../../../features/services/auth.service';
import { SearchComponent } from '../../../shared/components/search/search.component';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterLink, RouterLinkActive],
  animations: [
    trigger('toggleMenu', [
      state(
        'collapsed',
        style({
          width: '*',
        })
      ),
      state(
        'expanded',
        style({
          width: '160px',
        })
      ),
      transition('collapsed <=> expanded', [animate('300ms ease-in-out')]),
    ]),
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent implements OnInit {
  public isCollapsed = false;

  constructor(private dialog: MatDialog, private authService: AuthService) {}

  get username(): string | null {
    return this.authService.getLoggedInUsername();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  openSearchDialog(): void {
    this.dialog.open(SearchComponent, {
      width: '600px',
      panelClass: 'search-dialog',
      backdropClass: 'dialog-backdrop',
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 1280) {
      this.isCollapsed = true;
    } else {
      this.isCollapsed = false;
    }
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }
}
