import { Injectable, signal } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {
  private confirmation$ = new Subject<boolean>();

  private message = signal<string | null>(null);
  public loadedMessage = this.message.asReadonly();

  private content = signal<string | null>(null);
  public loadedContent = this.content.asReadonly();

  public confirm(message: string, content?: string): Observable<boolean> {
    this.message.set(message);
    this.content.set(content ?? null);

    return this.confirmation$.asObservable().pipe(take(1));
  }

  public handleClick(confirmed: boolean): void {
    this.confirmation$.next(confirmed);
    this.message.set(null);
    this.content.set(null);
  }
}
