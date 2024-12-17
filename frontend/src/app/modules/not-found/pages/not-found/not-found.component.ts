import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../features/services/auth.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  public constructor(private authService: AuthService) {}

  protected get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
