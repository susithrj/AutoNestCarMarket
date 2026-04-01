import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-car-filters-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
      <select
        class="min-h-[40px] min-w-[120px] max-w-full flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 sm:flex-initial sm:min-w-[128px]"
        [value]="brand()"
        (change)="brandChange.emit($any($event.target).value)"
      >
        <option value="">Make</option>
        @for (b of brands(); track b) {
          <option [value]="b">{{ b }}</option>
        }
      </select>

      <select
        class="min-h-[40px] min-w-[120px] max-w-full flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 sm:flex-initial sm:min-w-[128px]"
        [value]="model()"
        (change)="modelChange.emit($any($event.target).value)"
      >
        <option value="">Model</option>
        @for (m of models(); track m) {
          <option [value]="m">{{ m }}</option>
        }
      </select>

      <select
        class="min-h-[40px] min-w-[140px] max-w-full flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 sm:flex-initial sm:min-w-[148px]"
        [value]="price()"
        (change)="priceChange.emit($any($event.target).value)"
      >
        <option value="">Price (AED)</option>
        @for (p of priceRanges(); track p.value) {
          <option [value]="p.value">{{ p.label }}</option>
        }
      </select>

      <button
        type="button"
        class="ml-auto min-h-[40px] rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
        (click)="reset.emit()"
      >
        Reset
      </button>
    </div>
  `
})
export class CarFiltersRowComponent {
  brand = input<string>('');
  model = input<string>('');
  price = input<string>('');

  brands = input<string[]>([]);
  models = input<string[]>([]);
  priceRanges = input<{ value: string; label: string }[]>([]);

  brandChange = output<string>();
  modelChange = output<string>();
  priceChange = output<string>();
  reset = output<void>();
}

