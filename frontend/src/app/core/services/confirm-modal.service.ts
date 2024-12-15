import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {
  private confirmation$ = new Subject<boolean>();
  private message = '';
  private isOpen$ = new BehaviorSubject<boolean>(false);

  public confirm(message: string): Observable<boolean> {
    this.message = message;
    this.isOpen$.next(true);

    return this.confirmation$.asObservable();
  }

  public getMessage(): string {
    return this.message;
  }

  public handleClick(confirmed: boolean): void {
    this.confirmation$.next(confirmed);
    this.isOpen$.next(false);
  }

  public isOpen(): Observable<boolean> {
    return this.isOpen$.asObservable();
  }
}
