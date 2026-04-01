import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { CarListItem } from '../../cars.models';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
      role="link"
      tabindex="0"
      (click)="view.emit(car().id)"
      (keyup.enter)="view.emit(car().id)"
      (keyup.space)="$event.preventDefault(); view.emit(car().id)"
      [attr.aria-label]="'View ' + ariaLabel()"
    >
      <div class="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          *ngIf="car().primaryImageUrl"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          [src]="car().primaryImageUrl!"
          [alt]="ariaLabel()"
        />
        <div *ngIf="!car().primaryImageUrl" class="flex h-full w-full items-center justify-center text-sm text-gray-400">No photo</div>

        <div class="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm">
          {{ car().year }}
        </div>

        <button
          type="button"
          class="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/80 bg-white/95 shadow-md transition hover:scale-105"
          [class.text-red-600]="isFavorite()"
          [class.text-gray-700]="!isFavorite()"
          (click)="toggleFavorite.emit(car().id); $event.stopPropagation()"
          [attr.aria-pressed]="isFavorite()"
          aria-label="Save listing"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" aria-hidden="true">
            <path
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
              [attr.fill]="isFavorite() ? 'currentColor' : 'none'"
              d="M12 21s-6.7-4.35-9-8.5C.5 9.1 2 5.5 6 5c2.1 0 3.5 1.1 4 2.5.5-1.4 1.9-2.5 4-2.5 4 0 5.5 3.6 3 7.5-2.3 4.15-9 8.5-9 8.5Z"
            />
          </svg>
        </button>

        <div class="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition duration-200 group-hover:opacity-100">
          <span class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-lg">View details</span>
        </div>
      </div>

      <div class="p-4">
        <div class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{{ makeLabel() }}</div>
        <div class="mt-0.5 truncate text-lg font-semibold text-gray-900">{{ modelLabel() }}</div>
        <div class="mt-1 text-sm text-gray-600">{{ car().location }}</div>

        <div class="mt-3 flex flex-wrap gap-2">
          <span class="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-800">{{ mileageLabel() }}</span>
          <span class="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-800">{{ fuelLabel() }}</span>
          <span class="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-800">{{ transmissionLabel() }}</span>
        </div>

        <div class="mt-4 border-t border-gray-100 pt-3">
          <div class="text-2xl font-semibold tabular-nums text-primary">{{ priceLabel() }}</div>
        </div>
      </div>
    </div>
  `
})
export class CarCardComponent {
  car = input.required<CarListItem>();
  isFavorite = input(false);

  make = input<string | null>(null);
  model = input<string | null>(null);
  mileage = input<string | null>(null);
  fuel = input<string | null>(null);
  transmission = input<string | null>(null);
  price = input<string | null>(null);

  view = output<number>();
  toggleFavorite = output<number>();

  ariaLabel(): string {
    const mk = this.makeLabel();
    const m = this.modelLabel();
    return `${mk} ${m}`.trim() || this.car().title || 'car listing';
  }

  makeLabel(): string {
    return (this.make() ?? this.car().brand ?? '').trim() || '—';
  }

  modelLabel(): string {
    return (this.model() ?? this.car().model ?? '').trim() || (this.car().title ?? 'Listing');
  }

  mileageLabel(): string {
    return (this.mileage() ?? '').trim() || '—';
  }

  fuelLabel(): string {
    return (this.fuel() ?? '').trim() || '—';
  }

  transmissionLabel(): string {
    return (this.transmission() ?? '').trim() || '—';
  }

  priceLabel(): string {
    return (this.price() ?? '').trim() || '';
  }
}

