import { Injectable } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {
  private confirmation$ = new Subject<boolean>();
  private message = '';
  public isModalOpen = false;

  public confirm(message: string): Observable<boolean> {
    this.message = message;
    this.isModalOpen = true;

    return this.confirmation$.asObservable().pipe(take(1));
  }

  public getMessage(): string {
    return this.message;
  }

  public handleClick(confirmed: boolean): void {
    this.confirmation$.next(confirmed);
    this.isModalOpen = false;
  }
}
