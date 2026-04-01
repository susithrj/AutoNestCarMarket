import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { AdminApi, CarRequest } from '../admin.api';
import { CarDetail, FuelType, ListingStatus, Transmission } from '../../cars/cars.models';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
      <a class="text-sm text-primary underline" routerLink="/admin">← Back to manage</a>

      <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-xl border border-gray-200 bg-white p-6">
          <div class="flex items-center justify-between gap-4">
            <div class="text-xl font-semibold text-gray-900">{{ isEdit() ? 'Edit listing' : 'Create listing' }}</div>
            <div class="text-sm text-gray-500" *ngIf="isEdit()">ID {{ carId() }}</div>
          </div>

          <div class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" *ngIf="error()">
            {{ error() }}
          </div>

          <form class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2" [formGroup]="form" (ngSubmit)="submit()">
            <label class="block sm:col-span-2">
              <div class="text-xs font-medium text-gray-500">Title</div>
              <input class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" formControlName="title" placeholder="Toyota Corolla 2020" />
              <div class="mt-1 text-xs text-red-600" *ngIf="showError('title')">Title is required.</div>
            </label>

            <label class="block">
              <div class="text-xs font-medium text-gray-500">Brand</div>
              <input class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" formControlName="brand" placeholder="Toyota" />
              <div class="mt-1 text-xs text-red-600" *ngIf="showError('brand')">Brand is required.</div>
            </label>

            <label class="block">
              <div class="text-xs font-medium text-gray-500">Model</div>
              <input class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" formControlName="model" placeholder="Corolla" />
              <div class="mt-1 text-xs text-red-600" *ngIf="showError('model')">Model is required.</div>
            </label>

            <label class="block">
              <div class="text-xs font-medium text-gray-500">Year</div>
              <input type="number" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" formControlName="year" />
              <div class="mt-1 text-xs text-red-600" *ngIf="showError('year')">Year must be between 1950 and 2100.</div>
            </label>

            <label class="block">
              <div class="text-xs font-medium text-gray-500">Mileage (km)</div>
              <input type="number" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" formControlName="mileage" />
              <div class="mt-1 text-xs text-red-600" *ngIf="showError('mileage')">Mileage must be 0 or more.</div>
            </label>

            <label class="block">
              <div class="text-xs font-medium text-gray-500">Fuel type</div>
              <select class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" formControlName="fuelType">
                @for (f of fuelTypes; track f) { <option [value]="f">{{ f }}</option> }
              </select>
              <div class="mt-1 text-xs text-red-600" *ngIf="showError('fuelType')">Fuel type is required.</div>
            </label>

            <label class="block">
              <div class="text-xs font-medium text-gray-500">Transmission</div>
              <select class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" formControlName="transmission">
                @for (t of transmissions; track t) { <option [value]="t">{{ t }}</option> }
              </select>
              <div class="mt-1 text-xs text-red-600" *ngIf="showError('transmission')">Transmission is required.</div>
            </label>

            <label class="block">
              <div class="text-xs font-medium text-gray-500">Base price (AED)</div>
              <input type="number" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" formControlName="basePrice" />
              <div class="mt-1 text-xs text-red-600" *ngIf="showError('basePrice')">Base price must be 0 or more.</div>
            </label>

            <label class="block">
              <div class="text-xs font-medium text-gray-500">Additional charges (AED)</div>
              <input type="number" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" formControlName="additionalCharges" />
              <div class="mt-1 text-xs text-red-600" *ngIf="showError('additionalCharges')">Must be 0 or more.</div>
            </label>

            <label class="block">
              <div class="text-xs font-medium text-gray-500">Discount (AED)</div>
              <input type="number" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" formControlName="discountAmount" />
              <div class="mt-1 text-xs text-red-600" *ngIf="showError('discountAmount')">Must be 0 or more.</div>
            </label>

            <label class="block">
              <div class="text-xs font-medium text-gray-500">Status</div>
              <select class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" formControlName="status">
                @for (s of statuses; track s) { <option [value]="s">{{ s }}</option> }
              </select>
              <div class="mt-1 text-xs text-red-600" *ngIf="showError('status')">Status is required.</div>
            </label>

            <label class="block">
              <div class="text-xs font-medium text-gray-500">Location</div>
              <input class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" formControlName="location" placeholder="Dubai" />
              <div class="mt-1 text-xs text-red-600" *ngIf="showError('location')">Location is required.</div>
            </label>

            <label class="block">
              <div class="text-xs font-medium text-gray-500">Seller mobile</div>
              <input class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" formControlName="contactPhone" placeholder="+971501234567" />
              <div class="mt-1 text-xs text-red-600" *ngIf="showError('contactPhone')">Mobile number is required.</div>
            </label>

            <label class="block">
              <div class="text-xs font-medium text-gray-500">Seller email</div>
              <input type="email" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" formControlName="contactEmail" placeholder="seller@example.com" />
              <div class="mt-1 text-xs text-red-600" *ngIf="showError('contactEmail')">Valid email is required.</div>
            </label>

            <label class="block sm:col-span-2">
              <div class="text-xs font-medium text-gray-500">Description</div>
              <textarea rows="4" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" formControlName="description" placeholder="Well maintained, single owner..."></textarea>
            </label>

            <label class="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" class="h-4 w-4 rounded border-gray-300" formControlName="negotiable" />
              <span class="text-sm text-gray-700">Negotiable</span>
            </label>

            <div class="mt-2 flex items-center gap-3 sm:col-span-2">
              <button type="submit" class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark" [disabled]="saving()">
                {{ saving() ? 'Saving…' : (isEdit() ? 'Save changes' : 'Create listing') }}
              </button>
              <button type="button" class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" (click)="resetForm()" [disabled]="saving()">
                Reset
              </button>
            </div>
          </form>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6">
          <div class="text-base font-semibold text-gray-900">Images</div>
          <div class="mt-2 text-sm text-gray-600">
            Add image links. The first image becomes primary if none exists.
            <span *ngIf="!isEdit()"> On a new listing, links are queued here and saved when you click Create listing.</span>
          </div>

          <div class="mt-4">
            <label class="block">
              <div class="text-xs font-medium text-gray-500">Image URLs (one per line)</div>
              <textarea
                rows="3"
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                [value]="imageUrlsText()"
                (input)="imageUrlsText.set($any($event.target).value)"
                placeholder="https://...&#10;https://..."
              ></textarea>
            </label>
            <button
              type="button"
              class="mt-3 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60"
              [disabled]="!canAddUrls()"
              (click)="addUrls()"
            >
              {{ addingUrls() ? 'Adding…' : 'Add image link(s)' }}
            </button>
          </div>

          <div class="mt-5 grid grid-cols-3 gap-2" *ngIf="pendingImageUrls().length > 0">
            <div class="col-span-3 text-xs font-medium text-gray-500">Queued for create (saved on submit)</div>
            @for (url of pendingImageUrls(); track url; let i = $index) {
              <div class="group relative overflow-hidden rounded-lg border border-dashed border-primary/40 bg-primary/5">
                <img class="h-24 w-full object-cover" [src]="url" alt="Queued image" />
                <div class="absolute left-1 top-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-gray-800" *ngIf="i === 0">Primary</div>
                <button
                  type="button"
                  class="absolute right-1 top-1 rounded bg-red-600 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100"
                  (click)="removePendingUrl(i)"
                >
                  Remove
                </button>
              </div>
            }
          </div>

          <div class="mt-5 grid grid-cols-3 gap-2" *ngIf="car() as c">
            @for (img of c.images; track img.id) {
              <div class="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <img class="h-24 w-full object-cover" [src]="img.imageUrl" [alt]="c.title" />
                <div class="absolute left-1 top-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-gray-800" *ngIf="img.isPrimary">Primary</div>
                <button
                  type="button"
                  class="absolute right-1 top-1 rounded bg-red-600 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100"
                  (click)="deleteImage(img.id)"
                >
                  Delete
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class CarFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(AdminApi);
  private readonly toast = inject(ToastService);

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly carId = signal<number | null>(null);
  readonly car = signal<CarDetail | null>(null);

  readonly imageUrlsText = signal('');
  readonly addingUrls = signal(false);
  /** Staged URLs before the listing exists; sent to API right after create. */
  readonly pendingImageUrls = signal<string[]>([]);

  readonly isEdit = computed(() => this.carId() !== null);
  readonly canAddUrls = computed(() => this.imageUrlsText().trim().length > 0 && !this.addingUrls());

  readonly fuelTypes: FuelType[] = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'];
  readonly transmissions: Transmission[] = ['AUTOMATIC', 'MANUAL'];
  readonly statuses: ListingStatus[] = ['AVAILABLE', 'RESERVED', 'SOLD'];

  readonly form = this.fb.group({
    title: ['', [Validators.required]],
    brand: ['', [Validators.required]],
    model: ['', [Validators.required]],
    year: [2020, [Validators.required, Validators.min(1950), Validators.max(2100)]],
    mileage: [0, [Validators.required, Validators.min(0)]],
    fuelType: ['PETROL' as FuelType, [Validators.required]],
    transmission: ['AUTOMATIC' as Transmission, [Validators.required]],
    basePrice: [0, [Validators.required, Validators.min(0)]],
    additionalCharges: [0, [Validators.required, Validators.min(0)]],
    discountAmount: [0, [Validators.required, Validators.min(0)]],
    negotiable: [false],
    location: ['', [Validators.required]],
    contactPhone: ['', [Validators.required]],
    contactEmail: ['', [Validators.required, Validators.email]],
    description: [''],
    status: ['AVAILABLE' as ListingStatus, [Validators.required]]
  });

  constructor() {
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (!id) {
        this.carId.set(null);
        this.car.set(null);
        return;
      }
      const n = Number(id);
      if (!Number.isFinite(n)) return;
      this.carId.set(n);
      this.pendingImageUrls.set([]);
      void this.load();
    });
  }

  showError(name: keyof CarRequest) {
    const c = this.form.get(name as string);
    return !!c && c.touched && c.invalid;
  }

  resetForm() {
    const existing = this.car();
    if (existing) {
      this.patchFromCar(existing);
    } else {
      this.pendingImageUrls.set([]);
      this.form.reset({
        title: '',
        brand: '',
        model: '',
        year: 2020,
        mileage: 0,
        fuelType: 'PETROL',
        transmission: 'AUTOMATIC',
        basePrice: 0,
        additionalCharges: 0,
        discountAmount: 0,
        negotiable: false,
        location: '',
        contactPhone: '',
        contactEmail: '',
        description: '',
        status: 'AVAILABLE'
      });
    }
  }

  private patchFromCar(c: CarDetail) {
    this.form.patchValue({
      title: c.title,
      brand: c.brand,
      model: c.model,
      year: c.year,
      mileage: c.mileage,
      fuelType: c.fuelType,
      transmission: c.transmission,
      basePrice: c.basePrice,
      additionalCharges: c.additionalCharges,
      discountAmount: c.discountAmount,
      negotiable: c.negotiable,
      location: c.location,
      contactPhone: c.contactPhone ?? '',
      contactEmail: c.contactEmail ?? '',
      description: c.description ?? '',
      status: c.status
    });
  }

  async load() {
    const id = this.carId();
    if (!id) return;
    this.error.set(null);
    try {
      const c = await this.api.get(id);
      this.car.set(c);
      this.patchFromCar(c);
    } catch {
      this.error.set('Failed to load listing');
    }
  }

  private toRequest(): CarRequest {
    const v = this.form.getRawValue();
    return {
      title: v.title ?? '',
      brand: v.brand ?? '',
      model: v.model ?? '',
      year: Number(v.year ?? 0),
      mileage: Number(v.mileage ?? 0),
      fuelType: String(v.fuelType),
      transmission: String(v.transmission),
      basePrice: Number(v.basePrice ?? 0),
      additionalCharges: Number(v.additionalCharges ?? 0),
      discountAmount: Number(v.discountAmount ?? 0),
      negotiable: !!v.negotiable,
      location: v.location ?? '',
      contactPhone: String(v.contactPhone ?? '').trim(),
      contactEmail: String(v.contactEmail ?? '').trim(),
      description: v.description ?? '',
      status: String(v.status)
    };
  }

  async submit() {
    this.error.set(null);
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving.set(true);
    try {
      const req = this.toRequest();
      if (this.isEdit()) {
        const id = this.carId()!;
        const updated = await this.api.update(id, req);
        this.car.set(updated);
        this.toast.success('Listing updated');
      } else {
        const created = await this.api.create(req);
        const pending = this.pendingImageUrls();
        if (pending.length > 0) {
          try {
            await this.api.addImageUrls(created.id, pending);
            this.pendingImageUrls.set([]);
            this.toast.success('Listing created with images');
          } catch {
            this.toast.error('Listing created, but image links failed to save. Add them from Edit.');
          }
        } else {
          this.toast.success('Listing created');
        }
        await this.router.navigate(['/admin/cars', created.id, 'edit']);
      }

    } catch (e: any) {
      if (e instanceof HttpErrorResponse && (e.status === 401 || e.status === 403)) {
        this.error.set('You do not have permission to create listings. Please sign in as an ADMIN user.');
        this.toast.error('Admin access required');
      } else if (e instanceof HttpErrorResponse && e.status === 400) {
        this.error.set('Validation failed. Please check the form fields and try again.');
        this.toast.error('Validation error');
      } else {
        this.error.set('Failed to save listing');
        this.toast.error('Failed to save');
      }
    } finally {
      this.saving.set(false);
    }
  }

  async addUrls() {
    const urls = this.imageUrlsText()
      .split(/\r?\n/g)
      .map(s => s.trim())
      .filter(Boolean);

    if (urls.length === 0) return;

    if (!this.isEdit()) {
      const merged = [...this.pendingImageUrls()];
      for (const u of urls) {
        if (!merged.includes(u)) merged.push(u);
      }
      this.pendingImageUrls.set(merged);
      this.imageUrlsText.set('');
      this.toast.success('Image links queued — they will be saved when you create the listing');
      return;
    }

    const id = this.carId();
    if (!id) return;

    this.addingUrls.set(true);
    try {
      await this.api.addImageUrls(id, urls);
      this.imageUrlsText.set('');
      await this.load();
      this.toast.success('Image links added');
    } catch {
      this.toast.error('Failed to add image links');
    } finally {
      this.addingUrls.set(false);
    }
  }

  removePendingUrl(index: number) {
    this.pendingImageUrls.update(arr => arr.filter((_, i) => i !== index));
  }

  async deleteImage(imageId: number) {
    const id = this.carId();
    if (!id) return;
    try {
      await this.api.deleteImage(id, imageId);
      await this.load();
      this.toast.success('Image deleted');
    } catch {
      this.toast.error('Failed to delete image');
    }
  }
}

