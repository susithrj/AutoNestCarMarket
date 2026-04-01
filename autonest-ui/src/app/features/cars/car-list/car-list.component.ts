import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FavoritesService } from '../../../core/favorites/favorites.service';
import { CarCardComponent } from '../components/car-card/car-card.component';
import { CarSearchBarComponent } from '../components/car-search-bar/car-search-bar.component';
import { CarFiltersRowComponent } from '../components/car-filters-row/car-filters-row.component';
import { PopularBrandChipsComponent } from '../components/popular-brand-chips/popular-brand-chips.component';
import { CarFiltersDrawerComponent } from '../components/car-filters-drawer/car-filters-drawer.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { formatAed, formatKm } from '../../../shared/utils/format';
import { defaultBrowseState, stateFromQueryParamMap } from '../browse/browse.query';
import { CarsApi } from '../cars.api';
import { CarListItem } from '../cars.models';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    ErrorStateComponent,
    CarCardComponent,
    CarSearchBarComponent,
    CarFiltersRowComponent,
    PopularBrandChipsComponent,
    CarFiltersDrawerComponent
  ],
  template: `
    <section class="relative overflow-hidden rounded-3xl border border-gray-200 bg-white">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-light blur-3xl"></div>
        <div class="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"></div>
      </div>

      <div class="relative px-6 py-10 sm:px-10 sm:py-12">
        <div class="max-w-screen-xl">
            <div class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs font-medium text-gray-700">
              <span class="h-2 w-2 rounded-full bg-primary"></span>
              Verified listings · Transparent pricing
            </div>
            <h1 class="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Scroll less, Drive more 🏎️
            </h1>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              Search by brand, model, or location. Compare prices, mileage, and specs in one place.
            </p>

            <div class="mt-6 rounded-2xl border border-gray-200 bg-white/90 p-3 shadow-sm sm:p-4">
              <app-car-search-bar
                [q]="q()"
                [filterCount]="appliedFilterCount()"
                [totalElements]="totalElements()"
                (qChange)="setQ($event)"
                (openFilters)="filtersOpen.set(true)"
                (show)="reload()"
              />

              <app-car-filters-row
                [brand]="brand()"
                [model]="model()"
                [price]="priceRange()"
                [brands]="popularBrands"
                [models]="availableModels()"
                [priceRanges]="$any(priceRanges)"
                (brandChange)="setBrand($event)"
                (modelChange)="setModel($event)"
                (priceChange)="setPriceRange($event)"
                (reset)="clear()"
              />

              <app-popular-brand-chips [brands]="popularBrands" (select)="setBrand($event)" />
            </div>
        </div>
      </div>
    </section>

    <app-car-filters-drawer
      [open]="filtersOpen()"
      [year]="year()"
      [years]="years"
      [fuelType]="fuelType()"
      [fuelTypes]="$any(fuelTypes)"
      [transmission]="transmission()"
      [maxMileage]="maxMileage()"
      [mileageOptions]="$any(mileageOptions)"
      [location]="location()"
      (close)="filtersOpen.set(false)"
      (apply)="applyDrawerFilters()"
      (reset)="clear()"
      (yearChange)="setYear($event)"
      (fuelTypeChange)="setFuelType($event)"
      (transmissionChange)="setTransmission($event)"
      (maxMileageChange)="setMaxMileage($event)"
      (locationChange)="setLocation($event)"
    />

    <div class="mt-8">
      <section>
        <div class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="text-sm text-gray-600">
              <span class="font-semibold text-gray-900">{{ totalElements() | number }}</span> cars found
            </div>
            <label class="flex w-full flex-col gap-1.5 sm:w-auto">
              <span class="text-xs font-medium text-gray-500">Sort by</span>
              <select
                class="w-full min-w-[220px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-auto"
                [value]="sort()"
                (change)="setSort($any($event.target).value)"
              >
                <option value="createdAt,desc">Latest</option>
                <option value="year,desc">Year (high)</option>
                <option value="year,asc">Year (low)</option>
                <option value="price,desc">Price (high)</option>
                <option value="price,asc">Price (low)</option>
                <option value="mileage,desc">Mileage (high)</option>
                <option value="mileage,asc">Mileage (low)</option>
              </select>
            </label>
          </div>
        </div>

        <div class="mt-4">
          <div *ngIf="loading()" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            @for (_ of skeletons; track $index) {
              <div class="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                <div class="aspect-[4/3] animate-pulse bg-gray-200"></div>
                <div class="space-y-3 p-4">
                  <div class="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                  <div class="h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
                  <div class="h-8 w-full animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            }
          </div>

          <div *ngIf="error()">
            <app-error-state title="Failed to load listings" message="Please try again." (action)="reload()" />
          </div>

          <div *ngIf="!loading() && !error() && cars().length === 0" class="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
            No cars found. Try adjusting your filters.
          </div>

          <div *ngIf="!loading() && !error() && cars().length > 0" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            @for (car of cars(); track car.id) {
              <app-car-card
                [car]="car"
                [isFavorite]="favorites.isFavorite(car.id)"
                [make]="displayMake(car)"
                [model]="displayModel(car)"
                [mileage]="formatKm(car.mileage) + ' km'"
                [fuel]="formatFuelLabel(car.fuelType)"
                [transmission]="formatTransmissionLabel(car.transmission)"
                [price]="'AED ' + formatAed(car.finalPrice)"
                (view)="goToCar($event)"
                (toggleFavorite)="favorites.toggle($event)"
              />
            }
          </div>
        </div>

        <div class="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p class="text-center text-sm text-gray-600 sm:text-left">
            {{ paginationSummary() }}
          </p>
          <app-pagination
            [currentPage]="pageUi()"
            [totalPages]="totalPages()"
            (pageChange)="setPageUi($event)"
          />
        </div>
      </section>
    </div>
  `
})
export class CarListComponent {
  private readonly api = inject(CarsApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly favorites = inject(FavoritesService);
  readonly formatAed = formatAed;
  readonly formatKm = formatKm;

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly cars = signal<CarListItem[]>([]);
  readonly totalElements = signal(0);
  readonly totalPages = signal(1);

  readonly q = signal('');
  readonly brand = signal('');
  readonly model = signal('');
  readonly priceRange = signal('');
  readonly year = signal('');
  readonly fuelType = signal('');
  readonly transmission = signal('');
  readonly maxMileage = signal('');
  readonly location = signal('');
  readonly sort = signal('createdAt,desc');
  readonly page = signal(0); // API 0-indexed
  /** Page size multiple of 3 for a tidy 3-column grid. */
  readonly size = signal(6);

  readonly filtersOpen = signal(false);

  readonly pageUi = computed(() => this.page() + 1);

  /** Human-readable range for the bottom bar (pagination + record counts). */
  readonly paginationSummary = computed(() => {
    const total = this.totalElements();
    const pg = this.page();
    const sz = this.size();
    const tp = Math.max(1, this.totalPages());
    if (total === 0) {
      return 'No cars match your filters.';
    }
    const start = pg * sz + 1;
    const end = Math.min((pg + 1) * sz, total);
    return `Showing ${start}–${end} of ${total} records · Page ${pg + 1} of ${tp}`;
  });

  readonly skeletons = Array.from({ length: 6 }, () => 0);
  readonly popularBrands = ['Toyota', 'Nissan', 'Honda', 'BMW', 'Mercedes'];
  readonly fuelTypes = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'] as const;
  readonly years = Array.from({ length: new Date().getFullYear() - 2009 }, (_, i) => new Date().getFullYear() - i);
  readonly priceRanges = [
    { value: '0-25000', label: 'Under 25,000' },
    { value: '25000-50000', label: '25,000 – 50,000' },
    { value: '50000-100000', label: '50,000 – 100,000' },
    { value: '100000-200000', label: '100,000 – 200,000' },
    { value: '200000+', label: '200,000+' }
  ] as const;
  readonly mileageOptions = [
    { value: '25000', label: 'Up to 25,000 km' },
    { value: '50000', label: 'Up to 50,000 km' },
    { value: '75000', label: 'Up to 75,000 km' },
    { value: '100000', label: 'Up to 100,000 km' },
    { value: '150000', label: 'Up to 150,000 km' },
    { value: '200000', label: 'Up to 200,000 km' }
  ] as const;

  readonly availableModels = computed(() => {
    const make = this.brand();
    if (!make) return [];
    const map: Record<string, string[]> = {
      Toyota: ['Corolla', 'Camry', 'Land Cruiser', 'Hilux', 'RAV4', 'Yaris'],
      Nissan: ['Altima', 'Patrol', 'Sunny', 'X-Trail', 'Sentra'],
      Honda: ['Civic', 'Accord', 'CR-V', 'City'],
      BMW: ['3 Series', '5 Series', 'X3', 'X5'],
      Mercedes: ['C-Class', 'E-Class', 'GLE', 'GLC']
    };
    return map[make] ?? [];
  });

  readonly appliedFilterCount = computed(() => {
    let n = 0;
    if (this.q().trim()) n++;
    if (this.brand().trim()) n++;
    if (this.model().trim()) n++;
    if (this.priceRange().trim()) n++;
    if (this.year().trim()) n++;
    if (this.fuelType().trim()) n++;
    if (this.transmission().trim()) n++;
    if (this.maxMileage().trim()) n++;
    if (this.location().trim()) n++;
    return n;
  });

  constructor() {
    this.route.queryParamMap.subscribe(qp => {
      const parsed = stateFromQueryParamMap(qp, defaultBrowseState());

      this.q.set(parsed.q ?? '');

      const canonicalBrand = this.popularBrands.find(b => b.toLowerCase() === (parsed.brand ?? '').trim().toLowerCase());
      this.brand.set(canonicalBrand ?? '');

      const nextModelRaw = (parsed.model ?? '').trim();
      const nextModel = this.availableModels().includes(nextModelRaw) ? nextModelRaw : '';
      this.model.set(nextModel);

      const nextPriceRaw = (parsed.price ?? '').trim();
      const validPriceValues = new Set(this.priceRanges.map(p => p.value));
      const nextPrice = validPriceValues.has(nextPriceRaw as any) ? nextPriceRaw : '';
      this.priceRange.set(nextPrice);

      const nextYearRaw = (parsed.year ?? '').trim();
      const nextYear = this.years.includes(Number(nextYearRaw)) ? nextYearRaw : '';
      this.year.set(nextYear);

      const nextFuel = (parsed.fuelType ?? '').trim();
      const validFuel = new Set(this.fuelTypes as readonly string[]);
      this.fuelType.set(validFuel.has(nextFuel) ? nextFuel : '');

      const nextTx = (parsed.transmission ?? '').trim();
      const validTx = new Set(['AUTOMATIC', 'MANUAL']);
      this.transmission.set(validTx.has(nextTx) ? nextTx : '');

      const nextMileage = (parsed.maxMileage ?? '').trim();
      const validMileage = new Set(this.mileageOptions.map(m => m.value));
      this.maxMileage.set(validMileage.has(nextMileage as any) ? nextMileage : '');

      this.location.set(parsed.location ?? '');

      const validSorts = new Set([
        'createdAt,desc',
        'year,desc',
        'year,asc',
        'price,desc',
        'price,asc',
        'mileage,desc',
        'mileage,asc'
      ]);
      const rawSort = (parsed.sort ?? 'createdAt,desc').trim();
      this.sort.set(validSorts.has(rawSort) ? rawSort : 'createdAt,desc');

      this.page.set(parsed.page ?? 0);
      this.size.set(parsed.size ?? 6);
      void this.reload();
    });
  }

  async reload() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { minPrice, maxPrice } = this.parsePriceRange(this.priceRange());
      const y = this.year().trim();
      const year = y ? Number(y) : undefined;
      const res = await this.api.listCars({
        q: this.q().trim() || undefined,
        brand: this.brand().trim() || undefined,
        model: this.model().trim() || undefined,
        minPrice: minPrice,
        maxPrice: maxPrice,
        fuelType: this.fuelType() || undefined,
        transmission: this.transmission() || undefined,
        minYear: year ? String(year) : undefined,
        maxYear: year ? String(year) : undefined,
        maxMileage: this.maxMileage() || undefined,
        location: this.location() || undefined,
        sort: this.sort(),
        page: String(this.page()),
        size: String(this.size())
      });
      this.cars.set(res.content ?? []);
      this.totalElements.set(res.totalElements ?? 0);
      this.totalPages.set(res.totalPages ?? 1);
    } catch (e) {
      this.error.set('failed');
    } finally {
      this.loading.set(false);
    }
  }

  setQ(v: string) {
    this.q.set(v);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { q: v || null, page: 0 }, queryParamsHandling: 'merge' });
  }

  setBrand(v: string) {
    const raw = (v ?? '').trim();
    const canonical =
      this.popularBrands.find(b => b.toLowerCase() === raw.toLowerCase()) ?? raw;
    this.brand.set(canonical);
    // If make changes, reset model if not valid for the new make.
    const models = this.availableModels();
    const nextModel = models.includes(this.model()) ? this.model() : '';
    this.model.set(nextModel);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { brand: canonical || null, model: nextModel || null, page: 0 },
      queryParamsHandling: 'merge'
    });
  }

  setModel(v: string) {
    this.model.set(v);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { model: v || null, page: 0 }, queryParamsHandling: 'merge' });
  }

  setFuelType(v: string) {
    this.fuelType.set(v);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { fuelType: v || null, page: 0 }, queryParamsHandling: 'merge' });
  }

  setTransmission(v: string) {
    this.transmission.set(v);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { transmission: v || null, page: 0 }, queryParamsHandling: 'merge' });
  }

  setMaxMileage(v: string) {
    this.maxMileage.set(v);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { maxMileage: v || null, page: 0 }, queryParamsHandling: 'merge' });
  }

  setLocation(v: string) {
    this.location.set(v);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { location: v || null, page: 0 }, queryParamsHandling: 'merge' });
  }

  setPriceRange(v: string) {
    this.priceRange.set(v);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { price: v || null, page: 0 }, queryParamsHandling: 'merge' });
  }

  setYear(v: string) {
    this.year.set(v);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { year: v || null, page: 0 }, queryParamsHandling: 'merge' });
  }

  setSort(v: string) {
    this.sort.set(v);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { sort: v, page: 0 }, queryParamsHandling: 'merge' });
  }

  setPageUi(p: number) {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { page: p - 1 }, queryParamsHandling: 'merge' });
  }

  clear() {
    this.filtersOpen.set(false);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { q: null, brand: null, model: null, price: null, year: null, fuelType: null, transmission: null, maxMileage: null, location: null, sort: null, page: null, size: null } });
  }

  applyDrawerFilters() {
    this.filtersOpen.set(false);
    void this.reload();
  }

  private parsePriceRange(v: string): { minPrice?: string; maxPrice?: string } {
    const raw = (v ?? '').trim();
    if (!raw) return {};
    if (raw.endsWith('+')) {
      const min = raw.slice(0, -1);
      return min ? { minPrice: min } : {};
    }
    const parts = raw.split('-');
    if (parts.length !== 2) return {};
    const min = parts[0]?.trim();
    const max = parts[1]?.trim();
    return {
      minPrice: min || undefined,
      maxPrice: max || undefined
    };
  }

  goToCar(id: number) {
    void this.router.navigate(['/cars', id]);
  }

  cardAriaLabel(car: CarListItem): string {
    const m = this.displayModel(car);
    const mk = this.displayMake(car);
    return `${mk} ${m}`.trim() || car.title || 'car listing';
  }

  displayMake(car: CarListItem): string {
    const b = (car.brand ?? '').trim();
    return b || '—';
  }

  displayModel(car: CarListItem): string {
    const m = (car.model ?? '').trim();
    if (m) return m;
    const t = (car.title ?? '').trim();
    return t || 'Listing';
  }

  formatFuelLabel(f: string): string {
    if (!f) return '';
    return f.charAt(0) + f.slice(1).toLowerCase();
  }

  formatTransmissionLabel(t: string): string {
    if (t === 'AUTOMATIC') return 'Automatic';
    if (t === 'MANUAL') return 'Manual';
    return t;
  }
}

