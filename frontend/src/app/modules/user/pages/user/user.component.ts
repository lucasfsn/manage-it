import { Component } from '@angular/core';
import { UserDetailsComponent } from '../../components/user-details/user-details.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [UserDetailsComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {}
