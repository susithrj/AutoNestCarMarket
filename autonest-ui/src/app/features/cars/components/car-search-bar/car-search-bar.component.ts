import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-car-search-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3">
      <label class="block min-w-0 flex-1">
        <div class="sr-only">Keyword</div>
        <div class="relative h-full">
          <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
              <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <input
            class="h-full min-h-[44px] w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
            [value]="q()"
            (input)="qChange.emit($any($event.target).value)"
            placeholder="Make, model, or keyword"
          />
        </div>
      </label>

      <div class="flex shrink-0 items-center gap-2 sm:justify-end">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-primary bg-white px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/5"
          (click)="openFilters.emit()"
        >
          <span class="text-primary/80">
            <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
              <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
          Filters
          <span
            *ngIf="filterCount() > 0"
            class="grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-red-600 px-1 text-xs font-semibold text-white"
          >
            {{ filterCount() }}
          </span>
        </button>
        <button
          type="button"
          class="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          (click)="show.emit()"
        >
          Show {{ totalElements() | number }} cars
        </button>
      </div>
    </div>
  `
})
export class CarSearchBarComponent {
  q = input<string>('');
  filterCount = input<number>(0);
  totalElements = input<number>(0);

  qChange = output<string>();
  openFilters = output<void>();
  show = output<void>();
}

