import { NgIf } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [NgIf],
  template: `
    <div *ngIf="isOpen()" class="fixed inset-0 z-40 bg-black/30" (click)="cancelled.emit()"></div>
    <div *ngIf="isOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div class="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-md" (click)="$event.stopPropagation()">
        <div class="text-lg font-medium text-gray-900">{{ title() }}</div>
        <div class="mt-2 text-sm text-gray-600">{{ message() }}</div>
        <div class="mt-6 flex justify-end gap-2">
          <button type="button" class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" (click)="cancelled.emit()">
            Cancel
          </button>
          <button type="button" class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700" (click)="confirmed.emit()">
            {{ confirmLabel() }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  title = input.required<string>();
  message = input.required<string>();
  confirmLabel = input<string>('Confirm');
  isOpen = input.required<boolean>();

  confirmed = output<void>();
  cancelled = output<void>();
}

