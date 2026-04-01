import { NgIf } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="fixed right-4 top-4 z-50" *ngIf="toast() as t">
      <div class="w-[320px] rounded-xl border border-gray-200 bg-white p-4 shadow-md">
        <div class="flex items-start gap-3">
          <div class="mt-0.5 h-3 w-1.5 rounded-full" [class]="barClass()"></div>
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-900">{{ title() }}</div>
            <div class="mt-1 text-sm text-gray-600">{{ t.message }}</div>
          </div>
          <button
            type="button"
            class="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-50"
            (click)="toastService.clear()"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  `
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
  readonly toast = this.toastService.toast;

  readonly barClass = computed(() => {
    const t = this.toast();
    if (!t) return '';
    return (
      {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600'
      } as const
    )[t.kind];
  });

  readonly title = computed(() => {
    const t = this.toast();
    if (!t) return '';
    return (
      {
        success: 'Success',
        error: 'Error',
        info: 'Info'
      } as const
    )[t.kind];
  });
}

