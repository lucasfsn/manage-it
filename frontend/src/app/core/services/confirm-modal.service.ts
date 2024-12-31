import { Injectable, signal } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {
  private confirmation$ = new Subject<boolean>();
  private message = signal<string | null>(null);

  public loadedMessage = this.message.asReadonly();

  public confirm(message: string): Observable<boolean> {
    this.message.set(message);

    return this.confirmation$.asObservable().pipe(take(1));
  }

  public handleClick(confirmed: boolean): void {
    this.confirmation$.next(confirmed);
    this.message.set(null);
  }
}
