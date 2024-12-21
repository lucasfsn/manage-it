import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { HeaderComponent } from './core/layout/header/header.component';
import { TranslationService } from './features/services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private currentTitleKey: string | null = null;

  public constructor(
    private route: ActivatedRoute,
    private translationService: TranslationService,
    private titleService: Title,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.route;
          while (route.firstChild) route = route.firstChild;

          return route;
        }),
        switchMap((route) => route.data)
      )
      .subscribe((data) => {
        this.currentTitleKey = data['title'] as string;
        this.updateTitle();
      });

    this.translationService.languageChange$.subscribe(() => {
      this.updateTitle();
    });
  }

  private updateTitle(): void {
    if (!this.currentTitleKey) return;

    if (this.currentTitleKey.includes('PROFILE')) return;

    this.translationService
      .getTranslation(this.currentTitleKey)
      .subscribe((title: string) => {
        this.titleService.setTitle(`${title} | ManageIt`);
      });
  }
}
