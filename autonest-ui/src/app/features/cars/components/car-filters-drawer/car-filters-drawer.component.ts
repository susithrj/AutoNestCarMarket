import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-car-filters-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="open()" class="fixed inset-0 z-40">
      <button class="absolute inset-0 bg-black/30" type="button" (click)="close.emit()"></button>
      <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div class="text-base font-semibold text-gray-900">Filters</div>
          <button type="button" class="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100" (click)="close.emit()">Close</button>
        </div>

        <div class="space-y-5 px-5 py-5">
          <label class="block">
            <div class="text-xs font-medium text-gray-500">Year</div>
            <select class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700" [value]="year()" (change)="yearChange.emit($any($event.target).value)">
              <option value="">Any</option>
              @for (y of years(); track y) {
                <option [value]="'' + y">{{ y }}</option>
              }
            </select>
          </label>

          <label class="block">
            <div class="text-xs font-medium text-gray-500">Fuel type</div>
            <select class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700" [value]="fuelType()" (change)="fuelTypeChange.emit($any($event.target).value)">
              <option value="">Any</option>
              @for (f of fuelTypes(); track f) {
                <option [value]="f">{{ f }}</option>
              }
            </select>
          </label>

          <label class="block">
            <div class="text-xs font-medium text-gray-500">Transmission</div>
            <select class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700" [value]="transmission()" (change)="transmissionChange.emit($any($event.target).value)">
              <option value="">Any</option>
              <option value="AUTOMATIC">Automatic</option>
              <option value="MANUAL">Manual</option>
            </select>
          </label>

          <label class="block">
            <div class="text-xs font-medium text-gray-500">Mileage (max)</div>
            <select class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700" [value]="maxMileage()" (change)="maxMileageChange.emit($any($event.target).value)">
              <option value="">Any</option>
              @for (m of mileageOptions(); track m.value) {
                <option [value]="m.value">{{ m.label }}</option>
              }
            </select>
          </label>

          <label class="block">
            <div class="text-xs font-medium text-gray-500">Location</div>
            <input class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" [value]="location()" (input)="locationChange.emit($any($event.target).value)" placeholder="Dubai, Abu Dhabi..." />
          </label>

          <div class="flex items-center gap-3 pt-2">
            <button type="button" class="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90" (click)="apply.emit()">
              Apply filters
            </button>
            <button type="button" class="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200" (click)="reset.emit()">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CarFiltersDrawerComponent {
  open = input(false);

  year = input<string>('');
  years = input<number[]>([]);
  fuelType = input<string>('');
  fuelTypes = input<string[]>([]);
  transmission = input<string>('');
  maxMileage = input<string>('');
  mileageOptions = input<{ value: string; label: string }[]>([]);
  location = input<string>('');

  close = output<void>();
  apply = output<void>();
  reset = output<void>();

  yearChange = output<string>();
  fuelTypeChange = output<string>();
  transmissionChange = output<string>();
  maxMileageChange = output<string>();
  locationChange = output<string>();
}

