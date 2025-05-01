import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-icon',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile-icon.component.html',
  styleUrl: './profile-icon.component.scss'
})
export class ProfileIconComponent {
  @Input() public size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input({ required: true }) public firstName!: string;
  @Input({ required: true }) public lastName!: string;
  @Input() public hover: boolean = true;
  @Input() public routerLink?: string;
}
