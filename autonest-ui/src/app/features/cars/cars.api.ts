import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CarDetail, CarListItem, Page } from './cars.models';

export interface CarSearchQuery {
  q?: string;
  brand?: string;
  model?: string;
  minPrice?: string;
  maxPrice?: string;
  fuelType?: string | string[];
  transmission?: string;
  minYear?: string;
  maxYear?: string;
  maxMileage?: string;
  location?: string;
  sort?: string; // e.g. createdAt,desc
  page?: string;
  size?: string;
}

@Injectable({ providedIn: 'root' })
export class CarsApi {
  private readonly http = inject(HttpClient);

  async listCars(query: CarSearchQuery): Promise<Page<CarListItem>> {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue;
      if (Array.isArray(v)) {
        for (const item of v) params = params.append(k, item);
      } else {
        params = params.set(k, v);
      }
    }
    return await firstValueFrom(this.http.get<Page<CarListItem>>('/api/cars', { params }));
  }

  async getCar(id: string): Promise<CarDetail> {
    return await firstValueFrom(this.http.get<CarDetail>(`/api/cars/${id}`));
  }

  async brands(): Promise<string[]> {
    return await firstValueFrom(this.http.get<string[]>('/api/cars/brands'));
  }
}

