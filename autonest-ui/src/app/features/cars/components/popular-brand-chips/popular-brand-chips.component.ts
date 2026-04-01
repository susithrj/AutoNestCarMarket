import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-popular-brand-chips',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-4 flex flex-wrap items-center gap-2">
      <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">Popular brands</span>
      @for (b of brands(); track b) {
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-primary hover:bg-primary/5 hover:text-primary"
          (click)="select.emit(b)"
        >
          <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary" aria-hidden="true">{{ b[0] }}</span>
          {{ b }}
        </button>
      }
    </div>
  `
})
export class PopularBrandChipsComponent {
  brands = input<string[]>([]);
  select = output<string>();
}

