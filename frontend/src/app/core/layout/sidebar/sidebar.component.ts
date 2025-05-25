import { UserDto } from '@/app/features/dto/auth.dto';
import { AuthService } from '@/app/features/services/auth.service';
import { SearchComponent } from '@/app/shared/components/search/search.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, RouterLink, RouterLinkActive, TranslateModule],
  animations: [
    trigger('toggleMenu', [
      state('collapsed', style({ width: '0', opacity: 0, padding: 0 })),
      state(
        'expanded',
        style({ width: '*', opacity: 1, padding: '0 0 0 0.75rem' }),
      ),
      transition('collapsed <=> expanded', [animate('300ms ease-in-out')]),
    ]),
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  public isCollapsed = false;

  public constructor(
    private dialog: MatDialog,
    private authService: AuthService,
  ) {}

  protected get user(): UserDto | null {
    return this.authService.loadedUser();
  }

  protected toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  protected openSearchDialog(): void {
    this.dialog.open(SearchComponent, {
      width: '600px',
      panelClass: 'search-dialog',
      backdropClass: 'dialog-backdrop',
    });
  }

  @HostListener('window:resize')
  protected onResize(): void {
    this.checkScreenSize();
  }

  protected checkScreenSize(): void {
    const screenWidth = window.innerWidth;
    this.isCollapsed = screenWidth < 1280;
  }

  public ngOnInit(): void {
    this.checkScreenSize();
  }
}
