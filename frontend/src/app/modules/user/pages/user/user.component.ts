import { UserDetailsComponent } from '@/app/modules/user/components/user-details/user-details.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [UserDetailsComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {}
