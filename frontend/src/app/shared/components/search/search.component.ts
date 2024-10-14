import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

const dummyData = [
  { id: '1', name: 'Result 1' },
  { id: '2', name: 'Result 2' },
  { id: '3', name: 'Result 3' },
  { id: '4', name: 'Result 4' },
  { id: '5', name: 'Result 5' },
];

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  form = new FormControl('');
  searchResults: { id: string; name: string }[] = [];

  constructor(readonly dialogRef: MatDialogRef<SearchComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  focusInput(): void {
    this.searchInput.nativeElement.focus();
  }

  onSearch(): void {
    const query = this.form.value?.toLowerCase();
    if (query) {
      this.searchResults = dummyData.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    } else {
      this.searchResults = [];
    }
  }
}
