import { Injectable, signal } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {
  private confirmation$ = new Subject<boolean>();
  private message = '';
  private isModalOpen = signal<boolean>(false);

  public isOpen = this.isModalOpen.asReadonly();

  public confirm(message: string): Observable<boolean> {
    this.message = message;
    this.isModalOpen.set(true);

    return this.confirmation$.asObservable().pipe(take(1));
  }

  public getMessage(): string {
    return this.message;
  }

  public handleClick(confirmed: boolean): void {
    this.confirmation$.next(confirmed);
    this.isModalOpen.set(false);
  }
}
