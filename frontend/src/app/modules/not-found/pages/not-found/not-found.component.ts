import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@/app/features/services/auth.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TranslateModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  public constructor(private authService: AuthService) {}

  protected get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
