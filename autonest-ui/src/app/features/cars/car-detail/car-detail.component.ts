import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarsApi } from '../cars.api';
import { CarDetail } from '../cars.models';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { listingStatusLabel, listingStatusVariant } from '../../../shared/domain/listing-status';
import { formatAed, formatKm } from '../../../shared/utils/format';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent, ErrorStateComponent],
  template: `
    <div class="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
      <a class="text-sm text-primary underline" [routerLink]="['/']">← Back to listings</a>

      <div *ngIf="loading()" class="mt-4 rounded-xl border border-gray-200 bg-white p-6">
        <div class="h-6 w-48 animate-pulse rounded bg-gray-100"></div>
        <div class="mt-4 h-64 animate-pulse rounded bg-gray-100"></div>
      </div>

      <div class="mt-4" *ngIf="error()">
        <app-error-state
          title="Failed to load listing"
          message="Please try again."
          (action)="load()"
        />
      </div>

      <div *ngIf="!loading() && !error() && car() as c" class="mt-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="rounded-xl border border-gray-200 bg-white p-4">
            <img *ngIf="primaryImageUrl(c)" class="aspect-video w-full rounded-lg object-cover" [src]="primaryImageUrl(c)!" [alt]="c.title" />
            <div *ngIf="!primaryImageUrl(c)" class="aspect-video w-full rounded-lg bg-gray-100"></div>
            <div class="mt-3 flex gap-2 overflow-x-auto">
              @for (img of c.images; track img.id) {
                <img class="h-16 w-24 cursor-pointer rounded object-cover ring-1 ring-gray-200 hover:ring-primary" [src]="img.imageUrl" [alt]="c.title" (click)="selectedImage.set(img.imageUrl)" />
              }
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-6">
            <div class="text-2xl font-medium text-gray-900">{{ c.title }}</div>
            <div class="mt-2 text-xl font-medium text-primary">AED {{ formatAed(c.finalPrice) }}</div>
            <div class="mt-3 flex flex-wrap items-center gap-2">
              <app-badge [variant]="listingStatusVariant(c.status)" [label]="listingStatusLabel(c.status)" />
              <app-badge *ngIf="c.negotiable" variant="negotiable" label="Negotiable" />
            </div>
            <div class="mt-3 text-sm text-gray-600">
              {{ c.year }} · {{ formatKm(c.mileage) }} km · {{ c.fuelType }} · {{ c.transmission }}
            </div>
            <div class="mt-2 text-sm text-gray-600">{{ c.location }}</div>

            <div class="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div class="text-sm font-semibold text-gray-900">Contact seller</div>
              <div class="mt-3 space-y-2 text-sm">
                <div class="flex flex-wrap gap-2">
                  <span class="font-medium text-gray-600">Call:</span>
                  <a *ngIf="c.contactPhone" class="text-primary underline" [href]="'tel:' + telHref(c.contactPhone)">{{ c.contactPhone }}</a>
                  <span *ngIf="!c.contactPhone" class="text-gray-500">—</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span class="font-medium text-gray-600">Email:</span>
                  <a *ngIf="c.contactEmail" class="text-primary underline" [href]="'mailto:' + c.contactEmail">{{ c.contactEmail }}</a>
                  <span *ngIf="!c.contactEmail" class="text-gray-500">—</span>
                </div>
              </div>
            </div>

            <div class="mt-4 whitespace-pre-line text-sm text-gray-700" *ngIf="c.description">{{ c.description }}</div>

            <div class="mt-4 rounded-lg border border-gray-200 p-3" *ngIf="showBreakdown(c)">
              <div class="text-sm font-medium text-gray-900">Price breakdown</div>
              <div class="mt-3 space-y-1 text-sm text-gray-700">
                <div class="flex justify-between"><span>Base price</span><span>AED {{ formatAed(c.basePrice) }}</span></div>
                <div class="flex justify-between" *ngIf="c.additionalCharges"><span>Additional charges</span><span>AED {{ formatAed(c.additionalCharges) }}</span></div>
                <div class="flex justify-between" *ngIf="c.discountAmount"><span>Discount</span><span>-AED {{ formatAed(c.discountAmount) }}</span></div>
                <div class="mt-2 flex justify-between border-t border-gray-200 pt-2 font-medium">
                  <span>Final price</span><span>AED {{ formatAed(c.finalPrice) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CarDetailComponent {
  private readonly api = inject(CarsApi);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly car = signal<CarDetail | null>(null);
  readonly selectedImage = signal<string | null>(null);
  readonly formatAed = formatAed;
  readonly formatKm = formatKm;
  readonly listingStatusLabel = listingStatusLabel;
  readonly listingStatusVariant = listingStatusVariant;

  constructor() {
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (!id) return;
      void this.load(id);
    });
  }

  async load(id?: string) {
    const carId = id ?? this.route.snapshot.paramMap.get('id') ?? '';
    if (!carId) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      const c = await this.api.getCar(carId);
      this.selectedImage.set(null);
      this.car.set(c);
    } catch {
      this.error.set('failed');
      this.car.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  /** Default hero matches browse thumbnail: first image by API order (sort_order ASC), not isPrimary. */
  primaryImageUrl(c: CarDetail) {
    return this.selectedImage() ?? c.images?.[0]?.imageUrl ?? c.images?.find(i => i.isPrimary)?.imageUrl ?? null;
  }

  showBreakdown(c: CarDetail) {
    return (c.additionalCharges ?? 0) !== 0 || (c.discountAmount ?? 0) !== 0;
  }

  telHref(phone: string) {
    return phone.replace(/\s+/g, '');
  }
}

