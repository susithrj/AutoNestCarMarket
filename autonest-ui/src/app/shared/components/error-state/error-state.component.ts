import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700">
      <div class="font-medium">{{ title() }}</div>
      <div class="mt-1 text-red-700/90">{{ message() }}</div>
      <button
        *ngIf="actionLabel()"
        type="button"
        class="mt-2 underline"
        (click)="action.emit()"
      >
        {{ actionLabel() }}
      </button>
    </div>
  `
})
export class ErrorStateComponent {
  title = input<string>('Something went wrong');
  message = input.required<string>();
  actionLabel = input<string>('Try again');
  action = output<void>();
}

