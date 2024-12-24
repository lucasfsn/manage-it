import { Component, effect, OnInit } from '@angular/core';
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

interface RouteData {
  title?: string;
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
    private router: Router
  ) {
    effect(() => {
      this.translationService.loadedLanguage();
      this.updateTitle();
    });
  }

  private updateTitle(): void {
    this.translationService.get(this.title).subscribe((localeTitle: string) => {
      this.titleService.setTitle(`${localeTitle} | ManageIt`);
    });
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
        switchMap((route) => route.data)
      )
      .subscribe((data: RouteData) => {
        const { title } = data;

        this.title = title || 'ManageIt';
        this.updateTitle();
      });
  }
}
