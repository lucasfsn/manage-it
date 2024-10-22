import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  loadingOn() {
    this.loading.next(true);
  }

  loadingOff() {
    this.loading.next(false);
  }
}
