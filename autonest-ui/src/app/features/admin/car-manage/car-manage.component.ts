import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { listingStatusLabel, listingStatusVariant } from '../../../shared/domain/listing-status';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { AdminApi } from '../admin.api';
import { CarListItem } from '../../cars/cars.models';
import { formatAed } from '../../../shared/utils/format';

@Component({
  selector: 'app-car-manage',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmModalComponent, BadgeComponent, ErrorStateComponent],
  template: `
    <div class="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div class="text-2xl font-medium text-gray-900">Manage listings</div>
        <a class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark" routerLink="/admin/cars/new">
          + Create listing
        </a>
      </div>

      <div class="mt-4 rounded-xl border border-gray-200 bg-white p-4">
        <div class="flex gap-2">
          <button type="button" class="rounded-lg px-3 py-2 text-sm" [class.bg-primary]="tab() === 'all'" [class.text-white]="tab() === 'all'" [class.bg-gray-100]="tab() !== 'all'" (click)="tab.set('all')">All</button>
          <button type="button" class="rounded-lg px-3 py-2 text-sm" [class.bg-primary]="tab() === 'active'" [class.text-white]="tab() === 'active'" [class.bg-gray-100]="tab() !== 'active'" (click)="tab.set('active')">Active</button>
          <button type="button" class="rounded-lg px-3 py-2 text-sm" [class.bg-primary]="tab() === 'deleted'" [class.text-white]="tab() === 'deleted'" [class.bg-gray-100]="tab() !== 'deleted'" (click)="tab.set('deleted')">Deleted</button>
        </div>
      </div>

      <div class="mt-4 rounded-xl border border-gray-200 bg-white p-4" *ngIf="loading()">Loading...</div>
      <div class="mt-4" *ngIf="error()">
        <app-error-state title="Failed to load listings" message="Please try again." (action)="load()" />
      </div>

      <div class="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white" *ngIf="!loading() && !error()">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-gray-200 bg-gray-50 text-xs text-gray-500">
            <tr>
              <th class="px-4 py-3">Title</th>
              <th class="px-4 py-3">Price</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (c of filtered(); track c.id) {
              <tr class="border-b border-gray-100">
                <td class="px-4 py-3 font-medium text-gray-900">{{ c.title }}</td>
                <td class="px-4 py-3 text-primary">AED {{ formatAed(c.finalPrice) }}</td>
                <td class="px-4 py-3"><app-badge [variant]="listingStatusVariant(c.status)" [label]="listingStatusLabel(c.status)" /></td>
                <td class="px-4 py-3 text-right">
                  <a class="mr-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50" [routerLink]="['/admin/cars', c.id, 'edit']">Edit</a>
                  <button
                    *ngIf="tab() !== 'deleted'"
                    class="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                    (click)="confirmDelete(c)"
                  >
                    Delete
                  </button>
                  <button
                    *ngIf="tab() === 'deleted'"
                    class="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                    (click)="confirmRestore(c)"
                  >
                    Restore
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>

        <div class="p-6 text-sm text-gray-600" *ngIf="filtered().length === 0">
          No listings match this tab.
        </div>
      </div>

      <app-confirm-modal
        [isOpen]="confirmOpen()"
        title="Delete listing?"
        message="This will soft-delete the listing. It will disappear from public browsing but remain visible under Deleted."
        confirmLabel="Delete"
        (confirmed)="doDelete()"
        (cancelled)="confirmOpen.set(false)"
      />

      <app-confirm-modal
        [isOpen]="restoreConfirmOpen()"
        title="Restore listing?"
        message="This will restore the listing and make it visible in public browsing again."
        confirmLabel="Restore"
        (confirmed)="doRestore()"
        (cancelled)="restoreConfirmOpen.set(false)"
      />
    </div>
  `
})
export class CarManageComponent {
  private readonly api = inject(AdminApi);
  private readonly toast = inject(ToastService);
  readonly formatAed = formatAed;
  readonly listingStatusLabel = listingStatusLabel;
  readonly listingStatusVariant = listingStatusVariant;

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly cars = signal<CarListItem[]>([]);

  readonly tab = signal<'all' | 'active' | 'deleted'>('all');
  readonly confirmOpen = signal(false);
  readonly pendingDeleteId = signal<number | null>(null);
  readonly restoreConfirmOpen = signal(false);
  readonly pendingRestoreId = signal<number | null>(null);

  readonly filtered = computed(() => {
    const t = this.tab();
    const list = this.cars();
    if (t === 'all') return list;
    if (t === 'active') return list.filter(c => !c.deletedAt);
    if (t === 'deleted') return list.filter(c => !!c.deletedAt);
    return list;
  });

  constructor() {
    void this.load();
  }

  async load() {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.cars.set(await this.api.listAll());
    } catch {
      this.error.set('failed');
    } finally {
      this.loading.set(false);
    }
  }

  confirmDelete(c: CarListItem) {
    this.pendingDeleteId.set(c.id);
    this.confirmOpen.set(true);
  }

  confirmRestore(c: CarListItem) {
    this.pendingRestoreId.set(c.id);
    this.restoreConfirmOpen.set(true);
  }

  async doDelete() {
    const id = this.pendingDeleteId();
    if (!id) return;
    try {
      await this.api.softDelete(id);
      this.toast.success('Listing deleted');
      this.confirmOpen.set(false);
      await this.load();
    } catch {
      this.toast.error('Failed to delete');
    }
  }

  async doRestore() {
    const id = this.pendingRestoreId();
    if (!id) return;
    try {
      await this.api.restore(id);
      this.toast.success('Listing restored');
      this.restoreConfirmOpen.set(false);
      await this.load();
    } catch {
      this.toast.error('Failed to restore');
    }
  }

}

