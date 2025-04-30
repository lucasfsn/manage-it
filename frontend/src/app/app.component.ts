import { HeaderComponent } from '@/app/core/layout/header/header.component';
import { Theme, ThemeService } from '@/app/core/services/theme.service';
import { TranslationService } from '@/app/core/services/translation.service';
import { Component, effect, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter, map, switchMap } from 'rxjs';

interface RouteData {
  readonly title?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private title = 'ManageIt';

  public constructor(
    private route: ActivatedRoute,
    private translationService: TranslationService,
    private titleService: Title,
    private router: Router,
    private themeService: ThemeService,
    private renderer: Renderer2,
  ) {
    effect(() => {
      this.updateTheme(this.themeService.loadedTheme());
      this.translationService.loadedLanguage();
      this.updateTitle();
    });
  }

  private updateTitle(): void {
    this.translationService.get(this.title).subscribe((localeTitle: string) => {
      this.titleService.setTitle(`${localeTitle} | ManageIt`);
    });
  }

  private updateTheme(theme: Theme): void {
    if (theme === Theme.DARK) {
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
    }
  }

  public ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.route;
          while (route.firstChild) route = route.firstChild;

          return route;
        }),
        switchMap((route) => route.data),
      )
      .subscribe((data: RouteData) => {
        const { title } = data;

        this.title = title || 'ManageIt';
        this.updateTitle();
      });
  }
}
