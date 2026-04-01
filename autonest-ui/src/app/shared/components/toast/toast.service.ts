import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastState {
  kind: ToastKind;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toast = signal<ToastState | null>(null);

  private timer: ReturnType<typeof setTimeout> | null = null;

  success(message: string) {
    this.show({ kind: 'success', message });
  }

  error(message: string) {
    this.show({ kind: 'error', message });
  }

  info(message: string) {
    this.show({ kind: 'info', message });
  }

  clear() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.toast.set(null);
  }

  private show(state: ToastState) {
    this.toast.set(state);
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.clear(), 3000);
  }
}

