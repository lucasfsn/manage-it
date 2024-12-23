import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

export interface PageEvent {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly length: number;
}

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, TranslateModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent implements OnInit {
  @Input() public length: number = 0;
  @Input() public pageSizeOptions: number[] = [];
  @Input() public currentPage: number = 0;
  @Output() public page = new EventEmitter<PageEvent>();

  private pageSize: number = 5;

  protected get totalPages(): number {
    return Math.ceil(this.length / this.pageSize);
  }

  protected handlePageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize = Number(select.value);
    this.currentPage = 0;
    this.emitPageEvent();
  }

  protected handlePrev(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.emitPageEvent();
    }
  }

  protected handleNext(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.emitPageEvent();
    }
  }

  private emitPageEvent(): void {
    this.page.emit({
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      length: this.length,
    });
  }

  public ngOnInit(): void {
    this.pageSize = this.pageSizeOptions[0];
  }
}
