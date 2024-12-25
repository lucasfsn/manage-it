import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading = signal<boolean>(false);

  public isLoading = this.loading.asReadonly();

  public loadingOn(): void {
    this.loading.set(true);
  }

  public loadingOff(): void {
    this.loading.set(false);
  }
}
