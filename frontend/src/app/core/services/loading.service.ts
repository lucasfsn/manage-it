import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading = signal<boolean>(false);

  isLoading = this.loading.asReadonly();

  loadingOn() {
    this.loading.set(true);
  }

  loadingOff() {
    this.loading.set(false);
  }
}
